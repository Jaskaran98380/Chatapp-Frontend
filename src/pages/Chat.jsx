import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile, Send } from '@mui/icons-material'
import { InputField } from '../components/styles/styledComponents'
import FileMenu from '../components/auth/dialogs/FileMenu'
import { sampleMessage } from '../constants/sampleData'
import MessageComponent from '../components/shared/MessageComponent'
import { getSocket } from '../utils/socket'
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events'
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api'
import { useErrors, useSocketEvents } from '../hooks/hook'
import { useInfiniteScrollTop } from '6pp'
import { useDispatch } from 'react-redux'
import { setIsFileMenu } from '../redux/reducers/misc'
import { removeNewMessagesAlert } from '../redux/reducers/chat'
import { TypingLoader } from '../components/layout/Loaders'
import { useNavigate } from 'react-router-dom'

const Chat = ({chatId , user}) => {
// const user={
//   _id:"sdfsdfsdf",
//   name:"Jass"
// }
const navigate = useNavigate()

const dispatch = useDispatch()
const [message , setMessage] = useState("")
const [messages , setMessages] = useState([])
const [page , setPage] = useState(1)
const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

const [IAmTyping , setIAmTyping] = useState(false)
const [userTyping , setUserTyping] = useState(false)
const typingTimeout = useRef()
const bottomRef = useRef(null);

console.log(userTyping);


const chatDetails = useChatDetailsQuery({chatId , skip:!chatId})

const socket = getSocket();
const oldMessagesChunk = useGetMessagesQuery({chatId , page})

const errors = [
  {isError:chatDetails.isError , error:chatDetails.error},
  {isError:oldMessagesChunk.isError , error:oldMessagesChunk.error},
]
console.log(chatDetails.isError,"cde")
console.log(chatDetails.error,"cdee")
console.log(oldMessagesChunk.error,"ode")
console.log(oldMessagesChunk,"omcccc");

console.log(messages)
console.log(message);
  const containerRef = useRef(null);
  // const fileMenuRef = useRef(null);
  // console.log(fileMenuRef.current , "checking");

  const members = chatDetails?.data?.chat?.members
  const submitHandler = (e)=>{
    e.preventDefault();
    if(!message.trim())return;

    socket.emit(NEW_MESSAGE , {chatId , members , message})
    setMessage("");
  }



  
  const handleFileOpen = (e)=>{
    console.log(e.currentTarget,"ecurrent1")
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget)
    console.log(e.currentTarget,"ecurrent")
  }
  

  console.log(chatDetails.data,"yii");
  console.log(chatDetails?.data?.chat);

  const newMessagesListener = useCallback((data)=>{

    // console.log(data);
    if(data.chatId!==chatId)return;
    setMessages(prev=>[...prev , data.message])
  },[chatId])

  const startTypingListener = useCallback((data)=>{

    // console.log(data);
    console.log(data.chatId , chatId)
    if(data.chatId!==chatId)return;
    console.log("typing" , data)
    setUserTyping(true)
  },[chatId])

  const stopTypingListener = useCallback((data)=>{

    // console.log(data);
    console.log(data.chatId , chatId)
    if(data.chatId!==chatId)return;
    console.log("Stop typing" , data)
    setUserTyping(false);
  },[chatId])

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE] : newMessagesListener,
    [START_TYPING]:startTypingListener,
    [STOP_TYPING]:stopTypingListener,
  } 
  useSocketEvents(socket , eventHandler)
  // useEffect(()=>{
  //   socket.on(NEW_MESSAGE , newMessagesHandler)

  //   return ()=>{
  //     socket.off(NEW_MESSAGE , newMessagesHandler)
  //   }
  // },[])

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.message
  );
  // console.log(page)

  console.log(oldMessages , "om")
  const allMessages = [...oldMessages , ...messages]
  useErrors(errors)
  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId))
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // useEffect(() => {
  //   if (!chatDetails?.data?.chat) return navigate("/");
  // }, [chatDetails.isError]);

  useEffect(() => {
    if (chatDetails?.isError) return navigate("/");
  }, [chatDetails.isError]);
 

 const messageChangeHandler = (e)=>{
  setMessage(e.target.value)
  if(!IAmTyping){
    socket.emit(START_TYPING , ({members , chatId}));
    setIAmTyping(true);
  }


  if (typingTimeout.current) clearTimeout(typingTimeout.current);

  typingTimeout.current = setTimeout(() => {
    socket.emit(STOP_TYPING, { members, chatId });
    setIAmTyping(false);
  }, [2000]);
  
  console.log("abrakadabra")
 }
   
  return chatDetails.isLoading ? (<Skeleton />):(
    <Fragment>
    
        <Stack ref={containerRef} height={"90%"}  sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}>
          {/* {!oldMessagesChunk.isLoading && oldMessagesChunk?.data?.message?.map((i)=>
              <MessageComponent message = {i} user={user}/>
            )}
            {messages.map((i)=>
              <MessageComponent message = {i} user={user}/>
            )} */}

            {allMessages.map((i)=>
              <MessageComponent message = {i} user={user}/>
            )}

            {userTyping && <TypingLoader />}
            <div ref={bottomRef} />
        </Stack>
      
      <form onSubmit={submitHandler} style={{height : "10%" , width:"100%"}}>
        <Stack direction={'row'} padding={"1rem"} spacing={'1rem'} alignItems={"center"} height={"100%"} width={"100%"} position={"relative"}>
          <IconButton  sx={{position:"absolute" , left:"2rem"}} onClick={handleFileOpen}>
          <AttachFile />
          </IconButton>
          
          <InputField placeholder='Type Message Here...'  value = {message} onChange={messageChangeHandler}/>

          <IconButton type='submit' sx={{bgcolor:"green"}}>
          <Send />
          </IconButton>
          
        </Stack>
      </form>
      {/* <FileMenu anchorE1={fileMenuRef.current}/> */}
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId}/>
      
    </Fragment>
  )
}

export default AppLayout()(Chat)