import { Done, Edit, KeyboardBackspace, Menu as MenuIcon } from '@mui/icons-material'
import { Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { samepleChats } from '../constants/sampleData'
import { useSearchParams } from 'react-router-dom'
import AvatarCard from '../components/shared/AvatarCard'
import Title from '../components/shared/Title'
import { useEffect } from 'react'
import ConfirmDeleteDialog from '../components/auth/dialogs/ConfirmDeleteDialog'
import AddMembersDialog from '../components/auth/dialogs/AddMembersDialog'
import { samepleUsers } from '../constants/sampleData'
import UserItem from '../components/shared/UserItem'
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupNameMutation } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { AppLoader } from '../components/layout/Loaders'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember, setIsAdmin } from '../redux/reducers/misc'
import AdminMenu from '../components/auth/dialogs/AdminMenu'

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const [userId , setUserId] = useState("")
  const [isMobileMenuOpen , setIsMobileMenuOpen] = useState(false);
  const [isEdit , setIsEdit] = useState(false);
  const [grpName , setGrpName] = useState("");
  const [grpNameUpdatedValue , setGrpNameUpdatedValue] = useState("");
  const adminAnchor = useRef(null);

  const [confirmDeleteDialog , setConfirmDeleteDialog] = useState(false);
  // const [addMembersDialog , setAddMembersDialog] = useState(false);

  const [updatedName , isLoadingGroupName] = useAsyncMutation(useRenameGroupNameMutation);
  const dispatch = useDispatch()

  const myGroups = useMyGroupsQuery("");
  console.log(myGroups?.data?.groups , "mygdg")
 
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );
  console.log(groupDetails.data,"gddddddddd")

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  const [removeMember , isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation)
  const [deleteChat , isLoadingdeleteChat] = useAsyncMutation(useDeleteChatMutation)
  const [addMember , isLoadingAddMember] = useAsyncMutation(useAddGroupMembersMutation)
   const {isAddMember} = useSelector((state)=>state.misc)
  

  useEffect(() => {
    if (groupDetails.data) {
      setGrpName(groupDetails.data.chat.name);
      setGrpNameUpdatedValue(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
    }

    return () => {
      setGrpName("");
      setGrpNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);



  const updateGroupName = ()=>{
    setIsEdit(false);
    console.log(`update group name`);
    console.log("grpNameUpdatedValue" , grpNameUpdatedValue)
    updatedName("Updating name..." , {
      chatId,
      name:grpNameUpdatedValue
    })
  }

  useEffect(() => {
    if(chatId){
      setGrpName(`Group Name ${chatId}`);
      setGrpNameUpdatedValue(`Group Name ${chatId}`);
    }
    return ()=>{
      setGrpName("");
      setGrpNameUpdatedValue("");
      setIsEdit(false);
    }
  }, [chatId])
  

  const handleMobile = ()=>{
    setIsMobileMenuOpen((prev)=>!prev);
  }

  const navigate = useNavigate();
const navigateBack = ()=>{
  navigate("/");
}

const handleMobileClose = ()=>{
  setIsMobileMenuOpen(false);
}

const deleteHandler=()=>{
  setConfirmDeleteDialog(true);
  console.log("delete handler");
}
const deleteGroup = ()=>{
  setConfirmDeleteDialog(false);
  deleteChat("Deleting..." , chatId);
  navigate("/groups")
  console.log("delete group confirm");
}
const closeHandler = ()=>{
 
  setConfirmDeleteDialog(false);
  console.log("Close delete group confirm");
}

const admin = (e , userId)=>{
  dispatch(setIsAdmin(true))
  adminAnchor.current = e.currentTarget
  setUserId(userId)
}
const closeMembersHandler = ()=>{
 
  setAddMembersDialog(false);
  console.log("Close Add Members Dialog");
}

const addMemberHandler=()=>{
  // setAddMembersDialog(true);
  console.log("Add member handler");
  dispatch(setIsAddMember(true));
}

const addMembers = ()=>{
  console.log("Adding...");
}

const removeMemberHandler=(userId)=>{
  console.log("Remove member " , chatId);

  removeMember("Removing..." , {chatId , userId})
}
//jsx element
const GroupName =<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"}>
  {isEdit ? <>
   <TextField value={grpNameUpdatedValue} onChange={(e)=>setGrpNameUpdatedValue(e.target.value)}/>
   <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
    <Done />
    </IconButton>
  </> 
  :
  <>
    <Typography variant="h4">{grpName}</Typography>
  <IconButton onClick={()=>setIsEdit(true)} disabled={isLoadingGroupName}>
    <Edit /></IconButton>
  </>
  }
  
</Stack>

useErrors(errors);             

  return myGroups.isLoading ? <AppLoader /> : (<>
    <Title />
    <AdminMenu dispatch={dispatch}
      adminAnchor={adminAnchor} chatId={chatId} userId={userId}/>
    <Grid container height={"100vh"}>
      <Grid item sm={4} bgcolor={"bisque"}
      sx={{display:{
        xs:"none",
        sm:"block"
      }
        
      }}>
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId}/>
        </Grid>
      <Grid item xs={12} sm={8}>
        <IconButton onClick={navigateBack}>
          <Tooltip title="Back">
            <KeyboardBackspace />
          </Tooltip>
        </IconButton>
        <IconButton  sx={{display:{
          xs:"block",
          sm:"none",
          position:"fixed",
          right:"1rem",
          top:"0rem"
        }}} 
        onClick={handleMobile}>
          <Tooltip title="Back">
            <MenuIcon />
          </Tooltip>
        </IconButton>

        {grpName && <>
          {GroupName}
            <Typography variant='h5' padding={"2rem"} textAlign={"center"}>Members</Typography>
            <Stack spacing={"1rem"} alignItems={"center"} textAlign={"center"} overflow={"auto"} margin={"auto"} maxHeight={"50vh"}  width={"30vw"} >

              {isLoadingRemoveMember ? <CircularProgress /> : groupDetails?.data?.chat?.members.map((member , index)=>(
                 <UserItem user={member} key={index}  handler={removeMemberHandler} isAdded={true} chatId ={chatId} admin = {admin} styling={
                  {
                    boxShadow: '0 4px 8px 12px rgba(0, 0, 0, 0.1)',
                    padding:"1rem",
                    borderRadius:"1rem"
                  }
                 }  />
              ))}
            </Stack>
            <Stack padding={"2rem"} width={"25vw"} spacing={"1rem"} direction={{
              xs:"column-reverse",
              sm:"row"
            }} alignItems={"center"} margin={"auto"} justifyContent={"space-evenly"}>
                    <Button onClick={deleteHandler} color="error" variant="outlined" >Delete Group</Button>
                    <Button onClick={addMemberHandler} variant="contained">Add member</Button>
            </Stack>
      
        </>
        }
     

        </Grid>

        {confirmDeleteDialog && (
          <ConfirmDeleteDialog open={confirmDeleteDialog} deleteGroup={deleteGroup} closeHandler={closeHandler}/>
        )}

        {isAddMember && (
          <AddMembersDialog open={isAddMember}  chatId={chatId} />
        )}

        <Drawer sx={{display:{
          xs:"block",
          sm:"none" 
        }}} open={isMobileMenuOpen} onClose={handleMobileClose} >
          <GroupList myGroups={myGroups?.data?.groups} w={"50vw"} chatId={chatId}/>
        </Drawer>
    </Grid>
    </>
  )
}

const GroupList = ({myGroups=[]  , w="100%" , chatId})=>(
  <Stack width={w} height={"100vh"}  overflow={"scroll"}>
    {myGroups.length > 0 && 
    myGroups.map((grp)=>(<GroupListItem group={grp} chatId={chatId}/>))
    }
  </Stack>
  
  )

const GroupListItem = ({group , chatId})=>{
  const{name , avatar , _id} = group;
  console.log(_id , "id");
  console.log(chatId , "chatid");
  return(
    <Link to={`?group=${_id}`} style={{ textDecoration: 'none' }} onClick={(e)=>{
      if(chatId === _id){
        e.preventDefault();
      }
    }} >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} sx={{padding:"0.5rem"}}>
      <AvatarCard avatar = {avatar} />
      <Typography variant={"text"} color={"black"}>{name}</Typography>
    </Stack>
    </Link>
  )
 

}

export default Groups