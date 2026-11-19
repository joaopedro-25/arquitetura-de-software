import test from "node:test";
import assert from "node:assert/strict";
import { stages, getProgress, getNextStage, toggleStage } from "./roadmap.js";

test("define uma trilha de quatro etapas de aprendizado", () => {
  assert.equal(stages.length, 4);
  assert.equal(stages[0].title, "Fundamentos");
  assert.ok(stages.every((stage) => stage.skills.length > 0));
});

test("calcula o progresso e limita o resultado ao intervalo válido", () => {
  assert.equal(getProgress(1, 4), 25);
  assert.equal(getProgress(8, 4), 100);
  assert.equal(getProgress(-2, 4), 0);
  assert.equal(getProgress(1, 0), 0);
});

test("seleciona a etapa atual e mantém a última após concluir tudo", () => {
  assert.equal(getNextStage(0).title, "Fundamentos");
  assert.equal(getNextStage(3).title, "Especialização");
  assert.equal(getNextStage(4).title, "Especialização");
});

test("alterna uma etapa sem alterar o conjunto original", () => {
  const original = new Set([0]);
  const marked = toggleStage(original, 1);
  const unmarked = toggleStage(marked, 0);
  assert.deepEqual([...original], [0]);
  assert.deepEqual([...marked], [0, 1]);
  assert.deepEqual([...unmarked], [1]);
});
