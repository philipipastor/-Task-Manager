import { Router } from "express";
import { UsersController } from "@/controller/usersController";

const userRoutes = Router()
const usersController = new UsersController()

userRoutes.post("/", usersController.create)
userRoutes.get("/", usersController.index)

export { userRoutes }