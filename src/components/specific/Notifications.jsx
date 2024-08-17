import { Avatar, Button, Dialog, DialogTitle, IconButton, List, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { samepleNotifications } from '../../constants/sampleData'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hook'
import { useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/reducers/misc'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'

const Notifications = () => {
  const dispatch = useDispatch()
  const {isLoading , data , error , isError}  = useGetNotificationsQuery()
  const [acceptFriendRequest] = useAcceptFriendRequestMutation()
  const friendRequestHandler=async({_id , accept})=>{
    dispatch(setIsNotification(false));
    try {
      const res = await acceptFriendRequest({requestId:_id , accept})
    if(res.data.success){
      console.log("Use socket here")
      toast.success(res.data.message)
    }
      else{
      toast.error(res.error.data.message);
    }
    } catch (error) {
      toast.error(error)
    }
    
  }
  useErrors([{isError , error}])
  const {isNotification} = useSelector((state)=>state.misc)
  console.log(isNotification,"in")
   
  const closeHandlerNotification = ()=>{
    dispatch(setIsNotification(false));
  }
  console.log(data,"data");
  return (
    <Dialog open = {isNotification} onClose={closeHandlerNotification}>
      <Stack spacing={"1rem"} alignItems={"center"}>
        <DialogTitle>Notifications</DialogTitle>
        <List>
      {isLoading ? (<Skeleton />):(<>
        {data?.allRequests?.length > 0?(
            data.allRequests.map((i , index)=>(
              <NotificationItem sender={i.sender} _id={i._id} friendRequestHandler={friendRequestHandler} />
            ))
      ) 
      :
      (
        <Typography>No Notifications</Typography>
      )

    }
      </> 
      )}
        </List>
      </Stack>
    </Dialog>
  )
}

const NotificationItem = ({sender , _id , friendRequestHandler})=>{
  const {avatar , name} = sender;
  return(
    <ListItem>
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} width={"100%"}>
            <Avatar src={avatar} height={"2rem"} width={"2rem"} />
            <Typography sx={{
                width:"8rem",
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
            }}>{`${name} sent you a friend request`}</Typography>
           <Button  onClick={()=>friendRequestHandler({_id , accept:true})}>Accept</Button>
           <Button color="error" onClick={()=>friendRequestHandler({_id , accept:false})}>Reject</Button>
        </Stack>
    </ListItem>
  )
}

export default Notifications