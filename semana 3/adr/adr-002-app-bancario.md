# ADR-002 — Monolito modular para Banco Horizonte

**Status:** Aceito  
**Data:** 2026-11-16  
**Sistema:** Banco Horizonte — aplicativo bancário fictício  
**Atributo dominante (ISO/IEC 25010:2023):** Segurança  
**Tipo:** decisão arquitetural do estudo de caso, não prescrição de arquitetura bancária real.

## Contexto

O app oferece saldo, extrato, transferências e pagamentos para clientes. A equipe é moderada e a prioridade é preservar integridade do dinheiro, autorização correta e evidências de auditoria. Depuração de transações distribuídas elevaria risco e custo operacional na fase descrita.

**RNFs priorizados:** P0 segurança e consistência das operações; P1 auditoria e recuperação; P2 autonomia de deploy.

## Decisão

Adotaremos **monolito modular**, com módulos internos de Identidade e Acesso, Contas, Transferências, Pagamentos e Auditoria, preservando limites de dependência e testes por módulo. O núcleo contábil utilizará **transações ACID em banco relacional**, com invariantes e idempotência em requisições. A aplicação poderá integrar sistemas externos assíncronos, com reconciliação e evidências adequadas.

## Alternativas consideradas

1. **Monolito sem modularidade:** menor custo inicial, mas maior risco de acoplamento. Rejeitado.
2. **Monolito modular (aceito):** regras e transações próximas com fronteiras internas claras.
3. **Microsserviços generalizados:** aumentam independência de deploy, mas exigem coordenação transacional, observabilidade e operação distribuída para um ganho ainda não comprovado.

## Consequências

### Positivas
- Controle transacional e testes de operações críticas mais diretos no núcleo.
- Menor complexidade de deploy do que uma rede extensa de serviços.
- Trilha de mudanças e auditoria bem definida no domínio.

### Negativas
- Deploy compartilhado e escalonamento de aplicação menos granular.
- Um processo comum pode concentrar impacto de falhas se a arquitetura operacional for frágil.
- Fronteiras internas precisam ser fiscalizadas para não virar um “monólito de espaguete”.

## Mitigações e evidências
- MFA, princípio do menor privilégio, checagem de autorização por recurso, criptografia e gestão de segredos.
- Transações testadas sob concorrência; registros de auditoria protegidos contra adulteração e reconciliação.
- Backups, simulação de restauração, observabilidade e failover cuidadosamente testado.
- Modulação e teste de dependências entre módulos.

**Importante:** segurança, conformidade, auditoria e consistência **não surgem automaticamente** de um monolito. São requisitos implementados e verificados separadamente.

## Crise: demanda 10× em um mês

**Não aguenta automaticamente.** O gargalo pode ser o banco de escrita e a contenção transacional. Ações: otimização e particionamento somente se justificado, replicas para leituras compatíveis, otimização de consultas, mais instâncias do processo quando a sessão permitir, controle de taxa e fila segura em operações não críticas. **Não** distribuir escritas de saldo entre múltiplas bases sem preservar as invariantes financeiras.

## Tradução para a diretoria

**Ganho esperado:** reduzir risco de erro de saldo e diminuir custo/tempo operacional de um produto inicial. **Custo:** autonomia de deploy limitada. **Condição de aprovação:** testes de integridade, segurança, auditoria e recuperação bem-sucedidos.

## Condições de revisão

Revisar quando escalas de equipe ou de domínio exigirem releases independentes; qualquer extração deverá preservar o núcleo de transações e o modelo de segurança.

**Referência:** [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html).
