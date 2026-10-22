> Alpha.5 presentation revision: see [IMMERSIVE_APP.md](IMMERSIVE_APP.md) for current full-window kart rendering, responsive/proportional composition, integrated typing strip, control deck and recent-WPM speedometer. Fixed 1000×450/SVG composition described below is historical; CPU/core/result rules remain version 3.

# Recreate the single-player Quick Race

## Setup now and in the final game

Passage chooses the exercise; opponent pace chooses CPU target bands independently of passage length; mode chooses passage completion or a 60-active-second trial; seed reproduces CPU reaction/hesitation/correction schedules for debugging and fair retries. A seed never replays the human's typing. Current passages are validation exercises, not campaign content.

Keep passage/pace/mode choices for optional Quick Race and Practice where useful. Campaign nodes supply authored passage, CPU profile, mode and targets from the level definition, so players do not configure these four fields before every campaign race. Move the numeric seed to an optional Advanced/Replay disclosure in Phase 6 (TT-603); generate it automatically during normal play and retain Retry same race. It should not be a required final onboarding choice.

Implemented in Phase 4, app 0.1.0-alpha.3, rules version 3. This is a playable local single-player preview, not a public deployment or campaign release. Phase 5 (app alpha.4) replaces the prototype car with original modern sports bodies, Neon Harbor camera/effects and optional synth sound; this document retains the exact Phase 4 gameplay semantics.

## Run and reproduce

Follow [SETUP.md](SETUP.md), use `feat/solo-race` while its PR is under review, and open `/TurboType/#/race`. Select First keystroke, easy, untimed, seed `42`. Start after the track reports ready, then type after 3–2–1. Repeat those four inputs for exactly the same CPU schedules. Real player results still depend on their actual input/timing; the seed is not a player replay. Retry same race resets attempts/time while preserving this configuration. New seed increments the unsigned seed, wrapping 4294967295 to 0.

All three original practice passages are available; these are short exercises for race-engine verification, not authored campaign levels. The planned campaign will introduce longer passages gradually (see GAME_DESIGN_PLAN.md and Phase 8 tasks), while early learning stages stay approachable. Changing opponent pace affects CPU speed, not passage length. Quick Race opponent tiers are independent of future campaign learning categories:

| Pace tier | Target WPM before delays |
| --- | --- |
| easy | 18–30 |
| medium | 35–50 |
| hard | 65–85 |

Actual effective WPM is generally lower because reaction, hesitation and corrections are included. These bands are starting game tuning, not validated teaching targets or adaptive difficulty. Nothing secretly changes a CPU schedule to respond to the player's position.

## Deterministic schedules

`src/core/cpu-schedule.ts` takes printable passage length (1–2000), tier and an unsigned 32-bit integer seed. Each of four named, explicitly CPU opponents owns an independent PRNG state derived from seed XOR a lane-specific multiple of 0x9e3779b9. The PRNG uses 32-bit integer mixing (Mulberry32-style) and is scoped to this generator, without replacing global Math.random. The default seed comes from Math.random for variety; it is not a security token or persistent race ID.

For lane index i, target WPM is chosen from its quarter of the tier's band. Reaction is 300–1000 ms. Base character time is `60000 / (5 × targetWpm)` ms. Each character adds 0.82–1.18 times that base, has an 8% chance of 150–550 ms hesitation, and a 5% chance of a 1.2–2.4 base-character correction delay. Both may occur. Correction delays simulate time lost before validating the next character; no fake CPU accuracy is displayed.

Store the cumulative validated-character timestamps once, before GO. Binary search finds how many timestamps are at or below active elapsed time. Finish time is the last timestamp. Rendering at 30, 60, 120 fps or after a delayed frame cannot change those timestamps. The generated schedules/configuration are frozen. Do not regenerate inside a render loop or use pixel position to determine results.

These constants and PRNG details affect comparability: change the rules version when changing them. Rules version 3 adds the implemented opponent/result semantics; typing/correction rules from version 2 remain unchanged. Save/content versions stay 1 because only display preferences persist.

## One clock and honest outcomes

`src/core/solo-race.ts` composes TypingEngine with the schedules. The DOM adapter sends player commits to the same existing TypingEngine; Phaser and the 100 ms HUD read snapshots. There is no separately integrated CPU timer. All lanes pause together, including tab hiding, focus loss and in-app navigation; resumed countdown time is excluded. A pause after GO keeps the run practice-only. Resize alone does not pause. Reload/HMR discards the unsaved session.

Finishing CPUs do not end an untimed player run. Let the learner finish. At the player's final character, freeze the live track, player metrics and final result. The result table derives remaining CPU outcomes from the already-fixed schedules and explicitly labels future finishes **Simulated after your finish**. These projected times may extend past the frozen track; the table does not pretend those cars were observed crossing the line. Actual earlier finishes are labeled Finished.

For the optional 60-active-second trial, an unfinished player is DNF at the deadline with their actual progress and no finish time. A CPU scheduled at/before the event deadline finishes; one beyond it is DNF. If a player finishes before the deadline and a remaining CPU cannot finish in time, label that future outcome **Simulated DNF · deadline** and project its progress only to the event limit. On abandonment, retain observed CPU finishes and stop remaining entries at actual elapsed time, with no future finish fabrication.

Rank by exact finish time, then unfinished progress; exact ties share competition places (1,1,3). Stable IDs break display-order ties only. DNF/stopped entries have no displayed finish place/time, even though the helper can order their progress. CPU times display two decimals and the player's HUD one decimal; ranking uses unrounded milliseconds. No medals, rewards, records or cloud submissions follow from these local results.

## Renderer, recovery and ownership

`src/game/race-track.ts` owns one lazy-loaded Phaser instance: five fixed lanes, three original modern car bodies, procedural wheels/shadows/city/road and a checkerboard finish. Phase 5 uses a 1000×450 design; full-motion world position is `220 + 4000 × validatedProgress`, with camera `clamp(playerWorldX - 330, 0, 3370)` and the gate at world x=4292, aligned to the car's 72px front offset at validated completion. Reduced motion maps progress to `120 + 760 × progress` with gate x=952 (car-center finish 880 + 72px front offset). That Phase 4 full-course view is now the reduced-motion projection; Phase 5 full motion uses a progress-relative camera/approaching finish and offscreen lane indicators, as specified in ART_BIBLE.md and race-view.ts. Rules remain unchanged. Reduced motion removes road scrolling and wheel rotation while essential progress remains visible. The hub's three-car decorative preview remains separate.

Do not enable Start until artwork is ready or the user explicitly chooses text standings after failure. Missing art, import failure, a 12-second loading watchdog or WebGL context loss exposes Retry artwork and Race with text standings. A graphics failure during racing pauses the core. Text mode uses identical rules/schedules and is not selected silently. Retrying graphics preserves the paused/result session. Generation guards, listener aborts, timeout/interval cleanup, ResizeObserver disconnection and Phaser destruction prevent late mounts or extra scenes after navigation.

Original optional audio is described in [AUDIO.md](AUDIO.md); it defaults muted and never gates a race. Status and metrics appear above the track; the course leads directly into the passage and typing field. This order follows the user's race-visibility feedback. The canvas is positioned inside a relative aspect-ratio container so its previous dimensions cannot impose an old intrinsic height after setup compacts. Active layout hides setup/decorative headings, caps the desktop track width and compacts mobile metrics/navigation. Large-text preferences remain respected; native textarea vertical resizing remains available. Text standings and results are semantic DOM, independent of canvas readability. Native keyboard viewport/rotation still needs the available-device check below; emulation is not hardware certification.

## Verification and next checks

`npm run check` validates types, formatting, pure behavioral tests, build and Chromium profile flows. New tests cover reproducibility, seed bounds, character/finish boundaries, frame-independent progress, all-CPU-first continuation, pause/countdown exclusion, frozen/projected outcomes, timed/abandoned DNFs, retry, graphics recovery/context loss, navigation cleanup and narrow layouts. Actual run evidence lives in [TESTING.md](TESTING.md).

The user accepted the five requested ASUS/Samsung race checks (TT-404); [PHASE4_RACE_TESTS.md](PHASE4_RACE_TESTS.md) retains the procedure. Physical iPhone/tablet and broader browser/performance coverage remain TT-1008/Phase 10. No Phase 3 acceptance is retroactively presented as testing this new scene. Future rewards/storage, cloud accounts, cinematic art/audio, 300 campaign levels and multiplayer remain tracked in [BACKLOG.md](../BACKLOG.md).
