import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { dashboardData } from '../../constants/sampleData'
import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material'
import AvatarCell from '../../components/specific/AvatarCell'
import moment from 'moment'
import { fileFormat, transformImage } from '../../lib/features'
import RenderAttachment from '../../components/shared/RenderAttachment'
import { useErrors } from '../../hooks/hook'
import { server } from '../../constants/config'
import { useFetchData } from '6pp'


const columns = [
  {
    field:"id",
    headerName:"Id",
    headerClassName:"table_column",
    width:250
  },
  {
    field:"attachments",
    headerName:"Attachments",
    headerClassName:"table_column",
    width:300,
    renderCell:(params)=>{
      const {attachments} = params.row
      return attachments?.length>0 ? 
       attachments.map((it)=>{
        const url = it.url;
        const file = fileFormat(url);
        return(
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <a href={url}
          download
          target='_blank'>
          {RenderAttachment(file , url)}
          </a>
  
        </Box>
        )
       })
      
      
      : "No attachments"
    
    }

  },
  {
    field:"content",
    headerName:"Content",
    headerClassName:"table_column",
    width:300,
    renderCell : (params)=>(
      <Box display={"flex"} alignItems={"center"}  height={"100%"}>
              <Typography display={"flex"} alignContent={"center"}>
              {params.row.content}
                </Typography>
        
        </Box>
    )
  },
  {
    field:"groupChat",
    headerName:"Group Chat",
    headerClassName:"table_column",
    width:87,
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
    field:"chat",
    headerName:"Chat",
    headerClassName:"table_column",
    width:250
  },
  {
    field:"sender",
    headerName:"SentBy",
    headerClassName:"table_column",
    width:250,
    renderCell:(params)=>{
      return(
        <Stack display={"flex"}  alignItems={"center"} direction={"row"} spacing={"0.5rem"} height={"100%"}>
          <AvatarCell value = {params.row.sender.avatar} />
          <Typography>{params.row.sender.name}</Typography>
        </Stack>  
      )
    }
  },
  {
    field:"createdAt",
    headerName:"Time",
    headerClassName:"table_column",
    width:250,
  },
 
]


const Chats = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "dashboard-messages"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);
  const [rows , setRows] = useState([]);
console.log(data,"datatatatata")
  useEffect(() => {
    if (data) {
      setRows(
        data.messages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: i.sender.avatar,
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? <Skeleton height={"100vh"} /> :
        <Table rows={rows} columns={columns} heading={"Messages List"} rowHeight={150}/>
  }
    </AdminLayout>
  )
}

export default Chats