import { Route, Routes } from "react-router"

import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import { NotFound } from "../pages/NotFound"

export function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />

            <Route path="*" element={<NotFound/>} />
        </Routes>
    )
}