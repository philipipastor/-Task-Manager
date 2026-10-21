import { Router } from "express";
import { UsersController } from "@/controller/usersController";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";

const userRoutes = Router()
const usersController = new UsersController()

userRoutes.use(ensureAuthenticated)
userRoutes.post("/", usersController.create)
userRoutes.get("/", usersController.index)

export { userRoutes }