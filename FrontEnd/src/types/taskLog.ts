export type TaskLog = {
    id: string,
    taskId: string,
    changedBy: string,
    old_status: string,
    new_status: string,
    changed_at: string,
    user?: {
        id: string,
        name: string
    }
};