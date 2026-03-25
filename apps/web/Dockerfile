FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/web ./apps/web
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages

RUN bun install --frozen-lockfile

WORKDIR /app/apps/web

ARG VITE_API_URL=http://localhost:3333
ENV VITE_API_URL=${VITE_API_URL}

RUN bunx vite build

FROM nginx:1.27-alpine

COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
