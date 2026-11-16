# Rastreabilidade — Diagrama de Componentes × Diagrama de Implantação

Esta matriz comprova que **todo módulo/serviço lógico desenhado na visão de componentes tem um lugar de execução na implantação**.

| Componente da visão lógica | Local/nó de implantação | Artefato ou serviço | Observação |
|---|---|---|---|
| App Cliente | Smartphone/navegador do cliente | Cliente web/mobile | Acessa HTTPS |
| Portal Restaurante | Navegador do restaurante | Frontend portal | Acessa HTTPS |
| App Entregador | Smartphone do entregador | Cliente web/mobile | Acessa HTTPS |
| API REST | PaaS: instância API 1 e API 2 | **«artifact» backend-modular** | Mesmo artefato em 2 réplicas |
| Identidade | Dentro das 2 instâncias da API | Módulo interno do backend | Compartilha runtime e deploy |
| Catálogo | Dentro das 2 instâncias da API | Módulo interno do backend | Consulta Redis/PG |
| Pedidos | Dentro das 2 instâncias da API | Módulo interno do backend | Transações e outbox |
| Integração de Pagamentos | Dentro das 2 instâncias da API | Módulo interno do backend | HTTPs com PSP |
| Despacho | Dentro das 2 instâncias da API | Módulo interno do backend | Atualiza status |
| Publicador Outbox | Dentro das 2 instâncias da API | Módulo interno do backend | Publicação com concorrência controlada |
| Worker Notificações | PaaS: instância Worker | **«artifact» worker-notificacoes** | Consome fila |
| PostgreSQL HA | DB gerenciado, primário/standby | Dados persistentes + outbox | Backups/replicação |
| Redis | Cache gerenciado | Cache recomputável | Não é sistema de registro |
| Fila gerenciada | Broker gerenciado | Fila eventos de pedido | Entrega ao worker |
| PSP externo | Nuvem do provedor | Serviço de pagamento | Dependência de terceiros |
| Push externo | Nuvem do provedor | Serviço de notificações | Dependência de terceiros |
| CDN/WAF, LB, armazenamento | Infraestrutura externa/gerenciada | Nós de rede e storage | **Infra**, não módulos de negócio |

## Verificação de consistência

- [x] Os **6 módulos internos** (API, Identidade, Catálogo, Pedidos, Pagamentos e Despacho), mais Publicador, aparecem no mesmo backend, não como microsserviços separados.
- [x] O Worker de Notificações está **separado** da API em ambas as visões.
- [x] PostgreSQL, Redis, fila, PSP e Push aparecem nas duas visões.
- [x] Duas réplicas da API e primário/standby no deployment não são dois módulos de negócio diferentes.
- [x] O outbox é uma **tabela transacional do PostgreSQL**, não um broker adicional nem uma cópia de dados.
- [x] A proposta não confunde serviço gerenciado com garantia de disponibilidade.

**Arquivos:** [Componentes](../diagramas/diagrama-componentes.svg) · [Implantação](../diagramas/diagrama-implantacao.svg).
