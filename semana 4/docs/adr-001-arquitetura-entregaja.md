# ADR-001 — Monolito modular com processamento de eventos assíncronos

**Status:** Aceito para o cenário conceitual  
**Data:** 2026-11-16  
**Sistema:** EntregaJá (fictício)

## Contexto
Uma equipe de cinco pessoas precisa desenhar o MVP de um delivery regional em até 12 semanas, com orçamento limitado e requisitos fortes de integridade de pedidos, segurança, disponibilidade e notificações de status.

## Decisão
Adotar **monolito modular** (API REST com módulos Identidade, Catálogo, Pedidos, Pagamentos, Despacho e Publicador Outbox), replicado em duas instâncias stateless. Usar PostgreSQL gerenciado HA para transações locais e outbox, Redis para cache e fila+worker separado para notificações. PSP e Push permanecem externos.

## Alternativas
- **Monolito sem fronteiras:** risco alto de acoplamento e retrabalho.
- **Microsserviços completos:** maior autonomia futura, porém operação distribuída e custo elevado para equipe/tempo assumidos.
- **Monolito modular + eventos (aceito):** equilíbrio entre simplicidade operacional e evolução controlada.

## Consequências positivas
- Transações de pedido e outbox mais simples de manter consistentes.
- Menor custo de deploy e diagnóstico inicial.
- Réplicas da API e worker desacoplado permitem escalar processamento sem microserviços completos.
- Módulos permitem futura extração caso evidências justifiquem.

## Consequências negativas
- Deploy conjunto de módulos e banco compartilhado.
- Recursos de API podem competir dentro do mesmo processo.
- Dependências da nuvem e do PSP; failover regional não incluído no escopo inicial.
- Necessidade de garantir idempotência do publicador/worker e contratos internos.

## Mitigações e critérios para rever
- Monitorar tempo p95, erros, custo por pedido, CPU e fila.
- Automatizar testes de fronteiras, recuperação, acesso e webhook.
- Revisar em caso de múltiplas equipes autônomas, novas regiões ou crescimento de domínios incompatível com escala conjunta.

**Relação com a entrega:** [Diagrama de Componentes](../diagramas/diagrama-componentes.svg) · [Diagrama de Implantação](../diagramas/diagrama-implantacao.svg) · [RNFs](01-cenario-e-rnfs.md).
