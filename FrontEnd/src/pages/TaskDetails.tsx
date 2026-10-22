import { Select } from "../components/select";
import { Button } from "../components/button";

import { api } from "../services/api";

import { type Task } from "../types/task";
import { type TaskLog } from "../types/taskLog";

import arrowBack from "../assets/seta-esquerda.png"

import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink } from "react-router";

const options = [
    { label: "Pendente", value: "Pendente" },
    { label: "Em progresso", value: "Em_progresso" },
    { label: "Concluído", value: "Concluído" },
];

const schema = z.object({
    status: z.enum(["Pendente", "Em_progresso", "Concluído"])
});

type Status = z.infer<typeof schema>;

export function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [details, setDetails] = useState<Task>();
    const [taskLog, setTaskLog] = useState<TaskLog[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [historyError, setHistoryError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const { handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<Status>({
        resolver: zodResolver(schema),
        defaultValues: { status: "Pendente" }
    });

    async function updateTask(data: Status) {
        if (!id || !details || isDeleting) return;

        setError("");

        try {
            await api.patch(`/tasks/${id}`, data);

            setDetails((previous) =>
                previous ? { ...previous, status: data.status } : previous
            );

            navigate("/tasks")

        } catch (error) {
            console.log(error);
            setError("Não foi possível atualizar o status.");
        }
    }

    async function removeTask() {
        if (!id || !details || isDeleting || isSubmitting) return;
        if (!window.confirm("Deseja excluir essa tarefa?")) return;
        setIsDeleting(true);
        setError("");

        try {
            await api.delete(`/tasks/${id}`);

            navigate("/tasks")

        } catch (error) {
            console.log(error);
            setError("Não foi possível excluir a tarefa.");
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        let cancelled = false;
        async function taskDetails() {
            setIsLoading(true);
            setDetails(undefined);
            setError("");
            if (!id) { setIsLoading(false); return; }

            try {
                const response = await api.get<Task>(`/tasks/${id}`);
                if (cancelled) return;

                setDetails(response.data);

                reset({
                    status: response.data.status
                });

            } catch (error) {
                console.log(error);
                if (!cancelled) setError("Não foi possível carregar a tarefa.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        taskDetails();
        return () => { cancelled = true; };
    }, [id, reset]);

    useEffect(() => {
        let cancelled = false;
        async function taskLog() {
            setLoadingHistory(true);
            setHistoryError("");
            try {
                const response = await api.get(`/tasks/history/${id}`)
                if (!cancelled) setTaskLog(response.data)

            } catch (error) {
                console.log(error)
                if (!cancelled) setHistoryError("Não foi possível carregar o histórico.");
            } finally {
                if (!cancelled) setLoadingHistory(false);
            }

        }

        taskLog()
        return () => { cancelled = true; };
    }, [id])

    return (
        <main className="mx-auto min-h-svh w-full max-w-272 bg-page px-4 py-8 sm:px-8">
            <NavLink to="/tasks" className="mb-8 inline-block rounded-sm text-brand transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                <p className="flex items-center gap-2 text-sm font-medium"> 
                    <img src={arrowBack} alt="" aria-hidden="true" className="size-4 shrink-0 object-contain invert" />
                    Voltar às tarefas
                </p>
            </NavLink>
            {isLoading && <p role="status" className="mb-4 text-sm text-muted">Carregando tarefa...</p>}
            <h1 className="text-2xl font-semibold tracking-tight wrap-anywhere text-content">
                {details?.title}
            </h1>

            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed wrap-anywhere text-muted">
                {details?.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm wrap-anywhere text-content">
                <p>Responsável: {details?.user?.name}</p>
                <p>Prioridade: {details?.priority}</p>
                <p>Equipe: {details?.team?.name}</p>
            </div>

            <form className="mt-8 flex flex-wrap gap-3 [&>select]:mb-1 [&>p]:w-full [&>div:nth-last-child(2)]:ml-auto [&>div:nth-last-child(2)>button]:border [&>div:nth-last-child(2)>button]:border-line [&>div:nth-last-child(2)>button]:bg-surface [&>div:nth-last-child(2)>button]:text-danger [&>div:nth-last-child(2)>button:hover]:border-danger/50 [&>div:nth-last-child(2)>button:hover]:bg-danger-bg" onSubmit={handleSubmit(updateTask)}>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={options}
                            disabled={isLoading || !details || isSubmitting || isDeleting}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />

                {errors.status && (
                    <p className="text-sm text-danger">
                        {errors.status.message}
                    </p>
                )}

                {error && (
                    <p className="rounded-lg border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger">
                        {error}
                    </p>
                )}

                <Button type="button" onClick={removeTask} isLoading={isDeleting} disabled={isLoading || !details || isSubmitting}>
                    {isDeleting ? "Excluindo..." : "Excluir tarefa"}
                </Button>

                <Button type="submit" isLoading={isSubmitting} disabled={isLoading || !details || isDeleting}>
                    {isSubmitting ? "Salvando..." : "Salvar status"}
                </Button>
            </form>

            <h3 className="mt-9 mb-3 text-base font-semibold text-content">Histórico de status</h3>
            <h3 className="hidden">Histórico de status</h3>

            {loadingHistory ? (
                <p role="status" className="text-sm text-muted">Carregando histórico...</p>
            ) : historyError ? (
                <p role="alert" className="text-sm text-danger">{historyError}</p>
            ) : taskLog.length === 0 ? (
                <p className="text-sm text-muted">Nenhuma mudança de status ainda.</p>
            ) : (
                taskLog.map((log) => (
                    <div key={log.id} className="mb-3 w-full rounded-lg border border-line bg-surface p-4 text-sm">
                        <p className="font-medium wrap-anywhere text-brand">
                            {log.old_status.replace("_", " ")} → {log.new_status.replace("_", " ")}
                        </p>
                        <p className="mt-2 wrap-anywhere text-muted">
                            Alterado por: {log.user?.name}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                            Alterado em: {new Date(log.changed_at).toLocaleString("pt-BR")}
                        </p>
                    </div>
                ))
            )}
        </main>
    );
}
