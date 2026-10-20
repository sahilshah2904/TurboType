# Verification evidence

## Phase 4 — four-CPU Quick Race, 20 October 2026

Branch: `feat/solo-race`, from main baseline `08cddb4` after ordered merge of PRs #1 and #2. App 0.1.0-alpha.3 / rules 3. The final local `npm run check` completed with exit code 0: formatting, strict types, **69 unit tests**, production build and **54 Chromium browser tests** (18 behaviors in each desktop/phone/tablet profile). New coverage is 21 unit cases and five browser scenarios across all three profiles. Hosted CI for this branch is not recorded yet.

Core tests verify frozen seeded schedules, independent lanes/seed boundaries, exact validated-character/finish thresholds, sparse versus frequent progress queries, CPU tiers/delays, one pause/countdown clock, continuation after all CPUs finish, observed/projected final ordering, future deadline DNFs, actual timed/abandoned outcomes, immutable setup and fresh retries. The existing generic standings helper retains its exact-tie tests and now preserves row metadata. An initial type check caught that its old return type discarded extra row metadata; a generic return type fixed that contract, with the complete check rerun successfully.

New browser flows complete and retry an actual five-lane race, verify pre-GO input and correction while CPUs move, freeze results, preserve text/CPU positions across pause/navigation, handle synthetic WebGL context loss with explicit text continuation, continue after CPUs finish first, expire at 60 seconds with DNF, recover from aborted artwork, clean up/remount one canvas, reject invalid seeds, change seed, honor reduced motion and preserve text during narrow rotation. These synthetic events verify application handling; they are not a claim that real hardware GPU recovery was tested.

Visually inspected ready/active desktop and active phone captures from the actual dev app. Initial active layout put typing too far below the course; active controls/headings were compacted and desktop track width capped. At 1440×1000, input starts near 799px; at 390×844 near 448px. Document width matches those viewports, and automated narrow checking covers 320px. Actual software-keyboard occlusion/rotation still needs TT-404. Prototype car/scenery are deliberately retained for Phase 5; current canvas labels are supplemented by readable DOM standings. No actual fps, input latency, WebKit/Safari, iPhone or physical tablet coverage is claimed.

**Pending TT-404:** [available-device race checks](PHASE4_RACE_TESTS.md) on ASUS/Samsung. Earlier Phase 3 acceptance did not test this new scene. Broader hardware/browser/performance requirements remain TT-1008/Phase 10. No rewards/results are stored, no cloud or multiplayer exists and no Pages site was deployed. See [Quick Race recreation](QUICK_RACE.md) and [ADR 0004](adr/0004-solo-race-schedules-and-results.md).

The existing Windows shell AutoRun diagnostic still appears in nested scripts; all recorded final commands exit 0. The separately lazy Phaser chunk remains about 1.37 MB minified / 357 kB gzip; the app chunk is about 83 kB / 29 kB gzip. This is build size evidence, not a hardware performance claim.

## Phase 3 — typing practice, 20 October 2026

Branch: `feat/typing-engine`, based on `feat/app-foundation`. App 0.1.0-alpha.2, rules version 2. Current Windows local `npm run check` completed with exit code 0: formatting, strict types, 48 unit tests, production build and 39 Chromium browser checks (13 behaviors across desktop, phone and tablet profiles). Hosted Linux [run 39418022536](https://github.com/sahilshah2904/TurboType/actions/runs/39418022536) also passed for implementation commit `0e19dcf`, including clean npm ci, browser installation and the full check command.

New unit coverage exercises exact correction/error history, zero/backwards/late clocks, pause/resume/countdown cancellation, finish freeze, timed expiry boundaries, practice eligibility, retyping/nitro thresholds, invalid configuration and shared competition places. New browser coverage exercises strict input, fallback replacement validation, multi-character composition with trailing input, pause/navigation preservation, focus loss, timeout, unsupported selection edits and canceled composition.

A behavioral browser test caught HUD updates resetting native selection; sync now writes only changed values. Six simultaneous WebGL test workers caused a renderer startup timeout; concurrency is explicitly bounded at three workers. The final complete run passes. Existing local shell AutoRun diagnostics and Phaser chunk warning remain as described below; neither failed the checks.

Visually inspected active practice at desktop and 390px phone sizes; 320px, 390px and 1440px captures report document width equal to viewport width. This is layout evidence, not a real software keyboard or performance measurement. The hub track is still decorative; no four-CPU race, campaign, database, rewards or music exists. Practice text/results survive route navigation within this visit, but not reload/HMR.

**TT-305 accepted by user report:** on 20 October 2026, after receiving the focused seven-step checklist, the user said all test cases work on the laptop and similar tests work on the phone. Devices previously identified as ASUS laptop and Samsung S25 Ultra. Five supplied laptop screenshots show a finished 40.5 WPM / 92.2% / 13.9s run, error/correction counts, a paused unresolved error, preserved longer-passage text, and timeout at 60.0s / 87% completion. These support the visible states; mobile behavior and the other checklist cases are user-reported rather than independently observed. The report does not specify whether predictive completion was blocked or composed/practice-only, nor supply native event traces or browser/OS/keyboard versions. Do not invent those details or claim universal OS assistance detection. The available-device acceptance closes the Phase 3 gate; physical iOS/tablet coverage and missing environment metadata remain TT-1008.

The user also observed that the textarea can be dragged larger and reported no issue. This is the native resize control and remains available. The timeout screenshot exposed a stale “Paused” input notice after the result froze; TT-306 fixes state-transition notices. The existing timed browser scenario now checks paused, resumed countdown, GO and final timeout notices. After this notice fix, the full local check was rerun successfully: formatting/types/build, 48 unit and 39 browser tests passed with exit code 0. Screenshots remain in the conversation rather than publishing private clipboard files. See [implemented rules](GAME_RULES.md) and [ADR 0003](adr/0003-typing-clock-and-input-policy.md) for policy and limits.

## Phase 2 foundation verification (historical)

Date: 20 October 2026. Branch: feat/app-foundation. This records observed evidence, not a promise of untested device support.

## Local environment and executed checks

Windows workstation; Node 24.13.0, npm 11.6.2. Tested dependency versions: Phaser 4.2.1, Anime.js 4.5.0, Vite 8.3.4, TypeScript 7.0.2, Vitest 5.0.5, Playwright 1.64.1 and Prettier 3.9.10. Exact transitive versions are locked in package-lock.json.

`npm ci` completed successfully from the lockfile (49 packages audited; zero reported vulnerabilities at that time). After installation finished, `npm run check` completed with exit code 0:

- Formatting and strict TypeScript checks passed.
- **20 unit tests passed** across IDs, router behavior and settings persistence/recovery.
- Production build passed at base `/TurboType/`.
- **18 Playwright browser tests passed**: six behaviors in each of three Chromium profiles (desktop, Pixel 7 emulation and iPad Mini viewport/touch emulation using Chromium).

Browser tests exercise production asset loading and canvas startup, layout overflow, editing/backspace/composition diagnostics/reset, settings reload, repeated scene disposal/remount, unknown routes, landscape resizing without lost input, missing artwork/retry and denied storage. Shader rendering was also visually inspected, not inferred from a ready flag alone.

The first attempted full check during `npm ci` ran before the install finished and could not find Prettier. It was discarded, installation was awaited, and the complete check above was rerun successfully. No change to app behavior was needed for that transient orchestration error.

The workstation's existing Windows Command Processor AutoRun emits a warning on some nested npm scripts; checks still completed successfully. See SETUP.md. No registry settings were changed.

## Visual review

Captured hub previews at 1440, 768, 390 and 320 CSS-pixel widths and the keyboard screen at phone width. Reviewed desktop hub, phone hub and phone keyboard screenshots. Visual QA identified black rectangles for the SVG cars even though loading tests passed; setting explicit SVG raster dimensions fixed them, and the corrected scene was inspected with low/high effects. Reference source and procedural art are documented in ASSETS.md.

QA captures are local generated files under ignored test-results, not source assets. Playwright may clear that directory on a later run. Regenerate using the local app/preview and your browser; reproducible test commands are in SETUP.md. Visual screenshots are evidence of the captured layout, not proof that a real device's keyboard behaves identically.

## Build observations

The Phaser chunk is approximately 1.37 MB minified / 357 KB gzip; the interface script is about 50 KB / 20 KB gzip. Vite warns about the large Phaser chunk. It is deliberately isolated with dynamic import and not requested for direct keyboard/settings routes. The build is well below the proposed 5 MB initial-transfer target, but network/device measurements and final art/music remain future work. File gzip estimates are not a measured user transfer or a frame-rate benchmark.

Fonts are self-hosted Latin subsets; their notices are included in public/assets/licenses. No reel media, credentials, downloaded analysis helpers or external font service is shipped.

## Hosted CI

A checks-only GitHub Actions workflow is committed, pinned to verified action commits. It uses the recorded Node version, npm ci, Chromium/system dependencies and npm run check. [The first hosted Linux run passed](https://github.com/sahilshah2904/TurboType/actions/runs/39404088628) for implementation commit `5534591`, confirming the clean checkout/install and full check outside the Windows workstation. Later documentation-only commits may have their own runs; inspect their actual status separately. CI does not configure Pages deployment or branch protection.

## Open gates and honest limitations

### User-supplied physical-phone evidence

On 20 October 2026 the user opened the LAN preview on a physical phone, reported that it works, and supplied a portrait screenshot. It shows the keyboard-check page, an open software keyboard, a focused textarea with the full matching sample sentence, and readable sample/input text above the keyboard. This confirms real-phone page loading, focus/keyboard opening and visible entered text for that captured state. It does not establish how the text was entered or the input-event sequence. Later reports identify the phone as Samsung S25 Ultra and the laptop as ASUS; exact models beyond that, OS versions and browsers/versions remain unspecified.

The initial ERR_SSL_PROTOCOL_ERROR was resolved by opening the HTTP LAN URL rather than HTTPS; a local server request returned HTTP 200 and the server was listening on all interfaces. This was local preview access, not a public Pages deployment.

The screenshot remains a user-supplied local attachment; it has not been added to the public repository. In a follow-up, the user explicitly confirmed these three physical-phone checks passed: deleting characters with Backspace and retyping, rotating without losing entered text, and dismissing/reopening the software keyboard. These are user-reported results, not automated observations.

The user identified the phone as a **Samsung S25 Ultra** and the laptop as **ASUS**, and reported successful Clear text and next-key highlighting on both. Supplied laptop screenshots show the full sentence matching, and an empty reset field with E highlighted as the next expected letter. Browser/OS versions and the specific ASUS model remain unspecified.

The user also confirmed that navigating to the Hub or Settings clears the keyboard exercise on return. Source inspection confirms this is the foundation's current transient-screen behavior: routing rebuilds the textarea and does not save its draft. This is not a failed save of campaign progress, because campaign saves/races are not implemented. In a later response to the remaining checklist, the user confirmed settings persist after refresh on both devices and confirmed the separate browser-tab-return check works. Future active races must follow the explicit pause/resume/abandon policy rather than silently clearing race state.

**Finding: keyboard word completion remains available.** The user reports autocorrect can complete words despite the textarea requesting autocorrect/autocapitalization off. The foundation check deliberately permits free editing/paste and has no scores, so this is captured as a Phase 3 race-input requirement (TT-305), not silently treated as fair unassisted racing. The report does not distinguish automatic replacement from tapping a suggestion; capture the actual event behavior during adapter implementation. Native composition/automatic-capitalization paths and exact browser versions remain unverified.

- **TT-204 foundation verification closed with documented exceptions:** available-device checks on Samsung S25 Ultra/ASUS passed by user report, and word completion was identified for TT-305. The user has no iPhone or tablet available. On 20 October 2026, unavailable physical iOS/tablet coverage and missing environment metadata were explicitly carried to TT-1008 as release-gate work, rather than claimed as passed or allowed to block pure engine development. Phase 2 is complete for the foundation scope; broad device support remains unverified. Required future composition/race-input tests are TT-305.
- Firefox, Safari/WebKit and actual hardware GPU coverage are not established. Chromium tests use software rendering flags to make WebGL available in headless mode; they do not establish 60 fps on players' devices.
- The keyboard check intentionally accepts paste/editing. It is not the Phase 3 typing/race engine, with scoring/correction-required input.
- At this Phase 2 snapshot, no gameplay, campaign saves, cloud synchronization, accounts, music or multiplayer was implemented. Phase 3 adds typing practice as recorded above; stable provider contracts are still integration boundaries only.
- No live GitHub Pages site or release tag exists. Local preview success is not deployment evidence.

### Race-input follow-up and browser limits

During Phase 3, test beforeinput/input replacement events, multi-character inserts, rejected paste and committed composition without double-counting. Request keyboard assistance off, reject identifiable replacement/bulk assistance under explicit race rules, and validate the resulting value even when beforeinput is missing or cannot be canceled. Do not classify every multi-character insert as assistance: legitimate composition can commit multiple characters. Do not promise that a website can detect or disable every OS keyboard suggestion. Define how ambiguous/assisted entries affect competitive record eligibility, communicate it, and retest on the Samsung phone before closing TT-305.

Primary references checked for this finding: [beforeinput caveats](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event), [autocorrect attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autocorrect). No scoring/input-policy code has changed in this documentation update.

## Continue verification

For each implementation change, run meaningful relevant checks. Before release, verify the broader matrix in the game plan/online architecture, measure performance on named devices, validate cloud ownership/transactions/conflicts and reproduce deployment/recovery. Update PROJECT_STATUS.md and BACKLOG.md only after evidence exists.
