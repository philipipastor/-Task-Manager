import { Route, Routes } from "react-router"

import { TaskList } from "../pages/Tasks"
import { NewTask } from "../pages/NewTask"
import { TaskDetails } from "../pages/TaskDetails"
import { Teams } from "../pages/teams"
import { NotFound } from "../pages/NotFound"

export function TaskRoutes() {
    return (
        <Routes>
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/newTask" element={<NewTask />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/team" element={<Teams />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}