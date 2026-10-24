import { Router } from "express";

import { WorkSpaceController } from "@/controller/workSpaceController";

import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";

const workSpaceRoutes = Router()
const workSpaceController = new WorkSpaceController()

workSpaceRoutes.use(ensureAuthenticated)
workSpaceRoutes.post("/", workSpaceController.create)
workSpaceRoutes.get("/", workSpaceController.index)

export { workSpaceRoutes }
