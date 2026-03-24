#!/usr/bin/env dockerfile

# Usa imagem oficial do Bun (Node + Bun preinstalado)
FROM oven/bun:1 AS base

# Define diretorio de trabalho dentro do container
WORKDIR /app

# Copia arquivos de manifest para aproveitar cache de dependencias
COPY package.json tsconfig.json drizzle.config.ts ./

# Instala dependencias do backend
RUN bun install

# Copia o restante do codigo da API
COPY . .

# Garante permissao de execucao no entrypoint
RUN chmod +x ./docker-entrypoint.sh

# Porta exposta pela API Fastify
EXPOSE 3333

# Comando de inicializacao (dev/prod controlado por NODE_ENV no entrypoint)
CMD ["./docker-entrypoint.sh"]
