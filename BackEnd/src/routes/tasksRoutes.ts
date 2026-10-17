import { Router } from "express";
import { TaskController } from "@/controller/tasksController";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";

const taskRoutes = Router()
const taskController = new TaskController()

taskRoutes.use(ensureAuthenticated)
taskRoutes.post("/", taskController.create)
taskRoutes.get("/", taskController.index)
taskRoutes.delete("/:id", taskController.remove)
taskRoutes.patch("/:id", taskController.update)

export { taskRoutes }