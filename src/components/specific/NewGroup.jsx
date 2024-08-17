import React, { useState } from 'react'
import { Button, Dialog, InputAdornment, List, Stack, TextField, Typography } from '@mui/material'
import UserItem from '../shared/UserItem'
import SearchIcon from '@mui/icons-material/Search';
import { samepleUsers } from '../../constants/sampleData';
import { useInputValidation } from '6pp';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewGroup } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';

const NewGroup = () => {
  const dispatch = useDispatch();
  const [newGroup , isLoadingNewGroup]= useAsyncMutation(useNewGroupMutation)

  const groupName = useInputValidation("");
  // const [members , setMembers] = useState(samepleUsers);
  const [selectedMembers , setSelectedMembers] = useState([]);
  const {isNewGroup} = useSelector((state)=>state.misc)

  const {isError , error , data , isLoading} = useAvailableFriendsQuery();

  const errors = [
    {
      isError,
      error
    }
  ]
  const selectMemberHandler = (_id)=>{
    setSelectedMembers(prev=> prev.includes(_id) ? prev.filter((current)=>current!=_id) : [...prev , _id])
  }
  const closeGroupHandler = ()=>{
    dispatch(setIsNewGroup(false))
  }

  const submitHandler=()=>{
    if(!groupName.value) return toast.error("Please enter Group Name.");
    if(selectedMembers.length < 2) return toast.error("Please select atleast 2 members.");

    //creating group
    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    console.log(groupName.value , selectedMembers)

    closeGroupHandler();
  }
  useErrors(errors);

 

  console.log(selectedMembers);
  console.log(data,"ddd")
  return (
    <Dialog open={isNewGroup} onClose={closeGroupHandler}>
      <Stack spacing={"2rem"} sx={{padding:"1rem"}} alignItems={"center"}>
        <Typography  color={"black"}>New Group</Typography>
        <TextField
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
        </TextField>

        <List>
          {/* {members.map((i , index)=>(
            <UserItem user={i} key={index}  handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}  />
          ))} */}

          {data?.friends?.map((i , index)=>(
            <UserItem user={i} key={index}  handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}  />
          ))}
        
        </List> 
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} justifyContent={"space-evenly"}>
        <Button color="error" onClick={closeGroupHandler}>Cancel</Button>  
        <Button onClick={submitHandler}>Create</Button>  
        </Stack>

      </Stack>
    </Dialog>
  )
}

export default NewGroup