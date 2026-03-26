# Watch Brasil API

API REST para catálogo de vídeos e comentários, desenvolvida com **Fastify**, **TypeScript**, **PostgreSQL** e **Drizzle ORM**.

## Sobre o projeto

O backend do **Watch Brasil** expõe autenticação JWT, perfil do usuário, CRUD de vídeos (com papéis `admin` / `user`) e comentários por vídeo. A documentação interativa fica disponível via **Swagger UI**.

### Tecnologias principais

- **Runtime / API**: Fastify 5 + TypeScript
- **Banco**: PostgreSQL 16 + Drizzle ORM + Drizzle Kit
- **Validação**: Zod + fastify-type-provider-zod
- **Autenticação**: JWT (`@fastify/jwt`) + `bcryptjs`
- **Observabilidade**: OpenTelemetry + OTLP (opcional, com Jaeger no Compose)
- **Containerização**: Docker + Docker Compose (na raiz do monorepo)
- **Gerenciamento de pacotes**: **Yarn 4** (workspace do monorepo; `yarn.lock` na raiz)

> [!WARNING]
> **Use Yarn na raiz do monorepo.** O campo `packageManager` fixa a versão (Corepack). Evite misturar com Bun/npm/pnpm no mesmo workspace.

> [!WARNING]
> **Dados simulados (`db:seed`).** O script `yarn workspace api db:seed` **apaga todos os vídeos e comentários** do banco e recria usuários, vídeos e comentários de demonstração (`src/db/seed.ts`). Use apenas em desenvolvimento. Cada execução redefine o catálogo para o cenário simulado.

> [!NOTE]
> **Testes:** **Vitest**, com `vi.mock` em `db/client`; não é necessário PostgreSQL para `yarn test` na API ou `yarn test` na raiz (Turbo).

> [!TIP]
> Na raiz do repositório: `yarn test` (Turbo filtra o pacote `api`).

## Pré-requisitos

Antes de começar:

- **Node.js** + **Corepack** (para usar o `yarn` declarado no `packageManager` da raiz) — [Yarn](https://yarnpkg.com/getting-started/install)
- **Docker** e **Docker Compose** (PostgreSQL e, se quiser, API + web + tracing via Compose na raiz)

## Configuração de variáveis de ambiente

### Backend (`apps/api`)

Crie o arquivo `.env` na pasta `apps/api`:

```bash
cd apps/api
cp .env.example .env
```

Variáveis:

| Variável                      | Obrigatória | Descrição                                 |
| ----------------------------- | ----------- | ----------------------------------------- |
| `DATABASE_URL`                | Sim         | URL do PostgreSQL                         |
| `JWT_SECRET`                  | Recomendada | Segredo dos JWT (há fallback só para dev) |
| `PORT`                        | Não         | Porta HTTP (padrão `3333`)                |
| `HOST`                        | Não         | Bind (padrão `0.0.0.0`)                   |
| `NODE_ENV`                    | Não         | `development` \| `production`             |
| `OTEL_ENABLED`                | Não         | `true` / `false`                          |
| `OTEL_SERVICE_NAME`           | Não         | Nome no tracing                           |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Não         | Ex.: `http://localhost:4318`              |

Exemplo mínimo local:

```env
DATABASE_URL=postgresql://watch_user:watch_pass@localhost:5432/watch_brasil
JWT_SECRET=watch-brasil-dev-secret
PORT=3333
HOST=0.0.0.0
```

### Frontend (monorepo — `apps/web`)

Para o app web falar com esta API no dev, crie `.env` em `apps/web`:

```env
VITE_API_URL=http://localhost:3333
```

> [!IMPORTANT]
> Sem `VITE_API_URL` apontando para a API, o frontend não conseguirá chamar o backend corretamente em desenvolvimento.

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd watch-brasil
```

### 2. Instale as dependências (Yarn)

Na **raiz do monorepo**:

```bash
yarn install
```

## Como executar

### Opção 1: Docker Compose (recomendado para stack completa)

Na **raiz do monorepo**:

```bash
yarn docker:up
```

Isso builda e sobe PostgreSQL, API (com seed automatico), frontend (Nginx), coletor OTLP e Jaeger.

URLs típicas:

| Serviço       | URL                                                       |
| ------------- | --------------------------------------------------------- |
| **API**       | http://localhost:3333                                     |
| **Swagger**   | http://localhost:3333/docs                                |
| **Web**       | http://localhost:5173 (porta configuravel via `WEB_PORT`) |
| **Jaeger UI** | http://localhost:16686                                    |

### Opção 2: Só a API em desenvolvimento (local)

```bash
# Terminal — raiz: subir só o Postgres (ou use Postgres já existente)
docker compose up -d postgres

cd apps/api
cp .env.example .env   # ajuste se necessário
yarn db:push
# opcional: dados de demo (apaga vídeos/comentários existentes)
yarn db:seed
yarn dev
```

### Opção 3: Monorepo em dev (Turbo — API + web)

Na raiz, com `.env` do web configurado:

```bash
yarn dev
```

(Executa os `dev` dos pacotes via Turbo; confira `turbo.json` / scripts de cada app.)

### Testes da API no Docker

Perfil `test` do Compose (roda `check-types` + Vitest no container):

```bash
docker compose run --rm test
```

## Autenticação

Fluxo padrão:

1. `POST /auth/register` ou `POST /auth/login`
2. Enviar `Authorization: Bearer <accessToken>` nas rotas protegidas
3. `POST /auth/refresh` com `refreshToken` para renovar o access token

### Usuários de demonstração (após `yarn workspace api db:seed`)

| E-mail              | Senha       | Papel   |
| ------------------- | ----------- | ------- |
| `admin@example.com` | `admin1234` | `admin` |
| `user@example.com`  | `user12345` | `user`  |

No **frontend**, o **admin** vê primeiro o item **Painel admin** (métricas), depois **Adicionar filme**, e compartilha com o usuário comum o catálogo, o player, comentários e a lista **Filmes para ver (lista)** — tarefas ligadas a filmes do catálogo (e lembretes gerais). O **user** não acessa painel nem cadastro de títulos.

> [!NOTE]
> Esses usuários existem **após** rodar o seed; o seed também recria vídeos e comentários de exemplo. Detalhes de papéis e fluxo também estão em [`README.md`](../README.md) na raiz do monorepo.

## Estrutura do projeto (API)

```text
watch-brasil/
├── apps/
│   ├── api/                         # Esta API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/            # Registro, login, refresh
│   │   │   │   ├── users/           # Perfil autenticado
│   │   │   │   ├── videos/          # Catálogo de vídeos
│   │   │   │   └── comments/        # Comentários por vídeo
│   │   │   ├── plugins/             # Ex.: auth guard
│   │   │   ├── db/                  # Cliente Drizzle, schema, seed
│   │   │   ├── test/                # Mocks e utilitários de teste
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── drizzle/
│   │   ├── .env.example
│   │   ├── docker-entrypoint.sh
│   │   └── Dockerfile
│   └── web/                         # Frontend (Vue)
├── docker-compose.yml
└── package.json
```

## Scripts disponíveis (`apps/api`)

| Comando            | Descrição                                            |
| ------------------ | ---------------------------------------------------- |
| `yarn dev`         | API em modo desenvolvimento (watch)                  |
| `yarn build`       | Compila TypeScript para `dist/`                      |
| `yarn start`       | Sobe `node dist/server.js` (produção compilada)      |
| `yarn check-types` | Verificação TypeScript                               |
| `yarn test`        | Vitest                                               |
| `yarn db:generate` | Gera migrações Drizzle                               |
| `yarn db:push`     | Aplica schema no banco                               |
| `yarn db:studio`   | Drizzle Studio                                       |
| `yarn db:seed`     | **Reseta vídeos/comentários** e insere dados de demo |

### Monorepo (raiz do repositório)

| Comando                                          | Descrição                                                   |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `yarn dev`                                       | API + web em dev (Turbo)                                    |
| `yarn dev:api`                                   | Só a API                                                    |
| `yarn dev:web`                                   | Só o frontend (Vite)                                        |
| `yarn dev:fe`                                    | Sobe a API com Docker Compose + frontend local (hot reload) |
| `yarn build`                                     | Build de todos os pacotes                                   |
| `yarn build:api` / `build:web`                   | Build filtrado                                              |
| `yarn build:project`                             | `yarn install`                                              |
| `yarn test`                                      | Testes da API (Turbo → `apps/api`)                          |
| `yarn docker:up` / `docker:down` / `docker:test` | Compose na raiz                                             |

## Docker (visão geral)

Serviços definidos na raiz (`docker-compose.yml`) incluem:

- **postgres** — PostgreSQL na porta `5432`
- **api** — esta API na porta `3333`
- **web** — frontend (porta padrao mapeada em `5173`, ajustavel com `WEB_PORT`)
- **otel-collector** / **jaeger** — tracing (opcional para dev)
- **test** — perfil para pipeline de testes da API

Comandos úteis:

```bash
docker compose logs -f api
docker compose down
docker compose build --no-cache api
```

## Testes

```bash
cd apps/api
yarn test
```

Na raiz do monorepo:

```bash
yarn test
```

> [!NOTE]
> Suite **unitária** com mocks; o banco real não é usado durante os testes.

## Documentação da API

> [!TIP]
> A especificação segue o padrão **OpenAPI**, servida pelo Fastify Swagger — use `/docs` para contratos, exemplos e “try it out”.

- **Swagger UI**: `http://localhost:3333/docs` (com a API no ar)

### Principais endpoints

#### Autenticação

- `POST /auth/register` — Cadastro (público)
- `POST /auth/login` — Login; retorna `accessToken` e `refreshToken`
- `POST /auth/refresh` — Novo access token (público, body com `refreshToken`)

#### Usuários

- `GET /users/me` — Perfil (Bearer)
- `PUT /users/me` — Atualizar nome/senha (Bearer)
- `DELETE /users/me` — Excluir conta (Bearer)

#### Vídeos

- `GET /videos` — Listar (Bearer)
- `POST /videos` — Criar (**admin** + Bearer)
- `GET /videos/:id` — Detalhe (Bearer)
- `PUT /videos/:id` — Atualizar (**admin** + Bearer)
- `DELETE /videos/:id` — Remover (**admin** + Bearer)

#### Comentários

- `GET /videos/:id/comments` — Listar (Bearer)
- `POST /videos/:id/comments` — Criar (Bearer)
- `DELETE /videos/:id/comments/:commentId` — Remover (Bearer; autor)

#### Tarefas

- `GET /tasks` — Listar (Bearer; do usuário)
- `POST /tasks` — Criar (Bearer)
- `GET /tasks/:id` — Detalhe (Bearer)
- `PATCH /tasks/:id` — Atualizar (Bearer)
- `DELETE /tasks/:id` — Remover (Bearer)

#### Admin

- `GET /admin/reports/summary` — Resumo agregado (Bearer; **admin**)

#### Utilitários

- `GET /health` — Health check (público)

**Nota:** exceto `/health`, `/docs`, `/auth/register`, `/auth/login` e `/auth/refresh`, as rotas de negócio exigem JWT válido; criação/edição/remoção de vídeos e o relatório admin exigem papel **admin** onde indicado acima.

## Configuração

### Banco de dados

- URL padrão de desenvolvimento alinhada ao Compose: `postgresql://watch_user:watch_pass@localhost:5432/watch_brasil`
- Schema aplicado com `yarn workspace api db:push` (ou fluxo do `docker-entrypoint.sh` no container)

### Seed e dados fictícios

O comando `yarn workspace api db:seed`:

- Garante/atualiza usuários de demo (`admin` e `user`)
- **Remove** todos os registros de **comentários** e **vídeos**
- Insere novamente vídeos e comentários de exemplo

Use somente em ambientes de desenvolvimento.

## AWS Lambda (serverless)

> [!NOTE]
> Existe um handler em `src/lambda.ts` usando `@fastify/aws-lambda`, adequado para deploy em **AWS Lambda**. O repositório não inclui pipeline CDK/SAM/Serverless pronta; configure empacotamento, variáveis e API Gateway conforme sua conta AWS.

## Docker entrypoint (`apps/api`)

O script `docker-entrypoint.sh` (contexto de build na raiz do monorepo) roda `yarn install` em `/app`, valida `DATABASE_URL`, executa `yarn workspace api db:push`, `yarn workspace api check-types` e inicia `yarn workspace api dev` ou build + `start` em produção.

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch (`git checkout -b feature/sua-feature`)
3. Commit com mensagens claras
4. Push e abra um Pull Request

## Convenções de commit

O projeto segue [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — nova funcionalidade
- `fix:` — correção de bug
- `refactor:` — refatoração
- `test:` — testes
- `docs:` — documentação
- `chore:` — manutenção

## Troubleshooting

### API não conecta ao banco

- Confirme `DATABASE_URL` e se o Postgres está no ar (`docker compose ps`)
- Teste: `docker compose logs postgres`

### Porta 3333 em uso

- Altere `PORT` no `.env` ou pare o processo que usa a porta

### Seed “some” com meus vídeos

- Esperado: o seed **apaga** vídeos e comentários antes de recriar o cenário de demo

### `yarn test` falha na raiz do monorepo

- Rode a partir de `apps/api` ou garanta que não há artefatos antigos em `dist/` apontando para testes obsoletos

## Licença

Defina conforme a política do repositório (ex.: privado / desafio técnico).

## Links úteis

- [Documentação Fastify](https://fastify.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker Compose](https://docs.docker.com/compose/)

---

**Watch Brasil — API**
