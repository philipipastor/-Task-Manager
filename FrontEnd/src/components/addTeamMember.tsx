
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "../services/api";
import { Button } from "./button";
import { type Teams } from "../types/teams";
import arrowBack from "../assets/seta-esquerda.png";

type User = {
  id: string;
  name: string;
  email: string;
};

type AddTeamMemberProps = {
  team: Teams;
  onCancel: () => void;
  onAdded: () => Promise<void>;
};

const existingUserSchema = z.object({
  user_id: z.string().uuid("Selecione um usuário")
});

const newUserSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(5, "A senha deve ter no mínimo 5 caracteres")
});

type ExistingUserForm = z.infer<typeof existingUserSchema>;
type NewUserForm = z.infer<typeof newUserSchema>;

export function AddTeamMember({
  team,
  onCancel,
  onAdded
}: AddTeamMemberProps) {
  const [tab, setTab] = useState<"existing" | "new">("existing");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  const existingForm = useForm<ExistingUserForm>({
    resolver: zodResolver(existingUserSchema),
    defaultValues: {
      user_id: "" 
    }
  });

  const newUserForm = useForm<NewUserForm>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get<User[]>("/users");
        setUsers(response.data);
      } catch (error) {
        console.log(error);
        setError("Não foi possível carregar os usuários.");
      }
    }

    fetchUsers();
  }, []);

  async function addExistingUser(data: ExistingUserForm) {
    setError("");

    try {
      await api.post("/members", {
        user_id: data.user_id,
        team_id: team.id
      });

      await onAdded();
    } catch (error) {
      console.log(error);
      setError("Não foi possível vincular o usuário à equipe.");
    }
  }

  async function addNewUser(data: NewUserForm) {
    setError("");

    try {
      const response = await api.post<User>("/users", data);

      await api.post("/members", {
        user_id: response.data.id,
        team_id: team.id
      });

      await onAdded();
    } catch (error) {
      console.log(error);
      setError(
        "Não foi possível concluir o cadastro e o vínculo do usuário."
      );
    }
  }

  return (
    <section className="min-w-0 flex-1 p-5 sm:p-7">
      <button
        type="button"
        onClick={onCancel}
        className="mb-5 inline-flex cursor-pointer items-center gap-2 rounded text-sm font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand"
      >
        <img src={arrowBack} alt="" aria-hidden="true" className="size-4 shrink-0 object-contain invert" /> Voltar à equipe
      </button>

      <h2 className="text-xl font-semibold text-content">
        Adicionar membro
      </h2>

      <p className="mt-2 text-sm text-muted">
        Equipe:{" "}
        <span className="font-semibold text-content">
          {team.name}
        </span>
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Tipo de cadastro">
        <button
          type="button"
          aria-pressed={tab === "existing"}
          onClick={() => {
            setTab("existing");
            setError("");
          }}
          className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "existing"
              ? "border-brand bg-brand-light text-brand"
              : "border-line text-content hover:bg-page"
          }`}
        >
          Usuário existente
        </button>

        <button
          type="button"
          aria-pressed={tab === "new"}
          onClick={() => {
            setTab("new");
            setError("");
          }}
          className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "new"
              ? "border-brand bg-brand-light text-brand"
              : "border-line text-content hover:bg-page"
          }`}
        >
          Novo usuário
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      )}

      {tab === "existing" ? (
        <form
          onSubmit={existingForm.handleSubmit(addExistingUser)}
          noValidate
          className="mt-6 max-w-xl space-y-5"
        >
          <div>
            <label
              htmlFor="existing-user"
              className="mb-2 block text-sm font-medium text-content"
            >
              Usuário
            </label>

            <select
              id="existing-user"
              {...existingForm.register("user_id")}
              className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-content sm:text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="" className="bg-surface">
                Selecione um usuário
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                  className="bg-surface"
                >
                  {user.name} — {user.email}
                </option>
              ))}
            </select>

            {existingForm.formState.errors.user_id && (
              <p className="mt-1 text-xs text-danger">
                {existingForm.formState.errors.user_id.message}
              </p>
            )}

            <p className="mt-5 text-xs text-muted">
              Selecione uma pessoa já cadastrada no Task Manager.
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 cursor-pointer rounded-lg border border-line px-4 text-sm font-medium text-content hover:bg-page"
            >
              Cancelar
            </button>

            <Button
              type="submit"
              disabled={existingForm.formState.isSubmitting}
            >
              {existingForm.formState.isSubmitting
                ? "Vinculando..."
                : "Vincular à equipe"}
            </Button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={newUserForm.handleSubmit(addNewUser)}
          noValidate
          className="mt-6 max-w-xl space-y-5"
        >
          <div>
            <label
              htmlFor="new-user-name"
              className="mb-2 block text-sm font-medium text-content"
            >
              Nome completo
            </label>

            <input
              id="new-user-name"
              type="text"
              placeholder="Ex.: Marina Souza"
              {...newUserForm.register("name")}
              className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-content sm:text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />

            {newUserForm.formState.errors.name && (
              <p className="mt-1 text-xs text-danger">
                {newUserForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="new-user-email"
              className="mb-2 block text-sm font-medium text-content"
            >
              E-mail
            </label>

            <input
              id="new-user-email"
              type="email"
              placeholder="marina@exemplo.com"
              {...newUserForm.register("email")}
              className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-content sm:text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />

            {newUserForm.formState.errors.email && (
              <p className="mt-1 text-xs text-danger">
                {newUserForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="new-user-password"
              className="mb-2 block text-sm font-medium text-content"
            >
              Senha inicial
            </label>

            <input
              id="new-user-password"
              type="password"
              placeholder="No mínimo 5 caracteres"
              {...newUserForm.register("password")}
              className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-content sm:text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />

            {newUserForm.formState.errors.password && (
              <p className="mt-1 text-xs text-danger">
                {newUserForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <p className="text-xs text-muted">
            O novo usuário será vinculado à equipe selecionada.
          </p>

          <div className="flex flex-wrap justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 cursor-pointer rounded-lg border border-line px-4 text-sm font-medium text-content hover:bg-page"
            >
              Cancelar
            </button>

            <Button
              type="submit"
              disabled={newUserForm.formState.isSubmitting}
            >
              {newUserForm.formState.isSubmitting
                ? "Criando..."
                : "Criar e vincular"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
