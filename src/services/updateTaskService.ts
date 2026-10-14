import { prisma } from "@/database/prisma"
import { appError } from "@/utils/appError"
import { Status } from "../../generated/prisma/enums"

type UpdateTaskParams = {
  taskId: string
  oldStatus: Status
  newStatus: Status
  changedBy: string
}

class UpdateTaskService {
  async execute({taskId, oldStatus, newStatus, changedBy}: UpdateTaskParams) {

    if (oldStatus === "Concluído") {
      throw new appError("Essa tarefa já foi concluída", 400)
    }

    if (oldStatus === newStatus) {
      throw new appError("A tarefa já possui esse status", 400)
    }

    const updatedTask = await prisma.$transaction(async (tx) => {
      const task = await tx.tasks.update({
        where: { id: taskId },
        data: { status: newStatus }
      })

      await tx.taskHistory.create({
        data: {
          taskId,
          changedBy,
          old_status: oldStatus,
          new_status: newStatus
        }
      })

      return task
    })

    return updatedTask
  }
}

export { UpdateTaskService }