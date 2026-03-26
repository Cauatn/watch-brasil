#!/usr/bin/env dockerfile

FROM node:22-alpine AS base

WORKDIR /workspace

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages ./packages

RUN --mount=type=cache,target=/root/.yarn/cache \
    yarn install --immutable

COPY . .

RUN yarn run build

CMD ["yarn", "run", "check-types"]
