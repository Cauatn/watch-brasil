# Web Frontend

Frontend em Vue 3 + Vite, com arquitetura por features e componentes no estilo **shadcn-vue** (reka-ui, Tailwind).

> [!WARNING]
> **Gerenciador de pacotes:** na raiz do monorepo use **Bun** (`bun install`, `bun run dev`, etc.). Evite misturar com outros gerenciadores no mesmo workspace.

> [!NOTE]
> **Testes automatizados:** não há suite de testes (Vitest/Vue Test Utils) configurada neste app. O foco atual está na funcionalidade da interface e nos testes da API.

## Executar

Na **raiz** do monorepo (recomendado):

```bash
bun install
bun run dev
```

Somente o frontend:

```bash
bun run dev:web
```

Ou, dentro de `apps/web`:

```bash
cd apps/web
bun run dev
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
