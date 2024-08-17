import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Button, Container, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { AdminPanelSettings, Chat, Message, Notifications } from '@mui/icons-material'
import moment from "moment"
import { SearchField } from '../../components/styles/styledComponents'
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import { DoughnutChart, LineChart } from '../../components/specific/Charts'
import { useFetchData } from '6pp'
import { server } from '../../constants/config'
import { useErrors } from '../../hooks/hook'
import {AppLoader} from "../../components/layout/Loaders"

const Dashboard = () => {

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const { stats } = data || {};
console.log(data);
  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  // const data = [
  //   {
  //     name:"Users",
  //     amount:"6",
  //     icon:<PersonIcon />
  //   },
  //   {
  //     name:"Chats",
  //     amount:"8",
  //     icon:<Chat />
  //   },
  //   {
  //     name:"Messages",
  //     amount:"300",
  //     icon:<Message />
  //   },
  // ]

const AppBar = <>
<Paper elevation={3} sx={{margin:"1rem" , borderRadius:"0.6rem" }}>
  <Stack position={"relative"} direction={"row"} spacing={"1rem"} height={"3rem"} alignItems={"center"}>
    <IconButton sx={{position:"absolute" , left:"10px" , top:"3.5px"}}>
    <AdminPanelSettings  />
    </IconButton>

  {/* <SearchField placeholder='Search...' /> */}
  {/* <Button variant='contained'>Search</Button> */}
  <Box bgcolor={"red"} flexGrow={1} justifyContent={"flex-end"} />
  <Typography sx={{display:{
    xs:"none",
    md:"block"
  }}}>{moment().format('YYYY-MM-DD HH:mm:ss')}</Typography>

  <Notifications />
  </Stack>
  
</Paper>
</>

  return (
    <AdminLayout>
      {loading ? <Skeleton height={"100vh"}/> :
    <Container component={"main"}>
      {AppBar}
      <Stack direction={{
        xs:"column",
        lg:"row"
      }
    }  spacing={"1rem"} marginTop={"3rem"} alignItems={"center"}>
        {/* <Paper elevation={3} sx={{height:"15rem" , padding:"1rem" , width:{
          xs:"95%",
          sm:"57vw",
          lg:"35vw"
        } , display:"flex" , alignItems:"center" , justifyContent:"center" , borderRadius:"2rem" }} >
              <Typography margin={"2rem 0"} variant="h4">
              Last Messages
            </Typography>
        <LineChart value={stats?.messagesChart || []} />
        </Paper> */}

            <Paper
            elevation={3}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography margin={"2rem 0"} variant="h4">
              Last Messages
            </Typography>

            <LineChart value={stats?.messagesChart || []} />
          </Paper>

       
        <Paper elevation={3} sx={{height:"15rem" , pading:"1rem" , width:{
           xs:"95%",
           sm:"57vw",
           lg:"35vw"
        } , display:"flex" , alignItems:"center" , justifyContent:"center" , borderRadius:"2rem" }} >
        <DoughnutChart labels={["Single Chats" , "Group Chats"]} value={[stats?.totalChatsCount - stats?.groupsCount || 0 , stats?.groupsCount || 0]}/>
        </Paper>

        </Stack>

        <Stack margin={"1rem"} direction={{xs:"column" , lg:"row"}} spacing={"1rem"} alignItems={"center"} justifyContent={"space-evenly"}>
          
          {/* {data.map((item)=>(
            <Paper elevation={3} sx={{padding:"1rem"}} >
                <Stack direction={"column"} spacing={"1rem"} alignItems={"center"}>
            <Typography sx={{
              padding:"1rem",
              width:"6rem",
              height:"6rem",
              borderRadius:"3rem",
              bgcolor:"rgba(255, 0, 0, 0.2)",
              border:"3px solid black",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              fontWeight:"600"
            }} >{item.amount}</Typography>
            <Typography sx={{fontWeight:600}} >{item.name}</Typography>
            {item.icon}
          </Stack>
            </Paper>
          
          
          ))} */}

          <Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon /> } />
          <Widget title={"Group Chats"} value={stats?.groupsCount} Icon={<GroupIcon /> } />
          <Widget title={"Messages"} value={stats?.messagesCount} Icon={<MessageIcon /> } />

          </Stack>
          
         
     
    </Container>}
  </AdminLayout>
  )
  
  
}

const Widget = ({ title, value, Icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1.5rem",
      width: "20rem",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "rgba(0,0,0,0.7)",
          borderRadius: "50%",
          border: `5px solid black`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {Icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard