import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material'

const Home = () => {
  return (
    <Box sx={{display:"flex"}} alignItems={"center"} justifyContent={"center"} bgcolor={'lightgray'} height={"100%"}> 
          <Typography fontSize={'3rem'}>Select a friend to chat!</Typography>
    </Box>

  )
}

export default AppLayout()(Home)