import { Express } from "express";

import { env } from "@/env";

import { app } from "@/app";

app.listen(env.PORT, () => {
    console.log(`Server is running in PORT ${env.PORT}`)
})