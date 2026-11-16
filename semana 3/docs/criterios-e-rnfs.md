# RNFs priorizados e critérios de validação — Semana 3

## Regra de prioridade
- **P0 (essencial):** violação coloca em risco a finalidade central, segurança ou correção do serviço.
- **P1 (importante):** piora materialmente o serviço, mas admite degradação planejada ou mitigação.
- **P2 (evolução):** traz eficiência/qualidade incremental e pode ser adiado com transparência.

A ISO/IEC 25010:2023 define **nove características de qualidade de produto**. Este estudo usa uma delas como **dominante** por sistema, com subcaracterísticas onde apropriado. Os valores abaixo são **metas ilustrativas a negociar e testar**, e não SLAs medidos ou compromissos.

## Vitrine 360 — e-commerce fictício

**Contexto:** crescimento da loja, campanhas sazonais e sobrecarga de consultas de catálogo. Equipes separadas para catálogo e operações de checkout.

| Prioridade | RNF | Referência ISO 25010:2023 | Critério/forma de evidência (hipotético) |
|---|---|---|---|
| **P0** | Escala elástica | Flexibilidade → Escalabilidade | Testar 10× de requisições durante uma campanha e registrar erros/latência/custo |
| **P0** | Checkout correto | Adequação funcional (correção) e segurança/integridade | Não confirmar pedido com pagamento desconhecido ou estoque não reservado |
| **P1** | Disponibilidade | Confiabilidade → Disponibilidade | Definir janela e medir taxa de sucesso por jornada |
| **P1** | Resposta do catálogo | Eficiência de desempenho → Comportamento temporal | Medir p95 separadamente para busca e checkout |
| **P2** | Deploy autônomo | Manutenibilidade → Modularidade | Testar release de catálogo sem deploy em pagamento |

**Dominante:** Flexibilidade → Escalabilidade. **Trade-off aceito:** rede, observabilidade distribuída, consistência entre domínios, SRE/infra. **Cuidado:** consistência eventual só é aceitável em informações e reações que toleram atraso; pagamento e estoque exigem garantias explícitas.

## Banco Horizonte — app bancário fictício

**Contexto:** transações financeiras, controle de acesso, conformidade e equipe moderada.

| Prioridade | RNF | Referência ISO 25010:2023 | Critério/forma de evidência (hipotético) |
|---|---|---|---|
| **P0** | Confidencialidade e controle de acesso | Segurança → Confidencialidade, autenticidade | Revisão de autorização por recurso, autenticação forte e proteção de dados |
| **P0** | Integridade de transferências | Segurança → Integridade; adequação funcional | Testes concorrentes sem transferências confirmadas parcialmente |
| **P1** | Auditoria e não repúdio | Segurança → Responsabilização (*accountability*), não repúdio | Registrar trilha íntegra de operações e agentes |
| **P1** | Continuidade e recuperação | Confiabilidade → Disponibilidade, recuperabilidade | Ensaio de restauração e reconciliação controlada |
| **P2** | Evolução isolada por módulo | Manutenibilidade → Modularidade | Testes de fronteiras internas e dependências |

**Dominante:** Segurança. ACID é **propriedade transacional exigida pelo domínio**, não atributo ISO isolado. **Trade-off aceito:** deploy conjunto, escalabilidade menos granular. **Cuidado:** monolito não equivale a sistema seguro, e auditoria não pode ser só um log editável comum.

## Arena Flux — multiplayer fictício

**Contexto:** jogo casual competitivo em navegador, partidas rápidas e jogadores simultâneos.

| Prioridade | RNF | Referência ISO 25010:2023 | Critério/forma de evidência (hipotético) |
|---|---|---|---|
| **P0** | Tempo de atualização | Eficiência de desempenho → Comportamento temporal | Acompanhar p95 do processamento de tick e tempo de entrega das atualizações |
| **P0** | Estado consistente e validação de regras | Adequação funcional e Segurança → Integridade | Provar que cliente não define arbitrariamente vencedor/posição |
| **P1** | Continuidade da partida | Confiabilidade → Disponibilidade | Medir perda de sessão, falhas e reconexão |
| **P1** | Escala por sala | Flexibilidade → Escalabilidade | Aumentar partidas ativas sem elevar atraso além do aceitável |
| **P2** | Manutenção do matchmaking | Manutenibilidade → Modularidade | Isolar mudanças de pareamento de regras de partida |

**Dominante:** Eficiência de desempenho → Comportamento temporal. **Trade-off aceito:** infraestrutura em tempo real, região, orquestração de salas. **Cuidado:** WebSocket é escolha de transporte plausível para um jogo casual web, não um requisito universal de todos os jogos.

## Hipóteses, medições e revisão

- Os cenários e as prioridades são fornecidos pelo exercício; métricas e metas ainda precisam ser negociadas.
- Medir sempre com carga representativa, registrando p50/p95, erros, CPU, disponibilidade, consumo de banco e custo por unidade relevante.
- Escalonar em 10× não é resultado automático do estilo: depende de capacidade, processos, filas, limites de terceiros e gargalos.
- Revisar o ADR quando surgirem dados de carga, expansão de equipe, mudança de regulação ou aumento do custo de operação.

**Fontes:** [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html); [Semana 2](../../semana%202/README.md).
