# Milestone Planning — Phase 1

Overview
- Stabilize server & collectors (Milestone 2)
- Frontend empty-state & fallback UI (Milestone 3)

Resource allocation (Phase 1)
- Engineer (backend): 1.0 FTE — implement health endpoints, collector hardening, tests
- Engineer (frontend): 0.6 FTE — empty state components, health badge
- UX Designer: 0.2 FTE — wireframes, prototypes
- QA/Tester: 0.2 FTE — integration tests and verification

Delivery targets
- Milestone 2 (Stabilize server & collectors): 2 weeks — include `/api/status` per-collector health, `/health` metrics, Socket.io integration tests
- Milestone 3 (Frontend empty-state & fallback UI): 1 week — wireframes, React components, integration with `/api/status`

Risks & mitigations
- Risk: collector API rate limits — Mitigate by exponential backoff and circuit breaker in collectors
- Risk: socket reconnection flapping — Mitigate by backoff + user-facing banner
