# Watch Brasil

Sistema full-stack para catalogo de videos com autenticacao JWT e comentarios.

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

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3333
- **Swagger**: http://localhost:3333/docs

### Opcao 2: Somente backend

```bash
cd apps/api
bun run dev
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

### Raiz

| Comando               | Descricao                         |
| --------------------- | --------------------------------- |
| `bun run dev`         | Roda apps em modo desenvolvimento |
| `bun run build`       | Build de todos os workspaces      |
| `bun run check-types` | Validacao de tipos no monorepo    |
| `bun run lint`        | Lint no monorepo                  |

### Backend (`apps/api`)

| Comando               | Descricao                        |
| --------------------- | -------------------------------- |
| `bun run dev`         | Roda API em modo desenvolvimento |
| `bun run build`       | Compila API                      |
| `bun run start`       | Inicia API compilada             |
| `bun run check-types` | Valida tipos da API              |
| `bun run test`        | Executa testes da API            |

## Docker

O `docker-compose.yml` da raiz sobe o banco PostgreSQL usado pela API:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
```

Comandos uteis:

```bash
# Subir banco
docker compose up -d

# Ver logs
docker compose logs -f

# Parar banco
docker compose down
```

## Documentacao da API

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
