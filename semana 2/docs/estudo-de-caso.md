# Estudo de caso — três decisões de arquitetura

## Metodologia

Para cada sistema, o grupo examinou (1) contexto de negócio, (2) requisitos não funcionais, (3) estilo predominante, (4) justificativas técnicas e financeiras, (5) riscos e limites. As propostas são conceituais: não há implementação nem código.

## Caso A — Vitrine 360: e-commerce

### Contexto
Marketplace de pequeno a médio porte em crescimento, com campanhas de alto tráfego, buscas intensivas no catálogo, promoções e checkout com pagamentos. O cenário pressupõe várias equipes e operação suficientemente madura para observabilidade e automação de deploy.

### Requisitos não funcionais
- **Escalabilidade:** muitas leituras do catálogo e do preço durante eventos, sem exigir o mesmo aumento de capacidade nos pagamentos.
- **Resiliência:** problema nas notificações não pode derrubar a consulta de produtos nem perder pedidos confirmados.
- **Disponibilidade:** as jornadas principais devem ser priorizadas em períodos de pico.
- **Consistência:** o catálogo e indicadores toleram atualização eventual; pagamento, reserva de estoque e estados definitivos de pedido exigem garantias fortes e idempotência.
- **Operabilidade:** métricas, logs correlacionados, traces distribuídos e mecanismos de retry.

### Escolha: microsserviços
Separar os domínios **Catálogo**, **Carrinho**, **Pedidos**, **Estoque** e **Pagamento**; cada serviço possui responsabilidades explícitas. Um API Gateway organiza a entrada de chamadas. Eventos de negócio permitem acionar atividades assíncronas (por exemplo, notificar após pedido confirmado). Serviços críticos validam operações e fazem compensações quando necessário.

**Justificativa técnica:** escalonamento por componente, isolamento parcial de falhas e independência de deploy.  
**Justificativa de negócio:** campanhas mais resilientes, autonomia de equipes e capacidade de evoluir promoções sem interromper o checkout.  
**Trade-off:** maior custo de infraestrutura e pessoal especializado; comunicação remota, observabilidade e consistência entre domínios exigem mais engenharia.  
**Alternativa descartada:** monolito modular seria ideal em fase inicial com equipe pequena, mas neste cenário pressuposto de tráfego e de equipes a separação agrega valor.

### Exemplo de fluxo
Cliente consulta catálogo → inicia compra → serviço de pedidos solicita validação de estoque e pagamento → confirma o pedido após as condições obrigatórias → publica evento para notificação. Um timeout de pagamento deve resultar em consulta/retentativa segura ou estado pendente, nunca em cobrança duplicada.

## Caso B — Banco Horizonte: app bancário

### Contexto
Aplicativo regulado em fase inicial de expansão, com saldos, extratos, transferências e pagamento de contas. Equipe moderada, prioridade em correção, segurança e trilhas de auditoria.

### Requisitos não funcionais
- **Integridade:** débitos e créditos relacionados precisam ser coordenados e contabilizados corretamente.
- **Consistência forte:** operações críticas precisam respeitar transações ACID e regras de concorrência.
- **Segurança:** MFA, autorização por recurso, criptografia em trânsito e repouso, proteção de segredos e controles antifraude.
- **Auditoria:** registro rastreável, resistente a adulteração e útil para investigações.
- **Resiliência e recuperação:** backups, replicação, procedimentos de recuperação e tratamento idempotente de solicitações.

### Escolha: monolito modular
Um processo de aplicação com módulos como **Identidade e Acesso**, **Contas**, **Transferências**, **Pagamentos** e **Auditoria**. O domínio contábil usa um banco relacional transacional e regras de consistência concentradas; integrações com redes externas podem continuar assíncronas e idempotentes.

**Justificativa técnica:** operações multi-etapas dentro de limites transacionais mais simples de controlar e testar do que em transações distribuídas.  
**Justificativa de negócio:** menor complexidade operacional para equipe moderada; auditoria e desenvolvimento previsíveis.  
**Trade-off:** deploy conjunto, escalonamento do processo inteiro e risco de acoplamento caso módulos não sejam protegidos.  
**Alternativa descartada:** microsserviços em todo o núcleo aumentariam complexidade de transações e coordenação sem ganho necessário nessa fase.

> O monolito **não garante** segurança, ACID ou conformidade sozinho: tudo isso depende do desenho do domínio, banco, infraestrutura, políticas e testes.

### Exemplo de fluxo
Usuário autenticado solicita transferência → módulo valida titularidade, limite e saldo → transação registra movimentos de débito/crédito e a operação → auditoria registra evidência → resposta ao cliente. Integrações externas seguem protocolos e reconciliação adequados.

## Caso C — Arena Flux: jogo multiplayer

### Contexto
Jogo competitivo casual com salas e partidas de curta duração, jogadores conectados por navegador ou app, movimentação simultânea e placar.

### Requisitos não funcionais
- **Baixa latência:** comandos devem alcançar o servidor rapidamente.
- **Sincronização:** o estado da partida precisa ser convergente entre participantes.
- **Justiça:** validação no servidor e prevenção de clientes que definem resultados arbitrariamente.
- **Disponibilidade por sessão:** falhas em uma sala não devem afetar todas as outras.
- **Escala por partidas:** matchmaking e distribuição por região.

### Escolha: cliente-servidor autoritativo
Os clientes enviam **entradas**, nunca um estado final confiável; o **servidor de partida** mantém estado oficial, executa regras e distribui atualizações. Para um jogo casual via navegador, **WebSocket** é um transporte viável. Em jogos com requisitos mais agressivos de latência, o grupo avaliaria UDP/QUIC, interpolação e predição de cliente.

**Justificativa técnica:** um árbitro único por partida, sincronização centralizada e controle sobre regras, estado e placar.  
**Justificativa de negócio:** confiança na experiência competitiva, moderação e operação de partidas com métricas.  
**Trade-off:** servidores e conectividade permanentes, custo por sessão e latência ligada à distância geográfica.  
**Alternativa descartada:** peer-to-peer pode economizar processamento central, mas abre riscos de cheaters e dificuldades com NAT e sincronização.

### Exemplo de fluxo
Jogadores entram na fila → matchmaking forma a sala → serviço de sessão direciona para servidor de partida → clientes enviam entradas via WebSocket → servidor valida entradas, atualiza estado e transmite snapshots → resultados vão para persistência assíncrona.

## Síntese crítica

| Critério | Vitrine 360 | Banco Horizonte | Arena Flux |
|---|---|---|---|
| Prioridade dominante | Escala por domínio | Correção e auditoria | Estado em tempo real |
| Padrão escolhido | Microsserviços | Monolito modular | Cliente-servidor autoritativo |
| Benefício principal | Deploy e escala independentes | Núcleo transacional coeso | Autoridade e sincronização |
| Principal custo | Complexidade distribuída | Deploy e escala conjuntos | Custo dos servidores e latência |
| Sinal para reavaliar | Operação pequena, custo excessivo | Crescimento de equipes/domínios | Partidas com latência inadequada |

## Reflexão

A arquitetura é uma decisão contextual, não um ranking universal de tecnologias. Nenhum estilo maximiza simultaneamente segurança, consistência, latência, simplicidade, independência de deploy e custo. Uma equipe pequena pode preferir um monolito modular para lançar com segurança; equipes especializadas e cargas assimétricas podem justificar microsserviços. Em jogos, o caminho crítico de cada tick precisa ser curto; o servidor autoritativo tende a ser melhor para competição do que chamadas HTTP frequentes entre serviços.

Como numa planta de uma casa, a arquitetura permite antecipar necessidades e alinhar pessoas antes de construir. A vantagem não é adivinhar todos os problemas, mas deixar explícitas as prioridades, fronteiras e escolhas que poderão ser revistas com novos dados.
