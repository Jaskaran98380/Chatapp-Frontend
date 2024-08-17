import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'

const AvatarCard = ({avatar=[] , max = 4}) => {
  console.log(avatar,"avatar")
  return (
    <Stack direction={"row"} spacing={"0.5rem"}>
        
            <Box sx={{position:"relative"}} width={"6.7rem"} height={"3rem"} >
            <AvatarGroup max={max}>
                {avatar.map((item , index)=>
                
                <Avatar 
                key={index}
                src={item}
                alt={`Avatar ${index}`}
                sx={{
                    width:"3rem",
                    height:"3rem",
                    position:"absolute",
                    left:{
                        xs:`${0.5 + index}rem`,
                        sm:`${index}rem`
                    }
                }} />
            )}
             </AvatarGroup>
            </Box>
       
    </Stack> 
  )
}

export default AvatarCard