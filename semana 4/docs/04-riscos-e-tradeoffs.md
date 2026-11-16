# Riscos, trade-offs e plano de validação

| Risco | Impacto | Probabilidade presumida | Mitigação arquitetural | Evidência necessária |
|---|---|---|---|---|
| Duplicidade de checkout/cobrança | Crítico | Média | Idempotência, conciliação do PSP, webhook validado | Testes de retry e concorrência |
| Primário PostgreSQL indisponível | Crítico | Baixa a média | Standby, backup, testes de failover e restauração | Ensaio RPO/RTO |
| Região única indisponível | Alto | Baixa | Plano de recuperação, backup em outra zona/região segundo política | Exercício de recuperação regional |
| PSP fora do ar | Alto | Média | Timeout, pedido pendente, circuit breaker, reconciliação | Teste de indisponibilidade |
| Redis perdido | Médio | Média | Dados de catálogo recalculáveis, cache miss para PostgreSQL | Teste sem cache |
| Fila sobrecarregada | Médio | Média | Retentativas com backoff, DLQ, worker escalável | Monitorar atraso e DLQ |
| Falha de uma API | Alto | Média | Duas réplicas stateless e Load Balancer | Teste de desligamento de réplica |
| Perda de notificação | Baixo a médio | Média | Outbox + fila e consumidor idempotente | Testes de indisponibilidade e reprocessamento |
| Acesso indevido a pedidos | Crítico | Média | ACL por recurso, gestão de segredos, auditoria | Pentest e revisão de autorização |
| Contenção no banco durante pico | Alto | Média | Índices, queries, cache, dimensionamento e controle de carga | Teste 5× leitura/2× checkout |

## Trade-offs assumidos

**Monolito modular + worker** reduz a complexidade de distribuição do domínio e acelera MVP. Em troca, releases dos módulos de backend são conjuntos e a escalabilidade por módulo é limitada. Serviços gerenciados diminuem esforço de manutenção mas geram dependência do fornecedor e custo recorrente. Uma região inicial reduz custo mas não oferece continuidade contra falha completa da região. HA/replicação ajudam, não substituem backups nem testes de recuperação.

## Plano de teste conceitual

1. **Segurança:** controle de acesso em pedido de outro usuário, token expirado, webhook falso; não armazenar cartão completo.
2. **Integridade:** 100 requisições repetidas com a mesma chave; falhas de rede e callbacks duplicados; um único pagamento vinculado.
3. **Desempenho:** carga realista de busca (p95 ≤ 300ms backend) e criação de pedido (p95 ≤ 800ms, excluindo PSP), acompanhando erros.
4. **Escala:** 5× consultas, 2× checkout; observar CPU, profundidade de fila, Postgres e custo.
5. **Disponibilidade:** derrubar uma das réplicas da API sem encerrar o serviço.
6. **Recuperabilidade:** ensaiar failover e restauração; comprovar ou revisar as metas RPO 5min/RTO 60min.
7. **Fluxo assíncrono:** derrubar worker e fila; verificar que pedido continua transacionalmente correto e notificações são retomadas.

**Importante:** este projeto não executa testes nem prova essas metas. São requisitos e evidências planejadas.
