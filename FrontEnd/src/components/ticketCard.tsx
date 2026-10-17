import type { Task } from "../types/task";

type Props = {
  task: Task;
};

export function TaskCard({ task }: Props) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-5 transition-colors hover:border-brand/40 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold wrap-anywhere text-content">
          {task.title}
        </h3>

        <p className="mt-1 text-xs leading-relaxed wrap-anywhere text-muted">
          {task.team?.name} · {task.user?.name} ·
          Prioridade {task.priority.toLowerCase()}
        </p>
      </div>

      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${task.status === "Pendente" ? "bg-pending-bg text-pending" : task.status === "Em_progresso" ? "bg-progress-bg text-progress" : "bg-done-bg text-done"}`}>
        {task.status.replace("_", " ")}
      </span>
    </div>
  );
}
