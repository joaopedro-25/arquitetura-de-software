# Defesa executiva para a diretoria — Semana 3

## A decisão em 30 segundos

Propomos **microsserviços para a Vitrine 360**, **monolito modular para o Banco Horizonte** e **cliente-servidor autoritativo para a Arena Flux**. Não buscamos a tecnologia “mais moderna”; protegemos os pontos mais sensíveis da receita, do risco financeiro e da experiência dos jogadores.

## O que a diretoria precisa aprovar?

| Sistema | Por que investir | Risco/contrapartida | Evidência para avançar |
|---|---|---|---|
| Vitrine 360 | Evitar perda de vendas em promoções e reduzir acoplamento de releases | Gastos com plataforma, rede e observabilidade | Carga 10× testada, erros de checkout e custo por pedido |
| Banco Horizonte | Reduzir chance de erro financeiro, fraudes e retrabalho | Menos independência de implantação | Testes de concorrência, segurança, auditoria e restauração |
| Arena Flux | Manter partidas rápidas, íntegras e competitivas | Custo de servidor/tempo real e operação regional | Latência p95 e custo por sala com muitas partidas |

## Como responder a objeções

**“Por que não usar microsserviços nos três?”** Porque as prioridades são diferentes. A dispersão de serviços adiciona rede e coordenação; no jogo, isso penaliza o loop da partida. No banco inicial, amplia o custo de integridade distribuída.

**“O banco em monolito não é antiquado?”** É uma opção de organização. Modularidade e controles bem implementados podem reduzir complexidade inicial. Se o negócio mudar, registramos condições de revisão no ADR.

**“Isso vai reduzir custo com certeza?”** Não. São hipóteses. A aprovação deve depender de métricas, simulações e capacidade real.

**“E se crescer 10×?”** Não existe resposta “sim” sem carga de referência. E-commerce pode escalar serviços seletivamente, mas estoque e pagamentos ainda limitam. Banco precisa preservar as transações; escala não pode corromper saldo. Jogo precisa de servidores regionais e capacidade por partida.

## Uma fala possível para a banca

“Diretoria, nossa recomendação considera o que cada produto não pode perder: no e-commerce, conversão durante picos; no banco, a integridade do dinheiro; no jogo, partidas justas e rápidas. Cada escolha gera custos. Deixamos esses custos e condições de revisão documentados nos ADRs para que a arquitetura seja uma decisão de negócio auditável, não preferência pessoal.”

## Risco explícito e próximo passo

As hipóteses de volume, orçamento, equipe e metas de RNF são pedagógicas. Antes de gastar dinheiro real: definir baselines, fazer protótipos/experimentos de carga e segurança, comparar custo total de propriedade e revisar ADRs.

[Slides](../slides/apresentacao-semana-3.pdf) · [ADRs](../README.md#2-adrs--registros-de-decisão-arquitetural)
