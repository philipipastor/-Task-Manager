import { type Teams } from "../types/teams";

import arrowNext from "../assets/seta-direita.png"

type TeamListProps = {
    teams: Teams[];
    disabled?: boolean;
    
    selectedTeamId: string | null;
    onSelectTeam: (id: string) => void;
};

export function TeamList({ 
    teams,
    disabled,
    selectedTeamId,
    onSelectTeam
}: TeamListProps) {
    return (
        <aside className="w-full shrink-0 border-b border-line p-4 md:w-60 md:border-r md:border-b-0">
            <h2 className="mx-3 mb-4 text-xs font-medium tracking-wide text-muted">
                Suas equipes
            </h2>

            <div className="flex flex-col gap-2">
                {teams.map((team) => (
                    <button
                        key={team.id}
                        type="button"
                        disabled={disabled}
                        aria-pressed={selectedTeamId === team.id}
                        onClick={() => onSelectTeam(team.id)}
                        className={`w-full cursor-pointer rounded-lg p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${selectedTeamId === team.id
                            ? "bg-brand-light text-brand"
                            : "text-content hover:bg-page"
                            }`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <span className="min-w-0 wrap-break-word text-sm font-medium">
                                {team.name}
                            </span>

                            {selectedTeamId === team.id && (
                                <span aria-hidden="true" className="shrink-0"><img src={arrowNext} alt="" className="size-4 object-contain invert" /></span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-muted">
                            {team._count?.teamsMembers ?? 0} membros
                            {!team.active && <span className="ml-2 text-danger">Inativa</span>}
                        </p>
                    </button>
                ))}
            </div>
        </aside>
    );
}
