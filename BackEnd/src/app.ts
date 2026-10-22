import express from "express"
import cors from "cors"
import "express-async-errors"

import { errorHandling } from "./middleware/errorHandling"
import { routes } from "./routes"

const app = express()

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://task-manager-six-olive-82.vercel.app"
    ]
}))
app.use(express.json())
app.use(routes)
app.use(errorHandling)

export { app }
