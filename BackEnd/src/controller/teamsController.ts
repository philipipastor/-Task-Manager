import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { appError } from "@/utils/appError";

class TeamsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3),
            description: z.string().optional()
        })

        const { name, description } = bodySchema.parse(request.body)

        const team = await prisma.teams.create({ data: { name, description } })

        response.status(201).json(team)
    }

    async index(request: Request, response: Response) {
        if (!request.user) {
            throw new appError("Usuário não autenticado", 401)
        }

        if (!["Admin", "Member"].includes(request.user.role)) {
            throw new appError("Acesso não autorizado", 403)
        }

        if (request.user.role === "Member") {
            const teams = await prisma.teams.findMany({
                where: { active: true, teamsMembers: { some: { userId: request.user.id } } },
                include: { _count: { select: { teamsMembers: true } } }
            })

            response.json(teams)
        }

        const teams = await prisma.teams.findMany({ include: { _count: { select: { teamsMembers: true } } } })

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

    async desactive(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const teams = await prisma.teams.findUnique({ where: { id } })


        if (!teams) {
            throw new appError("Equipe não encontrada", 404)
        }

        if (!teams.active) {
            throw new appError("Equipe já está inativa", 400)
        }

        await prisma.teams.update({ where: { id }, data: { active: false } })

        response.json()
    }

    async active(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const team = await prisma.teams.findUnique({
            where: { id }
        })

        if (!team) {
            throw new appError("Equipe não encontrada", 404)
        }

        if (team.active) {
            throw new appError("Equipe já está ativa", 409)
        }

        await prisma.teams.update({
            where: { id },
            data: {
                active: true
            }
        })

        return response.json()
    }
}

export { TeamsController }
