import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router"

import { TaskCard } from "../components/ticketCard"
import { Select } from "../components/select"
import { Button } from "../components/button"

import { type Task } from "../types/task"
import { statusOptions } from "../utils/statusOptions"

import { api } from "../services/api"

export function TaskList() {
    const navigate = useNavigate()

    const [taskCount, setTaskCount] = useState(0)
    const [tasks, setTasks] = useState<Task[]>([])
    const [searchParams, setSearchParams] = useSearchParams()

    async function fetchTasks() {
        try {
            const response = await api.get<Task[]>("/tasks", {
                params: { status: searchParams.get("status") || undefined }
            })

            setTasks(response.data)
            setTaskCount(response.data.length)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [searchParams])

    return (
        <main className="min-h-svh bg-page px-4 py-8 sm:px-8">
            <section className="mx-auto w-full max-w-5xl">
                <div className="relative sm:pr-48 [&>div]:mt-6 sm:[&>div]:absolute sm:[&>div]:right-0 sm:[&>div]:top-8 sm:[&>div]:mt-0 [&_button]:h-11">
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">Meu espaço</p>

                    <h1 id="task-title" className="text-2xl font-semibold tracking-tight text-content">Minhas tarefas</h1>

                    <p className="mt-2 text-sm text-muted">Um lugar para acompanhar o que precisa ser feito</p>

                    <Button onClick={() => navigate("/newTask")}> + Nova tarefa</Button>
                </div>


                <div className="mt-9">
                    <p className="mb-2 text-sm font-medium text-content">Status</p>
                    <div className="flex items-center gap-5 [&>select]:h-11 [&>select]:max-w-48 [&>select]:text-sm [&>select]:font-medium">
                        <Select
                            options={statusOptions}
                            value={searchParams.get("status") ?? ""}
                            onChange={(event) => {
                                setSearchParams((params) => {
                                    const next = new URLSearchParams(params);

                                    if (event) {
                                        next.set("status", event);
                                    } else {
                                        next.delete("status");
                                    }

                                    return next;
                                });
                            }}
                        />
                        <span className="shrink-0 text-sm text-muted after:content-['_tarefas']">{taskCount}</span>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-2.5">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>

            </section>
        </main >
    )
}
