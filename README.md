# Watch Brasil

Sistema full-stack para catalogo de videos com autenticacao JWT e comentarios.

> [!IMPORTANT]
> **Documentacao e processo:** a API possui README dedicado em [`apps/api/README.md`](apps/api/README.md) (variaveis de ambiente, seed, endpoints, Docker, testes e OpenAPI/Swagger). Este arquivo cobre o monorepo como um todo.

> [!WARNING]
> **Gerenciador de pacotes:** use **Bun** na raiz e nos apps (`bun install`, `bun run`, `bun test`). O monorepo declara `packageManager: bun@...`; evite npm/yarn/pnpm para nao divergir lockfile e scripts.

> [!NOTE]
> **Testes do frontend:** nao ha suite de testes automatizados no `apps/web`. O foco de testes esta na API (`bun:test` em `apps/api`, executavel com `bun run test` na raiz via Turbo).

> [!NOTE]
> **Testes da API (Jest vs Bun):** os testes sao escritos com o runner **Bun** (`bun:test`), nao com Jest. Comportamento equivalente a testes unitarios com mocks do cliente de banco; ver `apps/api/src/**/*.test.ts`.

## Sobre o projeto

O **Watch Brasil** e um monorepo com frontend e backend separados:

- **Frontend** (`apps/web`): Vue 3 + TypeScript + Vite
- **Backend** (`apps/api`): Fastify + TypeScript + PostgreSQL

O backend expoe API REST com:

- autenticacao (`/auth/register`, `/auth/login`, `/auth/refresh`)
- perfil de usuario (`/users/me`)
- catalogo de videos (`/videos`)
- comentarios por video (`/videos/:id/comments`)

## Tecnologias principais

- **Monorepo**: Turborepo
- **Package manager**: Bun
- **Frontend**: Vue 3 + Vite + TypeScript
- **Backend**: Fastify + TypeScript + JWT + Zod
- **Banco de dados**: PostgreSQL
- **Containerizacao**: Docker + Docker Compose

> [!TIP]
> **OpenAPI:** com a API no ar, a documentacao interativa fica em `http://localhost:3333/docs` (Swagger UI).

## Pre-requisitos

Antes de comecar, instale:

- **Node.js** (v18+)
- **Bun** (v1.3+)
- **Docker** e **Docker Compose**

## Instalacao

### 1. Clone o repositorio

```bash
git clone <url-do-repositorio>
cd watch-brasil
```

### 2. Instale as dependencias

```bash
bun install
```

## Configuracao de variaveis de ambiente

### Backend (`apps/api`)

Crie o arquivo `apps/api/.env`:

```env
DATABASE_URL=postgresql://watch_user:watch_pass@localhost:5432/watch_brasil
JWT_SECRET=watch-brasil-dev-secret
PORT=3333
HOST=0.0.0.0
```

### Frontend (`apps/web`)

Crie o arquivo `apps/web/.env`:

```env
VITE_API_URL=http://localhost:3333
```

> [!IMPORTANT]
> Sem `VITE_API_URL` apontando para a API em execucao, o frontend nao consegira fazer requisicoes corretamente (CORS e URL base).

> [!WARNING]
> **Seed de desenvolvimento (`apps/api`):** o comando `bun run db:seed` dentro de `apps/api` **apaga todos os videos e comentarios** e recria dados de demonstracao. Use apenas em ambiente de desenvolvimento.

## Como executar

### Opcao 1: Desenvolvimento local

#### 1) Suba o banco

```bash
docker compose up -d
```

#### 2) Rode frontend e backend

Na raiz do projeto:

```bash
bun run dev
```

Servicos locais:

- **Frontend**: http://localhost:5173 (porta do Vite)
- **Backend API**: http://localhost:3333
- **Swagger**: http://localhost:3333/docs

### Opcao 2: API no Docker + frontend local (hot reload)

Sobe a API (e dependencias do Compose) e o Vite local:

```bash
bun run dev:fe
```

Use `VITE_API_URL=http://localhost:3333` em `apps/web/.env`.

> [!NOTE]
> O `dev:fe` sobe a API via Docker Compose (inclui dependencias como Postgres e, conforme o compose, OpenTelemetry/Jaeger). A primeira subida pode levar mais tempo.

### Opcao 3: So a API (local)

Com Postgres ja no ar:

```bash
bun run dev:api
```

### Opcao 4: So o frontend (local)

```bash
bun run dev:web
```

## Estrutura do projeto

```text
watch-brasil/
├── apps/
│   ├── web/                    # Frontend (Vue)
│   └── api/                    # Backend (Fastify)
├── docker-compose.yml          # PostgreSQL
├── package.json                # Scripts do monorepo
└── turbo.json                  # Configuracao Turborepo
```

## Scripts disponiveis

### Raiz (monorepo)

| Comando | Descricao |
| ------- | --------- |
| `bun run dev` | Frontend + API em dev (Turbo) |
| `bun run dev:api` | Apenas API (`apps/api`) |
| `bun run dev:web` | Apenas frontend (`apps/web`) |
| `bun run dev:fe` | `docker compose` sobe a API + frontend local (Vite) |
| `bun run build` | Build de todos os pacotes (Turbo) |
| `bun run build:api` | Build apenas da API |
| `bun run build:web` | Build apenas do frontend |
| `bun run build:project` | `bun install` (bootstrap do monorepo) |
| `bun run test` / `bun run test:api` | Testes da API (`bun test` em `apps/api`) |
| `bun run check-types` | Tipos em todos os pacotes |
| `bun run lint` | Lint (Turbo) |

### Docker (raiz)

| Comando | Descricao |
| ------- | --------- |
| `bun run docker:build` | `docker compose build` |
| `bun run docker:up` | Sobe stack em background |
| `bun run docker:up:build` | Build + sobe stack |
| `bun run docker:down` | Para e remove containers |
| `bun run docker:test` | Roda testes da API no container (perfil `test`) |

### Backend (`apps/api`)

| Comando | Descricao |
| ------- | --------- |
| `bun run dev` | API em dev |
| `bun run build` | Compila para `dist/` |
| `bun run start` | API compilada (Node) |
| `bun run check-types` | Typecheck |
| `bun run test` | Testes Bun |
| `bun run db:push` / `db:seed` / etc. | Drizzle |

## Testes

### API

```bash
bun run test
```

Ou, em `apps/api`:

```bash
cd apps/api && bun run test
```

> [!NOTE]
> Os testes usam **Bun** (`bun:test`) e mock do modulo `db/client`; nao e obrigatorio ter PostgreSQL rodando para a suite passar.

### Frontend

> [!NOTE]
> **Testes do frontend nao foram implementados.** Prioridade atual: funcionalidade da UI e cobertura de testes no backend.

## Docker

O `docker-compose.yml` na raiz inclui PostgreSQL, API, frontend (Nginx), OpenTelemetry e Jaeger (veja o arquivo para portas).

Comandos uteis:

```bash
bun run docker:up
docker compose logs -f api
bun run docker:down
```

## Documentacao da API

> [!TIP]
> A API expoe **OpenAPI** via Fastify Swagger; use o Swagger UI para experimentar rotas e esquemas.

Swagger UI:

- http://localhost:3333/docs

Todos os endpoints protegidos exigem:

```http
Authorization: Bearer <token>
```

## Convencoes de commit

O projeto segue Conventional Commits:

- `feat`: nova funcionalidade
- `fix`: correcao de bug
- `refactor`: refatoracao
- `docs`: documentacao
- `chore`: manutencao

## Troubleshooting

### API nao conecta no banco

- confirme se o postgres esta ativo: `docker compose ps`
- valide `DATABASE_URL` em `apps/api/.env`

### Swagger nao abre

- confirme se o backend subiu em `3333`
- acesse `http://localhost:3333/docs`
