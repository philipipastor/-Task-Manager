import { Route, Routes } from "react-router"

import { Navigate } from "react-router"

import { LayoutHeader } from "../components/layoutHeader"

import { TaskList } from "../pages/Tasks"
import { NewTask } from "../pages/NewTask"
import { TaskDetails } from "../pages/TaskDetails"
import { Teams } from "../pages/teams"
import { NotFound } from "../pages/NotFound"

import { useAuth } from "../hook/useAuth"

export function TaskRoutes() {
    const {user} = useAuth()
    const isAdmin = user?.role === "Admin"

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/login" element={<Navigate to="/tasks" replace />} />
            <Route path="/cadastro" element={<Navigate to="/tasks" replace />} />

            <Route element={<LayoutHeader />}>
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/newTask" element={<NewTask />} />
                <Route path="/tasks/:id" element={<TaskDetails />} />

                {isAdmin && (
                <Route path="/team" element={<Teams />} />
                )}
                
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
