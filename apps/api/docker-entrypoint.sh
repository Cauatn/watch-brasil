#!/usr/bin/env sh
set -eu

ROOT=/app
cd "$ROOT"

echo "[entrypoint] installing dependencies"
yarn install

echo "[entrypoint] checking DATABASE_URL"
if [ -z "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] DATABASE_URL is not set"
  exit 1
fi

echo "[entrypoint] applying database schema"
yarn workspace api db:push

echo "[entrypoint] running type checks"
yarn workspace api check-types

if [ "${NODE_ENV:-development}" = "production" ]; then
  echo "[entrypoint] building api for production"
  yarn workspace api build

  echo "[entrypoint] starting api in production mode"
  exec yarn workspace api start
fi

echo "[entrypoint] starting api in development mode"
exec yarn workspace api dev
