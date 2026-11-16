# Documento de Arquitetura — EntregaJá

## 1. Visão geral

A solução conecta apps de clientes e entregadores e o portal de restaurantes. Todos acessam o backend por HTTPS. Adotou-se **monolito modular** com duas instâncias de API stateless, **PostgreSQL gerenciado com HA** para o núcleo transacional, **Redis** para cache transitório, e **outbox + fila + worker** para notificação assíncrona.

**Premissas:** cenário fictício, equipe 5 pessoas, MVP 12 semanas, região única, orçamento limitado. Nada é implantado na atividade.

## 2. Estilo e justificativa

Escolha: **monolito modular com processamento assíncrono periférico**, em lugar de microsserviços para todos os domínios.

**Racional:** transações locais de pedido e outbox podem ser atômicas no PostgreSQL; uma aplicação tem menos overhead de comunicação e deploy. Duas réplicas suportam carga da API. Um worker separado absorve notificações e picos sem bloquear o pedido. Os módulos têm limites explícitos para eventual extração.

**Alternativas:**
1. Monolito não modular — rejeitado por risco de acoplamento e manutenção.
2. Microsserviços completos — rejeitados na fase inicial pelo custo de redes, deploys, tracing e coordenação distribuída.
3. Serverless para tudo — poderia reduzir idle, mas depende de custos de invocação, conexões, cold starts e adequação do provedor; não foi escolhido sem dados.

## 3. Componentes e responsabilidades

| ID | Componente | Responsabilidade | Interfaces principais |
|---|---|---|---|
| C1 | App Cliente | Buscar, pedir, pagar e acompanhar | HTTPS/REST → C4 |
| C2 | Portal Restaurante | Aceitar/preparar pedidos | HTTPS/REST → C4 |
| C3 | App Entregador | Corridas e status | HTTPS/REST → C4 |
| C4 | API REST | Validação de sessão, entrada e roteamento | HTTPS; chamadas internas C5–C9 |
| C5 | Identidade | Login, papéis e autorização | Chamadas internas; PostgreSQL |
| C6 | Catálogo | Cardápios, preços visíveis, busca | Chamadas internas; Redis e PostgreSQL |
| C7 | Pedidos | Máquina de estados, integridade, idempotência | Chamadas internas; PostgreSQL e outbox |
| C8 | Integração de Pagamentos | PSP, validação de webhook, conciliação | HTTPS ↔ PSP; C7 |
| C9 | Despacho | Regras de alocação e atualização de entrega | Chamadas internas; PostgreSQL |
| C10 | Publicador Outbox | Transfere eventos persistidos para broker | PostgreSQL → fila |
| C11 | Worker Notificações | Consome eventos idempotentemente e envia push | Fila → Push externo |
| C12 | PostgreSQL HA | Pedidos, usuários, outbox e dados de negócio | SQL |
| C13 | Redis | Cache recomputável de catálogo/sessões não sensíveis | TCP/TLS |
| C14 | Fila gerenciada | Entrega durável de eventos | Publish/consume |
| C15 | PSP externo | Autorização/confirmação de pagamento | HTTPS + webhook |
| C16 | Push externo | Entrega de notificações aos usuários | HTTPS API |

## 4. Fluxo A — pedido e pagamento

1. Cliente envia intenção de compra com **chave de idempotência** pela API.
2. Backend autentica e valida catálogo, preço e restaurante; cria pedido em estado controlado.
3. Adaptador de pagamento envia pedido de autorização ao PSP com idempotência; PSP responde ou envia webhook autenticado.
4. Após confirmação confiável do PSP, transação local registra estado do pedido + **evento outbox**; não finalizar sem confirmação.
5. Publicador entrega o evento à fila e marca o envio; worker entrega push idempotentemente.
6. Restaurante confirma, Despacho encaminha e Entregador atualiza o pedido; notificações não bloqueiam a transação de negócio.

**Falha importante:** timeout no PSP significa estado **indeterminado** a reconciliar, nunca “pagamento negado” nem nova cobrança sem verificação.

## 5. Fluxo B — consulta de catálogo

App Cliente → CDN/WAF → LB → API → Catálogo → Redis (hit); no cache miss, consulta PostgreSQL e alimenta cache com TTL curto. O cache não é fonte de verdade de preço final na compra; o pedido revalida dados.

## 6. Implantação conceitual

- Dispositivos e browser são nós clientes.
- Plataforma gerenciada hospeda 2 réplicas do **mesmo artefato monolito modular** e um artefato separado de **worker**.
- LB distribui HTTPS às réplicas stateless. CDN/WAF e storage são elementos externos/gerenciados.
- PostgreSQL possui instância primária + standby e backups, com teste de failover.
- Redis e fila são serviços gerenciados.
- PSP e Push são terceiros acessados por HTTPS.

## 7. Segurança e operação

TLS; segredos em cofre; menor privilégio; tokens/sessões curtas; autorização por propriedade de recurso; dados pessoais minimizados; nenhum dado completo de cartão; webhook do PSP com assinatura e idempotência; auditoria de pedidos e alteração de status. Observabilidade com correlation ID de pedido, latência p95, taxas de erros e métricas de fila.

## 8. Escalabilidade, resiliência e limites

API cresce horizontalmente mantendo estado no banco; Redis diminui leituras; worker cresce conforme profundidade de fila. Banco primário e PSP ainda podem limitar throughput. HA na mesma região não elimina falha regional. RPO/RTO precisam ser ensaiados. Em picos muito altos, investigar extração de módulos apenas após dados.

## 9. Consistência dos diagramas

Ver [mapeamento componente→implantação](03-mapeamento-componentes-implantacao.md), [riscos](04-riscos-e-tradeoffs.md), [componente SVG](../diagramas/diagrama-componentes.svg), [implantação SVG](../diagramas/diagrama-implantacao.svg).

## 10. Critérios de revisão

Revisar a decisão se surgirem várias equipes de domínio, necessidades de deploy verdadeiramente independentes, regiões adicionais ou picos que não possam ser acomodados com réplicas/caching/banco. Revisões devem registrar evidências, custos, mitigação e data.
