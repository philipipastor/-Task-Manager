import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { appError } from "@/utils/appError";

import { UpdateTaskService } from "@/services/updateTaskService";

class TaskController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string().min(3),
            description: z.string().min(3),
            assigned_to: z.string().uuid(),
            team_id: z.string().uuid()
        })

        const { title, description, assigned_to, team_id } = bodySchema.parse(request.body)

        const sameEquip = await prisma.teamsMembers.findFirst({
            where: { userId: assigned_to, teamId: team_id }
        })

        if (!sameEquip) {
            throw new appError("O usuário não pertence á equipe informada", 400)
        }

        const task = await prisma.tasks.create({
            data: { title, description, assignedTo: assigned_to, teamId: team_id },
            include: { team: { select: { name: true } }, user: { select: { name: true } } }
        })

        response.status(201).json(task)
    }

    async index(request: Request, response: Response) {
        const querySchema = z.object({
            status: z.enum(["Pendente", "Em_progresso", "Concluído"]).optional(),
        })

        const { status } = querySchema.parse(request.query)

        if (!request.user) {
            throw new appError("Usuário não autenticado", 401)
        }

        if (!["Admin", "Member"].includes(request.user.role)) {
            throw new appError("Acesso não autorizado", 403)
        }

        if (request.user.role === "Member") {
            return response.json(await prisma.tasks.findMany({
                where: { assignedTo: request.user.id, status },
                include: { team: { select: { name: true } }, user: { select: { name: true } } }
            }))
        }

        const tasks = await prisma.tasks.findMany({
            where: { status },
            include: { team: { select: { name: true } }, user: { select: { name: true } } }
        });

        response.json(tasks)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            status: z.enum(["Pendente", "Em_progresso", "Concluído"])
        })

        const { id } = paramsSchema.parse(request.params)
        const { status } = bodySchema.parse(request.body)

        const task = await prisma.tasks.findUnique({ where: { id } })

        if (!task) {
            throw new appError("Tarefa não existe", 404)
        }

        if (!request.user) {
            throw new appError("Usuário não autenticado", 401)
        }

        if (!["Admin", "Member"].includes(request.user.role)) {
            throw new appError("Acesso não autorizado", 403)
        }

        if (request.user.role === "Member" && task.assignedTo !== request.user.id) {
            throw new appError("Essa tarefa não pertence a você", 403)
        }

        const updateTaskService = new UpdateTaskService()

        const updatedTask = await updateTaskService.execute({
            taskId: id,
            oldStatus: task.status,
            newStatus: status,
            changedBy: request.user.id
        })

        return response.json({
            message: "Tarefa atualizada com sucesso",
            task: updatedTask
        })
    }

    async remove(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.tasks.findUnique({ where: { id } })

        if (!task) {
            throw new appError("Tarefa não existe!", 400)
        }

        if (!request.user) {
            throw new appError("Usuário não autenticado", 401)
        }

        if (!["Admin", "Member"].includes(request.user.role)) {
            throw new appError("Acesso não autorizado", 403)
        }

        if (request.user.role === "Member" && task.assignedTo !== request.user.id) {
            throw new appError("Essa tarefa não pertence a você", 400)
        }

        await prisma.tasks.delete({ where: { id } })

        response.json("task deletada")
    }
}

export { TaskController }