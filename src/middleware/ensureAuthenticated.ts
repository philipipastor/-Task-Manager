import { Request, Response, NextFunction } from "express";
import { appError } from "@/utils/appError";
import { verify } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

interface TokenPlayload {
    role: string,
    sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    const header = request.headers.authorization

    if (!header) {
        throw new appError("Token não informado", 401)
    }
    try {
        const [bearer, token] = header.split(" ")

        const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as TokenPlayload

        request.user = { id: user_id, role }

        return next()

    } catch (error) {
        throw new appError("Token inválido", 401)
    }

}