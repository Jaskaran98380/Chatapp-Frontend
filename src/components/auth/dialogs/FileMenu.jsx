import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../../../redux/reducers/misc'
import { Image, AudioFile , VideoFile, UploadFile} from '@mui/icons-material'
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../../../redux/api/api'

const FileMenu = ({anchorEl , chatId}) => {
  const imageRef = useRef(null)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const fileRef = useRef(null)
  // console.log(chatId, "now")

  const dispatch = useDispatch()
  const {isFileMenu} = useSelector((state)=>state.misc)

  const handleFileClose = ()=>{
    dispatch(setIsFileMenu(false));
}

const [sendAttachments] = useSendAttachmentsMutation();


  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    console.log(e.target,"etrgg")

    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    handleFileClose();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);

      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });

      // Fetching Here
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };


const selectImage = ()=>{
   imageRef.current.click();
}
const selectVideo = ()=>{
   videoRef.current.click()
}
const selectAudio = ()=>{
  audioRef.current.click()
}
const selectFiles = ()=>{
  fileRef.current.click()
}

  return (
    <Menu open={isFileMenu} anchorEl={anchorEl} onClose={handleFileClose}>
        <div style={{width:"10rem"}}>

        <MenuList>
          <MenuItem onClick={selectImage}> 
          <Tooltip title="Image">
              <Image />
          </Tooltip> 
            <ListItemText sx={{marginLeft:"10px"}}>Image</ListItemText>
            <input type='file'
            multiple
            accept="image/jpeg, image/png, image/gif"
            style={{display:"none"}}
            onChange={(e)=>fileChangeHandler(e , "Images")}
            ref={imageRef}/>
          </MenuItem>

          <MenuItem onClick={selectAudio}> 
          <Tooltip title="Audio">
              <AudioFile />
          </Tooltip> 
            <ListItemText sx={{marginLeft:"10px"}}>Audio</ListItemText>
            <input type='file'
            multiple
            accept="audio/mpeg, audio/wav , audio/mp3"
            style={{display:"none"}}
            onChange={(e)=>fileChangeHandler(e , "Audios")}
            ref={audioRef}/>
          </MenuItem>

          <MenuItem onClick={selectVideo}> 
          <Tooltip title="Video">
              <VideoFile />
          </Tooltip> 
            <ListItemText sx={{marginLeft:"10px"}}>Video</ListItemText>
            <input type='file'
            multiple
            accept="video/mp4, video/webm, video/ogg"
            style={{display:"none"}}
            onChange={(e)=>fileChangeHandler(e , "Videos")}
            ref={videoRef}/>
          </MenuItem>

          <MenuItem onClick={selectFiles}> 
          <Tooltip title="File">
              <UploadFile />
          </Tooltip> 
            <ListItemText sx={{marginLeft:"10px"}}>Files</ListItemText>
            <input type='file'
            multiple
            accept="*"
            style={{display:"none"}}
            onChange={(e)=>fileChangeHandler(e , "Files")}
            ref={fileRef}/>
          </MenuItem>
        </MenuList>
        </div>
        
    </Menu>
  )
}

export default FileMenu