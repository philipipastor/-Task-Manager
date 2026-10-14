import { Router } from "express";
import { TeamsController } from "@/controller/teamsController";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAutorization";

const teamRoutes = Router()
const teamsController = new TeamsController()

teamRoutes.use(ensureAuthenticated, verifyUserAuthorization(["Admin"]))

teamRoutes.post("/", teamsController.create)
teamRoutes.get("/", teamsController.index)
teamRoutes.put("/:id", teamsController.update)
teamRoutes.delete("/:id", teamsController.remove)

export { teamRoutes }