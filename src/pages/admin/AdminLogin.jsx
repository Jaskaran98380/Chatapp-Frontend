import React, { useEffect, useState } from 'react'
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import {CameraAlt} from "@mui/icons-material"
import { useInputValidation } from '6pp';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, getAdmin } from '../../redux/thunks/admin';

const AdminLogin = () => {
    const [isLogin , setIsLogin] = useState(true);
    const toggleLogin=()=>setIsLogin((prev)=>!prev)
    const dispatch = useDispatch()
    const password = useInputValidation("")
    // const isAdmin=true;
    const secretKey = useInputValidation("");

    const {isAdmin} = useSelector((state)=>state.auth)

 

    const handleSubmit = (e)=>{
      e.preventDefault();
      dispatch(adminLogin(secretKey.value))
    }
  
    useEffect(() => {
      dispatch(getAdmin());
    }, [dispatch]);

    if(isAdmin){
      return <Navigate to={'/admin/dashboard'} />
   }
  
    return (<>
            <div style={{backgroundImage:"linear-gradient(to right, #ff7e5f, #feb47b)"}}>
          <Container
            component={"main"}
            maxWidth="xs"
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius:"1rem"
              }}
            >
              
                  <Typography variant="h5">Login</Typography>
                  <form
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                    }}
                    onSubmit={handleSubmit}
                  >
    
                    <TextField
                      required
                      fullWidth
                      label="Secret Key"
                      type="password"
                      margin="normal"
                      variant="outlined"
                      value={secretKey.value}
                      onChange={secretKey.changeHandler}
                    />
    
                    <Button
                      sx={{
                        marginTop: "1rem",
                      }}
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                   
                    >
                      Login
                    </Button>
             
                  </form>
                  </Paper>
                  </Container>
                  </div>
    </>
       
             
               
  )
}

export default AdminLogin