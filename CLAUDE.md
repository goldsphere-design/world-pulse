# CLAUDE.md — World Pulse AI Assistant Guide

## Project Overview

World Pulse is a real-time information radiator that visualizes global events on an interactive 3D globe. It is designed to run 24/7 as an ambient dashboard on dedicated hardware (TV, iPad, monitor). The app streams live data from multiple sources (earthquakes, ISS tracking, aurora, volcanoes, asteroids, planet visibility) and renders them on a Three.js globe with a dark "Oblivion" aesthetic.

**Current status:** v0.1.0 — Phase 0 (foundation) is complete; Phase 1 (backend + MVP globe) is in progress.

## Operating Principles

- **Correctness over cleverness**: Favor straightforward, maintainable approaches.
- **Smallest change that works**: Limit scope; avoid unnecessary refactoring.
- **Leverage existing patterns**: Follow project conventions before creating new abstractions.
- **Prove it works**: Validate through tests, builds, linting, or reproducible manual verification.
- **Be explicit about uncertainty**: Acknowledge unknowns and propose safe next steps.

## Quick Reference — Commands

| Task | Command |
|---|---|
| **Install dependencies** | `npm install` |
| **Start dev (server + frontend)** | `npm run dev` |
| **Start dev server only** | `npm run dev:server` |
| **Start dev frontend only** | `npm run dev:renderer` |
| **Start Electron dev** | `npm run dev:electron` |
| **Run all tests** | `npm test` |
| **Run tests in watch mode** | `npm run test:watch` |
| **Run tests with coverage** | `npm run test:coverage` |
| **Run E2E tests** | `npm run test:e2e` |
| **Lint** | `npm run lint` |
| **Lint with autofix** | `npm run lint:fix` |
| **Format code** | `npm run format` |
| **Type check** | `npm run typecheck` |
| **Full validation** | `npm run validate` |
| **Build all** | `npm run build` |
| **Build Electron** | `npm run build:electron` |

**`npm run validate`** runs `typecheck && test && lint && build:renderer` — use this as the full pre-push check.

## Architecture

```
world-pulse/
├── src/
│   ├── renderer/          # React frontend (Vite + Three.js)
│   │   ├── components/    # UI components (Dashboard, Globe, Header, EventPanel, Ticker)
│   │   ├── hooks/         # Custom hooks (useSocket for WebSocket)
│   │   ├── store/         # Zustand state management (useAppStore)
│   │   ├── App.tsx        # Root component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Oblivion design system
│   ├── server/            # Node.js backend (Express + Socket.io)
│   │   ├── collectors/    # Data source plugins (extend BaseCollector)
│   │   ├── app.ts         # Express app, routes, Socket.io setup
│   │   └── index.ts       # Server entry point
│   ├── shared/            # TypeScript types shared across layers
│   │   └── types.ts       # Event, EventType, GeoLocation, DataCollector, etc.
│   └── test/              # Test setup (testing-library config)
├── docs/                  # Extended documentation and prototypes
├── .github/               # CI/CD workflows (ci, security, release)
└── .husky/                # Git hooks (pre-commit, commit-msg)
```

### Deployment Modes

1. **Desktop (primary):** Electron wrapper with embedded backend
2. **Web (secondary):** Separate Node.js server + Vite frontend

### Key Architectural Patterns

- **Plugin-based data collection:** All data sources extend `BaseCollector` (in `src/server/collectors/base.ts`). Each collector implements `fetch()` and `validate()`, runs on a polling interval, and auto-disables after 5 consecutive errors.
- **Event streaming:** Backend emits events via Socket.io (`events:initial` on connect, `events:new` for live updates). Max 100 events cached.
- **State management:** Zustand store (`useAppStore`) — not Redux. Flat state with actions for connection status, events, featured/selected event, and initialization.
- **Path aliases:** `@/` → `src/`, `@shared/` → `src/shared/`, `@renderer/` → `src/renderer/`, `@server/` → `src/server/` (configured in tsconfig.json and vitest.config.ts).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Three.js, react-three-fiber, react-three-drei |
| Styling | Tailwind CSS 3 + custom "Oblivion" CSS (dark navy/cyan/amber) |
| State | Zustand |
| Backend | Express 4, Socket.io |
| Database | SQLite (via sqlite3 npm package) |
| Language | TypeScript 5 (strict mode) |
| Build | Vite 6 (frontend), tsc (backend/main) |
| Desktop | Electron |
| Testing | Vitest (unit/integration), Playwright (E2E) |
| Linting | ESLint + Prettier |

## Code Conventions

### TypeScript

- **Strict mode** is enabled (`strict: true`, `noUnusedLocals`, `noUnusedParameters`).
- ES modules (`"type": "module"` in package.json).
- Target: ES2022.
- Prefix unused parameters with `_` (e.g., `_req`).
- Avoid `any` — it produces a warning. Use `unknown` with type narrowing instead.
- All shared types live in `src/shared/types.ts`.

### Formatting (Prettier)

- Single quotes, semicolons, trailing commas (ES5), 2-space indentation, 100 char print width, LF line endings, always use parens for arrow functions.

### Linting (ESLint)

- `no-console` is a warning — use `console.warn()` and `console.error()` only; avoid `console.log()` in production code.
- React: no need for `import React` (react-jsx transform). PropTypes are disabled.
- Three.js JSX properties (`args`, `attach`, `position`, `rotation`, etc.) are allowed via `react/no-unknown-property` ignore list.

### Commit Messages

Conventional Commits enforced by commitlint + husky:
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
```

Pre-commit hook runs `lint-staged` which auto-fixes ESLint and Prettier on staged `.ts`/`.tsx` files.

## Testing

- **Framework:** Vitest with globals enabled.
- **Environment:** `jsdom` for `src/renderer/**` tests, `node` for `src/server/**` tests (auto-selected via `environmentMatchGlobs`).
- **Setup file:** `src/test/setup.ts` (imports testing-library utilities).
- **Test file pattern:** `src/**/*.test.{ts,tsx}` — co-locate tests next to source files.
- **Coverage:** V8 provider, target >70%.
- **Component testing:** `@testing-library/react` + `@testing-library/user-event`.
- **API testing:** `supertest` for Express endpoint tests.
- **E2E:** Playwright (`npm run test:e2e`).

### Running a Single Test File

```bash
npx vitest run src/server/collectors/earthquakes.test.ts
```

## CI Pipeline

The GitHub Actions CI (`.github/workflows/ci.yml`) runs on pushes/PRs to `main` and `develop`:

1. **Lint** — ESLint (zero warnings) + Prettier check
2. **TypeCheck** — `tsc --noEmit`
3. **Test** — Vitest with coverage, uploaded to Codecov
4. **Build** — Full production build (depends on all above passing)

Additional workflows: `security.yml` (npm audit, Snyk, CodeQL — weekly + on push), `release.yml` (Electron builds on version tags).

## Adding a New Data Collector

1. Create `src/server/collectors/<name>.ts`.
2. Extend `BaseCollector` from `src/server/collectors/base.ts`.
3. Implement `fetch()` (returns `Event[]`) and `validate()`.
4. Add the corresponding `EventType` to `src/shared/types.ts` if new.
5. Create a typed event interface extending `Event` in `src/shared/types.ts`.
6. Register the collector in `src/server/index.ts`.
7. Add a test file `src/server/collectors/<name>.test.ts`.

## Environment Variables

Copy `.env.example` to `.env.local` (gitignored) and fill in API keys:

| Variable | Required | Description |
|---|---|---|
| `OPENWEATHER_API_KEY` | Yes | OpenWeather API key |
| `NEWSAPI_KEY` | Yes | NewsAPI key |
| `SPOTIFY_CLIENT_ID` | No | Spotify integration |
| `SPOTIFY_CLIENT_SECRET` | No | Spotify integration |
| `NODE_ENV` | — | `development` / `production` |
| `PORT` | — | Backend port (default: 3000) |
| `DB_PATH` | — | SQLite path (default: `./data/world-pulse.db`) |
| `LOG_LEVEL` | — | Logging level (default: `info`) |

**Never commit secrets.** The `.env.local` file is gitignored.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check (`{ status, timestamp }`) |
| GET | `/api/status` | Server readiness, active collectors, event count |
| GET | `/api/events` | Retrieve cached events |

### WebSocket Events (Socket.io)

| Event | Direction | Payload |
|---|---|---|
| `events:initial` | Server → Client | `{ events: Event[], timestamp }` |
| `events:new` | Server → Client | `{ events: Event[], timestamp }` |

## Workflow Orchestration (for AI Agents)

### Planning

Use planning mode for complex tasks (3+ steps, multi-file changes, architectural decisions). Deploy focused sub-agents for repo exploration, pattern discovery, test triage, and dependency research.

### Incremental Delivery

Ship thin vertical slices. Validate each step before moving to the next.

### Verification Before Done

Never mark a task complete without test results, lint checks, type checks, or manual reproducible evidence. Run `npm run validate` for full verification.

### Autonomous Bug Fixing

Reproduce → Isolate → Fix → Add test coverage → Verify — without offloading work back to the user.

### Error Handling and Recovery

- **Stop-the-line rule:** Pause when tests fail or behavior regresses.
- **Triage checklist:** Reproduce → Localize → Reduce → Fix root cause → Guard with regression test → Verify end-to-end.
- **Safe fallbacks:** Prefer "safe default + warning" over partial behavior.
- **Rollback strategy:** Keep changes reversible using isolated commits.

### Definition of Done

A task is complete when:
- Behavior matches acceptance criteria
- `npm run validate` passes (typecheck + test + lint + build)
- Code follows the conventions documented above
- New code has test coverage
- Risky changes have a rollback strategy
