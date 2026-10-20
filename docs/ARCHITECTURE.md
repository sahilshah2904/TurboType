# Phase 2 architecture

This describes implemented foundation code. Planned race and cloud behavior remains in the game design/online architecture documents.

## Ownership and flow

```text
index.html → main.ts → mountApp
  ├─ hash router → hub / keyboard check / settings
  ├─ Anime.js scope → HTML entrance animations
  ├─ LocalSettingsRepository → validated browser-local preferences
  └─ lazy Phaser import → isolated track-preview canvas
```

- `src/main.ts` mounts the app, handles startup failure and registers development HMR disposal.
- `src/ui/app.ts` builds semantic screens, owns interface motion and input-check diagnostics. Hash navigation restores focus to main. The skip link changes focus without changing routes.
- `src/ui/router.ts` accepts only implemented routes; unknown links recover to the hub. No fake room/campaign routes are exposed.
- `src/game/track-preview.ts` owns a disposable Phaser game, original SVG vehicle loading, wheel/body movement, particles, bloom, a camera entrance and a label tween. It is a decorative three-car scene, not a four-CPU race provider. Fixed 1200×420 design coordinates fit the responsive container. ResizeObserver refreshes scale without remounting.
- `src/storage/settings.ts` injects its Storage boundary for tests. It validates version/values, preserves unreadable existing data, returns defaults on failure and reports failed writes. It stores no progress/rewards/history yet.
- `src/core/contracts.ts` defines vendor/framework-free race, auth, sync and settings interfaces for later adapters. They are TypeScript contracts, not implemented backend services. Durations explicitly use milliseconds; raw counts remain separate from final metrics.
- `src/core/ids.ts` enforces category-qualified 001–100 IDs and provides secure UUID creators for future race/player identity. UUID creation requires the browser's secure-context crypto API (localhost/HTTPS); it is not invoked by the Phase 2 guest preview.
- `src/config/versions.ts` separates app/rules/save/content versions. App version is currently 0.1.0-alpha.1. No release tag exists.

## Cleanup and asynchronous work

Each route transition reverts the Anime.js scope, aborts input/viewport listeners, disconnects the old preview ResizeObserver and destroys its Phaser instance. A generation token ensures a delayed dynamic import cannot attach an old scene after navigation. Retry clears stale ready state. Settings changes apply only to the active UI; the next track mount uses the saved preferences.

On a system reduced-motion change, system-following screens remount with the new preference. Explicit reduced motion disables the scene's particle emission, wheel/body motion, camera entrance and repeating tween. Text size and quality settings are stored locally. Audio is deliberately disabled in this scene; the music/audio controller arrives later.

The keyboard screen is a **free-editing input spike**: it shows match/difference feedback, composition state, last input type and visible viewport dimensions. It accepts paste and normal editing so browser behavior can be examined. It does not implement correction-required race rules, accuracy, WPM, progress awards or anti-cheat policy. No input data is uploaded or saved.

## Failure boundaries

Main startup has a reload recovery screen. A missing SVG exposes retry without blocking navigation. Dynamic-import/renderer failures produce a useful scene message. Denied/malformed storage cannot block startup or silently claim a saved preference. Server/cloud errors cannot occur in this build because there are no service calls.

## Boundaries for later phases

Keep the pure rule engine out of UI/Phaser. Implement solo/network RaceProvider adapters only after Phase 3 defines state/timing semantics. Add the fuller save model and auth/result sync adapters using the existing planning contracts, reviewing those interfaces when actual validation and schemas are implemented. UI rendering does not award rewards. No client-side API secret, database table, auth method or server has been configured.

See [ADR 0001](adr/0001-foundation-stack.md), [ADR 0002](adr/0002-lifecycle-and-data-boundaries.md), [SETUP.md](SETUP.md), and [TESTING.md](TESTING.md).
