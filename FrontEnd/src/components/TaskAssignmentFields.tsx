import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { useNavigate } from "react-router";
import { Select } from "./select";
import type { TaskData } from "../pages/NewTask";
import type { useTaskOptions } from "../hook/useTaskOptions";
import type { User } from "../types/user";
import iconMais from "../assets/mais.png";

type TaskAssignmentFieldsProps = {
    control: Control<TaskData>;
    register: UseFormRegister<TaskData>;
    errors: FieldErrors<TaskData>;
    user: User | null;
    isAdmin: boolean;
    isSubmitting: boolean;
    selectedTeamId: string;
    options: ReturnType<typeof useTaskOptions>;
    onTeamChange: () => void;
};

export function TaskAssignmentFields({
    control, register, errors, user, isAdmin, isSubmitting,
    selectedTeamId, options, onTeamChange
}: TaskAssignmentFieldsProps) {
    const navigate = useNavigate()
    const {
        teamList, availableUsers, teamOptions, userOptions,
        loadingOptions, loadingMembers, optionsError, membersError
    } = options

    return (
        <>
                    <div>
                        <label htmlFor="task-team" className="mb-2 block text-sm font-medium text-content">Equipe</label>
                        <div className="flex min-w-0 items-center gap-2">
                        <Controller
                            name="team_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="task-team"
                                    options={teamOptions}
                                    value={field.value}
                                    disabled={loadingOptions || !!optionsError || isSubmitting}
                                    onChange={(value) => {
                                        field.onChange(value)
                                        onTeamChange()
                                    }}
                                />
                            )}
                        />

                        <div>
                            {isAdmin && (
                                <button type="button" disabled={isSubmitting} onClick={() => navigate("/team")} aria-label="Ir para equipes e membros" title="Ir para equipes e membros" className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line bg-page transition-colors hover:border-brand hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                                    <span>
                                        <img src={iconMais} alt="" aria-hidden="true" className="size-4 object-contain invert" />
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                    </div>
                    {errors.team_id && (
                        <p className="text-sm text-danger">
                            {errors.team_id.message}
                        </p>
                    )}

                    {loadingOptions && <p role="status" className="text-sm text-muted">Carregando usuários e equipes...</p>}
                    {!loadingOptions && !optionsError && teamList.length === 0 && (
                        <p role="status" className="text-sm text-muted">
                            {isAdmin ? "Nenhuma equipe cadastrada. Crie uma equipe para continuar." : "Você ainda não participa de uma equipe. Peça a um administrador para adicionar você."}
                        </p>
                    )}

                    <div>
                        {isAdmin ? (
                        <>
                        <label htmlFor="task-owner" className="mb-2 block text-sm font-medium text-content">Responsável</label>
                        <div className="flex min-w-0 items-center gap-2">
                        <Controller
                            name="assigned_to"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="task-owner"
                                    options={userOptions}
                                    value={field.value}
                                    disabled={!selectedTeamId || loadingOptions || loadingMembers || !!optionsError || !!membersError || isSubmitting || availableUsers.length === 0}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <div>
                            {isAdmin && (
                                <button type="button" disabled={isSubmitting} onClick={() => navigate("/team")} aria-label="Ir para equipes e membros" title="Ir para equipes e membros" className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line bg-page transition-colors hover:border-brand hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                                    <span>
                                        <img src={iconMais} alt="" aria-hidden="true" className="size-4 object-contain invert" />
                                    </span>
                                </button>
                            )}
                        </div>
                        </div>
                        {!loadingOptions && selectedTeamId && !loadingMembers && !membersError && !optionsError && availableUsers.length === 0 && (
                            <p role="status" className="mt-2 text-sm text-muted">Esta equipe não tem responsáveis disponíveis. Adicione um membro para continuar.</p>
                        )}
                        </>
                        ) : (
                            <>
                                <p className="mb-2 text-sm font-medium text-content">Responsável</p>
                                <p className="rounded-lg border border-line bg-page px-3 py-3 text-sm text-content">{user?.name} <span className="text-muted">(você)</span></p>
                                <input type="hidden" {...register("assigned_to")} />
                            </>
                        )}
                    </div>
                    {errors.assigned_to && (
                        <p className="text-sm text-danger">
                            {errors.assigned_to.message}
                        </p>
                    )}

        </>
    )
}
