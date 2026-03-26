# Web Frontend

Frontend em Vue 3 + Vite, com arquitetura por features e componentes no estilo **shadcn-vue** (reka-ui, Tailwind).

> [!WARNING]
> **Gerenciador de pacotes:** na raiz do monorepo use **Yarn 4** (`yarn install`, `yarn dev`, etc.). Evite misturar com outros gerenciadores no mesmo workspace.

## Executar

Na **raiz** do monorepo (recomendado):

```bash
yarn install
yarn dev
```

Somente o frontend:

```bash
yarn dev:web
```

Ou, dentro de `apps/web`:

```bash
cd apps/web
yarn dev
```

## Integração com a API

> [!IMPORTANT]
> Crie `apps/web/.env` (copie de `.env.example`). Sem **`VITE_API_URL`** apontando para a API em execução, as requisições falham.

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3333
```

Ajuste a URL se a API estiver em outra porta ou host (Docker, tunnel, etc.).

> [!TIP]
> Documentação OpenAPI da API: `http://localhost:3333/docs` (com o backend no ar).
