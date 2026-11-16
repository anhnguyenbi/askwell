# The app

An AI support chat widget for any website. The product name lives in `APP_NAME` (`packages/shared`).

## Requirements

- Node 24 LTS (see `.nvmrc`)
- pnpm 10.34.9 (pinned in `package.json` → `packageManager`; `corepack enable` picks it up)

## Setup

1. `pnpm install`
2. `cp .env.example apps/web/.env.local` (Next.js reads env files from `apps/web`), then fill in the values you need. Never commit `.env*` files other than `.env.example`.
3. `pnpm dev`, then open http://localhost:3000

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | Run the app locally |
| `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` | Checks. All must pass before a PR. |
| `pnpm db:types` | Regenerate `packages/db/types.ts` from the dev project (added in Phase 1) |

## Layout

| Path | What |
|---|---|
| `apps/web` | Next.js app: landing, dashboard, `/embed`, `/api` |
| `apps/widget` | Vanilla TS loader, bundled to `dist/widget.js` (under 5 kB) |
| `packages/shared` | Shared contract: types, API shapes, plan limits |
| `packages/db` | Database types and test helpers |

## Docs

- [docs/project.md](docs/project.md): what we build
- [docs/plan.md](docs/plan.md): the phases, in build order
