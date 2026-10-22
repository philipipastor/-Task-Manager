import { type Teams } from "../types/teams";
import { type TeamMember as TeamMemberType } from "../types/teamsMember";

import { TeamMember } from "./teamMember";
import { Button } from "./button";

import iconMais from "../assets/mais.png"
import iconPerson from "../assets/usuario.png"


type TeamDetailsProps = {
  team: Teams | undefined;
  members: TeamMemberType[];
  loadingMembers: boolean;
  removingMemberId: string | null;
  onRemoveMember: (member: TeamMemberType) => void;
  onAddMember: () => void
  onEdit: () => void;
  onToggleActive: () => void;
  changingStatus: boolean;
};

export function TeamDetails({ team, members, loadingMembers, removingMemberId, onRemoveMember, onAddMember, onEdit, onToggleActive, changingStatus }: TeamDetailsProps) {

  if (!team) {
    return (
      <section className="flex min-h-96 flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted">
          Selecione uma equipe para visualizar os detalhes.
        </p>
      </section>
    );
  }

  return (
    <section className="min-w-0 flex-1 p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
          <img src={iconPerson} alt="" aria-hidden="true" className="size-5 object-contain invert" />
        </div>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
          <Button type="button" onClick={onEdit} disabled={changingStatus || !!removingMemberId}>
            Editar equipe
          </Button>
          <button type="button" onClick={onToggleActive} disabled={changingStatus || !!removingMemberId} aria-busy={changingStatus}
            className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 ${team.active ? "border-danger/40 text-danger hover:bg-danger-bg" : "border-brand/40 text-brand hover:bg-brand-light"}`}>
            {changingStatus ? "Salvando..." : team.active ? "Inativar equipe" : "Ativar equipe"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h2 className="min-w-0 text-xl font-semibold wrap-anywhere text-content">
          {team.name}
        </h2>

        <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-medium ${team.active ? "bg-brand-light text-brand" : "bg-danger-bg text-danger"}`}>
          {team.active ? "Ativa" : "Inativa"}
        </span>
      </div>

      <p className="mt-2 text-sm text-muted">
        {team.description || "Esta equipe não possui descrição."}
      </p>

      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-content">
            Membros{" "}
            <span className="ml-1 text-xs font-normal text-muted">
              {loadingMembers ? "..." : members.length}
            </span>
          </h3>

          <Button type="button" onClick={onAddMember} disabled={!!removingMemberId || changingStatus}>
            <img src={iconMais} alt="" aria-hidden="true" />Adicionar membro
          </Button>
        </div>

        {loadingMembers ? (
          <p className="py-4 text-sm text-muted">
            Carregando membros...
          </p>
        ) : members.length === 0 ? (
          <p className="border-t border-line py-6 text-sm text-muted">
            Nenhum membro nesta equipe.
          </p>
        ) : (
          <div>
            {members.map((member) => (
              <TeamMember
                key={member.id}
                member={member}
                onRemove={onRemoveMember}
                isRemoving={removingMemberId === member.id}
                disabled={!!removingMemberId || changingStatus}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
