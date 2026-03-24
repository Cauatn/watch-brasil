#!/usr/bin/env sh
set -eu

echo "[entrypoint] installing dependencies"
bun install

echo "[entrypoint] checking DATABASE_URL"
if [ -z "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] DATABASE_URL is not set"
  exit 1
fi

echo "[entrypoint] applying database schema"
bun run db:push

echo "[entrypoint] running type checks"
bun run check-types

if [ "${NODE_ENV:-development}" = "production" ]; then
  echo "[entrypoint] building api for production"
  bun run build

  echo "[entrypoint] starting api in production mode"
  exec bun run start
fi

echo "[entrypoint] starting api in development mode"
exec bun run dev
