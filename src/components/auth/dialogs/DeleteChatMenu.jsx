import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';

import { useNavigate } from "react-router-dom";

import { setIsDeleteMenu } from "../../../redux/reducers/misc";
import { useAsyncMutation } from "../../../hooks/hook";
import { useDeleteChatMutation, useLeaveGroupMutation } from "../../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();

  const { isDeleteMenu , selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const [deleteChat , _ , deleteChatData] = useAsyncMutation(useDeleteChatMutation)
  const [leaveGroup , __ , leaveGroupData] = useAsyncMutation(useLeaveGroupMutation)


 
console.log(deleteChatData,"dcd")

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const leaveGroupHandler = ()=>{
    closeHandler();
    leaveGroup("Leaving Group" , selectedDeleteChat.chatId)
  }


  const deleteChatHandler = ()=>{
    closeHandler();
    deleteChat("Deleting Chat" , selectedDeleteChat.chatId)
  }

  useEffect(()=>{
    if(deleteChatData || leaveGroupData) navigate("/");
  },[deleteChatData , leaveGroupData])




  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={selectedDeleteChat.groupChat ? leaveGroupHandler : deleteChatHandler}
      >
        {selectedDeleteChat.groupChat ? <>
        <ExitToAppIcon />
        Leave Group
        </> : <>
        <DeleteIcon />
        Unfriend
        </>}
        
      </Stack>
    </Menu>
  );
};

export default DeleteChatMenu;