**Current scope override — 21 October 2026:** the user explicitly narrowed TurboType to laptop/desktop browsers with a physical keyboard. Phone/tablet compatibility, software-keyboard layout, rotation and mobile acceptance are canceled requirements. Earlier multi-device statements are historical. Keep laptop window responsiveness (960 CSS px minimum; verify 1024/1366/1440/1920 widths), accessibility, hardware-keyboard IME composition, cloud saves before solo launch and multiplayer afterward. Do not restore mobile work without a new user request.

> Alpha.5 update: [IMMERSIVE_APP.md](IMMERSIVE_APP.md) and [ADR 0006](adr/0006-immersive-app-and-live-wpm.md) supersede earlier fixed-size race/art/composition descriptions below. Race uses responsive Phaser RESIZE, the approved kart PNG/palette textures, integrated native typing and a rolling-WPM dial. Existing pages share a full-window world; previous sections retain historical ownership context.

# Application architecture

This describes the implemented foundation, typing engine, four-CPU Quick Race and Phase 5 audiovisual polish. Cloud services and progression remain future work.

## Ownership and flow

```text
index.html → main.ts → mountApp
  ├─ hash router → hub / keyboard check / settings
  ├─ practice screen → strict DOM adapter → deterministic TypingEngine
  ├─ Quick Race → SoloRace (TypingEngine + seeded CPU schedules) → race-track canvas
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
- `src/config/versions.ts` separates app/rules/save/content versions. App version is currently 0.1.0-alpha.5; rules version remains 3. No release tag exists.

## Cleanup and asynchronous work

Each route transition reverts the Anime.js scope, aborts input/viewport listeners, disconnects the old preview ResizeObserver and destroys its Phaser instance. A generation token ensures a delayed dynamic import cannot attach an old scene after navigation. Retry clears stale ready state. Settings changes apply only to the active UI; the next track mount uses the saved preferences.

On a system reduced-motion change, the hub remounts with the new preference; other screens apply preferences without destroying active typing state. Explicit reduced motion disables the scene's particle emission, wheel/body motion, camera entrance and repeating tween. Text size and quality settings are stored locally. Phaser audio remains disabled; the app-owned RaceAudio service independently controls optional original menu/race synthesis.

The keyboard screen shares TypingEngine and connectRaceInput with races: exact typing, one unresolved error, Backspace correction, append-only edits and paste/drop/replacement blocking. A validated countdownMs=0 starts this untimed diagnostic immediately; race defaults remain three seconds. It shows sample hints, independent common physical-key detection, composition/input/viewport diagnostics and reset. It does not display WPM/accuracy, award progress or save/upload input. Route/reset disposal cancels adapter listeners and queued composition commits.

## Failure boundaries

Main startup has a reload recovery screen. A missing SVG exposes retry without blocking navigation. Dynamic-import/renderer failures produce a useful scene message. Denied/malformed storage cannot block startup or silently claim a saved preference. Server/cloud errors cannot occur in this build because there are no service calls.

## Boundaries for later phases

Keep the pure rule engine out of UI/Phaser. Implement solo/network RaceProvider adapters only after Phase 3 defines state/timing semantics. Add the fuller save model and auth/result sync adapters using the existing planning contracts, reviewing those interfaces when actual validation and schemas are implemented. UI rendering does not award rewards. No client-side API secret, database table, auth method or server has been configured.

## Phase 3 typing integration

`src/core/typing-engine.ts` implements clock-injected validation, attempts/accuracy, progress, active-time metrics, streak/nitro events and the ready/countdown/racing/paused/finished/timed-out/abandoned lifecycle. `standings.ts` implements validated shared-place sorting for later opponents. Neither imports browser, storage or renderer code. `src/content/practice-passages.ts` supplies three original ASCII exercises, not campaign levels.

`src/ui/race-input.ts` is the DOM boundary: canonical engine text, append-only edits, fallback value validation, assistance rejection and once-only composition commit. `typing-practice.ts` renders the practice state, uses a 100 ms HUD interval, and wires pause/visibility/controls. A PracticeSession in mountApp retains its engine across routes; cleanup pauses it and removes listeners/intervals. Preference changes do not silently rebuild an active practice screen. Text/race state does not survive full reload/HMR, and no cloud/result save is implemented.

Active practice compacts the heading/options and mobile HUD to prioritize passage/input space. Result states restore the complete layout and reveal frozen metrics. Reduced motion still applies. The hub track remains decorative; Quick Race has its own separate engine-connected canvas.

The framework-free contracts remain integration boundaries; the live practice engine does not yet implement the full RaceProvider/network/persistence stack. See [implemented rules](GAME_RULES.md) and [ADR 0003](adr/0003-typing-clock-and-input-policy.md).

## Phase 4 race ownership

`cpu-schedule.ts` creates four frozen seeded timestamp arrays. `solo-race.ts` composes the existing typing clock with binary-searched CPU progress and exact-time standings; final rows distinguish observed finishes, later simulated outcomes, timed DNFs and stopped runs. No frame-integrated bot clock or renderer callback determines a place. The shared standings helper now preserves row metadata through its generic type.

`quick-race.ts` owns a separate in-memory session, canonical input adapter, 100 ms HUD, setup/seed/retry, pause triggers and track readiness/fallback. `race-track.ts` only renders snapshots in five lanes. It lazily imports Phaser, cleans up on navigation and reports asset/context failures. A 12-second watchdog exposes explicit text racing if loading stalls. Pause/resume, callbacks and pending mounts are guarded independently of animation. Reduced motion keeps essential position changes without decorative scrolling/wheels.

The current SoloRace composition is synchronous and framework-free; it does not pretend to implement the earlier asynchronous network RaceProvider contract, persistent RaceResult IDs or account submission. Those integration contracts will be reconciled when implementing storage/network services. See [Quick Race recreation](QUICK_RACE.md) and [ADR 0004](adr/0004-solo-race-schedules-and-results.md).

## Phase 5 presentation and sound ownership

`race-view.ts` projects authoritative progress into a following camera or reduced-motion whole-course view and gates real overtake/streak callouts. The rewritten HarborCircuit renderer owns procedural city depths, modern SVG bodies, wheels/shadows/halo/flames, bounded sparks/confetti and a finish card. Visual interpolation never feeds back into the pure rules. HTML/Anime.js owns callout motion and the caret-following passage strip; larger text stays wrapped. Metrics remain above the course.

`audio/race-audio.ts` owns one optional Web Audio context, bounded note scheduler/source set and fade/cleanup lifecycle. `audio/score.ts` is the editable original score. It reads typing snapshots for cue/pace changes and can fail without escaping into gameplay. `storage/audio-settings.ts` owns a separate schema-1 preference envelope; existing display preferences are untouched. `ui/audio-controls.ts` is shared by Race and Settings; mountApp owns audio disposal and focus/visibility listeners.

See [art direction](ART_BIBLE.md), [audio](AUDIO.md), [measured profile](PERFORMANCE.md) and [ADR 0005](adr/0005-neon-harbor-motion-and-audio.md). Physical sound/performance acceptance remains TT-505/506.

See [ADR 0001](adr/0001-foundation-stack.md), [ADR 0002](adr/0002-lifecycle-and-data-boundaries.md), [SETUP.md](SETUP.md), and [TESTING.md](TESTING.md).
