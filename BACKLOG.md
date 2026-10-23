# TurboType future work backlog

## Keyboard correction follow-up — alpha.23, 23 October 2026

- [x] TT-308: Share race correction/input validation in Keyboard check, retaining immediate untimed use and independent physical-key coverage. Verification below.

The user reports all alpha.22 changes work well and requests race-style correction in Keyboard check. The check now shares TypingEngine and connectRaceInput with races: one incorrect character blocks further text until Backspace, exact case/symbols, append-only edits, paste/drop/replacement blocking and committed IME normalization. The sample highlights correct/current/error positions; the next physical-key hint stays on the expected character. Clear text starts a fresh sample while preserving detected keys; Reset key check clears both. Physical-key indicators still record received keys even when their text is rejected. No timer/score is displayed, nothing is saved or awarded. A validated countdownMs=0 option starts this diagnostic immediately; all races retain the default three-second countdown and existing rules/save/content versions.

Alpha.22 source 31b2709 passed exact-head hosted run 39879309550 (check job 120172557695); this was verified again before changes. Fresh alpha.23 full local check passes 118 unit/80 browser cases; sequential 1024px capture has zero page errors. Its own hosted check remains pending; docs/TESTING.md records evidence. Keep the current PR #7 branch; no merge, deployment or Phase 8 start. Earlier free-editing/paste-allowed keyboard descriptions are historical and superseded.


## Alpha.22 review corrections — 23 October 2026

The user accepted campaign unlock/refresh, replay deduplication and pause/practice-only/eligible retry. Remaining feedback: top-align each new wrapped line with three visible look-ahead lines, clarify standalone Quick Race, expand physical keyboard/sample coverage and keep opening fire trailing the car without crossing the name. Implemented for review on the existing PR #7 branch; see [alpha.22 behavior and focused checklist](docs/ALPHA22_REVIEW.md). Broader atmosphere polish remains deferred. Do not merge/start Phase 8 solely from this note.

Prior hosted head 1c94952 failed (run 39812462848): unit tests passed but browser contexts/timeouts failed across many unrelated screens. CI now uses one software-rendered browser worker with all cases/timeouts/retries intact; inspect the new exact-head result before claiming success. Fresh full local verification passes 117 unit/79 browser cases with one worker; evidence and captures are in docs/TESTING.md and docs/images/alpha22.


- [x] TT-706: Top-align active wrapped typing lines with three full look-ahead rows, including Backspace across wraps, across race/practice/learning. User visual review pending.
- [x] TT-307: Expand keyboard sample to all printable English characters and independently show received common physical typing/editing/modifier keys; preserve paste/editing/IME diagnostics and honest limits.
- [x] TT-405: Clarify standalone Quick Race purpose and label without changing CPU/session/campaign rules.
- [x] TT-609: Bound opening fire to the moving car with a following gap/fade and a smaller title-underlay accent; no fire ahead or full road ribbon across the name. Specific requested correction, not closure of deferred TT-608.

## Phase 7 map delivery — alpha.21, 22 October 2026

TT-701–704 and TT-705's map/briefing starter-inventory portion are implemented for review. Fresh full local check: **116 unit / 73 browser cases**; hosted exact-head state is recorded separately in docs/TESTING.md. Three 100-stop maps have eighteen real sample races (six/category), with substantial paragraphs at levels4–6. Levels7–100 and bonuses remain unavailable content previews until Phase8 authoring; never count them as playable. Review/integration are separate. Current specification/checklist: docs/PHASE7_CAMPAIGN_MAPS.md.

Phase9 still owns earned inventory binding and canonical save migration/economy/receipts/import/recovery/cloud. Basic local map progress is implemented now, not the complete guest-save system. TT-608 remains deferred. Earlier status notes below are historical; the latest checkpoint takes precedence.


## Phase 6 closed — 22 October 2026

TT-601–607 are complete for agreed Phase 6 scope and integrated through PR #6 after exact-head hosted checks and fresh 102-unit/56-browser local verification. User authorized closure while explicitly deferring further appearance iteration. TT-608 remains a later visual-polish follow-up. See docs/PHASE6_CLOSEOUT.md for source/merge/check evidence. No Phase 7 implementation or deployment starts from this note. Older pending-merge sections are historical.

## Visual polish deferred by the user — 22 October 2026

- [ ] TT-608: Revisit race atmosphere visibility/quality and opening cinematic polish later. The user cannot perceive the new haze/air, accepts keeping the current baseline for now, and explicitly defers more visual work. Diagnose on the actual rendered scene/settings with the user before claiming success; scene-object counts are not visibility or aesthetic acceptance. Include sky/mountain/road depth, maintain readable typing and quality/motion fallbacks. Schedule after campaign groundwork or a later requested polish pass; this does not reopen accepted Phase 5 hardware work or block current Phase 6 functionality. No extra implementation is authorized by this status request.

Phase 6 implementation is complete for the current functional scope; PR #6 review/exact-head CI/integration remain pending. Do not merge or start Phase 7 solely from this status note. All future maps/content/reward/cloud/release/private-room tasks below remain pending.

## Requested atmosphere and navigation refinement — alpha.20

- [x] TT-607: Replace rejected curved road air lines with a researched layered atmosphere across sky/mountains/horizon/road, retain readable foreground and motion/quality controls; align shared action links including Skip to hub. Implemented in PR #6; full local check passes 102 unit / 56 browser cases; final evidence in docs/TESTING.md, user appearance acceptance pending. TT-911 now explicitly includes monster trucks, hoverboards, flying cars and varied original vehicle structures; future renderer/art/ownership work stays Phase 8/9. IDs/milestones/totals are unchanged.

## Purple-car opening refinement — alpha.19

- [x] TT-606: Requested purple-car arrival/brake/burnout/short reverse/rightward launch with blazing road trails and animated fire around the revealed game title. Implemented in existing PR #6 with original parts and SVG fire; full check passes 102 unit / 55 browser cases, with final CSS/capture evidence in docs/TESTING.md. User acceptance/integration remain pending. Fixed cinematic car never overwrites the selected racing car.

## Requested Phase 6 refinement — alpha.18

- [x] TT-605: User requested full-window 5.6-second title animation, richer bounded race airflow, removal of Hub preview labels and setting-row learning actions. Implemented on the existing PR #6; full local check passes 102 unit / 52 browser cases; final validation/captures in docs/TESTING.md. User visual acceptance remains pending. This refines TT-601/604 and TT-505/530 presentation without starting maps or changing race rules.

## Phase 6 implementation checkpoint — 22 October 2026

TT-601–604 are implemented in alpha.17, source 3bac5e7 / open PR #6; final local check passes 102 unit / 50 browser cases. Their source, behavior, recovery and verification map is [docs/PHASE6_ONBOARDING.md](docs/PHASE6_ONBOARDING.md); human review is [docs/PHASE6_REVIEW.md](docs/PHASE6_REVIEW.md). Checked boxes record implemented/tested scope, not user acceptance, integration or deployment. Final check evidence belongs in docs/TESTING.md. Campaign-specific briefing remains TT-701–704; current Quick Race has natural choices and a closed Advanced / Replay seed panel. TT-531 starter tracks are now user-accepted and integrated through PR #5. Phase 6 visual/interaction acceptance remains pending. Historical progress statements below do not override this checkpoint.

## Private multiplayer and zero-cost scope — 22 October 2026

User requests rooms for up to **10 human players including host**, for up to 100 approved friends/relatives, with a **$0/free-tier-only** budget. Plan: Multiplayer → Create room / Join room by code → host chooses an owned track and shared passage preset → each player chooses an owned car → everyone including host clicks I'm ready → host starts a synchronized race. Host/roster/configuration changes invalidate readiness; server validates admission, readiness, progress and results. No single-player pause online; reconnect/host-transfer/rematch policies are in docs/MULTIPLAYER_ROOMS.md.

The initial free-capacity interpretation is at most ten active racers across the project, also ten per room. Host track is temporarily shared for that match without granting ownership; multiplayer does not generate campaign unlock progress. GitHub Pages plus **Supabase Free is the preferred architecture to validate**, not provisioned infrastructure or a promise of unlimited service. Prefer approved social login, private channels, bounded shared snapshots and quota controls; no paid services, SMTP/SMS, add-ons or automatic upgrades. Pause/restrict online features when free capacity is unavailable and preserve local solo. Phase 9 owns identity/saves and the free-only provider gate; Phase 11 owns rooms/races after solo launch. This request updates plans only; no new runtime feature, account, deployment, merge or app-version bump. Cars/tracks keep their staggered milestone plan (23 cars / 26 tracks).


## Latest reward schedule correction — 22 October 2026

Latest reward schedule correction (22 October 2026): cars unlock at **15/30/45/60/75/90** eligible unique main clears within each category (6 × 3 = 18 rewards; **23 cars total** with starters). Tracks unlock independently at **10/25/40/55/70/85/100** (7 × 3 = 21 rewards; **26 tracks total** with starters). This supersedes the paired-unlock plan: car and track rewards are staggered and have separate receipts/IDs. Any owned car or track remains usable across Easy/Medium/Hard on already-unlocked levels and replays; replays cannot inflate earning counters or unlock levels. Phase 7 briefing/replay selection, Phase 8 content and Phase 9 independent ownership/saves remain the delivery plan. Five starter tracks are implemented; future reward unlocks are not. See docs/TRACK_PROGRESSION.md.

## Alpha.15 requested presentation follow-up — 22 October 2026

- [x] TT-529: Simplify final Race results to place, average WPM, accuracy and time; show completion for DNFs and retain accurate CPU outcomes in an optional disclosure. Alpha.15 implemented/tested; user accepts the presentation on 22 October, with alpha.16 expanded-standings refinement. Current regression evidence: 98 unit / 40 browser cases; docs/TESTING.md.
- [x] TT-530: Give the shared Live WPM dial an original blazing SVG background, richer instrument face and protected large readout. Keep speed/scoring semantics; stop flame animation for pause/finish, Low effects and Reduced motion. Alpha.15 implemented/tested; user accepts the presentation on 22 October, with alpha.16 expanded-standings refinement. Current regression evidence: 98 unit / 40 browser cases; docs/TESTING.md.

These are authorized follow-ups to the accepted Phase 5 baseline, not reopening its hardware gates or implementing Phase 6 onboarding. Review at the existing LAN URL before merge; source stays on codex/results-and-fire-dial pending acceptance. Reward correction remains six per category (15/30/45/60/75/90), eighteen total; no reward implementation is added.

## Phase 5 complete and integrated — 22 October 2026

The user reported “I believe everything worked fine” after the final physical checklist. Reviewed recorder evidence: 120-second hardware-accelerated session, 100 trusted racing keys, 99 trusted inputs, zero page errors, median/p95/max handler-to-next-rAF 9.3/18.8/22.2ms. This is a bounded input diagnostic and available-laptop acceptance, not universal performance certification. TT-506/511/512/513/522 are closed for the agreed Phase 5 scope; broader release testing stays in Phase 10. All Phase 5 backlog items are now complete, including explicitly canceled scope. [PR #4](https://github.com/sahilshah2904/TurboType/pull/4) merged into main as `de464ce` after exact acceptance-head `398d455` passed hosted run [39727202033](https://github.com/sahilshah2904/TurboType/actions/runs/39727202033). The local checkout is now main. This post-merge documentation update has its own main-push check; inspect actual HEAD/checks. See [closeout](docs/PHASE5_CLOSEOUT.md). No Phase 6 implementation or deployment started. Older pending-acceptance paragraphs below are historical.


## Historical pre-integration checkpoint — 22 October 2026

Implementation `2eadeef`, identical-tree README history sync `d168720`, hosted PR [run 39725624773](https://github.com/sahilshah2904/TurboType/actions/runs/39725624773) successful for exact d168720 head. See docs/TESTING.md for why the earlier conflicting head had no PR run. Completed alpha.14 feature tasks below have this shared source/check evidence; remaining physical/integration IDs are still open. This follow-up documentation receives its own CI and does not merge PR #4.

The user authorized finishing Phase 5. Alpha.14 implements independent body/wheel assets and chassis suspension for all five accepted models, compact shared previews and actual-GPU profiling tools. Full local checks pass: 96 unit / 36 browser cases. See [Phase 5 closeout](docs/PHASE5_CLOSEOUT.md) for current evidence and the remaining physical-input acceptance/integration gate. PR #4 stays open until that gate is reviewed; no deployment. Older stop-and-save/artwork-pending sections below are historical.

**Reward correction:** 100 levels per category; a distinct car at 15/30/45/60/75/90 eligible main clears independently in Easy/Medium/Hard. Eighteen rewards plus five starters replace the ten-car aggregate curve. See docs/GARAGE_PROGRESSION.md. No unlock implementation is claimed.


## Pre-implementation audit — 22 October 2026 (superseded by active work above)

This section supersedes stale current-state/acceptance wording in historical task descriptions below; stable IDs and completion boxes are preserved. Current app is alpha.13, implementation b76392b, audited branch head 2eebd92. PR #4 remains open/unmerged; exact-head hosted run 39584421655 passed. Main d86d046 is the README-only publication; its push run 39584487911 passed separately.

| Remaining Phase 5 group | Task IDs | What remains |
| --- | --- | --- |
| Component artwork | TT-501/510 | Separate body and wheel sources, independent wheel animation and suspension/anchors; inspect finished parts in race/hub and record cost. Preserve accepted silhouettes/colors. |
| Hardware performance and resources | TT-505/506/511/512/519/522 | Actual supported laptop/browser/GPU/settings, physical typing with a hardware-accelerated trace, Full/Low/Reduced comparisons, longer race/retry/navigation sessions, audio decode/transfer/resource cleanup and tuning based on observed bottlenecks. Earlier subjective acceptance and alpha.11 software profiling do not certify this. |
| Final reconciliation/integration | TT-502/508/509/513/515/518/520 | Accepted city/full-window scene, typing strip, gauge, palette and music are implemented with evidence; reconcile each task against current acceptance, check final parts/mix/layout/regressions, refresh evidence and review/integrate PR #4 when Phase 5 gates are met. No repeat blanket approval of accepted cars/music/colors/basic functions. |

Unchecked overlapping tasks are not separate unbuilt features. TT-523 is historical: its paused-switch rule is superseded by TT-525. Mobile references in older task wording are retired by the explicit laptop/desktop scope decision; TT-514 and TT-1008 are closed by cancellation. Alpha.13 car-lock/fullscreen/readability have automated evidence; do not invent a new user report. This audit closes no unchecked task.

Future required work remains TT-601–604 (opening/onboarding, with existing-page visuals partially implemented), TT-701–704 (three campaign maps), TT-801–806 (300 reviewed levels), TT-901–911 (progression/learning/guest saves, optional account-backed cloud progress and category-specific reward cars), TT-1001–1007 (desktop solo release) and TT-1101–1107 (friends multiplayer after solo launch). Cloud-provider selection/configuration remains pending; sign-in is optional for players, with cloud capability planned before solo launch. TT-911 milestones are superseded by the 22 October category-specific correction; receipt rules remain and do not block Phase 5. TT-1201–1206 remain optional; public matchmaking/global leaderboards are not commitments.

Handoff saved 21 October 2026: [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md) maps the current implementation and all future phases. Phase 5 still requires separate wheel/body parts and measured hardware performance/final integration; the current visible features/tests do not close those gates. Current art/music approvals and functional acceptance must not be repeatedly requested. Continue later from feat/race-polish, not a new phase merely because the README was refreshed.

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

- [x] TT-501: Original art bible/provenance and independent chassis/wheel assets completed in alpha.14, preserving the accepted five silhouettes. Wheel-free PNG masters, editable original SVG wheels, shared anchors and reproducible exports are in assets-source/karts/parts and scripts/export-kart-parts.mjs. Final physical new-parts acceptance remains TT-506/513, not a repeat palette review.
- [x] TT-502: Accepted full-window city track, parallax, relative camera, offscreen indicators and approaching finish are implemented and covered by current regressions/captures. Historical boxed/mobile redesign wording is superseded. Final physical responsiveness remains TT-506/511/512/513/522.
- [x] TT-503: Add bounded nitro, streaks, overtaking callouts, speed trails, finish celebration and reduced-motion/quality variants; keep passage readable.
- [x] TT-504: Create or license menu/race music, optional intensity stems, engine/UI effects and finish cues; record rights, sources, loop points and export settings.
Initial implementation evidence for TT-501–504 (not final visual acceptance; TT-501/502 reopened): editable vehicle generator and three original SVGs; src/game/race-track.ts/race-view.ts; source-authored Harbor Circuit menu/race score and cues; ART_BIBLE.md/AUDIO.md/ADR 0005; 83 unit and 66 browser checks plus inspected desktop/phone/reduced captures. Implementation `cdd8e4a`, [PR #4](https://github.com/sahilshah2904/TurboType/pull/4), hosted Linux [run 39451394088](https://github.com/sahilshah2904/TurboType/actions/runs/39451394088) passed. Optional intensity stems are not required or implemented.

- [x] TT-505: Audio controls/gesture unlock/fades/failure and lifecycle are implemented/tested, accepted masters are unchanged, and alpha.14 adds actual-GPU decode/resource/12-cycle cleanup evidence in PERFORMANCE_ALPHA14.md. Physical typing/perceptual follow-up is explicitly TT-506/522; total GPU/native-memory certification is not claimed.
- [x] TT-506: Final alpha.14 physical laptop check accepted on 22 October 2026. User reported “I believe everything worked fine.” Two-minute recorder: 100 trusted racing keys, 99 trusted inputs, zero page errors, accelerated AMD Direct3D11; Ready/Countdown/Racing/Paused/Finished and all five routes observed. See docs/performance/alpha14-physical-input.json and docs/TESTING.md. Prior palette/music/silhouette approvals are preserved; broader release coverage remains Phase 10.

Required redesign added after review of recordings 2–4 and user rejection of current visuals/input, 21 October 2026. [Detailed evidence and proposal](docs/RACE_REDESIGN.md). The following tasks track required redesign. Alpha.5 now integrates the accepted direction into the normal app; tasks distinguish implementation from pending device verification.

- [x] TT-507: User approved the full-window kart design on 21 October ("yes this design is very good"). Playable desktop/phone review artifact, car concept, prompt/provenance and captures are in docs/design/race-direction. Requested moving exhaust is implemented/checked in the prototype. This is direction approval only: normal Race integration, distinct fleet and physical-device acceptance remain TT-508–513/505/506.
- [x] TT-508: Full-window Race/HUD/control deck and harmless shared fullscreen are implemented and regression-tested on supported laptop layouts. Current evidence: 96 unit/36 browser cases, alpha.14 captures and TESTING.md. Physical final acceptance remains TT-506/513; no phone scope.
- [x] TT-509: Single visible native-backed Race/Practice strip, correction/composition/focus/pause/timing/large text are implemented with automated regression and prior available-laptop functional acceptance. Fresh physical responsiveness with the new parts remains TT-506/522.
- [x] TT-510: Alpha.14 completes the five accepted distinct models with separate wheel-free chassis, independently rotating original wheels, chassis-only suspension and shared race/hub/preview anchors. Sources/prompts/export pipeline and visual evidence are in KART_FLEET.md, assets-source/karts/parts and docs/images/alpha14. New-parts physical acceptance remains TT-506/513.
- [x] TT-511: Supported laptop layout/framing/readability work accepted with the final user report, existing available-laptop acceptance and fresh automated/capture evidence at 1024/1366/1440/1920. Independent parts remain proportional. Physical evidence is in docs/performance/alpha14-physical-input.json; this is agreed laptop scope, not all-browser certification.
- [x] TT-512: Independent wheel/chassis/exhaust choreography, WPM/effects/audio and cleanup are implemented and verified. Final two-minute physical session has zero page errors and the user reports everything worked fine; actual-GPU High/Low/Reduced experiments and bounded particle/canvas/audio evidence are in docs/PERFORMANCE_ALPHA14.md. Long-session/native/GPU-memory release checks remain TT-1003.
- [x] TT-513: Final alpha.14 regression checks, reviewed captures, README, physical checklist/recorded input evidence and explicit user report are complete. 96 unit/36 browser cases pass; exact PR head checks are verified before integration. See docs/PHASE5_CLOSEOUT.md and docs/TESTING.md. No deployment is implied.

- [x] TT-514: Retired by explicit user request on 21 October: alpha.8 removes the production personal-music chooser, loader and its tests. This closes the deferred personal-file scope by cancellation, not by claiming Misirlou playback or licensing verification. The normal app uses original bundled masters only.

- [x] TT-515: Live WPM analog/numeric gauge is implemented, regression-tested and previously accepted with typing/dial checks. Recent-vs-average semantics, needle-only cap, pause/final freeze and retry reset remain documented. Final new-parts physical responsiveness is held in TT-506/522.

- [x] TT-516: Apply the user-requested red-and-black theme across existing app pages, Phaser race/preview, player kart and Live WPM dial. Alpha.6 reuses original art with one-time palette baking; amber underlined errors remain distinct. Formatting/types/build and 18 focused Chromium cases pass; recreation and scripted desktop/phone captures are in docs/IMMERSIVE_APP.md. Actual-device visual acceptance remains TT-506/513, not certified by this task.

- [x] TT-517: Remove hub preview side gutters with Phaser RESIZE, full-width scenery redraw and uniform kart scaling. Wide/phone resize and cleanup regressions pass; implementation/recreation in docs/IMMERSIVE_APP.md.

- [x] TT-518: Separate countdown cues and accepted Ignition/Overdrive masters are implemented/tested; prior user listening acceptance is preserved. Actual-GPU final samples decode both once with one expected loop/context. No repeat soundtrack preference approval; physical dropouts if any belong in TT-506.

- [x] TT-519: Accepted colors/music remain unchanged; alpha.14 records current actual-GPU app/audio/transfer/cleanup evidence and much smaller kart resources in PERFORMANCE_ALPHA14.md. It does not certify total GPU memory or physical key-to-photon latency. Remaining physical follow-up is TT-506/522.

Alpha.5 integration evidence: source `2a2c11b`, PR #4, full local check 83 unit / 72 browser passed, hosted Linux [run 39519820938](https://github.com/sahilshah2904/TurboType/actions/runs/39519820938) passed, all existing routes captured and isolated renderer profile recorded in docs/PERFORMANCE_ALPHA5.md. TT-508/509/511/512/515 and TT-604 implementations are automatically verified; their remaining physical-device/visual gates are not closed by that evidence.

- [x] TT-520: Laptop-only scope, restored graphite/crimson/cyan and Ignition/Overdrive direction, typing and pause/resume/retry were accepted previously and remain implemented. Mobile work is canceled, not claimed fixed. Separate parts now complete through TT-501/510; final physical responsiveness/acceptance remains TT-506/513/522.

- [x] TT-521: Restore the previous alpha.8 graphite/crimson/cyan palette in alpha.10 at the user's request. Keep laptop-only layouts and current music; alpha.9 red/gold styling is rejected. Relevant checks/captures are in docs/TESTING.md.

- [x] TT-523: Alpha.12 player car choice among all five starter models, before a race or while paused; immediate in-place model/anchor updates, unique CPU model assignment, same simulation/progress, remembered cosmetic choice and hub hero/preview. Browser coverage verifies all five models, pause/resume/retry/navigation/reload and denied storage; recreation in docs/GARAGE_PROGRESSION.md.
- [x] TT-524: Put sound enable/mute/volume controls only in Settings and remove the hub radio section. Existing original music continues under saved preferences and gesture/lifecycle rules. Route-exclusivity, real decoded-source switching, saved volume, failure and one-context tests cover this change.

- [x] TT-525: Alpha.13 one-car-per-race rule: choice only in ready; lock countdown/racing/pause/final states, reject synthetic changes, reopen on retry/new race. Verify navigation/reload semantics and preserve pure simulation; supersedes TT-523 paused-switch behavior.
- [x] TT-526: Shared accessible fullscreen/restore corner icon on every page; real enter/exit/state/navigation and failure recovery, 44px target and keyboard focus. Replaces small Race-only text action.
Completion evidence for TT-525–527: src/ui/fullscreen.ts, app-owned control lifecycle, ready-state guard and native fieldset lock, 93 unit / 35 browser checks plus actual enter/exit/refusal and readable-size assertions; docs/TESTING.md and reviewed 1024/1440 captures. No hardware fps claim.

- [x] TT-527: Laptop readability pass: important prose/controls 16px+, compact labels 14px, contrast and spacing, scrollable setup and 1024/1440 layout captures. Retain Larger typing text and reduced motion.
- [x] TT-528: Fix the known hosted garage timeout: split overlong end-to-end test, preserve coverage, remove duplicate push/PR workflow executions, check exact new hosted result. Earlier opposite-result copies are not blanket CI success. Evidence: full local 93/35 check, 12 repeated garage executions and hosted PR run 39581833203 successful for b76392b, with only one PR execution. See docs/TESTING.md.

## Phase 6 — entrance and onboarding

- [x] TT-601: Build original cinematic loading panels, real asset status, optional skip/replay, returning-user shortcut and failed-load recovery.
- [x] TT-602: Build welcome/rules, interactive correction/streak tutorial, optional calibration and animated hub.
- [x] TT-603: Complete responsive setup/briefing/settings/results navigation with mouse, physical-keyboard and accessibility support; test first and returning visits. Present passage/pace/mode naturally for Quick Race, use level-defined campaign setup, and move seed into Advanced/Replay settings for the final player flow.

- [x] TT-604: Apply the accepted immersive visual language across existing hub, practice, keyboard check, settings and pre-race navigation: full-window background, no enclosing page card/unused gutters, readable responsive content and accessible focus/zoom/reduced-motion. Hub becomes a garage/city scene; practice keeps one visible typing surface; settings use a clear overlay/dedicated full-window view. Alpha.17 completes new welcome/rules/tutorial/calibration pages and laptop layout/accessibility regressions at 1024/1366/1440/1920, including active Larger typing text. Existing full-window routes remain covered. New visual acceptance is pending; broad release browser/hardware coverage stays Phase 10. Maps are TT-701–704, race/results TT-508–513, and final garage/progress views belong to Phase 9.

## Phase 7 — campaign maps

- [x] TT-701: Implement category selection and three rightward winding maps with 100 numbered circular main nodes each, chapter districts and bonus branches.
- [x] TT-702: Implement locked/current/available/completed states, sequential category-isolated unlocks, stars, unlock animations and level briefing.
- [x] TT-703: Implement saved map position, Continue/Jump to Current, chapter jump, swipe/drag, keyboard navigation and accessible list view; test narrow screens and reduced motion.
- [x] TT-704: Lazy-load scenery/previews and avoid running scenes/animations for every future level.

## Phase 8 — all 300 levels

- [ ] TT-801: Extend the Phase 7 manifest into the full reviewed campaign/passage schemas, prerequisites, rewards and asset references; retain stable IDs/revisions and validate all 300 authored definitions. Raise/test the current 2,000-character engine/CPU cap before late Hard paragraphs up to 3,000 characters.
- [ ] TT-802: Review the six original map samples and author/review the full Easy 001–100 across ten chapters with explicit learning objectives and gradual difficulty.
- [ ] TT-803: Review the six original map samples and author/review the full Medium 001–100 across ten chapters with explicit learning objectives and gradual difficulty.
- [ ] TT-804: Review the six original map samples and author/review the full Hard 001–100 across ten chapters with explicit learning objectives and gradual difficulty.
- [ ] TT-805: Author chapter showcases, optional side challenges, milestones and finale content; no locked placeholder levels counted as complete.
- [ ] TT-806: Validate all 300 definitions, duplicates/references/reachability, boundaries 9→10→11 and 99→100, and no level 101; playtest representative levels and every introduced skill.

## Phase 9 — progression, learning and persistent data

- [ ] TT-901: Integrate existing Phase 7 stars/first-clear unlocks into the canonical receipt model, then implement Driver Rank, exact reward formulas, pit stops, trophies, caches, perfect/recovery awards and one-time receipts.
- [ ] TT-902: Build garage ownership/equipment/previews and fixed cosmetic rewards; verify no speed advantages and no duplicate claims.
- [ ] TT-903: Migrate validated rules/revision-qualified Phase 7 map clears/stars/bests/positions from turbotype:campaign-map:v1; preserve malformed exports and define simultaneous-tab conflicts. Then build bounded local saves, migrations, backup export/import, malformed-save recovery, quota failure and multiple-tab protection.
- [ ] TT-904: Add comparable personal records, recent-history/pace charts, bounded learning aggregates and one evidence-based coaching suggestion.
- [ ] TT-905: Implement correction/capitalization/punctuation/consistency drills and optional keyboard guidance; separate practice from competitive eligibility.
- [ ] TT-906: Validate the free-only cloud provider before integration: preferred Supabase Free Auth/Postgres/private Realtime; check current quotas, OAuth/allowlist setup, region, recovery/export, authorization and static-site callbacks. Hard $0 budget; no paid dependencies or automatic upgrade. Gate final selection on measured validation, not a generic free-tier promise. See docs/MULTIPLAYER_ROOMS.md; depends on TT-205 and stable completed-run contracts.
- [ ] TT-907: Provision/configure the selected service when authorized/accessible; commit database migrations, test fixtures, access policies and reproducible setup docs without secrets.
- [ ] TT-908: Add optional permanent sign-in, guest-to-account import preview, account switching isolation and cross-device profile/progress.
- [ ] TT-909: Implement pending/synced/failed states, idempotent submissions, server-applied reward transactions, conflict handling, bounded queues and local fallback.
- [ ] TT-910: Test separate-account access isolation, duplicate/offline retries, cross-device conflicts, untrusted imported/solo records, export/deletion and backup/recovery; document actual guarantees.

TT-906/907 may start earlier once contracts stabilize; cloud progress remains a single-player launch requirement, not work postponed until multiplayer.

- [ ] TT-911: Required future category-specific reward collection: one distinct car every 15 unique eligible main-level clears within Easy, Medium and Hard (100 levels each), at 15/30/45/60/75/90 per category. Eighteen rewards plus five starters; counters never combine categories. Include monster trucks, hoverboards, flying cars and other original vehicle families rather than only sports-car chassis; support optional wheels/lift anchors within equal gameplay performance. This 22 October correction supersedes the ten-car/global-clear plan. Replays/bonus/Quick Race/Practice do not inflate counts; no extra car at 100 is implied. Author/export/anchor parts, persist idempotent category-qualified ownership from campaign receipts, migrate/recover guest saves and merge cloud clears/ownership safely; multiplayer validates entitlement. Cosmetic only. See docs/GARAGE_PROGRESSION.md for IDs, art briefs and boundary tests. Depends on campaign clear rules and Phase 9 save/cloud work; not implemented by the starter selector.

- [ ] TT-913: Adopt the private-audience $0 policy in identity/storage delivery: up to 100 approved profiles, optional solo sign-in but approved persistent identity online, preferred verified social OAuth instead of paid SMTP/SMS, bounded history, manual export/restore and free-provider pause/quota fallback. Supabase remains proposed until TT-906/1101 gates pass. See docs/MULTIPLAYER_ROOMS.md.

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

- [ ] TT-1101: Prototype/select a free-only authoritative room backend for 2–10 humans including host, up to 100 approved accounts and initially ten active racers project-wide. Prefer Supabase Free with existing identity/data contracts; prove server validation, clock/latency, throughput, quota and deployment feasibility. Realtime Broadcast is transport, not authority; Colyseus is unselected background research, not an additional paid host. See docs/MULTIPLAYER_ROOMS.md.
- [ ] TT-1102: Define versioned room/match schemas and server-owned configuration, ready/admission checks, capacity leases, future start timestamp, bounded sequenced input validation, shared snapshots, finish/DNF ordering and idempotent result persistence. Local typing never waits on network. Verify the batching/fairness policy and reject forged/stale/duplicate events.
- [ ] TT-1103: Implement Create room / Join room with random readable eight-character codes, transactional 2–10 membership including host, host-owned track/passage selection, player-owned cars, every-player I'm ready and host-only Start. Invalidate readiness on configuration/roster changes; no force-start or mid-race joins. Add invite copy/regeneration, pre-race removal, authorization and expiry.
- [ ] TT-1104: Implement interpolated live opponents, no global online pause, frozen car/track choices, shared deadlines, readable ten-entrant race/results, DNF and same-room rematch requiring fresh readiness. Host track is temporary match access, never ownership. Multiplayer does not create campaign clears, stars or car/track milestone progress in this first release.
- [ ] TT-1105: Implement proposed 30-second reconnect grace with continuing server time, validated input recovery, expired-slot DNF, host transfer and track-ownership fallback in lobby, countdown cancellation on loss, 30-minute idle expiry and abandoned-room cleanup. Backend outage yields interrupted/unverified results; never fake online winners.
- [ ] TT-1106: Test 2/10/11 clients, simultaneous joins/starts, stale readiness, latency/clock skew, forged/reordered inputs, room/account isolation, car/track permissions, host loss, reconnect, rematch and finalized results. Verify no multiplayer campaign awards and preserve solo/cloud record separation.
- [ ] TT-1107: Deploy/document the verified free backend only after provider/account configuration is available; migrations, access policies, OAuth callbacks, free-tier quotas, restore/export, usage reporting and actual code-based invitations through Pages. No paid fallback, billing method, automatic upgrade or solo guest regression.

- [ ] TT-1108: Implement and measure free-tier admission/usage guards, coalesced room snapshots (initially ≤1/second/room), low-frequency liveness, bounded retention and clean subscription teardown. Proposed internal budgets: 1M messages/month, 3GB backend egress and 100MB application data; compare against provider reports, account for fan-out and refuse new online races before exhaustion without paying.
- [ ] TT-1109: Verify invitation/account allowlist, private Realtime channel policies, nonmember/removed-account/code abuse, one active driving slot per identity, host privilege limits, temporary guest track access, secret-free public bundle and no raw password collection. Rate-limit failed joins and ordinary writes.
- [ ] TT-1110: Test ten-player laptop layouts/input/readability, all Ready/Not ready/loading/error states, reduced/low effects and backend sleeping/quota/outage recovery. Publish measured free-tier limitations rather than promising unrestricted uptime.

## Optional ideas — deferred, not launch commitments

- [ ] TT-1201: Best-run ghost/replay racing using versioned, bounded recordings; assess storage before adoption.
- [ ] TT-1202: Deterministic daily passages/challenges; decide local versus shared rankings and abuse validation before enabling online scores.
- [ ] TT-1203: Optional additional tracks/weather/vehicles beyond the required 26-track/23-car collection, after core art/performance budgets are proven. Required staggered track rewards are TT-807/912, not optional.
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

## Alpha.11 Phase 5 continuation — 21 October 2026

The user accepted the restored colors and Ignition and authorized continued work. Distinct CPU models are implemented; TT-501/510 retain the separate body/wheel and final-review work. Earlier phone/tablet acceptance references are historical; those platforms are canceled scope.

- [x] TT-522: Investigated software-renderer callback tails with actual AMD Direct3D11 experiments, preserved variable/failed runs, reduced kart payload, bounded/streamed trace analysis and verified active race time. Final guarded all-preset samples plus the two-minute physical keyboard session and user acceptance satisfy Phase 5. Handler-to-next-rAF median 9.3ms/p95 18.8ms/max22.2ms is diagnostic, not physical presentation/OS-to-photon certification. Broader long-session/GPU/native-memory work remains TT-1003.

## Required track collection follow-up — corrected 22 October 2026

The user accepts the alpha.15 compact score/metrics presentation and requests standings expanded by default; the existing fire instrument is preserved. Alpha.16 adds five starter environments and remembered Hub/Quick Race choice. Reward tracks are required campaign scope, not an optional replacement for opening/tutorial work.

- [x] TT-531: Five distinct original starter track environments shared by Hub and Quick Race, remembered optional preference, ready-only race selection and active-race lock. Implemented and locally tested (98 unit / 40 browser cases); User accepted all five starter tracks on 22 October 2026; PR #5 merged as 1b832ce after exact-head hosted run 39771450182 passed. Evidence: docs/TESTING.md.
- [x] TT-705 (Phase 7 portion): Implement starter car/track selection in level briefing and replay across categories, with a shared inventory boundary and no lock bypass. Future earned inventory/entitlement binding remains TT-902/911/912 in Phase 9; it is not claimed complete here.
- [ ] TT-807: Author/review twenty-one original reward track environments/previews, independent category/threshold IDs and campaign default scenery. Seven per category at 10/25/40/55/70/85/100; 26 tracks total including five starters. Validate references and lazy loading; no placeholder assets count as finished.
- [ ] TT-912: Unlock independent track rewards at 10/25/40/55/70/85/100 eligible unique main clears in each category: 21 rewards plus five starters, 26 tracks total. Supersedes paired car/track awards; cars stay at 15/30/45/60/75/90, 23 cars total. Derive separate idempotent entitlements from validated category-qualified clear receipts, recover interrupted writes and merge guest/cloud data safely. Globally usable on already-unlocked levels across categories and replays; no replay inflation or locked-level bypass. Verify 100 gives a track but no car. See docs/TRACK_PROGRESSION.md; depends on TT-801/807/901–911.

TT-1203 now applies only to optional tracks/weather/vehicles beyond the required 26-track/23-car collection. Existing baseline phases remain complete for their agreed scope; new presentation acceptance and future campaign work are tracked separately.
