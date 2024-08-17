import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";


import { useNavigate } from "react-router-dom";


import { useAsyncMutation } from "../../../hooks/hook";
import { setIsAdmin } from "../../../redux/reducers/misc";
import { useMakeAdminMutation } from "../../../redux/api/api";


const AdminMenu = ({ dispatch, adminAnchor , chatId , userId}) => {
  const navigate = useNavigate();

  const { isAdmin  } = useSelector(
    (state) => state.misc
  );


  const [makeAdmin , _ , makeAdminData] = useAsyncMutation(useMakeAdminMutation)

  const adminCreation = ()=>{
    closeHandler();
    makeAdmin("Work in Progress" , {
        chatId,
        userId
    })
  }


  const closeHandler = () => {
    dispatch(setIsAdmin(false));
    adminAnchor.current = null;
  };

  const leaveGroupHandler = ()=>{
    closeHandler();
    leaveGroup("Leaving Group" , selectedDeleteChat.chatId)
  }


  const deleteChatHandler = ()=>{
    closeHandler();
    deleteChat("Deleting Chat" , selectedDeleteChat.chatId)
  }

//   useEffect(()=>{
//     if(deleteChatData || leaveGroupData) navigate("/");
//   },[deleteChatData , leaveGroupData])




  return (
    <Menu
      open={isAdmin}
      onClose={closeHandler}
      anchorEl={adminAnchor.current}
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
        onClick={adminCreation}
      >
       Make Admin
        
      </Stack>
    </Menu>
  );
};

export default AdminMenu;