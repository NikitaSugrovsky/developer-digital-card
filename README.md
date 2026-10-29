# Developer Digital Card — Backend-визитка разработчика

Публичный read-only GraphQL API с информацией о разработчике: профиль, навыки, опыт работы и проекты.

## 1. Назначение

Проект демонстрирует backend-приложение на TypeScript/NestJS с реальной БД, Prisma, GraphQL, миграциями, seed и Docker. Все данные хранятся в PostgreSQL.

## 2. Стек

- TypeScript 5.4, Node.js 20 LTS
- NestJS 10, `@nestjs/graphql` 12, `@nestjs/apollo` 12
- Apollo Server 4
- Prisma ORM 5.22, `@prisma/client` 5.22
- PostgreSQL 16
- Docker, Docker Compose
- Jest + Supertest

## 3. Архитектура

```
src/
├── app.module.ts       # сборка модулей + GraphQLModule
├── main.ts             # bootstrap
├── prisma/             # PrismaService, PrismaModule (@Global)
├── profile/            # профиль + @ResolveField для вложенных
├── skills/             # навыки
├── experience/         # опыт
├── projects/           # проекты
└── common/errors.ts    # NotFoundException-хелперы
```

- **Resolver** — GraphQL-слой.
- **Service** — доступ к данным через Prisma.
- **PrismaService** — инкапсулирует подключение.
- **GraphQL** — code-first, `autoSchemaFile`.

## 4. Модель данных

4 модели: `Profile`, `Skill`, `Experience`, `Project`.
`Profile 1 ──── * Skill/Experience/Project` с `onDelete: Cascade`.
Уникальность: `Skill(profileId, name)`, `Experience(profileId, company, position, startDate)`, `Project(profileId, name)`, `Profile.email`.
`technologies` / `achievements` — `String[]` (Postgres array): плоские списки без собственных полей.

## 5. GraphQL и N+1

Вложенные `skills/experience/projects` загружаются в `ProfileService.getProfile` **одним** `include`:

```ts
prisma.profile.findFirst({
  include: { skills: true, experience: true, projects: true },
});
```

Это **4 SQL-запроса фиксированно** — не N+1. `@ResolveField` в `ProfileResolver` **не** обращаются к БД, а возвращают уже загруженные данные из `parent`. DataLoader не нужен: в схеме `profile` — единственный корневой объект.

## 6. Миграции и seed

```bash
npx prisma migrate dev --name <name>   # dev
npx prisma migrate deploy              # prod
npx prisma db seed                     # идемпотентный seed через upsert
```

## 7. Запуск с нуля

### Docker (рекомендуется)

```bash
docker compose up --build
```

- PostgreSQL 16 + NestJS, healthcheck через `pg_isready`;
- entrypoint: `prisma migrate deploy && prisma db seed && node dist/src/main.js`;
- GraphQL: **http://localhost:3000/graphql**;
- данные в volume `pgdata`.

Остановить: `Ctrl+C`. Удалить данные: `docker compose down -v`.

### Локально

1. PostgreSQL 16, БД `developer_card`.
2. `cp .env.example .env` и заполнить `DATABASE_URL`.
3. `npm install && npx prisma generate`.
4. `npx prisma migrate deploy && npx prisma db seed`.
5. `npm run build && npm run start:prod` (или `npm run start:dev`).

> `npm run build` использует `tsc -p tsconfig.build.json` — это надёжный аналог `nest build` на Windows.

## 8. Примеры GraphQL

Apollo Sandbox: **http://localhost:3000/graphql** (POST) или `Invoke-RestMethod`.

### Профиль с вложенными данными

```graphql
query {
  profile {
    name
    description
    githubUrl
    linkedinUrl
    skills { name category level }
    experience { company position startDate endDate description achievements }
    projects { name description projectUrl repositoryUrl technologies }
  }
}
```

### Отдельные коллекции

```graphql
query { skills { id name category level } }
query { experience { company position startDate endDate } }
query { projects { id name technologies } }
```

### Ошибка

```graphql
query { profileById(id: "nonexistent") { name } }
```

→ `{"errors":[{"message":"Profile not found","extensions":{"code":"NOT_FOUND"}}],"data":null}`

### Проверка через PowerShell

```powershell
$body = '{"query":"{ profile { name skills { name } } }"}'
Invoke-RestMethod -Uri "http://localhost:3000/graphql" -Method POST -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 10
```

## 9. Тесты

```bash
npm test          # unit
npm run test:e2e  # e2e (требует живую БД с миграциями и seed)
```

## 10. Переменные окружения

| Переменная | Описание | Пример |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:...@localhost:5432/developer_card?schema=public` |
| `PORT` | HTTP-порт | `3000` |
| `NODE_ENV` | `development` / `production` | `development` |
| `POSTGRES_USER` | для compose.yaml | `postgres` |
| `POSTGRES_PASSWORD` | для compose.yaml | `CHANGE_ME` |
| `POSTGRES_DB` | для compose.yaml | `developer_card` |

`.env` **не коммитится**.

## 11. Известные ограничения

- Apollo Server 4 объявлен EOL (2026-01-26). Апгрейд на 5 запланирован.
- В `seed.ts` для email зарезервирован RFC-домен `example.com` — заменить.
- Мутации не реализованы (read-only визитка).
- CSRF prevention отключён в dev для удобства Sandbox.
- `ValidationPipe` не используется: нет input-типов. При добавлении mutations — вернуть вместе с `class-validator`.

## 12. Последовательность коммитов

1. `chore: initial NestJS setup`
2. `feat: add Prisma schema and initial migration`
3. `feat: implement profile/skills/experience/projects modules`
4. `feat: add GraphQL API and nested resolvers`
5. `feat: add idempotent seed`
6. `chore: add Docker and compose`
7. `test: add unit and e2e tests`
8. `docs: add README and env example`