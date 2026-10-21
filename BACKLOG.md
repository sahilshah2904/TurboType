# TurboType future work backlog

**Current scope override — 21 October 2026:** the user explicitly narrowed TurboType to laptop/desktop browsers with a physical keyboard. Phone/tablet compatibility, software-keyboard layout, rotation and mobile acceptance are canceled requirements. Earlier multi-device statements are historical. Keep laptop window responsiveness (960 CSS px minimum; verify 1024/1366/1440/1920 widths), accessibility, hardware-keyboard IME composition, cloud saves before solo launch and multiplayer afterward. Do not restore mobile work without a new user request.

21 October 2026 handoff: current implementation is alpha.8 / 0b4eef6 on feat/race-polish, PR #4 open. The user asked to continue later. Resume instructions and the delivered-work summary are in [AGENTS.md](AGENTS.md#latest-alpha9-scope-and-acceptance-update) and [README.md](README.md#progress-checkpoint-and-next-session). First resolve remaining Phase 5 acceptance/fleet/performance tasks; do not skip straight to campaigns. All unchecked items below remain pending unless explicitly retired; TT-514 was canceled by the user.

Last reviewed: 20 October 2026. All unchecked items are future work, not implemented features. This backlog captures commitments and deferred ideas; [PROJECT_STATUS.md](PROJECT_STATUS.md) reports actual phase progress. Design details and acceptance criteria remain in the linked specifications.

## Maintenance rules

- Read this file with the phase tracker before starting a new phase. Add newly identified deferred work here during the same change that identifies it.
- Keep stable task IDs. Split a task when needed without reusing its ID; link follow-up IDs. Record dependencies, unresolved decisions and blockers instead of dropping them from the plan.
- Check an item only after its behavior, meaningful validation and documentation are complete. Append the completion commit/evidence. A draft screen or researched option alone does not complete an implementation task.
- Keep optional ideas separate from launch commitments. Cancellation or scope changes require an explicit dated note and rationale; do not silently delete tasks.
- Do not treat the number of checked boxes as a time/effort estimate. This is a living work breakdown, not a promise that every item has equal size.

## Phase 2 — application foundation (complete with recorded exceptions)

- [x] TT-201: Create the TypeScript/Vite application, actual scripts, runtime version record, lockfile and clean-clone setup instructions. Evidence: docs/SETUP.md and docs/TESTING.md, clean npm ci and production build on feat/app-foundation.
- [x] TT-202: Verify and pin compatible Phaser/Anime.js releases; test particles, filters, UI timelines, cleanup, resize and `/TurboType/` asset loading; record architecture decisions. Evidence: running scene and 18 browser tests, visual SVG fix, ADR 0001/0002.
- [x] TT-203: Build the responsive shell, screen navigation and minimal boot/error recovery flow for phones, tablets and laptops. Evidence: hub/keyboard/settings routes, image retry and storage-failure checks, responsive captures; actual device coverage remains TT-204/TT-1001.
- [x] TT-204: Foundation input spike and available-device verification completed with recorded exceptions on 20 October 2026. Samsung S25 Ultra/ASUS reports confirm editing, phone rotation/keyboard reopening, Clear text/highlighting, settings persistence and browser-tab return. Word completion remains possible: follow-up TT-305. User has no iPhone/tablet; physical coverage and missing browser/OS metadata explicitly transferred to release-gate TT-1008, not marked passed. Composition/race input belongs to TT-305. Evidence: docs/TESTING.md and user reports recorded in this branch's history.
- [x] TT-205: Define stable player/race/content IDs, versioned contracts and pure core/local-storage/sync/network boundaries. Evidence: src/core/contracts.ts, src/core/ids.ts, architecture docs and ID tests. Cloud/race adapters are not implemented.
- [x] TT-206: Add relevant automated checks, formatting/type checking and a CI workflow using actual working scripts; document supported tools and troubleshooting. Evidence: local npm run check (20 unit + 18 browser tests) and hosted Linux run 39404088628 passed for implementation commit 5534591; see docs/TESTING.md.

## Phase 3 — typing engine

- [x] TT-301: Implement exact-character append-only typing and correction rules, blocked input/paste handling, composition support and expected error/correction counts.
- [x] TT-302: Implement WPM, accuracy, progress, novel-position streaks and recent pace, including zero-time and threshold boundaries.
- [x] TT-303: Implement ready/countdown/racing/pause/finish states, monotonic timing, eligibility, restart and opt-in timed-event expiry.
- [x] TT-304: Verify behavioral edge cases, no deletion/retyping reward exploits, shared places, finish timestamps and animation-independent outcomes; write implemented rules documentation.
Completion evidence for TT-301–304: `src/core/typing-engine.ts`, `standings.ts`, `src/ui/race-input.ts`, practice UI, 48 unit tests and 39 Chromium browser checks passing on `feat/typing-engine`; implemented rules and ADR 0003; implementation commit `0e19dcf`, PR #2. This verifies automated behavior, not native Samsung input.

- [x] TT-305: Address Samsung word-completion finding in the race input adapter: request assistance off, handle identifiable replacements/paste and ambiguous multi-character input, preserve legitimate composition, validate resulting values and prevent inflated/unfair metrics under explicit eligibility rules. Do not claim all OS assistance can be detected or disabled. Retest the implemented adapter on the available phone; document actual behavior. Implemented and covered automatically; on 20 October 2026 the user reported all requested strict-input cases working on ASUS and Samsung S25 Ultra, with laptop screenshots showing correction, pause, completion and timeout. Accepted on that available-device report; exact prediction event/label behavior and browser/OS/keyboard versions were not supplied. Broader verification remains TT-1008. See docs/TESTING.md and docs/PHASE3_INPUT_TESTS.md.

- [x] TT-306: Correct stale input notices across countdown, resume and final states, identified in the user's timeout screenshot. Transition messages now match the engine state; the existing timed browser scenario checks pause→countdown→GO→expiry notices across all three profiles.

## Phase 4 — complete playable race

- [x] TT-401: Implement four seeded CPU schedules with fixed difficulty, reaction, hesitation and corrections; verify repeatability across frame rates.
- [x] TT-402: Connect passage/input, vehicles, progress/ranks, countdown and finish to the pure core.
- [x] TT-403: Implement honest results, eligibility, CPU result handling, pause/restart/retry and error paths; verify a complete race/retry flow.

Evidence for TT-401–403: `src/core/cpu-schedule.ts`, `solo-race.ts`, `src/ui/quick-race.ts`, `src/game/race-track.ts`, documented rules/recreation and ADR 0004; local `npm run check` passes with 69 unit tests and 54 Chromium profile checks on `feat/solo-race`. Implementation commit `e4e664d`, PR #3. User acceptance of the new race is separately TT-404.

- [x] TT-404: Verify the implemented Quick Race on the available ASUS laptop/Samsung S25 Ultra: start/actual vehicle progress, correction while CPUs continue, all-lane pause/navigation preservation, keyboard space/rotation, frozen results/simulation labels and retry. Follow docs/PHASE4_RACE_TESTS.md. Completed by user report on 20 October 2026: all five requested cases worked on ASUS laptop, with a supplied paused-race laptop screenshot. Exact browser/OS/keyboard versions and event traces were not supplied; physical iOS/tablet and broader performance remain TT-1008/Phase 10.

- [x] TT-405: Apply user-requested race reading order: status/metrics above track, then passage and typing field directly below. Also contain the canvas inside its aspect-ratio parent so compacting the screen does not retain the old intrinsic canvas height. CPU schedules, rules and exercise lengths are unchanged. See docs/TESTING.md for verification.

## Phase 5 — racing polish

- [ ] TT-501: Initial art implementation exists, but visual acceptance was rejected on 21 October; redo the vehicle direction through TT-507/510. Produce an original art bible with modern sports cars (replace the temporary retro coupe) and detailed vehicle parts/wheels/shadows/suspension/exhaust, keeping editable sources and provenance.
- [ ] TT-502: Initial scene implementation exists, but its boxed composition was rejected on 21 October; complete TT-508/511. Build the polished city track, layered parallax, relative camera framing, offscreen indicators and approaching finish gate. Capture the user's visual direction: an immersive wider composition with useful side scenery/information and coordinated cinematic motion, replacing the current boxed foundation layout; responsive phones remain compact.
- [x] TT-503: Add bounded nitro, streaks, overtaking callouts, speed trails, finish celebration and reduced-motion/quality variants; keep passage readable.
- [x] TT-504: Create or license menu/race music, optional intensity stems, engine/UI effects and finish cues; record rights, sources, loop points and export settings.
Initial implementation evidence for TT-501–504 (not final visual acceptance; TT-501/502 reopened): editable vehicle generator and three original SVGs; src/game/race-track.ts/race-view.ts; source-authored Harbor Circuit menu/race score and cues; ART_BIBLE.md/AUDIO.md/ADR 0005; 83 unit and 66 browser checks plus inspected desktop/phone/reduced captures. Implementation `cdd8e4a`, [PR #4](https://github.com/sahilshah2904/TurboType/pull/4), hosted Linux [run 39451394088](https://github.com/sahilshah2904/TurboType/actions/runs/39451394088) passed. Optional intensity stems are not required or implemented.

- [ ] TT-505: Remembered audio controls, gesture unlock, short source/gain fades, pause/retry cleanup and graceful failure are implemented/tested. Isolated software-renderer profiling including 4× CPU throttle is recorded in docs/PERFORMANCE.md. Remaining: actual lower-powered-device/ASUS/Samsung sound and performance evidence coordinated with TT-506. Do not close from emulation alone.
- [ ] TT-506: Available-device Phase 5 acceptance: review modern car/art direction, full/low/reduced effects, active-caret/keyboard space, audible menu/race/cues/volume and pause/tab/retry cleanup on ASUS/Samsung. Record model/browser/OS/settings and real smoothness/frame evidence where possible. Use docs/PHASE5_POLISH_TESTS.md. Run this acceptance after the required TT-507–513 redesign, with a revised checklist. New effects/audio were not covered by Phase 4 user acceptance; broad iOS/tablet/performance remains release work.

Required redesign added after review of recordings 2–4 and user rejection of current visuals/input, 21 October 2026. [Detailed evidence and proposal](docs/RACE_REDESIGN.md). The following tasks track required redesign. Alpha.5 now integrates the accepted direction into the normal app; tasks distinguish implementation from pending device verification.

- [x] TT-507: User approved the full-window kart design on 21 October ("yes this design is very good"). Playable desktop/phone review artifact, car concept, prompt/provenance and captures are in docs/design/race-direction. Requested moving exhaust is implemented/checked in the prototype. This is direction approval only: normal Race integration, distinct fleet and physical-device acceptance remain TT-508–513/505/506.
- [ ] TT-508: Alpha.5 implementation is in the normal Race route; final responsive/device verification pending. Implement edge-to-edge active racing without outer card, fixed width cap, page gutters or large navigation/footer. Move setup/secondary controls to pre-race/pause screens, use a compact upper HUD, and support optional user-initiated fullscreen with harmless refusal.
- [ ] TT-509: Alpha.5 Race/Practice now have one visible native-input-backed strip; automated regressions and actual laptop keyboard acceptance must be recorded. Replace separate passage/answer box with one visible integrated typing strip backed by a real accessible native input. Preserve correction, prediction/composition policy, focus, pause, timing, larger text and laptop keyboard behavior; verify before expanding effects.
- [ ] TT-510: Produce and review a distinctly improved original/appropriately licensed vehicle fleet with consistent proportions, depth/shading, glass, wheels/lights/shadows and editable source/export/anchor/provenance records. Prefer a prerendered 2.5D pipeline after concept review; no final assets/pipeline selected yet.
- [ ] TT-511: Alpha.9 retains responsive Phaser RESIZE, truthful relative CPU framing and full-course reduced motion for supported laptop windows; OS-keyboard VisualViewport/phone layouts were removed by scope change. Automated 1024–1920 resize checks pass. Finish real laptop zoom/window/readability and smoothness validation without stretched karts or hidden text.
- [ ] TT-512: Alpha.5 moving exhaust, spoke overlays, suspension, bounded sparks/confetti and live WPM dial implemented; actual-device sound/frame/texture acceptance remains. Refine speed/streak/overtaking/exhaust/audio/finish choreography around the accepted composition; preserve reduced-motion/low-effects and independent engine outcomes. Validate texture/source cleanup and actual-device responsiveness.
- [ ] TT-513: Refresh regression checks, physical-device checklist, measured evidence, screenshots and public README after redesign. Obtain explicit visual/device acceptance before closing Phase 5/merging PR #4; previous 83/66 tests do not verify the replacement.

- [x] TT-514: Retired by explicit user request on 21 October: alpha.8 removes the production personal-music chooser, loader and its tests. This closes the deferred personal-file scope by cancellation, not by claiming Misirlou playback or licensing verification. The normal app uses original bundled masters only.

- [ ] TT-515: Live WPM speedometer implemented in Race/Practice (existing rolling three-active-second pace; average WPM remains separate; 0–160 needle with uncapped numeric reading, pause/result freeze and retry reset). Record new browser evidence and ASUS/Samsung readability/performance acceptance before closing.

- [x] TT-516: Apply the user-requested red-and-black theme across existing app pages, Phaser race/preview, player kart and Live WPM dial. Alpha.6 reuses original art with one-time palette baking; amber underlined errors remain distinct. Formatting/types/build and 18 focused Chromium cases pass; recreation and scripted desktop/phone captures are in docs/IMMERSIVE_APP.md. Actual-device visual acceptance remains TT-506/513, not certified by this task.

- [x] TT-517: Remove hub preview side gutters with Phaser RESIZE, full-width scenery redraw and uniform kart scaling. Wide/phone resize and cleanup regressions pass; implementation/recreation in docs/IMMERSIVE_APP.md.

- [ ] TT-518: Dedicated countdown pulse/rising 3–2–1 cues remain implemented. The user rejected the old menu/race mix; alpha.8 replaces it with distinct rendered Nightforge/Overdrive originals. Complete ASUS/Samsung listening and volume-balance acceptance with TT-505/506.

- [ ] TT-519: Alpha.9 red/gold theme and upbeat Ignition menu master replace rejected alpha.8 choices. Overdrive is user-accepted and byte-identical. Technical evidence in docs/TESTING.md; finish laptop audiovisual/loop/mix and audio decode/transfer/memory evidence with TT-505/506/513. Phase 5 remains open.

Alpha.5 integration evidence: source `2a2c11b`, PR #4, full local check 83 unit / 72 browser passed, hosted Linux [run 39519820938](https://github.com/sahilshah2904/TurboType/actions/runs/39519820938) passed, all existing routes captured and isolated renderer profile recorded in docs/PERFORMANCE_ALPHA5.md. TT-508/509/511/512/515 and TT-604 implementations are automatically verified; their remaining physical-device/visual gates are not closed by that evidence.

- [ ] TT-520: Alpha.9 laptop-only scope and red/gold/bright-menu update implemented; verify 1024–1920 laptop windows and latest color/music on ASUS. Overdrive is byte-identical to the user-accepted alpha.8 track. Mobile cursor/composition symptom reported by user is retired with phone support, not claimed fixed. Typing and pause/resume/retry checks accepted by user report; final performance/art gates remain.

- [x] TT-521: Restore the previous alpha.8 graphite/crimson/cyan palette in alpha.10 at the user's request. Keep laptop-only layouts and current music; alpha.9 red/gold styling is rejected. Relevant checks/captures are in docs/TESTING.md.

## Phase 6 — entrance and onboarding

- [ ] TT-601: Build original cinematic loading panels, real asset status, optional skip/replay, returning-user shortcut and failed-load recovery.
- [ ] TT-602: Build welcome/rules, interactive correction/streak tutorial, optional calibration and animated hub.
- [ ] TT-603: Complete responsive setup/briefing/settings/results navigation with mouse, physical-keyboard and accessibility support; test first and returning visits. Present passage/pace/mode naturally for Quick Race, use level-defined campaign setup, and move seed into Advanced/Replay settings for the final player flow.

- [ ] TT-604: Apply the accepted immersive visual language across existing hub, practice, keyboard check, settings and pre-race navigation: full-window background, no enclosing page card/unused gutters, readable responsive content and accessible focus/zoom/reduced-motion. Hub becomes a garage/city scene; practice keeps one visible typing surface; settings use a clear overlay/dedicated full-window view. Alpha.5 now revamps all those existing routes, including integrated Practice typing and the kart hub; final responsive/device verification remains. New tutorial/welcome flows are not included. Maps are TT-701–704, race/results TT-508–513, and final garage/progress views belong to Phase 9.

## Phase 7 — campaign maps

- [ ] TT-701: Implement category selection and three rightward winding maps with 100 numbered circular main nodes each, chapter districts and bonus branches.
- [ ] TT-702: Implement locked/current/available/completed states, sequential category-isolated unlocks, stars, unlock animations and level briefing.
- [ ] TT-703: Implement saved map position, Continue/Jump to Current, chapter jump, swipe/drag, keyboard navigation and accessible list view; test narrow screens and reduced motion.
- [ ] TT-704: Lazy-load scenery/previews and avoid running scenes/animations for every future level.

## Phase 8 — all 300 levels

- [ ] TT-801: Define and validate campaign/passage schemas, stable IDs/revisions, all prerequisites, rewards and referenced assets.
- [ ] TT-802: Author/review Easy 001–100 across ten chapters with explicit learning objectives and gradual difficulty.
- [ ] TT-803: Author/review Medium 001–100 across ten chapters with explicit learning objectives and gradual difficulty.
- [ ] TT-804: Author/review Hard 001–100 across ten chapters with explicit learning objectives and gradual difficulty.
- [ ] TT-805: Author chapter showcases, optional side challenges, milestones and finale content; no locked placeholder levels counted as complete.
- [ ] TT-806: Validate all 300 definitions, duplicates/references/reachability, boundaries 9→10→11 and 99→100, and no level 101; playtest representative levels and every introduced skill.

## Phase 9 — progression, learning and persistent data

- [ ] TT-901: Implement stars, first-clear unlocks, Driver Rank, exact reward formulas, pit stops, trophies, caches, perfect/recovery awards and one-time receipts.
- [ ] TT-902: Build garage ownership/equipment/previews and fixed cosmetic rewards; verify no speed advantages and no duplicate claims.
- [ ] TT-903: Build bounded local saves, migrations, backup export/import, malformed-save recovery, quota failure and multiple-tab protection.
- [ ] TT-904: Add comparable personal records, recent-history/pace charts, bounded learning aggregates and one evidence-based coaching suggestion.
- [ ] TT-905: Implement correction/capitalization/punctuation/consistency drills and optional keyboard guidance; separate practice from competitive eligibility.
- [ ] TT-906: Validate/select the cloud provider before integration (Supabase Auth/Postgres is proposed); review limits/costs, region, ownership, recovery and static-site auth callbacks. Dependency: TT-205 and stable completed-run contracts.
- [ ] TT-907: Provision/configure the selected service when authorized/accessible; commit database migrations, test fixtures, access policies and reproducible setup docs without secrets.
- [ ] TT-908: Add optional permanent sign-in, guest-to-account import preview, account switching isolation and cross-device profile/progress.
- [ ] TT-909: Implement pending/synced/failed states, idempotent submissions, server-applied reward transactions, conflict handling, bounded queues and local fallback.
- [ ] TT-910: Test separate-account access isolation, duplicate/offline retries, cross-device conflicts, untrusted imported/solo records, export/deletion and backup/recovery; document actual guarantees.

TT-906/907 may start earlier once contracts stabilize; cloud progress remains a single-player launch requirement, not work postponed until multiplayer.

## Phase 10 — single-player release

- [ ] TT-1001: Test supported laptop/desktop browsers and physical keyboards, standard laptop resolutions, browser zoom/window resize and accessibility; record actual hardware/browser coverage. Mobile/tablet support is canceled.
- [ ] TT-1002: Verify accessibility, mouse/focus behavior, input-profile record separation, reduced motion, audio failures and loading/recovery paths.
- [ ] TT-1003: Measure frame times, typing responsiveness, transfer size and repeated-retry memory/cleanup with named devices/settings; tune bottlenecks.
- [ ] TT-1004: Configure Pages deployment/CI and repository protections where supported; validate the public bundle contains no secrets and all project-base paths work.
- [ ] TT-1005: Verify account/cloud sync, outages and data policies; make game-data export/deletion and local-save limitations clear.
- [ ] TT-1006: Reproduce clean-clone setup, complete docs/assets registry/release notes, tag a tested release and document deployment rollback plus save compatibility.
- [ ] TT-1007: Verify the actual public game link with a complete race, replay, level unlock and saved progress before calling the launch complete.
- [x] TT-1008: Retired by explicit user scope change on 21 October. Physical phone/tablet/iOS software-keyboard verification is no longer a release requirement. Earlier Samsung observations remain historical, not current compatibility claims.

## Phase 11 — friends multiplayer, immediately after solo launch

- [ ] TT-1101: Prototype/select the authoritative realtime service, reusing existing identity/data contracts; validate hosting, connection limits/costs and deployment requirements. Colyseus is a candidate, not a selected service.
- [ ] TT-1102: Define room/match message schemas, server-owned passage/rules/start clock, sequenced progress updates, validation, finish ordering and result persistence.
- [ ] TT-1103: Implement private-room creation, invitation URLs, join/ready checks, host start, player names and room expiry.
- [ ] TT-1104: Implement interpolated live opponents, online pause policy, input-profile/mixed-device rules, finish/results and rematch.
- [ ] TT-1105: Add disconnect/reconnect/timeout/host-departure policies, connection recovery and clear error states.
- [ ] TT-1106: Test multiple real clients, varied latency and duplicates, account/room isolation and finalized rewards; keep client-run solo records distinct from authoritative online results.
- [ ] TT-1107: Deploy and document the backend/database migrations, operational monitoring/recovery and costs; verify invitations through the Pages link without regressing solo guest play.

## Optional ideas — deferred, not launch commitments

- [ ] TT-1201: Best-run ghost/replay racing using versioned, bounded recordings; assess storage before adoption.
- [ ] TT-1202: Deterministic daily passages/challenges; decide local versus shared rankings and abuse validation before enabling online scores.
- [ ] TT-1203: More authored tracks/weather/vehicles after the core art and performance budgets are proven.
- [ ] TT-1204: Animated pit-crew mascot or authored Rive/Lottie badges, only if asset quality and measured runtime cost justify another dependency.
- [ ] TT-1205: Fuller offline/PWA installation support, distinct from continuing an already-loaded solo session during a cloud outage.
- [ ] TT-1206: Broader language/input support with grapheme-aware content, composition behavior and fair scoring defined first.

These ideas are captured from research/future possibilities and do not expand the required scope until deliberately selected. Public matchmaking and global leaderboards are not currently promised features; if requested, create explicit scoped tasks and backend validation requirements rather than treating them as implicit in private-room multiplayer.

## External dependencies and open decisions

- Real-device test access must be recorded; emulator-only checks cannot be presented as physical-device coverage.
- Cloud account/project configuration and provider choice are pending. Do not claim a database, email sign-in, backups, budget, or free unlimited service exists now.
- Final package versions, curriculum balance, art/music, provider costs and measured performance await their implementation milestones.
- New bugs, deferred improvements, missing assets and follow-up migrations discovered during implementation must receive task IDs here or links to explicit repository issues; this file remains the entry point.

## Supporting specifications

- [Game design](GAME_DESIGN_PLAN.md)
- [Rule/reward/storage baseline](docs/RULES_AND_STORAGE_BASELINE.md)
- [Responsive and online architecture](docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md)
- [Research](IMPLEMENTATION_RESEARCH.md)
- [Reference video analysis](docs/REFERENCE_VIDEO_ANALYSIS.md)
- [Engineering conventions](docs/ENGINEERING_CONVENTIONS.md)
- [GitHub workflow](docs/GITHUB_WORKFLOW.md)
