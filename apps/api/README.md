# API Fastify

API REST com Fastify, PostgreSQL e Drizzle ORM.

## Stack

- Node.js + TypeScript
- Fastify
- PostgreSQL (Docker)
- Drizzle ORM + Drizzle Kit
- OpenAPI via Swagger (`/docs`)
- AWS Lambda handler (`src/lambda.ts`)

## Subir banco PostgreSQL

Na raiz do monorepo:

```bash
docker compose up -d
```

## Configurar variaveis de ambiente

Em `apps/api`:

```bash
cp .env.example .env
```

## Aplicar schema no banco

Em `apps/api`:

```bash
bun run db:push
```

## Rodar localmente

Na raiz do monorepo:

```bash
bun install
bun run dev --filter=api
```

Servidor local: `http://localhost:3333`  
Swagger: `http://localhost:3333/docs`

## Scripts de banco (apps/api)

- `bun run db:generate` - gera migracoes SQL
- `bun run db:push` - aplica schema no banco
- `bun run db:studio` - abre Drizzle Studio

## Arquitetura

O modulo `watch` esta organizado em:

- `watch.routes.ts` - camada HTTP (Fastify)
- `watch.use-cases.ts` - regras de negocio (use_case)
- `watch.repository.ts` - acesso a dados com Drizzle
- `src/shared/db/*` - conexao e schema do banco
