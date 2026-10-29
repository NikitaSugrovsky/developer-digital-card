# ---------- Stage 1: builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN npx prisma generate
RUN npx tsc -p tsconfig.build.json

# ---------- Stage 2: runner ----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]