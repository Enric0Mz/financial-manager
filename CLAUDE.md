# CLAUDE.md — Financial Manager

## Project Overview

Personal finance management app for tracking expenses, bank accounts, salaries, and monthly financial statements. Full-stack Next.js application with a PostgreSQL database.

## Tech Stack

- **Runtime**: Node.js 18.20.4 (see `.nvmrc`)
- **Framework**: Next.js 15.0.3 (pages router)
- **Database**: PostgreSQL 16.0 (Docker) + Prisma 6.0.1
- **Auth**: JWT (access token 15min, refresh token 24h) + bcryptjs
- **Frontend**: React 18, SWR, Tailwind CSS 4.1.7
- **Routing middleware**: `next-connect`

## Quick Commands

```bash
npm run dev          # Start DB + migrations + Next.js dev server
npm test             # Full integration test suite (starts DB, migrates, runs Jest, stops DB)
npm run test:watch   # Jest watch mode (DB must already be running)
npm run db:up        # Start PostgreSQL Docker container
npm run db:down      # Stop and remove PostgreSQL container
npm run db:migrate   # Run Prisma migrations
npm run lint:prettier:check   # Check formatting
npm run lint:prettier:fix     # Fix formatting
npm run lint:eslint:check     # Run ESLint
npm run commit       # Commitizen interactive commit
```

## Project Structure

```
src/
├── pages/api/v1/       # REST API route handlers (presentation layer)
├── models/             # Business logic & data access (service layer)
├── infra/              # Infrastructure: Prisma client, security utils, Docker compose
│   ├── database.js     # Prisma singleton
│   └── security/       # JWT and bcrypt utilities
├── middlewares/         # Auth token validation, CORS
├── helpers/             # Validators, HTTP success response classes, error handlers
├── errors/             # Custom HTTP error classes (404, 401, 409, 422, 500)
├── components/         # React components (auth/, dashboard/, layout/, ui/, schemas/)
├── pages/              # Next.js frontend pages + API routes
├── styles/             # Tailwind CSS globals
├── contexts/           # React contexts (planned)
├── hooks/              # React custom hooks (planned)
├── tests/integration/  # Integration tests organized by API route
```

## Architecture & Design Patterns

- **Layered architecture**: Route handlers (`pages/api/`) → Models (`models/`) → Prisma (`infra/database.js`)
- **Service/model pattern**: Each domain entity has a model file exporting an object with methods (`findById`, `create`, `update`, `delete`)
- **Custom error classes**: `NotFoundError`, `UnauthorizedError`, `ConflictError`, `UnprocessableEntityError`, etc. in `src/errors/http.js`
- **HTTP success response classes**: `httpSuccessCreated`, `httpSuccessUpdated`, etc. with `.toJson()` in `src/helpers/httpSuccess.js`
- **Middleware composition**: `next-connect` `createRouter()` chains middleware and handlers
- **JWT token versioning**: `tokenVersion` field on User model enables instant token invalidation on logout
- **Singleton DB client**: Prisma client with dev-mode global caching to prevent connection pool exhaustion

## API Conventions

- Base path: `/api/v1`
- Auth: Bearer token in `Authorization` header
- RESTful verbs: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE
- All endpoints return consistent JSON via success/error response classes
- Swagger docs available at `/docs` (JSDoc annotations + schemas in `components/schemas/`)

## Key API Routes

| Domain | Endpoints |
|--------|-----------|
| Auth | `POST /auth`, `POST /auth/refresh`, `DELETE /auth` |
| User | `POST /user`, `GET /user`, `PUT /user` |
| Bank | CRUD at `/bank` and `/bank/{id}` |
| Salary | `POST /salary`, `PUT /salary/{id}`, `GET /salary` |
| Bank Statement | `/bank-statement` (create, fetch by year/month, delete) |
| Expenses | `/expense/credit/{id}` and `/expense/debit/{id}` (CRUD) |
| Extra Income | `/extra-income/{bankStatementId}` (CRUD) |
| Calendar | `/calendar`, `/year/{n}`, `/month` |
| Health | `GET /health` |

## Database

- Schema defined in `prisma/schema.prisma`
- Key models: User, Salary, Bank, BankStatement, Expense, ExtraIncome, RefreshToken, Year, Month, YearMonth
- BankStatement holds monthly financial snapshots (balanceInitial, balanceTotal, balanceReal, debitBalance)
- Bank ↔ BankStatement is many-to-many via BankBankStatement junction table
- Cascading deletes on BankStatement → Expense, ExtraIncome

## Testing

- **Framework**: Jest 29.7.0, integration tests only
- **Location**: `src/tests/integration/api/v1/`
- **Infrastructure**: Orchestrator waits for services + clears DB; `setupDatabase.js` provides factory helpers
- Tests run against a real PostgreSQL instance (no mocks)

## Code Style & Conventions

- **Commits**: Conventional commits enforced via commitlint + Husky hooks
- **Formatting**: Prettier (checked in pre-commit hook via lint-staged)
- **Linting**: ESLint with Next.js + Jest plugins
- **File naming**: camelCase for source files, kebab-case for URL routes
- **Imports**: Absolute from `src/` root; `@infra/*` alias for `infra/` directory

## CI/CD

- **GitHub Actions**: Linting workflow (Prettier + ESLint + commitlint) and Test workflow, both on pull requests
- **Branch strategy**: `main` (releases), `develop` (active development)

## Environment

- Config via `.env.development` (DB credentials, JWT secrets, base URL)
- Docker Compose for PostgreSQL in `src/infra/compose.yaml`
- Production builds: `npm run vercel-build` (Prisma generate → migrate deploy → Next.js build)

## Frontend Status

UI is in early development. Current state:
- Health page with SWR data fetching and Tailwind styling
- Auth pages (login/register) scaffolded
- UI language: Portuguese (pt-BR)
- Design reference: Figma mockup with dark theme, colored bank cards, summary dashboard
