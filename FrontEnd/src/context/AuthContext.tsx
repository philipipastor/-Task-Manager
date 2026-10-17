import { createContext, useEffect, useState, type ReactNode } from "react";

import { api } from "../services/api";

import type { User } from "../types/user";

type AuthContextData = {
    user: User | null,
    signIn: (user: User) => void,
    signOut: () => void
}

const LocalStorageKey = "@TaskManager"

export const authContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    function signIn(authenticatedUser: User) {
        localStorage.setItem(`${LocalStorageKey}:user`, JSON.stringify(authenticatedUser.user))
        localStorage.setItem(`${LocalStorageKey}:token`, authenticatedUser.token)

        api.defaults.headers.common["Authorization"] = `Bearer ${authenticatedUser.token}`
        setUser(authenticatedUser)
    }

    function signOut() {
        localStorage.removeItem(`${LocalStorageKey}:user`)
        localStorage.removeItem(`${LocalStorageKey}:token`)

        delete api.defaults.headers.common["Authorization"]

        setUser(null)
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
                setUser({ token, user: savedUser })
            } catch {
                signOut()
            }
        } else if (token || user) {
            signOut()
        }
    }

    useEffect(() => {
        loadUser()
    }, [])

    return (
        <authContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </authContext.Provider>
    )
}
