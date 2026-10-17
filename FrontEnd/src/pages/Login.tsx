import { useForm } from "react-hook-form"
import { z } from "zod"
import { NavLink, useNavigate } from "react-router"
import { AxiosError } from "axios"
import { useState } from "react"

import { Input } from "../components/input"
import { Button } from "../components/button"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAuth } from "../hook/useAuth"

import { api } from "../services/api"

const schema = z.object({
    email: z.string().trim().email("Insira um e-mail válido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
})

type LoginData = z.infer<typeof schema>

export function Login() {
    const navigate = useNavigate()

    const auth = useAuth()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
        resolver: zodResolver(schema)
    })

    const [error, setError] = useState("")

    async function onSubmit(data: LoginData) {
        setError("")
        console.log(data)

        try {
            const response = await api.post("/session", data)
            auth.signIn(response.data)
            navigate("/tasks")

        } catch (error) {
            console.log(error)

            if (error instanceof AxiosError) {
                setError(error.response?.data.message)
                return
            }

            setError("Não foi possível fazer login")
        }
    }

    return (
        <main className="flex min-h-svh items-center justify-center bg-page px-4 py-10 sm:px-6">
            <section className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-10">
                <p className="mb-3 text-sm font-semibold text-brand">Bem-vindo de volta</p>

                <h1 id="login-title" className="text-3xl font-bold tracking-tight text-content">Organize seu dia.</h1>

                <p className="mt-2 text-sm text-muted">Suas tarefas, um passo de cada vez.</p>
                <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">
                        <Input
                            label="E-mail"
                            type="email"
                            placeholder="seu@email.com"
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            className="aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus:ring-danger/20"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p id="email-error" role="alert" className="text-sm text-danger">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Input
                            label="Senha"
                            type="password"
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "password-error" : undefined}
                            className="aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus:ring-danger/20"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p id="password-error" role="alert" className="text-sm text-danger">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {error && (
                        <p role="alert" className="rounded-lg border border-danger/15 bg-danger-bg px-4 py-3 text-center text-sm text-danger">{error}</p>
                    )}

                    <Button type="submit">Entrar</Button>
                </form>

                <NavLink to="/cadastro" className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                    <p className="mt-6 text-center text-sm text-muted">Ainda não tem conta? <span className="font-semibold text-brand transition-colors hover:text-brand-hover hover:underline">Criar conta</span></p>
                </NavLink>

            </section>
        </main>

    )

}
