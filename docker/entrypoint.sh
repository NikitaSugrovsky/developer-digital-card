#!/bin/sh
set -e

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Running seed (idempotent)..."
npx prisma db seed

echo "Starting NestJS..."
exec node dist/src/main