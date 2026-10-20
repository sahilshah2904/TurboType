# TurboType future work backlog

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

Evidence for TT-401–403: `src/core/cpu-schedule.ts`, `solo-race.ts`, `src/ui/quick-race.ts`, `src/game/race-track.ts`, documented rules/recreation and ADR 0004; local `npm run check` passes with 69 unit tests and 54 Chromium profile checks on `feat/solo-race`. User acceptance of the new race is separately TT-404.

- [ ] TT-404: Verify the implemented Quick Race on the available ASUS laptop/Samsung S25 Ultra: start/actual vehicle progress, correction while CPUs continue, all-lane pause/navigation preservation, keyboard space/rotation, frozen results/simulation labels and retry. Follow docs/PHASE4_RACE_TESTS.md. Required for Phase 4 user acceptance; physical iOS/tablet and broader performance remain TT-1008/Phase 10.

## Phase 5 — racing polish

- [ ] TT-501: Produce an original art bible with modern sports cars (replace the temporary retro coupe) and detailed vehicle parts/wheels/shadows/suspension/exhaust, keeping editable sources and provenance.
- [ ] TT-502: Build the polished city track, layered parallax, relative camera framing, offscreen indicators and approaching finish gate. Capture the user's visual direction: an immersive wider composition with useful side scenery/information and coordinated cinematic motion, replacing the current boxed foundation layout; responsive phones remain compact.
- [ ] TT-503: Add bounded nitro, streaks, overtaking callouts, speed trails, finish celebration and reduced-motion/quality variants; keep passage readable.
- [ ] TT-504: Create or license menu/race music, optional intensity stems, engine/UI effects and finish cues; record rights, sources, loop points and export settings.
- [ ] TT-505: Implement remembered audio controls, gesture unlock, smooth transitions, pause/retry cleanup and graceful audio failure; profile effects on lower-powered devices.

## Phase 6 — entrance and onboarding

- [ ] TT-601: Build original cinematic loading panels, real asset status, optional skip/replay, returning-user shortcut and failed-load recovery.
- [ ] TT-602: Build welcome/rules, interactive correction/streak tutorial, optional calibration and animated hub.
- [ ] TT-603: Complete responsive setup/briefing/settings/results navigation with touch, keyboard and accessibility support; test first and returning visits.

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

- [ ] TT-1001: Test representative real Android/iOS phones, tablets/iPads and laptops, software/hardware input, rotation/resize, browser chrome and supported browsers; publish actual coverage/limitations.
- [ ] TT-1002: Verify accessibility, touch/focus behavior, input-profile record separation, reduced motion, audio failures and loading/recovery paths.
- [ ] TT-1003: Measure frame times, typing responsiveness, transfer size and repeated-retry memory/cleanup with named devices/settings; tune bottlenecks.
- [ ] TT-1004: Configure Pages deployment/CI and repository protections where supported; validate the public bundle contains no secrets and all project-base paths work.
- [ ] TT-1005: Verify account/cloud sync, outages and data policies; make game-data export/deletion and local-save limitations clear.
- [ ] TT-1006: Reproduce clean-clone setup, complete docs/assets registry/release notes, tag a tested release and document deployment rollback plus save compatibility.
- [ ] TT-1007: Verify the actual public game link with a complete race, replay, level unlock and saved progress before calling the launch complete.
- [ ] TT-1008: Deferred from TT-204 on 20 October 2026 because the user has no iPhone/tablet: obtain representative physical iPhone/Safari and tablet/iPad keyboard/viewport/orientation coverage before claiming broad mobile release support. Record browser/OS/model/keyboard versions for available ASUS/Samsung tests, fill missing composition/safe-area cases, and publish actual coverage/remaining limits. Device access is an external dependency; emulation alone cannot close this task. Coordinate with TT-1001 rather than duplicating its tests.

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
