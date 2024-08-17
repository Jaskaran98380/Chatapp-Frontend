import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { dashboardData } from '../../constants/sampleData'
import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material'
import AvatarCell from '../../components/specific/AvatarCell'
import AvatarCard from '../../components/shared/AvatarCard'
import { transformImage } from '../../lib/features'
import { server } from '../../constants/config'
import { useFetchData } from '6pp'
import { useErrors } from '../../hooks/hook'


const columns = [
  {
    field:"id",
    headerName:"Id",
    headerClassName:"table_column",
    width:250
  },
  {
    field:"name",
    headerName:"Name",
    headerClassName:"table_column",
    width:147
  },
  {
    field:"avatar",
    headerName:"Avatar",
    headerClassName:"table_column",
    width:147,
    renderCell : (params)=>(
      // <Avatar src={params.row.avatar} alt={params.row.name} />
      <AvatarCard max={100} avatar = {params.row.avatar} />
    )
  },
  {
    field:"groupChat",
    headerName:"Group Chat",
    headerClassName:"table_column",
    width:100,
    renderCell:(params)=>{
      console.log(params.row.groupChat)
      return (
        <Box display={"flex"} alignItems={"center"}  height={"100%"}>
              <Typography display={"flex"} alignContent={"center"}   sx={{
          color: params.row.groupChat === false ? "red" : "green",
        }
    }

        >{String(params.row.groupChat)}</Typography>
        </Box>
      
      )
      
    }
  },
  {
    field:"totalMembers",
    headerName:"Total Members",
    headerClassName:"table_column",
    width:150
  },
  {
    field:"Members",
    headerName:"Members",
    headerClassName:"table_column",
    width:150,
    renderCell:(params)=>(
      <AvatarCard max={100} avatar={params.row.members} />
    )
  },
  
  {
    field:"totalMessages",
    headerName:"Total Messages",
    headerClassName:"table_column",
    width:150
  },
  {
    field:"creator",
    headerName:"Created By",
    headerClassName:"table_column",
    width:200,
    renderCell:(params)=>{
      return(
        <Stack display={"flex"}  alignItems={"center"} direction={"row"} spacing={"0.5rem"} height={"100%"}>
          <AvatarCell value = {params.row.creator.avatar} />
          <Typography>{params.row.creator.name}</Typography>
        </Stack>  
      )
    }
  },
 
]


const Chats = () => {

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "dashboard-chats"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows , setRows] = useState([]);

  // useEffect(() => {
  //   setRows(dashboardData.chats.map((i)=>(
  //     {
  //       ...i,
  //       id : i._id,
  //       // members:i.members.map((it)=>transformImage(it.avatar , 50)),
  //       // avatar:i.avatar.map((it)=>transformImage(it , 50)),
  //       members:i.members.map((it)=>it.avatar),
  //       avatar:i.avatar.map((it)=>it),
  //       creator:{
  //         name:i.creator.name,
  //         // avatar:transformImage(i.creator.avatar , 50)
  //         avatar:i.creator.avatar
  //       }
  //     }
  //   )))
  // }, []) 

  console.log(data,"djcndcn")
  

  useEffect(() => {
    if (data) {
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => i),
          members: i.members.map((i) => i.avatar),
          creator: {
            name: i.creator.name,
            avatar: i.creator.avatar
          },
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
    {loading ? <Skeleton height={"100vh"}/> : 
        <Table rows={rows} columns={columns} heading={"Chats List"}/>
    }
    </AdminLayout>
  )
}

export default Chats