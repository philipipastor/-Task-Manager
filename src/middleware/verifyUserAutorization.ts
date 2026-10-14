import { Request, Response, NextFunction } from "express"
import { appError } from "@/utils/appError";

export function verifyUserAuthorization(role: string[]){
    return (request: Request, response: Response, next: NextFunction ) => {
        if(!request.user || !role.includes(request.user.role)) {
            throw new appError("Usuário não autorizado", 401)
        }
        
        next()
    }
}