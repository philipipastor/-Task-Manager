import { Router } from "express"
import { TaskHistoryController } from "@/controller/taskHistoryController"
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated"


const taskHistoryRoutes = Router()
const taskHistoryController = new TaskHistoryController()

taskHistoryRoutes.get("/:id", ensureAuthenticated, taskHistoryController.index)

export { taskHistoryRoutes }