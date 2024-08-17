import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { transformImage } from '../../lib/features';
import { useChatDetailsQuery } from '../../redux/api/api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MoreVert } from '@mui/icons-material';

const UserItem = ({user , handler , handlerIsLoading , isAdded , chatId , admin,  styling={}}) => {
    console.log(user,"usususususu")
    const {avatar , name , _id} = user;
    console.log(handlerIsLoading,"hil")
    const groupDetails = useChatDetailsQuery(
        { chatId, populate: true },
        { skip: !chatId }
      );
      console.log(groupDetails,"gdgdgdg")
  return (
    <ListItem>
        <Stack direction={"row"} justifyContent={"center"} spacing={"1rem"} alignItems={"center"} width={"90%"} {...styling}>
            {/* <Avatar src={transformImage(avatar)} height={"2rem"} width={"2rem"} /> */}
            <Avatar src={avatar} height={"2rem"} width={"2rem"} />
            <Typography sx={{
                width:"8rem"
            }}>{name}</Typography>
            <IconButton onClick={()=>handler(_id)} disabled={handlerIsLoading}>
                {groupDetails?.data?.chat?.creator?.toString() === _id.toString() ? (<></>):
                isAdded ? <RemoveIcon /> : <AddIcon /> }
                {/* <AddIcon /> */}
            </IconButton>
            {/* <Typography>{groupDetails?.data?.chat?.creator?.toString() === _id.toString() && "A"}</Typography> */}
            <Typography>{groupDetails.data.chat.creator.toString() === _id.toString() ? "A" :  <IconButton onClick={(e)=>admin(e, _id)}>
                {<MoreVert/>}
            </IconButton>}</Typography>
           
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem);