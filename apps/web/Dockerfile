# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY apps/web ./apps/web
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages

RUN --mount=type=cache,target=/root/.yarn/cache \
    yarn install --immutable

ARG VITE_API_URL=http://localhost:3333
ENV VITE_API_URL=${VITE_API_URL}

RUN yarn workspace web build

FROM nginx:1.27-alpine

COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
