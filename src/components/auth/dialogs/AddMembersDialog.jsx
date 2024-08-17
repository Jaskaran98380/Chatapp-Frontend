import React, { useState } from 'react'
import { samepleUsers } from '../../../constants/sampleData'
import { Button, Dialog, InputAdornment, List, Skeleton, Stack, TextField, Typography } from '@mui/material';
import UserItem from '../../shared/UserItem';
import { useInputValidation } from '6pp';
import SearchIcon from '@mui/icons-material/Search';
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../../redux/api/api';
import { useDispatch } from 'react-redux';
import { setIsAddMember } from '../../../redux/reducers/misc';
import { useAsyncMutation, useErrors } from '../../../hooks/hook';




const AddMembersDialog = ({open , chatId }) => {
  const dispatch = useDispatch()
    // const [members , setMembers] = useState(samepleUsers);
    const [selectedMembers , setSelectedMembers] = useState([]);
    
    const selectMemberHandler = (_id)=>{
        setSelectedMembers(prev=> prev.includes(_id) ? prev.filter((current)=>current!=_id) : [...prev , _id])
    }

    const [addMembers, isLoadingAddMembers] = useAsyncMutation(
      useAddGroupMembersMutation
    );

    const closeHandler = () => {
      dispatch(setIsAddMember(false));
    };

    const {isError , error , data , isLoading} = useAvailableFriendsQuery(chatId)
    
// const submitHandler = ()=>{
//     console.log("add members handler")
// }
    
const addMembersSubmitHandler = ()=>{
  addMembers("Adding..." , {
    members:selectedMembers,
    chatId
  })
  closeHandler()
}
   const groupName = useInputValidation("");

   useErrors([{isError , error}])
   console.log(data,"datatatatat")

  return (
    <Dialog open={open} onClose={closeHandler}>
    <Stack spacing={"2rem"} sx={{padding:"1rem"}} alignItems={"center"}>
      <Typography  color={"black"}>Add Members</Typography>
      {/* <TextField
      label="Group Name"
      variant="outlined"
      value={groupName.value}
      onChange={groupName.changeHandler}
      size='large'
      InputProps={{
        startAdornment:(
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        )
      }}>
      </TextField> */}

      <List>
        {/* {isLoading?(<Skeleton />):
           data.friends.map((i , index)=>(
            <UserItem user={i} key={index}  handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}  />
          ))    
        } */}

         {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
      </List> 
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} justifyContent={"space-evenly"}>
      <Button onClick={closeHandler} color="error">Cancel</Button>  
      <Button onClick={addMembersSubmitHandler}>Update</Button>  
      </Stack>

    </Stack>
  </Dialog>
  )
}

export default AddMembersDialog