# 0002 — Separate UI, preview, pure rules and persistence

Date: 20 October 2026. Status: accepted for Phase 2.

## Context

Responsive solo gameplay must evolve into account-backed saves and friends multiplayer. A monolithic scene owning input, storage and rewards would make that transition expensive. Repeated screen visits must not accumulate canvases/listeners.

## Decision

Define framework-free ID and race/auth/sync/settings contracts now. Implement only browser-local preferences and the decorative track in this phase. Do not simulate working cloud/accounts or advance campaign progress. Use generation-guarded scene creation, a per-screen Anime.js scope and abortable keyboard/viewport listeners. Dispose all screen-owned resources on navigation/HMR.

Keep the input check's free editing separate from future correction-required race input. Use real textarea input/composition and VisualViewport events for inspection; no data is uploaded. Preserve input on resize. Runtime-check stored preference values and degrade safely when storage fails.

## Consequences

There is intentionally no progress database or playable race yet. Interfaces will evolve with the actual core/schema, with documentation/tests updated in the same change. Physical phone keyboard behavior is a separate evidence gate. This design avoids relying on a realtime backend before the solo engine exists while leaving explicit integration boundaries for later cloud/multiplayer work.
