import { type TeamMember as TeamMemberType } from "../types/teamsMember";

type TeamMemberProps = {
  member: TeamMemberType;
  onRemove: (member: TeamMemberType) => void;
};

export function TeamMember({ member, onRemove }: TeamMemberProps) {
  const initials = member.user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 border-t border-line py-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-page text-xs font-medium text-muted">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-medium text-content">
          {member.user.name}
        </p>

        {member.user.email && (
          <p className="mt-1 break-all text-xs text-muted">
            {member.user.email}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onRemove(member)}
        aria-label={`Remover ${member.user.name} da equipe`}
        className="min-h-11 shrink-0 cursor-pointer rounded px-2 text-xs font-medium text-muted transition-colors hover:text-danger focus-visible:outline-2 focus-visible:outline-brand"
      >
        Remover
      </button>
    </div>
  );
}
