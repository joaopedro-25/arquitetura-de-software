# Cenário e requisitos não funcionais

## Descrição textual interpretada (proposta-base)

**EntregaJá** é uma plataforma de delivery urbano com três públicos: cliente (busca, pedido, pagamento e acompanhamento), restaurante (aceite e preparo) e entregador (aceite de corrida e status). O pedido evolui por estados controlados; a autorização do pagamento acontece por um PSP externo, sem reter o número completo de cartão. Eventos de status devem notificar cliente e parceiros, sem travar o checkout.

> **Hipótese adotada pelo grupo:** como o professor ainda não forneceu aqui o enunciado individualizado, esta descrição foi redigida para o projeto conceitual. Ela deve ser substituída se o sistema realmente atribuído for diferente.

## Atores, casos e escopo

| Ator | Principal jornada | Dados e componentes |
|---|---|---|
| Cliente | Buscar cardápio → pedido → pagamento → acompanhar entrega | App Cliente, Catálogo, Pedidos, Pagamentos, Despacho |
| Restaurante | Receber → confirmar → preparar | Portal Restaurante, API, Pedidos |
| Entregador | Aceitar corrida → atualizar estado → concluir | App Entregador, Despacho, API |
| Operação | Investigar incidentes, realizar backup e monitorar | logs, métricas, banco, filas |

**Restrições hipotéticas:** 5 pessoas na equipe, MVP em 12 semanas, lançamento em uma região, orçamento operacional limitado; utilização de PostgreSQL e serviços gerenciados para baixar esforço de manutenção; PSP terceirizado; nada de dados completos de cartão no sistema.

## RNFs priorizados

| ID | Prioridade | ISO/IEC 25010:2023 | Meta de aceitação hipotética | Teste de comprovação futuro |
|---|---|---|---|---|
| RNF-01 | **P0** | Segurança | TLS; autenticação, autorização por papel/recurso; proteção de credenciais; nenhum PAN completo no servidor | Pentest/checagem de ACL + inspeção de logs e payloads |
| RNF-02 | **P0** | Segurança / integridade | Checkout idempotente, confirmação apenas com pagamento conhecido; webhook verificado | Injetar retries, duplicatas e webhooks malformados |
| RNF-03 | **P0** | Confiabilidade / disponibilidade | 99,9% de disponibilidade mensal do endpoint de criação de pedidos | Monitoramento externo e ensaio de falha |
| RNF-04 | **P0** | Confiabilidade / recuperabilidade | RPO-alvo ≤ 5 min e RTO-alvo ≤ 60 min | Simulação documentada de failover e restauração |
| RNF-05 | **P1** | Eficiência de desempenho / comportamento temporal | API de busca p95 ≤ 300 ms, medida sem redes móveis; API de criação de pedido p95 ≤ 800 ms sem contar PSP | Teste de carga com distribuição de consultas |
| RNF-06 | **P1** | Flexibilidade / escalabilidade | Suportar teste 5× em leituras e 2× em checkout sem violar metas de erro e latência | Ensaio progressivo com métricas |
| RNF-07 | **P1** | Manutenibilidade / modularidade | Alteração de catálogo não exige modificar regra de autorização de pagamento | Revisão de fronteiras e testes de contrato |
| RNF-08 | **P2** | Capacidade de interação | Mensagens de erro compreensíveis, navegação por teclado em web e contraste revisado | Inspeção de interface e teste com usuários |

**Metas de exemplo, não resultados medidos:** o professor pode solicitar outros números. Os tempos de backend excluem rede móvel/serviços externos; as metas de recuperação dependem do provedor e do teste real. Segurança é a prioridade de negócio nº 1, mas confiabilidade é indispensável para pedidos.

## Restrições de negócio e seus impactos

- **Equipe pequena:** favorece um monolito modular com processos auxiliares, não muitos serviços distribuídos.
- **Prazo curto:** prioriza escopo funcional do MVP, observabilidade mínima e automação simples.
- **Orçamento limitado:** serviços gerenciados e réplica de app, evitando 24x7 de cluster próprio; custo deve ser revisto.
- **Pagamento terceiro:** fornecedor PSP é dependência externa; usar tempo limite, callbacks e idempotência.
- **Dados pessoais:** aplicar minimização de dados, trilhas de acesso e política de retenção, considerando legislação aplicável (sem presumir conformidade automática).

[ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html)
