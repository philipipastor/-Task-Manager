import { Input } from "../components/input";
import { Button } from "../components/button";
import { Select } from "../components/select";

import { api } from "../services/api";

import { type User } from "../types/user";
import { type Teams } from "../types/teams";

import iconMais from "../assets/mais.png"
import backArrow from "../assets/seta-esquerda.png"

import { priorityOptions } from "../utils/priorityOptions";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, NavLink } from "react-router";
import { useForm, Controller } from "react-hook-form"
import { AxiosError } from "axios";
import { useState, useEffect } from "react";

const schema = z.object({
    title: z.string().trim().min(3, "Informe pelo menos 3 caracteres"),
    description: z.string().trim().min(3, "Informe pelo menos 3 caracteres"),
    priority: z.enum(["Alta", "Média", "Baixa"]),
    assigned_to: z.string().uuid("Selecione um usuário"),
    team_id: z.string().uuid("Selecione um time")
})

type TaskData = z.infer<typeof schema>

export function NewTask() {
    const navigate = useNavigate()

    const { register, handleSubmit, control, formState: { errors } } = useForm<TaskData>({
        resolver: zodResolver(schema)
    })

    const [error, setError] = useState("")
    const [userList, setUserList] = useState<User[]>([])
    const [teamList, setTeamList] = useState<Teams[]>([])

    async function onSubmit(data: TaskData) {
        console.log(data)

        try {
            await api.post<TaskData>("/tasks", data)
            navigate("/tasks")
        } catch (error) {
            console.log(error)

            if (error instanceof AxiosError) {
                setError(error.response?.data.message)
                return
            }

            setError("Não foi possível criar sua tarefa")
        }

    }

    useEffect(() => {
        async function usersList() {
            try {
                const response = await api.get<User[]>("/users")
                setUserList(response.data)

            } catch (error) {
                console.log(error)
            }
        }
        usersList()
    }, [])

    useEffect(() => {
        async function teamsList() {
            try {
                const response = await api.get<Teams[]>("/teams")
                setTeamList(response.data)

            } catch (error) {
                console.log(error)
            }
        }
        teamsList()
    }, [])

    const userOptions = [
        { label: "Selecione um usuário", value: "" },
        ...userList.map((user) => ({
            label: user.name,
            value: user.id
        }))
    ]

    const teamOptions = [
        { label: "Selecione uma equipe", value: "" },
        ...teamList.map((team) => ({
            label: team.name,
            value: team.id
        }))
    ]

    return (
        <main className="min-h-svh bg-page px-4 py-8 sm:px-6 sm:py-12">
            <section className="mx-auto w-full max-w-2xl rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-10">
                <NavLink to="/tasks" className="inline-block rounded-sm transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand">
                        <img src={backArrow} alt="" aria-hidden="true" className="size-4 shrink-0 object-contain invert" />
                        Voltar às tarefas
                    </p>
                </NavLink>

                <h1 id="login-title" className="text-3xl font-bold tracking-tight text-content">Nova tarefa</h1>
                <p className="mt-2 text-sm text-muted">Defina o que fazer e quem vai cuidar disso.</p>

                <form className="mt-8 flex flex-wrap gap-x-3 gap-y-5 [&>div]:w-full [&>select]:w-full sm:[&>div:has(>select)]:w-[calc(50%-0.375rem)] [&>p]:w-full [&>div:nth-last-child(2)]:ml-auto [&>div:nth-last-child(2)]:mt-1 [&>div:nth-last-child(2)]:w-auto [&>div:last-child]:mt-1 [&>div:last-child]:w-auto [&>div:nth-last-child(2)>button]:border [&>div:nth-last-child(2)>button]:border-line [&>div:nth-last-child(2)>button]:bg-surface [&>div:nth-last-child(2)>button]:text-content [&>div:nth-last-child(2)>button:hover]:border-brand/50 [&>div:nth-last-child(2)>button:hover]:bg-page" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Título"
                        type="text"
                        placeholder="Ex: Criar tela de login"
                        aria-invalid={!!errors.title}
                        aria-describedby={errors.title ? "title-error" : undefined}
                        className="aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus:ring-danger/20"
                        {...register("title")}
                    />

                    <Input
                        label="Descrição"
                        type="text"
                        placeholder="Descreva o que pode ser feito"
                        aria-invalid={!!errors.description}
                        aria-describedby={errors.description ? "description-error" : undefined}
                        className="aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus:ring-danger/20"
                        {...register("description")}
                    />

                    <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={priorityOptions}
                                value={field.value}
                                onChange={field.onChange} />
                        )}
                    />

                    {errors.priority && (
                        <p className="text-sm text-danger">
                            {errors.priority.message}
                        </p>
                    )}

                    <div className="flex min-w-0 items-center gap-2">
                        <Controller
                            name="assigned_to"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={userOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <button type="button" onClick={() => navigate("/team")} aria-label="Ir para equipes e membros" title="Ir para equipes e membros" className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line bg-page transition-colors hover:border-brand hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                            <span>
                                <img src={iconMais} alt="" aria-hidden="true" className="size-4 object-contain invert" />
                            </span>
                        </button>
                    </div>
                    {errors.assigned_to && (
                        <p className="text-sm text-danger">
                            {errors.assigned_to.message}
                        </p>
                    )}

                    <div className="flex min-w-0 items-center gap-2">
                        <Controller
                            name="team_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={teamOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <button type="button" onClick={() => navigate("/team")} aria-label="Ir para equipes e membros" title="Ir para equipes e membros" className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line bg-page transition-colors hover:border-brand hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                            <span>
                                <img src={iconMais} alt="" aria-hidden="true" className="size-4 object-contain invert" />
                            </span>
                        </button>
                    </div>
                    {errors.team_id && (
                        <p className="text-sm text-danger">
                            {errors.team_id.message}
                        </p>
                    )}

                    <p className="mt-2 text-xs text-muted">Status inicial: Pendente</p>

                    {error && (
                        <p role="alert" className="text-sm flex justify-center items-center text-danger">{error}</p>
                    )}

                    <Button type="button" onClick={() => navigate("/tasks")}>Cancelar</Button>
                    <Button type="submit">Criar tarefa</Button>
                </form>
            </section>

        </main>
    )
}
