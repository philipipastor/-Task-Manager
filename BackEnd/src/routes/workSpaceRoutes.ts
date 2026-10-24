import { Router } from "express";

import { WorkSpaceController } from "@/controller/workSpaceController";
import { WorkSpaceInviteController } from "@/controller/workSpaceInviteController";

import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";

const workSpaceRoutes = Router()
const workSpaceController = new WorkSpaceController()
const workSpaceInviteController = new WorkSpaceInviteController()

workSpaceRoutes.use(ensureAuthenticated)
workSpaceRoutes.post("/", workSpaceController.create)
workSpaceRoutes.get("/", workSpaceController.index)

workSpaceRoutes.post("/:workSpaceId/invites", workSpaceInviteController.create)
workSpaceRoutes.post("/invites/accept", workSpaceInviteController.accept)

export { workSpaceRoutes }
