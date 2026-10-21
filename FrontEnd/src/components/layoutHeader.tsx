import logo_check from "../assets/verificar.png"
import icon_logout from "../assets/sair-do-usuario.png"

import { useAuth } from "../hook/useAuth"
import { Link, Outlet } from "react-router"

export function LayoutHeader() {
    const { user, signOut } = useAuth()

    return (
        <>
            <header className="border-b border-line bg-surface px-4 sm:px-8">
                <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5">
                    <Link
                        to="/tasks"
                        className="inline-flex shrink-0 items-center gap-3 rounded-lg text-base font-semibold tracking-tight text-content transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                    >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand">
                            <img src={logo_check} alt="" aria-hidden="true" className="size-5 object-contain" />
                        </span>
                        Task Manager
                    </Link>

                    <div className="flex min-w-0 max-w-full items-center gap-3 sm:gap-5">
                        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
                            <span className="min-w-0 wrap-break-word font-medium text-content">{user?.name}</span>
                            <span aria-hidden="true" className="text-muted">·</span>
                            <span className="text-muted">{user?.role === "Admin" ? "Administrador" : "Membro"}</span>
                        </div>

                        <button
                            type="button"
                            onClick={signOut}
                            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-page hover:text-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                        >
                            <img src={icon_logout} alt="" aria-hidden="true" className="size-4 shrink-0 object-contain invert" />
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <Outlet />
        </>
    )
}
