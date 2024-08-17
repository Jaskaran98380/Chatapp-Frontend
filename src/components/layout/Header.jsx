import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { Suspense, lazy, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
const Search = lazy(()=>import("../specific/Search"))
const Notifications = lazy(()=>import("../specific/Notifications"))
const NewGroup = lazy(()=>import("../specific/NewGroup"))
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { server } from '../../constants/config';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from '../../redux/reducers/auth';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc';
import { resetNotificationCount } from '../../redux/reducers/chat';
import { useAsyncMutation } from '../../hooks/hook';



const Header = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch()
 
  const { isSearch , isNotification , isNewGroup} = useSelector(
    (state) => state.misc
  );

  const { notificationCount } = useSelector(
    (state) => state.chat
  );

  const notiCount =  Number(localStorage.getItem('notificationCount')) || 0

  
  console.log(isNotification , "inin")

  // const isOpenSearch = ()=>{
  //   dispatch(setIsSearch(true))
  // }

  // const [isMobile , setIsMobile]=useState(false);
// const [isSearch , setIsSearch]=useState(false);
// const [isNewGroup , setIsNewGroup]=useState(false);
// const [isNotification , setIsNotification]=useState(false);
const [isLogout , setIsLogout]=useState(false);

  const handleMobile=()=>{
    dispatch(setIsMobile(true));
  }
  const handleSearch=()=>{
    dispatch(setIsSearch(true))
  }
  const handleNewGroup=()=>{
    dispatch(setIsNewGroup(true));
  }
  const handleManageGroups=()=>{
    Navigate("/groups");
  }
  const handleNotifications=()=>{
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
    localStorage.setItem('notificationCount', 0);
  }
  const handleLogout=async()=>{
    // setIsLogout(prev=>!prev);
    try {
      const {data} = await axios.get(`${server}/api/v1/user/logout`,{withCredentials:true})
      dispatch(userNotExists())
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <>
    <Box sx={{flexGrow:1}} height={"4rem"}>
      <AppBar position="static"  sx={{bgcolor:"green"}}>
        <Toolbar>
          {/* <IconButton sx={{}}>
              <MenuIcon />
          </IconButton>
          <Typography>
            Home
          </Typography>
          <Typography>
            About
          </Typography> */}
          <Typography variant="h6" sx={{display:{xs:"none" , md:"block"}}}>Chat Website</Typography>
          <Box sx={{}}>
            <IconButton color='inherit' sx={{display:{xs:"block" , md:"none"}}} onClick={handleMobile}><MenuIcon /></IconButton>
          </Box>
          <Box sx={{flexGrow:1}}></Box>
          <Box>
            {/* <Tooltip title="Search">
            <IconButton size='large' onClick={handleSearch}>
                <SearchIcon />
            </IconButton>
            </Tooltip> */}
          
           <IconHandler title={"Search"} onClick={handleSearch} icon={<SearchIcon />} />
           <IconHandler title={"New Group"} onClick={handleNewGroup} icon={<AddIcon/>} />
           <IconHandler title={"Manage Groups"} onClick={handleManageGroups} icon={<GroupIcon />} />
           {/* <IconHandler title={"Notifications"} onClick={handleNotifications} icon={<NotificationsIcon />} value={notificationCount} /> */}
           <IconHandler title={"Notifications"} onClick={handleNotifications} icon={<NotificationsIcon />} value={notiCount} />

           <IconHandler title={"Logout"} onClick={handleLogout} icon={<LogoutIcon />} />
           
           
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    {isSearch && (
      <Suspense fallback={<Backdrop open />}>
      <Search/>
    </Suspense>
    )} 
     {isNotification && (
      <Suspense fallback={<Backdrop open />}>
      <Notifications/>
    </Suspense>
    )}
    {isNewGroup && (
      <Suspense fallback={<Backdrop open />}>
      <NewGroup/>
    </Suspense>
    )}
    </>
  )
}

const IconHandler = ({title , onClick , icon , value})=>{
  return(
    <Tooltip title={title}>
    <IconButton size='large' color='inherit' onClick={onClick}>
      {value ? <Badge badgeContent={value} color='error'>{icon}</Badge> : icon}
    </IconButton>
  </Tooltip>
  )
}

export default Header