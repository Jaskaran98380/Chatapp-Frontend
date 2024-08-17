import { Avatar, Button, Container, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import {CameraAlt} from "@mui/icons-material"
import { VisuallyHiddenInput } from '../components/styles/styledComponents';
import {useFileHandler, useInputValidation} from "6pp"
import { usernameValidator } from '../utils/validators';
import axios from 'axios';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import toast from 'react-hot-toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
    const dispatch = useDispatch()
    const [isLogin , setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const name = useInputValidation("")
    const bio = useInputValidation("")
    const username = useInputValidation("" , usernameValidator)
    const password = useInputValidation("")
    const avatar = useFileHandler("single")

    const toggleLogin=()=>{
      
      setIsLogin((prev)=>!prev)
    }

    const handleLogin = async(e)=>{
      e.preventDefault();
      const toastId = toast.loading("Logging In...");
      setIsLoading(true);

      const config = {
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      }
      
   try {
    const {data} = await axios.post(`${server}/api/v1/user/login` , 
      {
      username:username.value,
      password:password.value
    },
  config)

    dispatch(userExists(data.user))
    toast.success(data.message , {
      id: toastId,
    })
  
   } catch (error) {
    toast.error(error?.response?.data?.message || "Something Went Wrong." , {
      id: toastId,
    })
   }finally {
    setIsLoading(false);
  }

    }
    const handleSignUp = async (e)=>{
      e.preventDefault();
      const toastId = toast.loading("Signing Up...");
      setIsLoading(true);

      const formData = new FormData();
      console.log(formData , "fd")
      formData.append("avatar" , avatar.file)
      formData.append("name" , name.value)
      formData.append("username" , username.value)
      formData.append("bio" , bio.value)
      formData.append("password" , password.value)
      console.log(formData , "fd")

      const config = {
        withCredentials:true,
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
      
   try {
    const {data} = await axios.post(`${server}/api/v1/user/new` , 
     formData,
     config)

    dispatch(userExists(data.user))
    toast.success(data.message , {
      id: toastId,
    })
  
   } catch (error) {
    toast.error(error?.response?.data?.message || "Something Went Wrong." , {
      id: toastId,
    })
   }finally {
    setIsLoading(false);
  }

    }

    return (
       <div>
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
                
              }}
            >
              {isLogin ? (
                <>
                  <Typography variant="h5">Login</Typography>
                  <form
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                    }}
                    onSubmit={handleLogin}
                  >
                    <TextField
                      required
                      fullWidth
                      label="Username"
                      margin="normal"
                      variant="outlined"
                      value={username.value}
                      onChange={username.changeHandler}
                    />

                    {username.error && 
                    <Typography variant="caption" color="error" >
                      {username.error}
                      </Typography>}
    
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      // type="password"
                      type={showPassword ? 'text' : 'password'}
                      margin="normal"
                      variant="outlined"
                      value={password.value}
                      onChange={password.changeHandler}
                      InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    />
    
                    <Button
                      sx={{
                        marginTop: "1rem",
                      }}
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                    >
                      Login
                    </Button>
    
                    <Typography textAlign={"center"} m={"1rem"}>
                      OR
                    </Typography>
    
                    <Button
                      fullWidth
                      variant="text"
                      onClick={toggleLogin} 
                      disabled={isLoading}
                    >
                      Sign Up Instead
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Typography variant="h5">Sign Up</Typography>
                  <form
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                    }}
                    onSubmit={handleSignUp}
                  >
                    <Stack position={"relative"} width={"8rem"} margin={"auto"}>
                      <Avatar
                        sx={{
                          width: "7rem",
                          height: "7rem",
                          objectFit: "contain",
                        }}
                        src={avatar.preview}
                      
                      />
    
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          color: "white",
                          bgcolor: "rgba(0,0,0,0.5)",
                          ":hover": {
                            bgcolor: "rgba(0,0,0,0.7)",
                          },
                        }}
                        component="label"
                      >
                        <>
                          <CameraAlt />
                          <VisuallyHiddenInput
                            type="file"
                            onChange={avatar.changeHandler}
                          />
                        </>
                      </IconButton>
                    </Stack>

                    {avatar.error && 
                    <Typography textAlign={"center"} m={" auto"} display={"block"} variant="caption" color="error" >
                      {avatar.error}
                      </Typography>}
    
        
    
                    <TextField
                      required
                      fullWidth
                      label="Name"
                      margin="normal"
                      variant="outlined"
                      value={name.value}
                      onChange={name.changeHandler}
                    />
    
                    <TextField
                      required
                      fullWidth
                      label="Bio"
                      margin="normal"
                      variant="outlined"
                      value={bio.value}
                      onChange={bio.changeHandler}
                    />
                    <TextField
                      required
                      fullWidth
                      label="Username"
                      margin="normal"
                      variant="outlined"
                      value={username.value}
                      onChange={username.changeHandler}
                    />
    
                    {username.error && 
                    <Typography variant="caption" color="error" >
                      {username.error}
                      </Typography>}
    
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      // type="password"
                      type={showPassword ? 'text' : 'password'}
                      margin="normal"
                      variant="outlined"
                      value={password.value}
                      onChange={password.changeHandler}
                      InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    />
    
                    <Button
                      sx={{
                        marginTop: "1rem",
                      }}
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                    >
                      Sign Up
                    </Button>
    
                    <Typography textAlign={"center"} m={"1rem"}>
                      OR
                    </Typography>
    
                    <Button
                       disabled={isLoading}
                      fullWidth
                      variant="text"
                      onClick={toggleLogin}
                    >
                      Login Instead
                    </Button>
                  </form>
                </>
              )}
            </Paper>
          </Container>
       </div>
      );
}

export default Login