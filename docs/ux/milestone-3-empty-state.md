# Milestone 3 — Empty State & Fallback UI

Overview
- Provide clear UX for when no events are available or connection is lost.

Wireframes
- No-events state: centered illustration, short explanatory copy, CTA `Retry` and `Subscribe`.
- Collector health badge: small pill with color states (green: healthy, amber: degraded, red: disabled) and tooltip with details.
- Connection-loss modal/banner: persistent banner with reconnect attempts, `Retry` button, and diagnostic link.

Components
- `EmptyState` : illustration + copy + primary CTA + secondary link
- `CollectorHealthBadge` : accepts `{ status, name, reason? }` and renders pill + tooltip
- `ConnectionBanner` : shows reconnecting state, last-seen timestamp, and offline fallback actions

Acceptance Criteria
- Empty state displays when `events.length === 0` and no active fetch
- Collector badges reflect `/api/status` `collectors` payload
- Connection banner appears after WebSocket disconnect and offers retry

Next steps
- Prototype HTML in `docs/prototypes/empty-state.html`
- Create React components in `src/renderer/components/EmptyState` and `CollectorHealthBadge`
