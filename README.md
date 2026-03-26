# Watch Brasil

Sistema full-stack para catalogo de videos com autenticacao JWT, comentarios, tarefas e relatorios admin.

## Subir a stack (comando rapido)

Na **raiz** do repositorio (apos `git clone`) — **nao** rode o Compose de dentro de `apps/api`; o `docker-compose.yml` e os contextos de build (`web` usa a raiz) assumem esse diretorio:

```bash
cd watch-brasil
bun install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
docker compose up -d --build
```

Na **primeira** build, a etapa `RUN bun install` da imagem `web` pode ficar varios minutos em `Resolving dependencies` sem parecer progresso; e normal (rede + monorepo). Builds seguintes ficam mais rapidas com cache do Docker.

Isso sobe Postgres, API, web (Nginx) e dependencias do `docker-compose.yml`. Ajuste `apps/web/.env` se a API nao estiver em `http://localhost:3333`. Com o Compose, o front costuma ficar em **http://localhost:8080** (porta `WEB_PORT`). Para desenvolvimento so com Vite na maquina, veja [Como executar](#como-executar).

> [!WARNING]
> **Gerenciador de pacotes:** use **Bun** na raiz e nos apps (`bun install`, `bun run`, `bun test`). O monorepo declara `packageManager: bun@...`; evite npm/yarn/pnpm para nao divergir lockfile e scripts.

## Acesso rapido (desenvolvimento)

Depois de subir o Postgres, aplicar o schema (`bun run db:push` em `apps/api`) e rodar o seed (`bun run db:seed` em `apps/api`), use:

| Papel | E-mail | Senha | O que enxerga no app |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@example.com` | `admin1234` | **Painel** (resumo e relatorios), **cadastro de filmes** no catalogo, e o mesmo que o usuario: inicio, titulos, player, comentarios e **lista pessoal de filmes para assistir**. |
| **Usuario** | `user@example.com` | `user12345` | Inicio, catalogo, player, comentarios e **lista pessoal de filmes para assistir**. Sem painel admin e sem tela de adicionar filme. |

A **lista** e onde ficam suas tarefas de ver filmes: ao marcar *assistir filme*, o item fica ligado a um titulo do catalogo e voce abre o streaming a partir dali. Tarefas *gerais* sao lembretes sem filme associado.

> [!TIP]
> **Este e o README principal do monorepo (raiz).** Com `bun run dev` ou o fluxo local descrito abaixo, use no navegador: **frontend** http://localhost:5173 · **API** http://localhost:3333 · **Swagger (OpenAPI, todas as rotas)** http://localhost:3333/docs. Repeticao e notas de Docker ficam na secao [URLs local (referencia rapida)](#urls-local-referencia-rapida) ao final.

## Checklist de entrega (enunciado)

Referencia rapida do que o projeto cobre frente ao objetivo (tarefas, CRUD, relatorios, stack pedida) e observacoes curtas.

### Objetivo: gerenciamento de tarefas

- [x] **Contas** — registro/login (`/auth/*`), JWT, perfil (`/users/me`).
- [x] **CRUD de tarefas** — `GET/POST/PATCH/DELETE /tasks`; na UI: pagina da lista + **sheet “Ver tarefas”** no header do catalogo.
- [x] **Categorizar** — `general` ou `watch_movie` (ligada a um video do catalogo).
- [x] **Acompanhar progresso** — estados `pending`, `in_progress`, `done`; painel admin com agregados (`/admin/reports/summary`).
- [x] **Colaboracao em comentarios** — comentarios por filme (`GET`/`POST /videos/:id/comments`), visiveis a todos os usuarios autenticados no mesmo titulo do catalogo.

### Caso de uso (streaming)

- [x] Catalogo de videos, reproducao/embed, **metas “ver filme”** amarradas ao catalogo e botoes “na minha lista” no catalogo.

### Requisitos tecnicos

- [x] **Frontend Vue** — Vue 3 + Vite; **Tailwind**; **shadcn-vue** (`apps/web/src/components/ui`); telas modulares em `features/*`.
- [x] **Backend Node REST** — **Fastify** (nomenclatura do enunciado: alternativa ao Express); varios CRUDs (tarefas, videos, comentarios, usuarios).
- [x] **Postgres relacional** — Drizzle ORM; `bun run db:push` / migracoes em `apps/api/drizzle`.
- [x] **Documentacao** — este README, [`apps/api/README.md`](apps/api/README.md), **OpenAPI/Swagger** em `http://localhost:3333/docs`.
- [x] **Docker** — `docker-compose.yml` na raiz (Postgres, API, web conforme perfil).
- [x] **JWT e controle de acesso** — token + papel `admin` | `user` (rotas admin protegidas).
- [x] **OpenTelemetry** — OTLP opcional; **Jaeger** no Compose (variaveis `OTEL_*` na API).

### Diferencas em relacao ao texto do enunciado

- [x] **Testes unitarios** — na API com **`bun:test`** e mocks do banco, **nao com Jest** (mesmo tipo de teste, runner diferente).
- [x] **AWS Lambda** — ponto de entrada em [`apps/api/src/lambda.ts`](apps/api/src/lambda.ts) (`@fastify/aws-lambda`); **nao** ha pipeline/IaC pronta — detalhes em `apps/api/README.md` (secao Lambda).

> [!IMPORTANT]
> **Documentacao e processo:** a API possui README dedicado em [`apps/api/README.md`](apps/api/README.md) (variaveis de ambiente, seed, exemplos de payload, Docker, testes e OpenAPI/Swagger). Este arquivo cobre o monorepo como um todo.

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
- tarefas pessoais (`/tasks`) e relatorio admin (`GET /admin/reports/summary`)

## Tecnologias principais

- **Monorepo**: Turborepo
- **Package manager**: Bun
- **Frontend**: Vue 3 + Vite + TypeScript
- **Backend**: Fastify + TypeScript + JWT + Zod
- **Banco de dados**: PostgreSQL
- **Containerizacao**: Docker + Docker Compose

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

## Convencoes de commit

O projeto segue Conventional Commits:

- `feat`: nova funcionalidade
- `fix`: correcao de bug
- `refactor`: refatoracao
- `docs`: documentacao
- `chore`: manutencao

## URLs local (referencia rapida)

Desenvolvimento comum (ex.: `bun run dev` na raiz ou API + web separados):

- **Frontend (Vite):** http://localhost:5173
- **API:** http://localhost:3333
- **Swagger (OpenAPI, documentacao e “try it out”):** http://localhost:3333/docs

Listagem de rotas, esquemas e autenticacao: use o **Swagger** ou o detalhe em [`apps/api/README.md`](apps/api/README.md). No **Docker Compose**, as portas do web podem diferir — veja `docker-compose.yml`.

Rotas protegidas no Swagger costumam exigir header:

```http
Authorization: Bearer <token>
```

## Troubleshooting

### API nao conecta no banco

- confirme se o postgres esta ativo: `docker compose ps`
- valide `DATABASE_URL` em `apps/api/.env`

### Swagger nao abre

- confirme se o backend subiu em `3333`
- acesse `http://localhost:3333/docs`
