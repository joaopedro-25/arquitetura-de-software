# ADR-003 — Cliente-servidor autoritativo para Arena Flux

**Status:** Aceito  
**Data:** 2026-11-16  
**Sistema:** Arena Flux — jogo multiplayer fictício  
**Atributo dominante (ISO/IEC 25010:2023):** Eficiência de desempenho → Comportamento temporal  
**Tipo:** decisão arquitetural do estudo de caso, não descrição de jogo real.

## Contexto

Jogo competitivo casual com partidas rápidas, jogadores conectados simultaneamente e atualização frequente de posição, pontuação e eventos. O negócio depende de partidas percebidas como rápidas, justas e consistentes. O uso de requisições HTTP isoladas para cada movimento seria inadequado.

**RNFs priorizados:** P0 baixa latência e estado sincronizado; P1 disponibilidade por partida e resistência à fraude; P2 modularidade do matchmaking.

## Decisão

Adotaremos **cliente-servidor autoritativo**: clientes transmitem entradas; o **servidor de partida** aplica as regras, decide o estado oficial, publica atualizações e registra o resultado final. Um **serviço de matchmaking** organiza salas. Para um jogo casual via navegador, o canal de partida poderá usar **WebSocket** persistente; protocolos com características distintas (UDP/QUIC) seriam avaliados se os requisitos de latência exigirem.

## Alternativas consideradas

1. **Peer-to-peer:** menor uso de servidor central, mas mais exposição a trapaça, NAT e divergência de estado.
2. **Cliente-servidor autoritativo (aceito):** controle e consistência por partida em troca de gasto de infraestrutura.
3. **Microsserviços em cada ação da partida:** potencial de separação funcional, mas chamadas remotas adicionais no caminho de cada atualização aumentariam latência e complexidade.

## Consequências

### Positivas
- Autoridade sobre regras de jogo, reduzindo manipulação direta do estado por clientes.
- Sincronização baseada em fonte oficial por sessão.
- Facilita testes e auditoria de resultado de partidas.

### Negativas
- Custo de computação e conexões por sala.
- Distância geográfica e congestionamento afetam experiência em tempo real.
- Queda do servidor da partida afeta sua sessão; recuperação é desafiadora.

## Mitigações e evidências
- Servidores de partida por região, limites de capacidade e agendamento de salas.
- Monitorar tempo de tick, p95 de atualização, uso de CPU e perda/reconexão.
- Limitar entradas, validar movimentações, registrar métricas e tratar desconexões.
- Separar caminhos de matchmaking e persistência do loop crítico do jogo.

## Crise: jogadores 10× em um mês

**Depende de capacidade real, não apenas do estilo.** Escalar o número de servidores de partida e a alocação de salas, distribuir por regiões e usar admissão controlada se faltarem recursos. Sem orçamento/instâncias suficientes, aumentam filas e latência; é preferível informar capacidade limitada a degradar silenciosamente todas as partidas.

## Tradução para a diretoria

**Ganho esperado:** partidas justas e melhor experiência percebida, protegendo retenção. **Custo:** infraestrutura regional e equipe de operação em tempo real. **Condição de aprovação:** ensaios de carga por sala, latência e custo por hora de partida sob metas acordadas.

## Condições de revisão

Revisar o transporte (WebSocket versus alternativas) e tamanho das salas caso medições apontem latência inadequada; não abandonar autoridade sem revisar risco de fraude e consistência.

**Referências:** [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html); [C4 Model](https://c4model.com/introduction).
