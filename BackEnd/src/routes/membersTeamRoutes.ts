import { Router } from "express";
import { MembersTeamsController } from "@/controller/membersTeamController";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAutorization";

const membersTeamRoutes = Router()
const membersTeamController = new MembersTeamsController()

membersTeamRoutes.use(ensureAuthenticated)

membersTeamRoutes.post("/", verifyUserAuthorization(["Admin"]), membersTeamController.create)
membersTeamRoutes.delete("/:team_id", verifyUserAuthorization(["Admin"]), membersTeamController.remove)
membersTeamRoutes.get("/:team_id", membersTeamController.index)


export { membersTeamRoutes }