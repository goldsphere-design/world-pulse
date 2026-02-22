# PRD — World Pulse

## Summary
World Pulse is an ambient, always-on real-time information radiator that visualizes global events on an interactive 3D globe. It streams multiple live data sources, normalizes them into typed events, and renders them in an "Oblivion" aesthetic for display on dedicated hardware (TV, tablet, monitor) or as a web/Electron app.

## Goals
- Deliver a reliable Phase-1 MVP: backend event aggregation + frontend globe renderer with live updates.
- Provide a stable plugin architecture for collectors so new data sources can be added safely.
- Ship desktop-first (Electron) with a web deployment option.
- Achieve reproducible builds and CI validation (`npm run validate`).

## Background & Scope Thus Far
- Phase 0 foundation completed (see CLAUDE.md). The repo already contains a working split between `src/renderer` and `src/server` with an event plugin pattern and frontend components.
- Implemented pieces observed in the codebase:
  - Plugin-based collectors under `src/server/collectors/` (e.g., `earthquakes.ts`, `iss.ts`, `aurora.ts`, `asteroids.ts`, `volcanoes.ts`, `planets.ts`).
  - A `BaseCollector` pattern (`src/server/collectors/base.ts`) for consistent fetch/validate lifecycle.
  - Express + Socket.io server (`src/server/app.ts`, `src/server/index.ts`) emitting `events:initial` and `events:new`.
  - Frontend React + Three.js renderer in `src/renderer` with components for `Globe`, `SkyMap`, `Ticker`, and UI pieces (`Header`, `EventPanel`).
  - State management using a Zustand store (`src/renderer/store/useAppStore.ts`).
  - Tests exist for many components and collectors (`*.test.tsx`, `*.test.ts`).
  - Tooling and conventions: `vite`, `electron`, `vitest`, linters, and `npm run validate` script described in CLAUDE.md.

## Key Specifications (from CLAUDE.md) to Keep in Context
- Plugin-based collectors extend `BaseCollector`, run at configurable polling intervals, and auto-disable after repeated errors.
- Backend emits: `events:initial` (on connect) and `events:new` (for live updates). Backend keeps up to 100 cached events.
- Shared types in `src/shared/types.ts` should be the single source of truth for event shapes and EventType enums.
- Frontend uses React + react-three-fiber for the globe and Zustand for state management.
- Strict TypeScript and test coverage expectations (Vitest, >70% coverage overall; 80% for new features where applicable).

## Non-Goals (for this PRD / Phase 1)
- Large data persistence layers, complex user accounts, or heavy analytics pipelines (deferred to later phases).
- Full mobile-optimized UI—desktop/Electron first.

## Success Metrics
- Reliable live feed: backend uptime and collectors running with automated restarts/health checks.
- UI receives and renders new events within 1–3 seconds of collection under normal network conditions.
- `npm run validate` passes on CI for any PR touching core features.
- New collector can be added with a test and registration in under 2 hours by a familiar engineer.

## Acceptance Criteria (Phase 1)
- `GET /api/events` returns cached events and shape matches `src/shared/types.ts`.
- Socket.io emits initial and new events; frontend displays them and preserves ordering.
- `BaseCollector` auto-disables after N consecutive errors (configurable) and logs reasons.
- Tests added for each collector type and core server path; CI enforces them.
- Electron packaging script builds a runnable desktop app (`npm run build:electron`).

## Milestones & Timeline (suggested)
1. PRD + Issue setup (this document) — create issue and link to project board. (0.5 day)
2. Stabilize server & collectors: health endpoints, auto-disable, config for intervals. (2–3 days)
3. Frontend integration: ensure `events:initial` and incremental updates render correctly, add fallback when no data. (2 days)
4. Tests & CI: increase coverage, add integration test for socket flow. (2 days)
5. Electron packaging + smoke test. (1–2 days)
6. UX polish, performance tuning, and observability (logs/metrics). (2–3 days)

## Implementation Tasks (break into issues)
- Collector health and auto-disable improvements (`src/server/collectors/*`).
- Add server health endpoints and metrics (`src/server/app.ts`).
- Ensure `src/shared/types.ts` fully covers current event shapes; add missing types.
- Add integration test for Socket.io + Express (server ↔ renderer) flow (`src/server/api.test.ts` extension).
- Add a minimal end-to-end test harness for Electron boot and socket connectivity (Playwright or similar).
- Document collector onboarding steps in `docs/` (new docs/prd or docs/specs collector guide).

## Risks & Mitigations
- Risk: Collectors hitting third-party rate limits or unstable APIs.
  - Mitigation: Add retry/backoff, per-collector rate config, and circuit-breaker via `BaseCollector`.
- Risk: Performance drop when many events present.
  - Mitigation: Limit event cache to 100 items (as spec), batch socket emits, and throttle renderer updates.
- Risk: Diverging event types across collectors.
  - Mitigation: Enforce typed interfaces in `src/shared/types.ts`, add schema validation in collectors.

## Dependencies
- Environment vars & API keys documented in CLAUDE.md and `.env.example` (ensure `.env.local` created locally).
- CI runners with Node + Electron build capability for packaging.

## Next Steps (what I will do if you want me to continue)
- Create a GitHub issue from this PRD and add it to the project board (Issue-first workflow).
- Break the Milestones into issues and implement the highest-priority task (collector health + server endpoints).
- Open small PR(s) with targeted changes and tests.

## References
- CLAUDE.md (project overview & architecture)
- Repo layout (source code under `src/server` and `src/renderer`)


*PRD created by agent — use this as the basis for issue creation and milestone planning.*
