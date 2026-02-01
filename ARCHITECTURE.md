# Architecture Decision Log

This document records key architectural decisions and their rationale.

---

## ADR-001: Electron for Desktop, Web as Secondary

**Date:** 2026-01-31  
**Status:** Accepted

**Context:**
Primary use case is a 24/7 ambient dashboard on dedicated hardware (TV, iPad, spare monitor). Need native desktop performance for smooth 3D rendering.

**Decision:**
Build with Electron as primary target, but structure code so the React + Node.js stack can also run as a web app.

**Consequences:**
- Single codebase for desktop and web
- Can leverage native APIs (file system, system tray) in desktop mode
- Web deployment requires separate Node.js server process
- Electron bundle size is larger, but acceptable for desktop use case

---

## ADR-002: Three.js Over Unity/Unreal for 3D

**Date:** 2026-01-31  
**Status:** Accepted

**Context:**
Need 3D globe visualization. Options: Unity WebGL, Unreal Pixel Streaming, Three.js, Babylon.js.

**Decision:**
Use Three.js with react-three-fiber.

**Rationale:**
- Web-native, no plugin required
- Massive ecosystem and examples
- Lighter weight than game engines
- Better integration with React workflow
- Easier to customize shaders for data viz

**Consequences:**
- More control over rendering pipeline
- Requires WebGL expertise for advanced effects
- May need manual optimization vs. game engine's built-in tools

---

## ADR-003: Plugin Architecture for Data Sources

**Date:** 2026-01-31  
**Status:** Accepted

**Context:**
Multiple data sources (weather, earthquakes, news, etc.) with different update frequencies, API limits, and data shapes.

**Decision:**
Abstract data sources as plugins implementing a common `DataCollector` interface.

**Benefits:**
- Easy to add new sources without touching core code
- Testable in isolation
- Graceful degradation if one source fails
- Can enable/disable sources per user preference

**Tradeoffs:**
- Slightly more boilerplate per source
- Need to design a flexible `Event` type that works for all sources

---

## ADR-004: SQLite for Local Storage

**Date:** 2026-01-31  
**Status:** Accepted

**Context:**
Need to cache historical event data and user settings. Desktop app should work offline after initial data load.

**Decision:**
Use SQLite embedded database.

**Rationale:**
- Zero configuration (no separate DB server)
- Works offline
- Good performance for read-heavy workloads
- Portable single-file database
- Mature Node.js bindings (`better-sqlite3`)

**Consequences:**
- Not suitable for high-concurrency web deployment (use PostgreSQL/MySQL for that)
- Need migration strategy if schema changes
- File-based, so backup is just copying the file

---

## ADR-005: Zustand Over Redux for State Management

**Date:** 2026-01-31  
**Status:** Accepted

**Context:**
Need global state for event data, UI state, settings. React Context alone is insufficient for performance (too many re-renders).

**Decision:**
Use Zustand for state management.

**Rationale:**
- Simpler API than Redux (less boilerplate)
- Great TypeScript support
- Built-in devtools integration
- Good performance with selectors
- Works well with real-time WebSocket updates

**Consequences:**
- Less opinionated than Redux (team needs to establish patterns)
- Smaller community vs. Redux, but still actively maintained
- May need Redux later if state complexity explodes (can migrate)

---

## ADR-006: Socket.io for Real-Time Updates

**Date:** 2026-01-31  
**Status:** Accepted

**Context:**
Frontend needs real-time event updates from backend without polling.

**Decision:**
Use Socket.io for WebSocket communication.

**Rationale:**
- Automatic reconnection handling
- Fallback to long-polling if WebSocket unavailable
- Room/namespace support for future multi-user scenarios
- Good integration with Express
- Widely used, well-documented

**Consequences:**
- Adds dependency to backend
- Need to handle connection state in frontend
- More complex than simple HTTP polling, but better UX

---

## ADR-007: TypeScript in Strict Mode

**Date:** 2026-01-31  
**Status:** Accepted

**Context:**
Codebase will grow, multiple data shapes, async operations. JavaScript alone leads to runtime errors.

**Decision:**
Use TypeScript with `strict: true` from day one.

**Rationale:**
- Catch type errors at compile time
- Better IDE autocomplete and refactoring
- Self-documenting interfaces (types as documentation)
- Forces explicit handling of `null`/`undefined`

**Consequences:**
- Steeper initial learning curve
- More upfront type definition work
- Build step required (but we need one anyway for React)
- Long-term maintenance cost is lower

---

## ADR-008: Vitest Over Jest for Testing

**Date:** 2026-01-31  
**Status:** Accepted

**Context:**
Need fast, modern test framework. Using Vite for build tool.

**Decision:**
Use Vitest for unit and integration tests.

**Rationale:**
- Native ESM support (matches our build setup)
- Same config as Vite (less tooling overhead)
- Faster than Jest (reuses Vite's transform pipeline)
- Jest-compatible API (easy migration path)
- Built-in coverage reporting

**Consequences:**
- Smaller ecosystem vs. Jest
- Less mature, but actively developed
- Good enough for our needs

---

_New decisions will be added as the project evolves._
