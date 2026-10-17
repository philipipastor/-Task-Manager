import { useContext } from "react";

import { authContext } from "../context/AuthContext";

export function useAuth(){
    const contextValue = useContext(authContext)

    if(!contextValue)
        throw new Error("Useauth deve ser usado dentro de AuthProvider")
    
    return contextValue
}