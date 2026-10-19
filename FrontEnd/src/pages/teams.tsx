import { Button } from "../components/button";
import { TeamList } from "../components/teamList";
import { TeamDetails } from "../components/teamDetails";
import { NewTeam } from "../components/newTeam";
import { AddTeamMember } from "../components/addTeamMember";

import { api } from "../services/api";

import { type Teams } from "../types/teams";
import { type TeamMember } from "../types/teamsMember";

import iconMais from "../assets/mais.png"
import arrowBack from "../assets/seta-esquerda.png"

import { useEffect, useState } from "react";
import { Link } from "react-router";

export function Teams() {
  const [teams, setTeams] = useState<Teams[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const [view, setView] = useState<"details" | "new" | "addMember">("details");

  const [members, setMembers] = useState<TeamMember[]>([]);

  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [error, setError] = useState("");

  const selectedTeam = teams.find(
    (team) => team.id === selectedTeamId
  );

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await api.get<Teams[]>("/teams");

        setTeams(response.data);

        if (response.data.length > 0) {
          setSelectedTeamId(response.data[0].id);
        }
      } catch (error) {
        console.log(error);
        setError("Não foi possível carregar as equipes.");
      } finally {
        setLoadingTeams(false);
      }
    }

    fetchTeams();
  }, []);

  useEffect(() => {
    if (!selectedTeamId) {
      setMembers([]);
      return;
    }

    let cancelled = false;

    async function fetchMembers() {
      setLoadingMembers(true);
      setMembers([]);

      try {
        const response = await api.get<TeamMember[]>(
          `/members/${selectedTeamId}`
        );

        if (!cancelled) {
          setMembers(response.data);
        }
      } catch (error) {
        console.log(error);

        if (!cancelled) {
          setError("Não foi possível carregar os membros.");
        }
      } finally {
        if (!cancelled) {
          setLoadingMembers(false);
        }
      }
    }

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, [selectedTeamId]);

  async function removeMember(member: TeamMember) {
    if (!selectedTeamId) return;

    const confirmed = window.confirm(
      `Deseja remover ${member.user.name} desta equipe?`
    );

    if (!confirmed) return;

    setError("");

    try {
      // Ajuste este endpoint conforme sua rota DELETE no backend.
      await api.delete("/members", {
        data: {
          user_id: member.userId,
          team_id: selectedTeamId
        }
      });

      setMembers((previous) =>
        previous.filter((item) => item.id !== member.id)
      );

      setTeams((previous) =>
        previous.map((team) =>
          team.id === selectedTeamId
            ? {
              ...team,
              _count: team._count
                ? {
                  teamsMembers: Math.max(
                    0,
                    team._count.teamsMembers - 1
                  )
                }
                : undefined
            }
            : team
        )
      );
    } catch (error) {
      console.log(error);
      setError("Não foi possível remover o membro.");
    }
  }

  async function handleTeamCreated() {
    try {
      const response = await api.get<Teams[]>("/teams");

      setTeams(response.data);

      if (response.data.length > 0) {
        setSelectedTeamId(response.data[response.data.length - 1].id);
      }

      setView("details");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleMemberAdded() {
    if (!selectedTeamId) return;

    try {
      const [membersResponse, teamsResponse] = await Promise.all([
        api.get<TeamMember[]>(`/members/${selectedTeamId}`),
        api.get<Teams[]>("/teams")
      ]);

      setMembers(membersResponse.data);
      setTeams(teamsResponse.data);
      setView("details");
    } catch (error) {
      console.log(error);
      setError("Não foi possível atualizar os membros.");
      throw error;
    }
  }

  return (
    <main className="min-h-svh bg-page px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Link to="/newTask" className="mb-7 inline-flex items-center gap-2 rounded text-sm font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
          <img src={arrowBack} alt="" aria-hidden="true" className="size-4 shrink-0 object-contain invert" />
          Voltar para cadastro de tarefa
        </Link>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">
          ADMINISTRAÇÃO
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-content">
          Equipes
        </h1>

        <p className="mt-2 text-sm text-muted">
          Organize suas equipes e quem faz parte delas.
        </p>
        </div>

        <div>
          <Button type="button" onClick={() => setView("new")}>
            <img src={iconMais} alt="" aria-hidden="true" className="size-4 shrink-0 object-contain" /> Nova equipe
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-danger-bg p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-7 overflow-hidden rounded-xl border border-line bg-surface">
        {loadingTeams ? (
          <p className="p-6 text-sm text-muted">
            Carregando equipes...
          </p>
        ) : (
          <div className="flex min-h-96 flex-col md:flex-row">
            <TeamList
              teams={teams}
              selectedTeamId={selectedTeamId}
              onSelectTeam={(id) => {
                setSelectedTeamId(id);
                setView("details");
              }}
            />

            {view === "new" ? (
              <NewTeam
                onCancel={() => setView("details")}
                onCreated={handleTeamCreated}
              />
            ) : view === "addMember" && selectedTeam ? (
              <AddTeamMember
                team={selectedTeam}
                onCancel={() => setView("details")}
                onAdded={handleMemberAdded}
              />
            ) : (
              <TeamDetails
                team={selectedTeam}
                members={members}
                loadingMembers={loadingMembers}
                onRemoveMember={removeMember}
                onAddMember={() => setView("addMember")}
              />
            )}
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
