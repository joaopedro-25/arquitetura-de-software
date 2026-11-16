# ADR-001 — Microsserviços para Vitrine 360

**Status:** Aceito  
**Data:** 2026-11-16  
**Sistema:** Vitrine 360 — e-commerce fictício  
**Atributo dominante (ISO/IEC 25010:2023):** Flexibilidade → Escalabilidade  
**Tipo:** decisão arquitetural do estudo de caso, não prescrição universal.

## Contexto

A loja enfrenta campanhas com picos concentrados de consulta de produtos e, em menor proporção, etapas críticas de checkout. Catálogo, estoque, pedidos e pagamentos têm ritmos de demanda e mudança diferentes. A equipe possui maturidade **hipotética** para manter automação, observabilidade e deploys separados. O risco de negócio é perder vendas durante picos ou paralisar o checkout ao evoluir a vitrine.

**RNFs priorizados:** P0 escala elástica e correção do checkout; P1 disponibilidade e desempenho; P2 autonomia de deploy.

## Decisão

Adotaremos **microsserviços organizados por domínio**: Catálogo, Pedidos, Estoque, Pagamentos e Notificações. Uma camada de entrada expõe APIs. Tarefas como notificações ou analytics poderão ser disparadas por **eventos**. Dados de pedido, pagamento e estoque terão regras de integridade explícitas, idempotência e tratamento de falhas; **não** serão tratados como consistência eventual irrestrita. Testaremos cargas de pico antes de assumir metas.

## Alternativas consideradas

1. **Monolito modular:** mais simples e barato para começar; seria preferível com equipe pequena e volume estável. Rejeitado neste cenário por expectativa de picos e equipes atuando em domínios distintos.
2. **Microsserviços (aceito):** escalonamento e deploy independentes em troca de complexidade distribuída.
3. **Arquitetura orientada a eventos como estilo central:** útil como integração assíncrona, mas insuficiente, isoladamente, para modelar toda a jornada síncrona de compra.

## Consequências

### Positivas
- Catálogo e promoções podem escalar sem replicar os serviços de pagamento.
- Deploys e limites de falha são mais separados entre domínios (sem prometer isolamento absoluto).
- Equipes podem evoluir serviços com contratos estáveis.

### Negativas
- Mais infraestrutura, custos de monitoramento, rastreamento de chamadas e automação.
- Falhas de rede, timeouts, retries e transações entre serviços demandam compensação e idempotência.
- O banco de um serviço ou parceiro de pagamento pode permanecer gargalo e ponto de dependência.

## Mitigações e evidências
- Tracing, logs correlacionados, alertas de erro, limites de fila e circuit breakers onde fizer sentido.
- Contratos entre serviços, controle transacional local, chave de idempotência e fluxos de compensação.
- Experimentos de carga de campanha, acompanhando p95, erros e custo por pedido concluído.

## Crise: demanda 10× em um mês

**Não há garantia automática.** A camada de catálogo pode escalar horizontalmente, mas pagamentos, estoque e banco precisam de capacidade própria. Devemos carregar dados de leitura em cache (com invalidação adequada), ampliar workers de eventos, limitar solicitações abusivas e ensaiar falhas parciais sem comprometer a correção do checkout.

## Tradução para a diretoria

**Ganho esperado:** proteger a receita nos picos e entregar promoções com autonomia. **Custo:** equipe, operação e observabilidade distribuída. **Condição de aprovação:** ganhos demonstrados em teste de carga e custo operacional compatível com o negócio.

## Condições de revisão

Revisar se o tráfego não justificar custos distribuídos, se não houver equipe suficiente para operação ou se os testes revelarem dependências excessivas entre serviços. A solução pode ser simplificada por domínio se o custo superar o benefício.

**Referência:** [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html). 
