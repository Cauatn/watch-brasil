# Watch Brasil API

Backend da plataforma de vídeos e comentários (Fastify, TypeScript, PostgreSQL, Drizzle).

---

> **Aviso — gerenciador de pacotes**  
> Este projeto usa **Bun** como gerenciador e executor de scripts: `bun install`, `bun run <script>`, `bun test`. Evite misturar com npm, yarn ou pnpm neste pacote para não divergir lockfile e comportamento.

---

> **Aviso — banco com dados simulados**  
> O comando `bun run db:seed` **remove todos os vídeos e comentários** existentes no banco e **reinsere** usuários de demonstração, vídeos de exemplo e comentários fictícios (veja `src/db/seed.ts`).  
> Use só em **desenvolvimento**. Sempre que você rodar o seed, o catálogo volta ao conjunto simulado — não trate esses dados como produção.

---

## Passo a passo (começar a API)

### 1) Variáveis de ambiente

Na pasta `apps/api`, crie o `.env` (pode copiar o exemplo):

```bash
cd apps/api
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
|----------|---------------|-----------|
| `DATABASE_URL` | Sim | URL do PostgreSQL (ex.: `postgresql://watch_user:watch_pass@localhost:5432/watch_brasil`) |
| `JWT_SECRET` | Recomendada | Segredo para assinar JWT (em dev o código tem fallback, mas defina em produção) |
| `PORT` | Não | Porta HTTP (padrão `3333`) |
| `HOST` | Não | Host de bind (padrão `0.0.0.0`) |
| `OTEL_ENABLED` | Não | `true`/`false` — tracing OpenTelemetry |
| `OTEL_SERVICE_NAME` | Não | Nome do serviço no tracing |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Não | Endpoint OTLP (ex.: `http://localhost:4318`) |
| `NODE_ENV` | Não | `development` ou `production` (afeta Docker entrypoint) |

Exemplo mínimo local:

```env
DATABASE_URL=postgresql://watch_user:watch_pass@localhost:5432/watch_brasil
JWT_SECRET=watch-brasil-dev-secret
PORT=3333
HOST=0.0.0.0
```

### 2) Dependências (Bun)

Na **raiz do monorepo**:

```bash
bun install
```

### 3) Banco PostgreSQL

Na **raiz do monorepo**:

```bash
docker compose up -d
```

### 4) Aplicar schema (Drizzle)

```bash
cd apps/api
bun run db:push
```

### 5) (Opcional) Popular dados simulados

> Lembrete: isso **apaga vídeos e comentários** e recria o cenário de demo.

```bash
bun run db:seed
```

### 6) Subir a API

```bash
bun run dev
```

A API fica em `http://localhost:3333` (ou na porta definida em `PORT`).

### 7) Testes

Na raiz do monorepo ou em `apps/api`:

```bash
bun test
```

---

## Endpoints principais

Base: `http://localhost:<PORT>` (ex.: `3333`).

| Método | Caminho | Auth | Descrição |
|--------|---------|------|-----------|
| GET | `/health` | Não | Saúde do serviço |
| GET | `/docs` | Não | Swagger UI (documentação interativa) |
| POST | `/auth/register` | Não | Cadastro |
| POST | `/auth/login` | Não | Login (retorna `accessToken` e `refreshToken`) |
| POST | `/auth/refresh` | Não | Renovar access token |
| GET | `/users/me` | Bearer | Perfil do usuário autenticado |
| PUT | `/users/me` | Bearer | Atualizar nome/senha |
| DELETE | `/users/me` | Bearer | Remover conta |
| GET | `/videos` | Bearer | Listar vídeos (query: paginação, filtros) |
| POST | `/videos` | Bearer + **admin** | Criar vídeo |
| GET | `/videos/:id` | Bearer | Detalhe do vídeo |
| PUT | `/videos/:id` | Bearer + **admin** | Atualizar vídeo |
| DELETE | `/videos/:id` | Bearer + **admin** | Remover vídeo |
| GET | `/videos/:id/comments` | Bearer | Listar comentários |
| POST | `/videos/:id/comments` | Bearer | Criar comentário |
| DELETE | `/videos/:id/comments/:commentId` | Bearer | Remover comentário (autor) |

Rotas protegidas: header `Authorization: Bearer <accessToken>`.

---

## Endereços úteis (local)

- API: `http://localhost:3333`
- Swagger: `http://localhost:3333/docs`
- Jaeger UI (tracing, se stack estiver no ar): `http://localhost:16686`

---

## Sobre o projeto

A API oferece:

- Autenticação JWT
- Perfil do usuário autenticado
- Catálogo de vídeos
- Comentários por vídeo
- OpenAPI via Swagger

## Stack

- TypeScript
- **Bun** (scripts e testes)
- Fastify
- Zod + fastify-type-provider-zod
- PostgreSQL
- Drizzle ORM + Drizzle Kit
- JWT (`@fastify/jwt`) + `bcryptjs`

## Pré-requisitos

- Bun 1.3+
- Docker + Docker Compose (para PostgreSQL local)

## Observabilidade (OpenTelemetry + Jaeger)

```bash
docker compose up -d
```

Variáveis típicas: `OTEL_ENABLED=true`, `OTEL_SERVICE_NAME=watch-brasil-api`, `OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318`.

## Scripts (`apps/api`)

| Comando | Descrição |
|---------|-----------|
| `bun run dev` | API em desenvolvimento |
| `bun run build` | Compila para `dist/` |
| `bun run start` | Sobe `dist/server.js` (Node) |
| `bun run check-types` | Verificação TypeScript |
| `bun run test` | Testes (Bun) |
| `bun run db:generate` | Gera migrações Drizzle |
| `bun run db:push` | Aplica schema no banco |
| `bun run db:studio` | Drizzle Studio |
| `bun run db:seed` | **Reseta vídeos/comentários** e insere dados de demo |

## Fluxo de autenticação

1. `POST /auth/register` ou `POST /auth/login`
2. Use `accessToken` em `Authorization: Bearer ...`
3. `POST /auth/refresh` com `refreshToken` para renovar o access token

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
│   ├── db/
│   ├── app.ts
│   ├── server.ts
│   └── lambda.ts
├── .env.example
├── drizzle.config.ts
└── docker-entrypoint.sh
```

## Docker entrypoint

`docker-entrypoint.sh` instala dependências com Bun, exige `DATABASE_URL`, roda `db:push`, `check-types` e sobe a API (`dev` ou `build` + `start` em produção).

```bash
cd apps/api
chmod +x docker-entrypoint.sh
./docker-entrypoint.sh
```

## CI/CD (resumo)

1. Checkout e `bun install`
2. `bun run db:push` (ou migrações)
3. `bun run check-types` e `bun test`
4. Deploy / restart do processo
