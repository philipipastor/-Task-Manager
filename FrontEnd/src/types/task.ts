export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: "Pendente" | "Em_progresso" | "Concluído";
  priority: "Alta" | "Média" | "Baixa";
  team?: {
    name: string;
  };
  user?: {
    name: string;
  };
};
