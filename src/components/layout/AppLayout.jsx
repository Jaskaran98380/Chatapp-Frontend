import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header'
import Title from '../shared/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import { samepleChats } from '../../constants/sampleData'
import ChatList from '../specific/ChatList'
import { useNavigate, useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import { grey } from '@mui/material/colors'
import { useMyChatsQuery } from "../../redux/api/api.js";
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/misc.js'
import { useAsyncMutation, useErrors, useSocketEvents } from '../../hooks/hook.jsx'
import { getSocket } from '../../utils/socket.jsx'
import { incrementNotificationCount, setNewMessagesAlert } from '../../redux/reducers/chat.js'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events.js'
import { getOrSaveFromStorage } from '../../lib/features.js'
import DeleteChatMenu from '../auth/dialogs/DeleteChatMenu.jsx'

const AppLayout = () => (WrappedContent) => {
    return (props) => {
        const deleteMenuAnchor = useRef(null);
        const dispatch = useDispatch();
        const navigate = useNavigate()
        const params=useParams();
        const chatId = params.chatId;
        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
        const { notificationCount } = useSelector(
            (state) => state.chat
          );
        
          const [onlineUsers, setOnlineUsers] = useState([]);

        const newMessageAlertListener=useCallback((data)=>{
            console.log(data,"yii")
            if(data.chatId===chatId)return;
            dispatch(setNewMessagesAlert(data))
        },[chatId])

        const newRequestListener=useCallback(()=>{
            const newCount = notificationCount + 1;
            dispatch(incrementNotificationCount())
            localStorage.setItem('notificationCount', newCount);
        },[dispatch , notificationCount])
    

        const refetchListener = useCallback(()=>{
            console.log("testinggggg");
            refetch()
            navigate("/");
        },[refetch , navigate])

        const onlineUsersListener = useCallback((data) => {
            setOnlineUsers(data);
          }, []);

        const eventHandler = {
            [NEW_MESSAGE_ALERT] : newMessageAlertListener,
            [NEW_REQUEST] : newRequestListener,
            [REFETCH_CHATS] : refetchListener,
            [ONLINE_USERS]: onlineUsersListener,
        } 
        
        
        
        
        console.log(chatId , "gg");

        

        const {isMobile} = useSelector((state)=>state.misc)
        const {user} = useSelector((state)=>state.auth)
        const {newMessagesAlert} = useSelector((state)=>state.chat)

        console.log("nmaaaaa", newMessagesAlert,"nmaaaaa")
        console.log(isMobile , "im");

        useErrors([{ isError, error }]);

        const handleMobileClose = () => dispatch(setIsMobile(false));
        const socket = getSocket()

        console.log(socket.id , "sid");

       

        console.log(data);
        useSocketEvents(socket , eventHandler)

        useEffect(()=>{
            getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
        },[newMessagesAlert])

        const handleDeleteChat = (e , chatId , groupChat)=>{
            // e.preventDefault();
            dispatch(setIsDeleteMenu(true))
            dispatch(setSelectedDeleteChat({chatId , groupChat}))
            deleteMenuAnchor.current = e.currentTarget;
            console.log("Deleting" , chatId , groupChat)
        }

        return (
            <div>
                <Title />
                <Header />
                <DeleteChatMenu
                    dispatch={dispatch}
                    deleteMenuAnchor={deleteMenuAnchor}
                />
                <Drawer open ={isMobile} onClose={handleMobileClose}>
                <ChatList w="70vw" chats={data?.chats} chatId={chatId} 
                            onlineUsers = {onlineUsers}
                            handleDeleteChat={handleDeleteChat}
                            newMessagesAlert={newMessagesAlert}/>
                </Drawer>
                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid item 
                    sm={4} 
                    md={3}
                    sx={{
                        display:{xs:"none" , sm:"block"},
                        height:"100%"
                    }}
                    // height={"100%"}
                    >
                       {isLoading ? (<Skeleton />)
                       :
                    //    ( <ChatList chats={samepleChats} chatId={chatId} 
                    //     newMessagesAlert = {[{
                    //         chatId:chatId,
                    //         count:4
                    //     }
                    //     ]} 
                    //     onlineUsers = {["1","2"]}/>)
                        ( <ChatList chats={data?.chats} chatId={chatId} 
                           newMessagesAlert={newMessagesAlert}
                           handleDeleteChat={handleDeleteChat}
                            onlineUsers = {onlineUsers}/>)
                        }
                    </Grid>

                    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} >
                        <WrappedContent {...props} chatId={chatId} user={user} />
                    </Grid>
                    <Grid item md={4} lg={3} sx={{
                        display:{xs:"none" ,md:"block"},
                        padding:"2rem",
                        bgcolor:"grey"
                    }}>
                        <Profile user={user} />
                    </Grid>
                </Grid>
                
                {/* <div>Footer</div> */}
            </div>
        )
    }
}

export default AppLayout