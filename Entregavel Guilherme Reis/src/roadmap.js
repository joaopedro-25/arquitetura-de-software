export const stages = [
  {
    number: "01",
    title: "Fundamentos",
    period: "Meses 0–3",
    description: "Construa a base para trabalhar com sistemas e código.",
    skills: ["Linux", "Git", "Docker", "CI/CD"],
  },
  {
    number: "02",
    title: "Infraestrutura",
    period: "Meses 3–8",
    description: "Aprenda a provisionar, escalar e observar aplicações.",
    skills: ["Terraform", "Cloud", "Kubernetes", "Monitoramento"],
  },
  {
    number: "03",
    title: "Projeto público",
    period: "Meses 8–12",
    description: "Transforme conhecimento em uma entrega que outras pessoas possam ver.",
    skills: ["Portfólio", "Automação", "Documentação"],
  },
  {
    number: "04",
    title: "Especialização",
    period: "Próxima etapa",
    description: "Aprofunde-se na área que mais combina com você.",
    skills: ["MLOps", "Segurança", "SRE", "FinOps"],
  },
];

export function getProgress(completed, total) {
  if (!Number.isFinite(total) || total <= 0) return 0;
  return Math.round((Math.min(Math.max(completed, 0), total) / total) * 100);
}

export function getNextStage(completed, items = stages) {
  return items[Math.min(Math.max(completed, 0), items.length - 1)] ?? null;
}

export function toggleStage(completed, index) {
  const result = new Set(completed);
  result.has(index) ? result.delete(index) : result.add(index);
  return result;
}
