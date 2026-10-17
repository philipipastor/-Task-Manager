import { useAuth } from "../hook/useAuth";

import { BrowserRouter } from "react-router";

import { AuthRoutes } from "./AuthRoutes";
import { TaskRoutes } from "./TaskRoutes";

function AppRoutes() {
    const { user } = useAuth()

    if(!user){
        return <AuthRoutes/>
    }

    return <TaskRoutes/>
} 

export function Route() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    )
}

