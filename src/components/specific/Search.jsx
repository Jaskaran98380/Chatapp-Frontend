import { Dialog, InputAdornment, List, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import UserItem from '../shared/UserItem';
import { samepleUsers } from '../../constants/sampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { useInputValidation } from '6pp';
import toast from 'react-hot-toast';
import { useAsyncMutation } from "../../hooks/hook";

const Search = () => {
const dispatch=  useDispatch()
// const [sendFriendRequest] = useSendFriendRequestMutation()

const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
  useSendFriendRequestMutation
);

  const {isSearch} = useSelector((state)=>state.misc)
  const [users , setUsers] = useState([]);
  const addFriendHandler=async(id)=>{
    // console.log(id);
    // try {
    //   const res = await sendFriendRequest({userId : id})
    //   if(res.data) {
    //     toast.success("Friend Request Sent.")
    //     console.log(res.data);
    //   }
    //   else{
    //     toast.error(res?.error?.data?.message || "Something Went Wrong.");
    //   }
      
    // } catch (error) {
    //   toast.error(error);
    // }

    await sendFriendRequest("Sending friend request...", { userId: id });
    

  }
  const search = useInputValidation("");
  // const isLoadingSendFriendRequest=false;

  const [searchUser] = useLazySearchUserQuery()
  const searchCloseHandler = ()=>{
    dispatch(setIsSearch(false))
  }

  useEffect(()=>{
    // console.log("search value" , search.value);
    const timeOutId = setTimeout(()=>{
      searchUser(search.value).then(({data})=>{
        
        (
        setUsers(data.users)
      )}   
      ).catch((e)=>console.log(e))
    },700)

    return ()=>{
      clearTimeout(timeOutId)
    };
    
  },[search.value]);
  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack spacing={"2rem"} sx={{padding:"1rem"}} alignItems={"center"}>
        <Typography  color={"black"}>Find People</Typography>
        <TextField
        label=""
        variant="outlined"
        value={search.value}
        onChange={search.changeHandler}
        size='large'
        InputProps={{
          startAdornment:(
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          )
        }}></TextField>

        <List>
          {users.map((i , index)=>(
            <UserItem user={i} key={index}  handler = {addFriendHandler}  handlerIsLoading={isLoadingSendFriendRequest} />
          ))}
        
        </List>   
      </Stack>
    </Dialog>
  )
}

export default Search