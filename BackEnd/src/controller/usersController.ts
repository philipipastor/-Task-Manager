import { Request, Response } from "express";
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { hash } from "bcrypt";
import { appError } from "@/utils/appError";

class UsersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(5),
        })

        const { name, email, password } = bodySchema.parse(request.body)

        const usedEmail = await prisma.user.findFirst({ where: { email } })

        if (usedEmail) {
            throw new appError("E-mail já foi cadastrado", 400)
        }

        const hashPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: { name, email, password: hashPassword }
        })

        const { password: _, ...userWith } = user

        response.status(201).json(userWith)
    }

    async index(request: Request, response: Response) {
        if (!request.user) {
            throw new appError("Usuário não autenticado", 401)
        }

        if (!["Admin", "Member"].includes(request.user.role)) {
            throw new appError("Acesso não autorizado", 403)
        }

        const user = await prisma.user.findMany({
            where: request.user.role === "Member" ? { id: request.user.id } : {},
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updateAt: true,
            }
        })



        response.json(user)
    }
}

export { UsersController }



