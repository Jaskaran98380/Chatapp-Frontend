import React , {Suspense, lazy, useEffect} from 'react'
import {BrowserRouter , Routes , Route} from "react-router-dom"
// import Home from './pages/Home'
const Home = lazy(()=>import("./pages/Home"))                    //lazy helps in dynamic importing as it helps in avoiding overcrowding of js bundle
const Login = lazy(()=>import("./pages/Login"))                    //lazy helps in dynamic importing as it helps in avoiding overcrowding of js bundle
const Chat = lazy(()=>import("./pages/Chat"))                    //lazy helps in dynamic importing as it helps in avoiding overcrowding of js bundle
const Groups = lazy(()=>import("./pages/Groups"))                    //lazy helps in dynamic importing as it helps in avoiding overcrowding of js bundle
const NotFound = lazy(()=>import("./pages/NotFound"))
const Dashboard = lazy(()=>import("./pages/admin/Dashboard"))
const AdminLogin = lazy(()=>import("./pages/admin/AdminLogin"))
const Chats = lazy(()=>import("./pages/admin/Chats"))
const Messages = lazy(()=>import("./pages/admin/Messages"))
const Users = lazy(()=>import("./pages/admin/Users"))
import axios from "axios"
import {Toaster} from "react-hot-toast"


import { ProtectRoutes } from './components/auth/protectRoutes'
import { AppLoader } from './components/layout/Loaders'
import { server } from './constants/config'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { userExists, userNotExists } from './redux/reducers/auth'
import { SocketProvider } from './utils/socket'



// const user=true;

const App = () => {

  const dispatch = useDispatch();
  const {user , loader} = useSelector(state => state.auth)

  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me` , {withCredentials:true})
    // .then((res)=>console.log(res))
    .then(({data})=>dispatch(userExists(data.user)))
    .catch((error)=>dispatch(userNotExists()))
  } , [dispatch])

  console.log(loader);
  return loader ? (
    <AppLoader />
  ):(
    
    <BrowserRouter>
    <Suspense fallback={<AppLoader />}>
    <Routes>
      <Route element={<SocketProvider><ProtectRoutes user={user} /></SocketProvider>}>
        <Route path='/' element={<Home/>} />            
        <Route path='/chat/:chatId' element={<Chat />} />
        <Route path='/groups' element={<Groups />} />
      </Route>
      
      <Route path='/login' element={<ProtectRoutes user={!user} redirect="/"><Login /></ProtectRoutes>} />
      <Route path='/admin' element={<AdminLogin /> } />
      <Route path='/admin/dashboard' element={<Dashboard/> } />
      <Route path='/admin/chats' element={<Chats/> } />
      <Route path='/admin/messages' element={<Messages/> } />
      <Route path='/admin/users' element={<Users/> } />
      
      <Route path='*' element={<NotFound />} />
    </Routes>
    </Suspense>
 
    <Toaster position="bottom-center" />
    </BrowserRouter>
  )
}

export default App