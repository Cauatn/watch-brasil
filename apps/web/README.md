# Web Frontend

Frontend em Vue 3 + Vite com arquitetura por features e componentes shadcn-vue.

## Executar

```bash
bun install
bun run dev --filter=api
bun run dev --filter=web
```

## Integracao com API

Copie `.env.example` para `.env` e ajuste:

```bash
VITE_API_URL=http://localhost:3333
```

Com isso, a tela principal consome `GET /api/hello` do backend Fastify.
