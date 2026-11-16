# Roteiro de pitch para stakeholders — EntregaJá

**Duração alvo:** 10–15 minutos. **Formato:** falar com base nos slides, sem ler cada tópico literalmente.

| Slide | Tempo aprox. | Mensagem para apresentar |
|---|---:|---|
| 1. Capa | 30s | “Transformamos o problema de delivery em decisões de software e infraestrutura.” |
| 2. Contexto e premissas | 45s | “Este é um cenário fictício de MVP; a descrição específica do professor não veio, por isso declaramos as hipóteses.” |
| 3. Jornadas e escopo | 45s | “Três públicos dependem de uma jornada de pedido confiável.” |
| 4. Prioridades P0/P1/P2 | 65s | “Segurança, integridade e disponibilidade são essenciais. Tempo de resposta tem critérios mensuráveis.” |
| 5. Estilo selecionado | 55s | “Com equipe pequena, monolito modular entrega controle com menos operações distribuídas.” |
| 6. Diagrama de componentes | 75s | “Mostramos apps, módulos, banco, cache, fila, worker e terceiros. Setas explicam quem consome quem.” |
| 7. Pedido seguro | 60s | “Idempotência evita duplicidade; um timeout de PSP deixa estado pendente, não autoriza cobrança extra.” |
| 8. Diagrama de implantação | 75s | “A API corre em duas réplicas, o worker separado e o banco possui standby; são mapas do mesmo sistema.” |
| 9. Componentes × nós | 60s | “Cada componente possui um local concreto de implantação.” |
| 10. Qualidade e medição | 60s | “Não prometemos 99,9%/300ms sem teste; são metas sujeitas a ensaio.” |
| 11. Falhas e proteção | 55s | “Falha de PSP ou de um banco deve ser prevista, com limitações explícitas.” |
| 12. Custos e trade-offs | 55s | “Pagamos com deploy conjunto e dependência de nuvem, em troca de simplicidade inicial.” |
| 13. Crescimento e riscos | 55s | “Aumentamos réplicas, cache e workers, mas banco e PSP podem seguir gargalos.” |
| 14. Peer review | 45s | “Uma rubrica objetiva de 20 pontos ajuda outro grupo a criticar com respeito.” |
| 15. Encerramento | 35s | “A arquitetura é boa quando é coerente, mensurável e revisável.” |

## Perguntas que podem surgir

**Por que não microsserviços?** No cenário hipotético a equipe e o orçamento favorecem simplicidade; a modularidade deixa aberta futura extração.

**Duas APIs garantem 99,9%?** Não. Banco, região, rede e PSP ainda falham. Disponibilidade requer ensaio e métricas.

**Onde o módulo de pagamento está no deployment?** Ele roda dentro do artefato backend-modular nas duas réplicas, comunicando-se com o PSP externo.

**E se a notificação não for entregue?** A transação de pedido e outbox permanece registrada; eventos podem ser reenviados e o worker deve ser idempotente.

**Por que diagramas separados?** Componentes mostram responsabilidades; implantação mostra em quais nós e artefatos essas responsabilidades executam.
