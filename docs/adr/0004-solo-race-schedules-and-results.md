# 0004 — One active clock and seeded CPU schedules

Date: 20 October 2026. Status: implemented; available-device race checks accepted by ASUS/Samsung user report (TT-404).

## Context

Phase 4 needs a complete race without making opponents dependent on frame rate, adaptive rubber-banding or visual effects. The learner must continue after CPUs finish. Later friends multiplayer needs a different, server-authoritative timing policy; local races must not pretend to provide that trust.

## Decision

Compose the existing clock-injected TypingEngine with four frozen seeded per-character schedules. Calculate CPU progress by binary search at the player's active elapsed time; a single paused clock freezes all lanes. Use the shared exact-time standings helper, preserving extra row metadata through a generic type. Render positions from snapshots and retain semantic text standings even without graphics.

When the player finishes, freeze live state and derive later CPU outcomes from fixed schedules, explicitly labeling simulations (including future deadline DNFs). Do not animate fake observed finishes or force the player to wait. An earlier CPU finish never stops the learner. Retry creates a fresh core with the same configuration; New seed deliberately changes opponents. Guard renderer startup/cleanup and provide an explicit text fallback after error, timeout or context loss.

## Consequences

App 0.1.0-alpha.3 and rules version 3; preference schema/content stay 1. Quick Race tier bands are separate from campaign category definitions. Results are unsaved and untrusted local outcomes; no currency, unlocks or multiplayer validation is implemented. Prototype art remains until Phase 5's modern vehicle/cinematic design. Phase 2/3 PRs were merged into main in order before branching feat/solo-race; Phase 4 is a normal PR against main.

See [QUICK_RACE.md](../QUICK_RACE.md) for exact generator parameters, equations, cutoff semantics, recreation and limits, and [TESTING.md](../TESTING.md) for observed checks.
