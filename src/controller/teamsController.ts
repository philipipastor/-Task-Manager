import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";

class TeamsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            description: z.string().optional()
        })

        const { name, description } = bodySchema.parse(request.body)

        await prisma.teams.create({ data: { name, description } })

        response.status(201).json({ message: "created" })
    }

    async index(request: Request, response: Response) {
        const teams = await prisma.teams.findMany()

        response.json(teams)
    }

    async update(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            description: z.string().optional()
        })

        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)
        const { name, description } = bodySchema.parse(request.body)

        const teams = await prisma.teams.update({ where: { id }, data: { name, description } })

        response.json(teams)
    }

    async remove(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        await prisma.teams.delete({ where: { id } })

        response.json("Time removido")
    }
}

export { TeamsController }