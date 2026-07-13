# Sentinel

Sentinel é uma plataforma para gerenciamento de dispositivos IoT, colecionamento de dados, execução de runs e geração de alertas. O repositório contém serviços backend, frontend e infraestrutura para rodar a stack localmente via Docker Compose.

**Resumo rápido**
- Backend: Node.js + TypeScript + Prisma (Postgres)
- Banco: PostgreSQL (imagem oficial)
- Broker MQTT: Eclipse Mosquitto
- UI: pasta `app` (frontend)

## Arquitetura

- `api/services` — código do backend (TypeScript + Prisma). Contém repositórios de acesso a dados e inicializador (`src/main.ts`).
- `app` — frontend (conteúdo para build/execução em container).
- `infra/docker/docker-compose.yml` — orquestração dos serviços: `db`, `adminer`, `mqtt`, `backend`, `frontend`.
- `infra/database/initdb` — scripts SQL para inicialização do banco.
- `api/services/prisma/schema.prisma` — modelo de dados Prisma (tabelas, enums e relações).

## Tecnologias

- Node.js, TypeScript
- Prisma ORM + @prisma/client
- PostgreSQL
- Docker / Docker Compose
- Mosquitto (MQTT broker)

## Pré-requisitos

- Docker e Docker Compose instalados (ou Docker Desktop).
- Git para clonar o repositório.
- (Opcional) Node.js e pnpm/npm/yarn para desenvolvimento local do backend e frontend.

## Variáveis de ambiente (usadas em `infra/docker/.env` ou no ambiente)

- `POSTGRES_DB` — nome do banco (ex: `sentinel`)
- `POSTGRES_USER` — usuário Postgres
- `POSTGRES_PASSWORD` — senha do usuário Postgres
- `POSTGRES_PORT` — porta exposta para PostgreSQL (ex: `5432`)
- `ADMINER_PORT` — porta para Adminer (ex: `8080`)
- `MQTT_PORT` — porta MQTT (1883)
- `MQTT_WS_PORT` — porta MQTT WebSocket (9001)
- `BACKEND_PORT` — porta do backend (ex: `3000`)
- `FRONTEND_PORT` — porta do frontend (ex: `3001`)

Coloque essas variáveis em um arquivo `.env` na pasta `infra/docker` ou exporte no seu ambiente antes de executar o `docker-compose`.

## Executando com Docker Compose (recomendado)

1. Copie o exemplo de `.env` (se houver) ou crie um arquivo `.env` com as variáveis acima na pasta `infra/docker`.
2. No diretório `infra/docker`, execute:

```bash
docker compose up --build
```

Isso criará os containers: Postgres (`db`), Adminer (`adminer`), Mosquitto (`mqtt`), backend (`backend`) e frontend (`frontend`).

Aguarde o banco ficar saudável (o compose depende do healthcheck) e então acesse:

- Adminer: http://localhost:${ADMINER_PORT}
- Backend: http://localhost:${BACKEND_PORT}
- Frontend: http://localhost:${FRONTEND_PORT}

## Desenvolvimento local do Backend

1. Entre na pasta do serviço:

```bash
cd api/services
```

2. Instale dependências e gere o cliente Prisma:

```bash
npm install
npx prisma generate
```

3. Crie a variável `DATABASE_URL` apontando para sua instância Postgres (pode usar a criada pelo Docker Compose). Exemplo:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/sentinel"
```

4. Inicie em modo de desenvolvimento (hot reload):

```bash
npm run dev
```

Para buildar e rodar em produção:

```bash
npm run build
npm start
```

## Banco de Dados e Prisma

- O schema Prisma está em `api/services/prisma/schema.prisma`.
- Scripts de inicialização do banco (criação de extensões/tabelas) estão em `infra/database/initdb` e são montados no container do Postgres via `docker-compose` para execução automática na primeira inicialização.
- Para trabalhar com migrações e cliente Prisma:

```bash
cd api/services
npx prisma generate    # gera o client
npx prisma migrate dev # criar/rodar migrações (se usado)
```

## Estrutura do repositório (visão rápida)

- `api/services` — backend (TypeScript, Prisma)
- `app` — frontend (UI)
- `infra/docker` — `docker-compose.yml` e arquivos de infraestrutura
- `infra/database/initdb` — scripts SQL de inicialização
- `.githooks` — hooks Git (configurar via `git config core.hooksPath .githooks`)
- `semgrep` — regras de segurança/estilo para CI

## Regras de commit e githooks

Este repositório inclui hooks e um padrão sugerido para mensagens de commit (ex.: `feat(scope): descrição curta`). Para ativar os hooks locais:

```bash
git config core.hooksPath .githooks
```

Use os tipos comuns: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`.

## Segurança e análise estática

Regras do Semgrep estão incluídas em `semgrep/rules` e workflows em `semgrep/ci.yml` para detectar desde problemas de configuração até vazamento de segredos.

## Contribuição

- Abra issues para bugs ou novas features.
- Faça branches por feature: `feature/nome-da-feature`.
- Siga o padrão de commits e inclua descrições claras.

## Licença

Adicione aqui a licença do projeto (ex: MIT) antes de publicar publicamente.

## Contato

Se quiser, inclua um email ou link para contato/maintainer.

---

Arquivo atualizado automaticamente por assistente. Para ajustes finos (ex.: exemplo de `.env`, instruções de build do `app`), diga o que quer incluir e eu complemento.
