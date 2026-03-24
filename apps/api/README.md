# Watch Brasil API

Backend da plataforma de videos e comentarios, desenvolvido com Fastify, TypeScript, PostgreSQL e Drizzle.

## Sobre o projeto

Esta API fornece:

- autenticacao com JWT
- gerenciamento de usuario autenticado
- catalogo de videos
- comentarios por video
- documentacao OpenAPI via Swagger

## Stack

- Node.js + TypeScript
- Bun (package manager + scripts)
- Fastify
- Zod + fastify-type-provider-zod
- PostgreSQL (Docker)
- Drizzle ORM + Drizzle Kit
- JWT (`@fastify/jwt`) + `bcryptjs`

## Pre-requisitos

- Node.js 18+
- Bun 1.3+
- Docker + Docker Compose

## Instalacao

Na raiz do monorepo:

```bash
bun install
```

## Configuracao de ambiente

No backend (`apps/api`), crie o arquivo `.env`:

```bash
cp .env.example .env
```

Exemplo de variaveis:

```env
DATABASE_URL=postgresql://watch_user:watch_pass@localhost:5432/watch_brasil
JWT_SECRET=watch-brasil-dev-secret
PORT=3333
HOST=0.0.0.0
```

## Como executar

### 1) Subir banco PostgreSQL

Na raiz do monorepo:

```bash
docker compose up -d
```

### 2) Aplicar schema no banco

No backend:

```bash
cd apps/api
bun run db:push
```

### 3) Rodar API em desenvolvimento

No backend:

```bash
bun run dev
```

## Enderecos locais

- API: `http://localhost:3333`
- Swagger: `http://localhost:3333/docs`
- Jaeger UI (tracing): `http://localhost:16686`

## Observabilidade (OpenTelemetry + Jaeger)

Para tracing local, suba os servicos pela raiz do monorepo:

```bash
docker compose up -d
```

Configuracao usada na API:

- `OTEL_ENABLED=true`
- `OTEL_SERVICE_NAME=watch-brasil-api`
- `OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318`

## Scripts disponiveis (apps/api)

| Comando               | Descricao                             |
| --------------------- | ------------------------------------- |
| `bun run dev`         | Inicia API em modo desenvolvimento    |
| `bun run build`       | Compila TypeScript para `dist`        |
| `bun run start`       | Sobe API compilada (`dist/server.js`) |
| `bun run check-types` | Valida tipos TypeScript               |
| `bun run test`        | Executa testes                        |
| `bun run db:generate` | Gera migracoes Drizzle                |
| `bun run db:push`     | Aplica schema no banco                |
| `bun run db:studio`   | Abre Drizzle Studio                   |

## Fluxo de autenticacao

1. `POST /auth/register` cria conta
2. `POST /auth/login` retorna `accessToken` e `refreshToken`
3. rotas protegidas exigem `Authorization: Bearer <accessToken>`
4. `POST /auth/refresh` renova access token

## Estrutura do backend

```text
apps/api/
├── drizzle/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── videos/
│   │   └── comments/
│   ├── plugins/
│   ├── shared/
│   │   ├── db/
│   │   ├── errors/
│   │   ├── types/
│   │   └── utils/
│   ├── types/
│   ├── app.ts
│   ├── server.ts
│   └── lambda.ts
├── .env.example
├── drizzle.config.ts
└── docker-entrypoint.sh
```

## Docker entrypoint

Este projeto possui um arquivo `docker-entrypoint.sh` na raiz do backend para uso em pipelines e containers.

Objetivo:

- sincronizar dependencias
- aplicar schema/migracao
- validar tipos
- iniciar servidor

Execucao manual:

```bash
cd apps/api
chmod +x docker-entrypoint.sh
./docker-entrypoint.sh
```

Modo de execucao:

- `NODE_ENV=development` (padrao): roda `bun run dev`
- `NODE_ENV=production`: roda `bun run build` e depois `bun run start`

## Observacoes de CI/CD

Um fluxo comum no CI/CD para este backend:

1. sincronizar codigo
2. instalar dependencias
3. executar `db:push` ou migracoes
4. rodar `check-types` e testes
5. reiniciar container/processo da API

O `docker-entrypoint.sh` ja organiza este fluxo em um unico ponto de entrada.
