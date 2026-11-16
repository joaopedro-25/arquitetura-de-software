# Roteiro da apresentação oral (aprox. 8–10 minutos)

**Slide 1 — Abertura (30s):** “A mesma arquitetura não resolve os problemas de toda aplicação. Vamos comparar três cenários fictícios.”

**Slide 2 — Problema e critérios (45s):** “Primeiro definimos os requisitos mais críticos: pico de acesso, integridade de dinheiro e tempo real. A escolha depende dessas restrições.”

**Slide 3 — Matriz de decisão (45s):** “Cada sistema possui uma prioridade dominante. O preço de cada escolha é tão relevante quanto o benefício.”

**Slides 4–5 — Vitrine 360 (1m30):** “Microserviços permitem escalar catálogo e checkout de forma diferente. Eventos ajudam no assíncrono, mas cobrança e estoque exigem regras fortes. A contrapartida é a complexidade operacional.”

**Slides 6–7 — Banco Horizonte (1m30):** “Escolhemos monolito modular porque transações críticas se beneficiam de um núcleo controlado. Auditoria e segurança exigem medidas concretas; não surgem automaticamente por escolher um monolito.”

**Slides 8–9 — Arena Flux (1m30):** “No cliente-servidor autoritativo, o jogador envia ações, e o servidor define a verdade da partida. WebSocket é adequado ao nosso jogo casual; latência muito exigente pode requerer UDP/QUIC.”

**Slide 10 — Comparação (45s):** “Microserviços não são superiores por padrão; são melhores para este cenário de e-commerce. O banco prioriza integridade, e o jogo, sincronização.”

**Slide 11 — Diagrama bônus (45s):** “O matchmaking direciona os jogadores ao servidor autoritativo. O estado sensível fica em memória durante a partida e resultados podem ser persistidos depois.”

**Slide 12 — Fechamento (45s):** “Não há bala de prata: orçamento, equipe, risco e prazo determinam o melhor trade-off. O importante é saber defender e revisar a decisão.”

**Perguntas prováveis do professor**
- *Por que não microsserviços no banco?* Porque neste cenário inicial a prioridade é reduzir complexidade distribuída do núcleo transacional; isso não significa que bancos reais jamais usem microsserviços.
- *Microsserviços garantem disponibilidade?* Não. Eles ajudam a isolar domínios, mas exigem circuit breakers, retries adequados, idempotência e observabilidade.
- *WebSocket é sempre mais rápido que UDP?* Não. WebSocket é prático para cliente web e conexão persistente; a escolha do transporte depende do perfil do jogo.
- *Qual seria a escolha para um pequeno e-commerce?* Possivelmente um monolito modular, caso baixo orçamento e equipe reduzida tornem microsserviços caros demais.
