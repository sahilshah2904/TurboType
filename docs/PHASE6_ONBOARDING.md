# Phase 6 opening and learning — alpha.18

Implemented 22 October 2026 on `codex/phase6-onboarding`. User visual acceptance and integration remain pending. Rules 3 and save/content 1 are unchanged; no dependencies or backend were added.

## Entrance and navigation

An empty URL fragment opens the entrance; the optional skip preference sends returning visitors directly to Hub. Explicit route links remain direct. Settings offers replay links for the opening, welcome, rules, tutorial and calibration. Shared navigation/fullscreen remains available.

The original cinematic is now a full-window 5.6-second title sequence: dark start, emblem emergence, slow TURBOTYPE reveal, restrained cyan/crimson light sweeps and final tagline/Enter hold. Navigation/footer stay hidden until leaving the entrance; the shared fullscreen icon stays available. Skip is available throughout. Enter appears after 5600 ms; Low effects/Reduced motion immediately show the static final title and Enter. Route cleanup cancels the title timer. This supersedes alpha.17's city/car/driver panels. CSS animations form the sequence rather than an external video download; no commercial logos/film/audio are copied. An explicit user click unlocks existing audio under browser policy; audio controls remain only in Settings.

The Hub now shows Your circuit and no routine ready message. Failures/loading still show actionable feedback. Opening/learning links in Settings use the same setting-row dividers, descriptive text and right-side actions as Motion/Track effects.
Enter and Skip opening both prepare five real essentials: brand image, selected car preview, body, wheel and the Phaser module. Image decode/module completion drives the count, not fabricated byte progress. Each operation has a ten-second deadline. Skip removes the montage, not the readiness gate. Retry cancels prior listeners/timers; leaving the page prevents late navigation. Rules/Keyboard check remain available after failure. The rest of the fleet and optional audio retain their existing route-owned loading/recovery.

The lightweight HTML bootstrap independently catches a failed module download and offers Reload; a twelve-second watchdog also offers recovery for a stalled startup. This works before the application bundle runs. A production test caught Vite stripping a module-tag inline error handler; the final implementation registers an early capturing listener instead.

## Guided lessons

`src/ui/driving-lessons.ts` uses the existing TypingEngine and native race-input adapter. There is one visible typing surface, with the same correction, IME, append-only and assisted-input rules as the race. Three lessons teach exact case (`Go`), correction (`cx`, Backspace, `at`, producing 75% accuracy) and twenty new clean characters for cosmetic nitro. Cleanly typing `cat` does not satisfy the correction lesson. Only completing the final real streak records tutorial completion; all lessons can be skipped or replayed.

Start/resume countdown, Escape, blur and visibility pauses use the core clock. Route cleanup disposes input/listeners/intervals. The active lesson hides decorative headings and compacts the panel so typing and Pause stay visible at 1024×768 with Larger typing text. Ready/results pages can scroll normally.

## Optional calibration and Quick Race setup

Calibration runs for thirty active seconds and never grants records, campaign progress or rewards. A finished sample needs at least twenty validated characters and ten active seconds, with no pause/assisted-input practice reason. Below 95% accuracy or below 30 WPM suggests Easy; 30–below 55 suggests Medium; 55+ suggests Hard. These are conservative starting heuristics for CPU pace, not skill certification. Players can always choose manually.

Applying pace updates a ready race while preserving its other setup. A paused or completed race remains frozen; the preference applies on Retry/New race. Calibration is optional and does not block Hub or Quick Race.

Quick Race retains passage, pace and mode as useful practice choices. Numeric race seed is now inside closed-by-default Advanced / Replay, preserving reproducible CPU schedules. The visible action is New race; it still advances the seed. Future campaign briefing uses level-defined passage/pace/rules in Phase 7 rather than exposing a fake campaign setup today.

## Preferences and boundaries

`turbotype:onboarding:v1` separately validates welcome/tutorial flags, opening skip, preferred pace and optional WPM/accuracy sample. Unknown/malformed data resets safely; blocked storage keeps choices in memory with feedback. These preferences are not credentials, ownership or a persistent race history. Existing car/track/audio/accessibility preferences keep their own keys.

The accepted animated Hub, existing full-window routes and compact result metrics remain. Laptop layouts, keyboard focus, native IME, Low effects, Reduced motion, Larger typing text and shared fullscreen are retained. No mobile work is restored. Maps are Phase 7, 300 reviewed levels Phase 8, independent reward ownership/guest and optional cloud saves Phase 9, release/Pages Phase 10, free-only private rooms Phase 11. Reward totals remain 23 cars / 26 tracks; multiplayer remains at most ten simultaneous players for up to 100 approved people.

## Evidence

See [TESTING.md](TESTING.md), `tests/browser/onboarding.spec.ts`, calibration/storage unit tests and `docs/images/alpha17/`. Automated Chromium/layout evidence does not claim new physical GPU performance certification. Human review is [PHASE6_REVIEW.md](PHASE6_REVIEW.md).

## Alpha.18 race airflow

`src/game/race-track.ts` renders 26 curved road ribbons, eight oblique near-edge gusts and two trails behind each unfinished car, with a hard ceiling of 44 paths and no extra particle objects/timers/assets. Recent WPM smoothly controls strength and decorative travel; delta is capped at 50 ms. Pause/countdown/end clear airflow; Low effects/Reduced motion disable it. It only draws inside the canvas and does not touch score/CPU progress. Existing exhaust and independent wheels remain. Reference-video observations about thin speed streaks/exhaust are developed into visible layered airflow while retaining the accepted tracks/cars/palette. This is a visual refinement, not a new physical frame-rate certification.
