import { Container, Paper, Typography } from '@mui/material'
import React from 'react'
import { DataGrid } from '@mui/x-data-grid';

const Table = ({heading , rows , columns , rowHeight=54}) => {
  return (
    <Container component={"main"} sx={{height:"96vh"}}>
        <Paper elevation={3} sx={{padding:"2rem" , m:"2rem" , borderRadius:"2rem" , height:"98%" , overflow:"hidden"}}>
            <Typography sx={{textAlign:"center" , fontWeight:500 , fontSize:"40px" , pb:"2rem"}} >{heading}</Typography>
            <DataGrid rows={rows} columns={columns} rowHeight={rowHeight} style={{height:"80%"}} sx={{
                ".table_column":{
                    bgcolor:"black",
                    color:"white"
                }
            }}/>
        </Paper>
    </Container>
  )
}

export default Table