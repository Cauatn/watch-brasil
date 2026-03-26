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
- **Gerenciamento de pacotes**: **Bun** (workspace do monorepo)

> [!WARNING]
> **Use Bun neste projeto.** O `packageManager` do monorepo é Bun (`bun install`, `bun run`, `bun test`). Evite npm/yarn/pnpm no `apps/api` para não gerar lockfiles ou scripts divergentes.

> [!WARNING]
> **Dados simulados (`db:seed`).** O script `bun run db:seed` **apaga todos os vídeos e comentários** do banco e recria usuários, vídeos e comentários de demonstração (`src/db/seed.ts`). Use apenas em desenvolvimento. Cada execução redefine o catálogo para o cenário simulado.

> [!NOTE]
> **Testes:** os testes da API usam `bun:test` com mock do cliente Drizzle (`mock.module`); não é necessário PostgreSQL rodando para `bun test`.

## Pré-requisitos

Antes de começar:

- **Bun** (recomendado: mesma linha do monorepo, ex.: `1.3.x`) — [Instalação](https://bun.sh/docs/installation)
- **Docker** e **Docker Compose** (PostgreSQL e, se quiser, API + web + tracing via Compose na raiz)

## Configuração de variáveis de ambiente

### Backend (`apps/api`)

Crie o arquivo `.env` na pasta `apps/api`:

```bash
cd apps/api
cp .env.example .env
```

Variáveis:

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | URL do PostgreSQL |
| `JWT_SECRET` | Recomendada | Segredo dos JWT (há fallback só para dev) |
| `PORT` | Não | Porta HTTP (padrão `3333`) |
| `HOST` | Não | Bind (padrão `0.0.0.0`) |
| `NODE_ENV` | Não | `development` \| `production` |
| `OTEL_ENABLED` | Não | `true` / `false` |
| `OTEL_SERVICE_NAME` | Não | Nome no tracing |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Não | Ex.: `http://localhost:4318` |

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

### 2. Instale as dependências (Bun)

Na **raiz do monorepo**:

```bash
bun install
```

## Como executar

### Opção 1: Docker Compose (recomendado para stack completa)

Na **raiz do monorepo**:

```bash
docker compose up -d
```

Isso sobe, entre outros, PostgreSQL, API, frontend (Nginx), coletor OTLP e Jaeger (conforme `docker-compose.yml`).

URLs típicas:

| Serviço | URL |
|---------|-----|
| **API** | http://localhost:3333 |
| **Swagger** | http://localhost:3333/docs |
| **Web** | http://localhost:8080 (porta configurável via `WEB_PORT`) |
| **Jaeger UI** | http://localhost:16686 |

### Opção 2: Só a API em desenvolvimento (local)

```bash
# Terminal — raiz: subir só o Postgres (ou use Postgres já existente)
docker compose up -d postgres

cd apps/api
cp .env.example .env   # ajuste se necessário
bun run db:push
# opcional: dados de demo (apaga vídeos/comentários existentes)
bun run db:seed
bun run dev
```

### Opção 3: Monorepo em dev (Turbo — API + web)

Na raiz, com `.env` do web configurado:

```bash
bun run dev
```

(Executa os `dev` dos pacotes via Turbo; confira `turbo.json` / scripts de cada app.)

### Testes da API no Docker

Perfil `test` do Compose (roda `check-types` + `bun test` no container):

```bash
docker compose run --rm test
```

## Autenticação

Fluxo padrão:

1. `POST /auth/register` ou `POST /auth/login`
2. Enviar `Authorization: Bearer <accessToken>` nas rotas protegidas
3. `POST /auth/refresh` com `refreshToken` para renovar o access token

### Usuários de demonstração (após `bun run db:seed`)

| E-mail | Senha | Papel |
|--------|-------|--------|
| `admin@example.com` | `admin1234` | `admin` |
| `user@example.com` | `user12345` | `user` |

> [!NOTE]
> Esses usuários existem **após** rodar o seed; o seed também recria vídeos e comentários de exemplo.

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

| Comando | Descrição |
|---------|-----------|
| `bun run dev` | API em modo desenvolvimento (watch) |
| `bun run build` | Compila TypeScript para `dist/` |
| `bun run start` | Sobe `node dist/server.js` (produção compilada) |
| `bun run check-types` | Verificação TypeScript |
| `bun run test` | Testes com `bun:test` |
| `bun run db:generate` | Gera migrações Drizzle |
| `bun run db:push` | Aplica schema no banco |
| `bun run db:studio` | Drizzle Studio |
| `bun run db:seed` | **Reseta vídeos/comentários** e insere dados de demo |

### Monorepo (raiz)

| Comando | Descrição |
|---------|-----------|
| `bun run dev` | Dev via Turbo (apps configurados) |
| `bun run build` | Build via Turbo |
| `bun run check-types` | Tipos em todos os pacotes |

## Docker (visão geral)

Serviços definidos na raiz (`docker-compose.yml`) incluem:

- **postgres** — PostgreSQL na porta `5432`
- **api** — esta API na porta `3333`
- **web** — frontend (porta padrão mapeada em `8080`, ajustável com `WEB_PORT`)
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
bun test
```

Ou, a partir da raiz (se o Bun descobrir os arquivos `*.test.ts`):

```bash
bun test
```

Os testes mockam `src/db/client` e não alteram o PostgreSQL real.

## Documentação da API

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

#### Utilitários

- `GET /health` — Health check (público)

**Nota:** exceto `/health`, `/docs`, `/auth/register`, `/auth/login` e `/auth/refresh`, as rotas de negócio exigem JWT válido; criação/edição/remoção de vídeos exige papel **admin**.

## Configuração

### Banco de dados

- URL padrão de desenvolvimento alinhada ao Compose: `postgresql://watch_user:watch_pass@localhost:5432/watch_brasil`
- Schema aplicado com `bun run db:push` (ou fluxo do `docker-entrypoint.sh` no container)

### Seed e dados fictícios

O comando `bun run db:seed`:

- Garante/atualiza usuários de demo (`admin` e `user`)
- **Remove** todos os registros de **comentários** e **vídeos**
- Insere novamente vídeos e comentários de exemplo

Use somente em ambientes de desenvolvimento.

## Docker entrypoint (`apps/api`)

O script `docker-entrypoint.sh` (usado pela imagem da API) roda `bun install`, valida `DATABASE_URL`, executa `db:push`, `check-types` e inicia `bun run dev` ou build + `start` em produção.

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

### `bun test` falha na raiz do monorepo

- Rode a partir de `apps/api` ou garanta que não há artefatos antigos em `dist/` apontando para testes obsoletos

## Licença

Defina conforme a política do repositório (ex.: privado / desafio técnico).

## Links úteis

- [Documentação Fastify](https://fastify.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Bun](https://bun.sh/docs)
- [Docker Compose](https://docs.docker.com/compose/)

---

**Watch Brasil — API**
