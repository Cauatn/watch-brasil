# API Fastify

API REST com Fastify para gerenciamento de tarefas.

## Stack

- Node.js + TypeScript
- Fastify
- OpenAPI via Swagger (`/docs`)
- AWS Lambda handler (`src/lambda.ts`)
- Jest para testes unitarios

## Rodar localmente

```bash
bun install
bun run dev --filter=api
```

Servidor local: `http://localhost:3333`  
Swagger: `http://localhost:3333/docs`

## Endpoints

- `GET /api/health`
- `GET /api/hello`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Exemplo create task

```bash
curl -X POST http://localhost:3333/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudar arquitetura serverless"}'
```

## Deploy em AWS Lambda

O handler ja esta pronto em `src/lambda.ts` usando `@fastify/aws-lambda`.

Exemplo de roteamento com API Gateway:

- `ANY /{proxy+}` -> `handler`

## Proximos passos recomendados

- Persistencia em PostgreSQL (Prisma/Drizzle)
- Autenticacao JWT
- OpenTelemetry + Jaeger/Datadog
- Dockerfile para ambiente de desenvolvimento
