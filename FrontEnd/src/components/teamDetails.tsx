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
  onRemoveMember: (member: TeamMemberType) => void;
  onAddMember: () => void
};

export function TeamDetails({
  team,
  members,
  loadingMembers,
  onRemoveMember,
  onAddMember
}: TeamDetailsProps) {
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
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand">
        <img src={iconPerson} alt="" aria-hidden="true" className="size-5 object-contain invert" />
      </div>

      <h2 className="text-xl font-semibold text-content">
        {team.name}
      </h2>

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

          <Button type="button" onClick={onAddMember}>
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
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}