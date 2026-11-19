import { stages, getProgress, getNextStage, toggleStage } from "./roadmap.js";

const STORAGE_KEY = "devpath-guilherme-completed";
const roadmap = document.querySelector("#roadmap");
const readCompleted = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(value.filter((index) => Number.isInteger(index) && index >= 0 && index < stages.length));
  } catch {
    return new Set();
  }
};

let completed = readCompleted();

function render() {
  roadmap.innerHTML = stages.map((stage, index) => `
    <article class="roadmap-card ${completed.has(index) ? "is-complete" : ""}">
      <div class="stage-head"><span class="stage-number">${stage.number}</span><span class="stage-period">${stage.period}</span></div>
      <h3>${stage.title}</h3><p>${stage.description}</p>
      <div class="skill-list">${stage.skills.map((skill) => `<span>${skill}</span>`).join("")}</div>
      <button class="stage-toggle" data-stage="${index}" aria-pressed="${completed.has(index)}">
        <span class="checkmark">${completed.has(index) ? "✓" : ""}</span>${completed.has(index) ? "Concluída" : "Marcar como concluída"}
      </button>
    </article>`).join("");

  const percent = getProgress(completed.size, stages.length);
  document.querySelector("#progress-value").textContent = percent;
  document.querySelector("#progress-bar").style.width = `${percent}%`;
  document.querySelector("#completed-count").textContent = `${completed.size} ${completed.size === 1 ? "etapa" : "etapas"}`;

  const next = getNextStage(completed.size);
  document.querySelector("#next-title").textContent = completed.size === stages.length ? "Jornada completa. Hora de escolher o próximo desafio." : `${next.title}: seu próximo passo.`;
  document.querySelector("#next-description").textContent = completed.size === stages.length ? "Continue aprendendo, compartilhe seu projeto e ajude outras pessoas a avançar." : next.description;
}

roadmap.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-stage]");
  if (!button) return;
  completed = toggleStage(completed, Number(button.dataset.stage));
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  render();
});

render();
