import { createContext, useEffect, useState, type ReactNode } from "react";

import { useNavigate } from "react-router";

import { api } from "../services/api";

import { AxiosError } from "axios"

import type { User } from "../types/user";
import type { AuthResponse } from "../types/user";

type AuthContextData = {
    user: User | null,
    isLoading: boolean,
    signIn: (session: AuthResponse) => void,
    signOut: () => void
}

const LocalStorageKey = "@TaskManager"

export const authContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    function signIn(authenticatedUser: AuthResponse) {
        localStorage.setItem(`${LocalStorageKey}:user`, JSON.stringify(authenticatedUser.user))
        localStorage.setItem(`${LocalStorageKey}:token`, authenticatedUser.token)

        api.defaults.headers.common["Authorization"] = `Bearer ${authenticatedUser.token}`
        setUser(authenticatedUser.user)
    }

    function signOut() {
        localStorage.removeItem(`${LocalStorageKey}:user`)
        localStorage.removeItem(`${LocalStorageKey}:token`)

        delete api.defaults.headers.common["Authorization"]

        setUser(null)

        navigate("/login", { replace: true })

    }

    function loadUser() {
        const user = localStorage.getItem(`${LocalStorageKey}:user`)
        const token = localStorage.getItem(`${LocalStorageKey}:token`)

        if (token && user) {
            try {
                const savedUser = JSON.parse(user)
                if (!savedUser || typeof savedUser.id !== "string") {
                    signOut()
                    return
                }

                api.defaults.headers.common["Authorization"] = `Bearer ${token}`
                setUser(savedUser)
            } catch {
                signOut()
            }
        } else if (token || user) {
            signOut()
        }
    }

    useEffect(() => {
        try {
            loadUser()
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,

            (error: AxiosError) => {

                console.log("Interceptor executado")
                console.log("Status:", error.response?.status)
                console.log("URL:", error.config?.url)

                const isUnauthorized = error.response?.status === 401

                const isLoginRequest = error.config?.url?.includes("/session")

                if (isUnauthorized && !isLoginRequest) {
                    sessionStorage.setItem(
                        "@TaskManager:sessionExpired",
                        "true"
                    )

                    signOut()
                }

                return Promise.reject(error)
            }
        )

        return () => {
            api.interceptors.response.eject(interceptor)
        }
    }, [navigate])

    return (
        <authContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </authContext.Provider>
    )
}
