import { Box, Typography } from '@mui/material'
import moment from 'moment'
import React from 'react'
import { fileFormat } from '../../lib/features'
import RenderAttachment from './RenderAttachment'
import {motion} from "framer-motion"

const MessageComponent = ({message , user}) => {
    const {content , sender , attachments=[] , createdAt} = message
    const sameSender = sender?._id === user._id
    const timeAgo=moment(createdAt).fromNow();
  return (
    <motion.div 
    initial={{opacity:0 , x:"-100%"}}
    whileInView={{opacity:1 , x:0}}
    style={{
        alignSelf:sameSender?"flex-end" : "flex-start",
        width:"fit-content",
        padding:"1rem 1rem",
        backgroundColor:"lightgrey",
        color:"black",
        borderRadius:"10%",
        display:"flex",
        flexDirection:"column"
    }}>
    {sender && <Typography variant='caption' color="blue">{sender.name}</Typography>}
    {content && <Typography variant="text" fontWeight={"600"} fontSize={"1rem"} color="black">{content}</Typography>}
    
    {attachments.length > 0 && 
    attachments.map((attachment , index)=>{
        const url=attachment.url;
        const file=fileFormat(url);
        return(
            <Box>
            <a href={url} target='_blank' download  style={{
                  color: "black",
                }}>{RenderAttachment(file , url)}</a>
        </Box>
        ); 
    })}

    {createdAt && <Typography variant='caption' color="text.secondary">{timeAgo}</Typography>}
    </motion.div>
  )
}

export default MessageComponent