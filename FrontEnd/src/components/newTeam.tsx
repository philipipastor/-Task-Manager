
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "../services/api";
import { Button } from "./button";

import arrowBack from "../assets/seta-esquerda.png"

const schema = z.object({
    name: z.string().trim().min(1, "Informe o nome da equipe"),
    description: z.string().optional()
});

type FormData = z.infer<typeof schema>;

type NewTeamProps = {
    onCancel: () => void;
    onCreated: () => Promise<void>;
};

export function NewTeam({ onCancel, onCreated }: NewTeamProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: ""
        }
    });

    async function createTeam(data: FormData) {
        try {
            await api.post("/teams", data);

            await onCreated();
        } catch (error) {
            console.log(error);
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
                Nova equipe
            </h2>

            <p className="mt-2 text-sm text-muted">
                Crie um espaço para trabalhar em conjunto.
            </p>

            <form onSubmit={handleSubmit(createTeam)} noValidate className="mt-6 max-w-xl space-y-5">
                <div>
                    <label htmlFor="team-name" className="mb-2 block text-sm font-medium text-content">
                        Nome da equipe
                    </label>

                    <input
                        id="team-name"
                        type="text"
                        placeholder="Ex.: Desenvolvimento"
                        {...register("name")}
                        className="h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-content sm:text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />

                    {errors.name && (
                        <p className="mt-1 text-xs text-danger">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="team-description" className="mb-2 block text-sm font-medium text-content">
                        Descrição
                    </label>

                    <p className="mb-2 text-xs text-muted">
                        opcional
                    </p>

                    <textarea
                        id="team-description"
                        rows={3}
                        placeholder="Qual é o objetivo desta equipe?"
                        {...register("description")}
                        className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-3 text-base text-content sm:text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-1">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-11 cursor-pointer rounded-lg border border-line px-4 text-sm font-medium text-content hover:bg-page"
                    >
                        Cancelar
                    </button>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Criando..." : "Criar equipe"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
