# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY apps/api/package.json apps/api/tsconfig.json apps/api/drizzle.config.ts ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages ./packages

RUN --mount=type=cache,target=/root/.yarn/cache \
    yarn install --immutable

COPY apps/api ./apps/api

RUN chmod +x ./apps/api/docker-entrypoint.sh

WORKDIR /app

EXPOSE 3333

CMD ["/app/apps/api/docker-entrypoint.sh"]
