import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog = ({open , deleteGroup={deleteGroup} , closeHandler={closeHandler}}) => {
  return (
    <>
    <Dialog open={open} onClose={closeHandler}>
        <DialogTitle textAlign={"center"}>Confirm Delete</DialogTitle>
        <DialogContent>
        <DialogContentText>
        Are you sure to delete this group?
        </DialogContentText>
        </DialogContent>
        <Stack padding={"1rem"} alignItems={"center"} justifyContent={"end"}direction={"row"} spacing={"1rem"}>
            <Button  onClick={closeHandler} variant='outlined' >
                No
            </Button>
            <Button onClick={deleteGroup} color='error' variant='contained'>
                Yes
            </Button>
        </Stack>
    </Dialog>
    </>
  )
}

export default ConfirmDeleteDialog