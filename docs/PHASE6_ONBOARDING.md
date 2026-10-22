# Phase 6 opening and learning — alpha.19

Implemented 22 October 2026 on `codex/phase6-onboarding`. User visual acceptance and integration remain pending. Rules 3 and save/content 1 are unchanged; no dependencies or backend were added.

## Entrance and navigation

An empty URL fragment opens the entrance; the optional skip preference sends returning visitors directly to Hub. Explicit route links remain direct. Settings offers replay links for the opening, welcome, rules, tutorial and calibration. Shared navigation/fullscreen remains available.

The original 5.6-second full-window cinematic now features the existing purple Volt Electric (volt-rival). It races from off-left, brakes/holds in the centre, revs its separate tyres with smoke, moves back 7vw, then launches off-right. The title reveals left-to-right behind the launch, with original flame ribbons along its invisible middle road and around the lettering. Chassis pitch/exhaust and separate tyre spin use the same body/wheel proportions/anchors as the race. No selected-car preference is changed. This replaces alpha.18's simple title-only reveal and alpha.17's illustrated panels.

Timing after decoded artwork: arrival/brake through ~1.46 seconds; brief wheel stop then central rev/burnout through ~2.4; reverse to ~3.0; right launch through ~4.3; title/fire reveal ~3.5–5.0, then final hold/Enter at 5.6. There are five bounded smoke elements and three original SVG ribbons with three flame paths each, no new raster/video transfer or extra Phaser canvas. Whole SVG roots use small composited scale/skew flicker, with the wording in front for readability.

The title clock/CSS timeline wait for the body and both wheel images to decode. Four-second failure/timeout recovery shows a static readable title plus feedback and Enter. Skip is immediate and cancels remaining preparation/timing. Low effects/Reduced motion immediately show the static title without car, smoke or fire. Navigation/footer stay hidden until leaving the entrance; shared fullscreen remains. Enter after the sequence still performs the real five-essential loading gate below. Route cleanup cancels artwork/title timers and suppresses stale decode callbacks. An explicit click unlocks existing audio; controls remain only in Settings.
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
