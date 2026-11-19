# DevPath · Jornada DevOps de Guilherme Reis

Aplicação web simples para acompanhar uma trilha de aprendizado em DevOps, baseada nos próximos passos apresentados no material de carreiras em TI. As etapas concluídas ficam salvas no navegador.

## Executar localmente

Requer Node.js 22 ou superior.

```sh
npm test
npm run build
```

Para servir os arquivos gerados em `dist/`, use qualquer servidor estático. Também é possível iniciar a versão Nginx em container:

```sh
docker compose up --build
```

Acesse http://localhost:8080.

## CI/CD

O workflow `.github/workflows/devpath-ci-cd.yml`, na raiz do repositório, executa os testes com Node.js, gera o build e valida a imagem Docker em cada push ou pull request que altera esta pasta. Na branch `main`, depois que os testes passam, o artefato aprovado é publicado automaticamente no GitHub Pages.

## Deploy

O primeiro deploy habilita o GitHub Pages automaticamente. O endereço publicado aparece no job `Deploy · GitHub Pages` e no ambiente `github-pages` da execução.
