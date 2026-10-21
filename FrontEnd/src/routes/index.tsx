import { useAuth } from "../hook/useAuth";

import { AuthRoutes } from "./AuthRoutes";
import { TaskRoutes } from "./TaskRoutes";

export function AppRoutes() {
    const { user, isLoading } = useAuth()

    if(isLoading){
        return(
            <div className="flex min-h-svh items-center justify-center">
                <p>Carregando...</p>
            </div>
        )
    }

    return user ? <TaskRoutes/> : <AuthRoutes/>

} 


