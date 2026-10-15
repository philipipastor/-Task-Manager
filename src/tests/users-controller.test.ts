import { randomUUID } from "node:crypto"
import { afterAll, describe, expect, it } from "@jest/globals";
import { prisma } from "@/database/prisma"
import request from "supertest"
import { app } from "@/app";

describe("UsersController", () => {
    let user_id: string

    const email = `test-${randomUUID()}@example.com`

    afterAll(async () => {
        if (user_id) {
            await prisma.user.deleteMany({ where: { id: user_id } })
        }

        await prisma.$disconnect()
    })

    it("testa criação de usuário", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
            email,
            password: "password123"
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")

        user_id = response.body.id
    })

    it("testa cadastro de usuário com o mesmo e-mail", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
            email,
            password: "password123"
        })

        expect(response.status).toBe(400)
    })

    it("testa validação de e-mail", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
            email: "test",
            password: "password123"
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Validation error")
    })
})
