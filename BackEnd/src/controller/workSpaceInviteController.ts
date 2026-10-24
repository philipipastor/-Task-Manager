import { Request, Response } from "express"

import { z } from "zod"
import { randomBytes, createHash } from "node:crypto"

import { prisma } from "@/database/prisma"

import { requireWorkSpaceMember } from "../utils/requireWorkSpaceMember"
import { appError } from "@/utils/appError"

class WorkSpaceInviteController {
    async create(request: Request, response: Response) {
        const paramsSchema = z.object({
            workSpaceId: z.string().uuid()
        })

        const bodySchema = z.object({
            email: z.string().email()
        })

        const { workSpaceId } = paramsSchema.parse(request.params)

        const { email } = bodySchema.parse(request.body)

        await requireWorkSpaceMember(request.user?.id, workSpaceId, true)

        const emailExist = await prisma.workSpaceMember.findFirst({
            where: { workSpaceId, user: { email } }
        })

        if (emailExist) {
            throw new appError("Esse usuário já pertence ao espaço", 409)
        }

        const token = randomBytes(32).toString("hex")

        const tokenHash = createHash("sha256").update(token).digest("hex")

        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 48)

        const invite = await prisma.workSpaceInvite.create({
            data: { workSpaceId, email, tokenHash, expiresAt }
        })

        return response.status(201).json({
            token,
            expiresAt: invite.expiresAt
        })
    }

    async accept(request: Request, response: Response) {
        if (!request.user) {
            throw new appError("Usuário não autenticado", 401)
        }

        const bodySchema = z.object({
            token: z.string().regex(/^[a-f0-9]{64}$/, "Token inválido")
        })

        const { token } = bodySchema.parse(request.body)
        const userId = request.user.id

        const tokenHash = createHash("sha256")
            .update(token)
            .digest("hex")

        const result = await prisma.$transaction(async (tx) => {
            const invite = await tx.workSpaceInvite.findUnique({
                where: { tokenHash }
            })

            if (!invite) {
                throw new appError("Convite não encontrado", 404)
            }

            if (invite.acceptedAt) {
                throw new appError("Esse convite já foi utilizado", 409)
            }

            const now = new Date()

            if (invite.expiresAt <= now) {
                throw new appError("Esse convite expirou", 410)
            }

            const user = await tx.user.findUnique({
                where: { id: userId }
            })

            if (!user) {
                throw new appError("Usuário não encontrado", 401)
            }

            if (user.email !== invite.email) {
                throw new appError("Entre com a conta que recebeu o convite", 403)
            }

            const accepted = await tx.workSpaceInvite.updateMany({
                where: {
                    id: invite.id,
                    acceptedAt: null,
                    expiresAt: { gt: now }
                },
                data: {
                    acceptedAt: now
                }
            })

            if (accepted.count === 0) {
                throw new appError("O convite já foi utilizado ou expirou", 409)
            }

            await tx.workSpaceMember.upsert({
                where: {
                    userId_workSpaceId: {
                        userId,
                        workSpaceId: invite.workSpaceId
                    }
                },
                create: {
                    userId,
                    workSpaceId: invite.workSpaceId,
                    role: "Member"
                },
                update: {}
            })

            return {
                workSpaceId: invite.workSpaceId
            }
        })

        return response.json({
            message: "Convite aceito com sucesso",
            ...result
        })
    }
}

export { WorkSpaceInviteController }