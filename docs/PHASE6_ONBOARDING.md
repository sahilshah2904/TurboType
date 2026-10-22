# Phase 6 opening and learning — alpha.17

Implemented 22 October 2026 on `codex/phase6-onboarding`. User visual acceptance and integration remain pending. Rules 3 and save/content 1 are unchanged; no dependencies or backend were added.

## Entrance and navigation

An empty URL fragment opens the entrance; the optional skip preference sends returning visitors directly to Hub. Explicit route links remain direct. Settings offers replay links for the opening, welcome, rules, tutorial and calibration. Shared navigation/fullscreen remains available.

The original cinematic uses a CSS city, the accepted selected car artwork and an original inline SVG driver/helmet panel. Its eight-second motion becomes static under Low effects or Reduced motion. It is a code-native montage, not a downloaded film. Enter unlocks the existing audio context; sound remains optional and configured only in Settings.

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
