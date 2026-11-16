# Roteiro oral — Semana 3 (10 a 12 minutos)

Público imaginário: **diretoria**. O objetivo é justificar investimento e riscos, não ler texto técnico.

| Slide | Tempo sugerido | Fala-guia |
|---|---:|---|
| 1. Abertura | 30s | “O melhor estilo depende do problema que precisamos resolver.” |
| 2. Resumo executivo | 45s | “Três produtos, três riscos de negócio: vendas, dinheiro e experiência.” |
| 3. Prioridades RNF | 60s | “Definimos P0, P1 e P2 antes de discutir tecnologia.” |
| 4. ISO 25010 | 45s | “Classificamos os atributos de modo consistente e evitamos tratar ACID como atributo ISO independente.” |
| 5. ADR-001 | 50s | “Microsserviços permitem ampliar catálogo sem ampliar pagamento na mesma proporção.” |
| 6. Custos do e-commerce | 40s | “É mais caro operar; só vale se o teste confirmar a demanda e a economia de escala seletiva.” |
| 7. ADR-002 | 50s | “Monolito modular mantém o núcleo transacional controlável e auditável.” |
| 8. Custos do banco | 40s | “Deploy conjunto é o preço. Controles de segurança e ACID são obrigação, não magia do estilo.” |
| 9. ADR-003 | 50s | “Servidor decide estado e vence; cliente apenas manda ações.” |
| 10. Custos do multiplayer | 40s | “Pagamos por infraestrutura e latência. Isso compra uma experiência mais controlável.” |
| 11. C4 modelo | 50s | “No diagrama: usuário → app → matchmaking → servidor de jogo → persistência de resultados. A partida usa conexão persistente.” |
| 12. Crise de 10× | 70s | “Nenhuma das três opções garante 10× sem capacidade; apresentamos o plano e o gargalo.” |
| 13. Dinheiro e prazos | 55s | “O critério de aprovação é a evidência de custo, risco e tempo de entrega.” |
| 14. ADR versus diagrama | 50s | “O diagrama mostra como; o ADR registra por quê e quanto custa.” |
| 15. Encerramento | 35s | “Arquitetura é uma hipótese gerenciável, revisada com dados reais.” |

## Questões que podem aparecer

- **Microsserviços são sempre mais escaláveis?** Não. Escala depende de banco, limites externos, operação e desenho por domínio.
- **Por que não dividir o banco em serviços?** Neste contexto, custo e risco da transação distribuída excedem a vantagem inicial. Não é uma regra universal.
- **WebSocket resolve a latência?** Melhora a adequação do transporte para o caso casual web, mas rede, servidor e região continuam decisivos.
- **Como saber se o ADR continua válido?** Revisar condições e evidências: volume, falhas, tamanho da equipe, exigências de segurança e custo.
