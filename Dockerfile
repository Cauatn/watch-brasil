#!/usr/bin/env dockerfile

# Imagem base oficial com Bun
FROM oven/bun:1 AS base

# Diretório de trabalho do monorepo
WORKDIR /workspace

# Copia arquivos essenciais para instalar dependências
COPY package.json bun.lock turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

# Instala dependências de todos os workspaces
RUN bun install

# Copia o restante do repositório
COPY . .

# Build opcional do monorepo (ajuste conforme pipeline)
RUN bun run build

# Comando padrão focado em validação de tipos
CMD ["bun", "run", "check-types"]
