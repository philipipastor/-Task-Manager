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
        const user = await prisma.user.findMany()

        response.json(user)
    }
}

export { UsersController }



