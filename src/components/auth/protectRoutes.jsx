import React from "react";
import { Navigate, Outlet } from "react-router-dom"

export const ProtectRoutes = ({ user , redirect="/login" , children})=>{
    if(!user){
        return <Navigate to={redirect} />
    }
    return children ? children : <Outlet />
}