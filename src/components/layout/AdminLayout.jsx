import { Chat, Close, Dashboard, Logout, Menu, Message, VerifiedUser } from '@mui/icons-material'
import { Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
import { Link } from '../styles/styledComponents'
import { Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { adminLogout } from '../../redux/thunks/admin'

// const isAdmin = true;



const AdminOptions = [
    {
        name:"Dashboard",
        path:"/admin/dashboard",
        icon:<Dashboard />
    },
    {
        name:"Users",
        path:"/admin/users",
        icon:<VerifiedUser />
    },
    {
        name:"Chats",
        path:"/admin/chats",
        icon:<Chat />
    },
    {
        name:"Messages",
        path:"/admin/messages",
        icon:<Message />
    },
    
]


const SideBar = ({w})=>{
    const dispatch = useDispatch()
    const logoutHandler = ()=>{
        console.log("Logout");
        dispatch(adminLogout())
    }
    return(
        <Stack padding={"3rem"} spacing={"2rem"}>
              {AdminOptions.map((option)=>
                 (
                    
                    <Link key={option.path} to={option.path} sx={
                        location.pathname === option.path && {
                            backgroundColor:"grey",
                            color:"white",
                            ":hover":{
                                color:"black"
                            }
                        }
                    }
                    >
                        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} >
                    {option.icon}
                    <Typography>{option.name}</Typography>
                    </Stack>
                    </Link>
                    
             
          )
        )}
     <Link onClick={logoutHandler}>
                <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} >
                    <Logout />
                    <Typography>Logout</Typography>
                    </Stack>
                    </Link>

        </Stack>
      
    )
    
}

const AdminLayout = ({children}) => {

    const {isAdmin} = useSelector((state)=>state.auth)

    const location = useLocation();
  
    const [isMobile , setIsMobile] = useState(false);

    const handleMobile = ()=>{
        setIsMobile(prev=>!prev);
    }
    const closeMobile = ()=>{
        setIsMobile(false);
    }

    if(!isAdmin)return <Navigate to={"/admin"} />

  return (
    <Grid container minHeight={"100vh"}> 

    <Box sx={{position:"fixed" , right:"1rem" , top:"1rem" , display:{
        xs:"block",
        sm:"none"
    }}}>
        <IconButton onClick={handleMobile}>
        {isMobile ? <Close /> : <Menu />}
        </IconButton>
        
    </Box>
        <Grid item sm={4} md={4} lg={3} sx={{display:{
            xs:"none",
            sm:"block"
        }}}>
            <SideBar />
        </Grid>
        <Grid item xs={12} sm={8} md={8} lg={9} bgcolor={"lightpink"}>
            {children}
        </Grid>

        <Drawer open={isMobile} onClose={closeMobile}>
            <SideBar w={"50vw"}/>
        </Drawer>
    </Grid>
  )
}

export default AdminLayout