# TurboType project status

## Alpha.20 atmosphere, action alignment and future vehicle variety — 22 October 2026

The user rejected the white curved air lines. Alpha.20 removes them entirely and uses researched, layered atmospheric movement across the full race scene: soft distant haze over sky/mountains, small suspended motes and feathered peripheral speed accents. These are 42 reused sprites from three tiny generated gradient textures, including 20 in the upper sky/mountain area. Smooth WPM response and slower scenery parallax replace stepwise scene movement. Cars, labels, HUD and typing stay sharp. Pause/end/Low/Reduced hide the atmosphere. Research/design/limits: docs/ATMOSPHERE_RESEARCH.md. User visual acceptance is pending; do not describe quality or physical frame rate as certified.

Shared action rows now centre-align buttons and plain links, with a minimum 44px link target, fixing Skip to hub in Welcome/tutorial/calibration and other action rows. The user also requests future monster trucks, hoverboards, flying cars and other original vehicle families. Proposed Phase 8/9 briefs now vary body/propulsion structures; eighteen stable reward IDs, milestones, 23 total vehicles and cosmetic-only gameplay stay unchanged. No future vehicles/ownership are implemented. See docs/GARAGE_PROGRESSION.md. Work stays in codex/phase6-onboarding / open PR #6; no merge/deployment or Phase 7 implementation.

## Alpha.19 purple-car opening — 22 October 2026

The latest user request supersedes alpha.18's simple title-only reveal: the accepted purple Volt Electric enters fast from the left, brakes at the middle, holds briefly, spins its independent tyres with burnout smoke, rolls back slightly and launches right as TURBOTYPE reveals. Original three-layer SVG flames burn along its invisible middle road and around the title. Choreography remains 5.6 seconds after its original body/wheel artwork decodes; Skip stays immediately available. Low/Reduced show the finished static title without the car/fire sequence. A four-second decode watchdog or failed opening art falls back to the static title with feedback and an available Enter action. Route cleanup cancels both timers and ignores stale image promises.

This remains Phase 6 refinement on codex/phase6-onboarding / open PR #6, pending user visual acceptance and integration. No new raster assets, dependencies, copyrighted footage, audio, gameplay rules, ownership or storage were added. Purple in this opening is a fixed cinematic role; the player's selected race car is preserved. Evidence and captures: docs/TESTING.md / docs/images/alpha19; the previous alpha.18 opening frames are historical.

## Alpha.18 visual follow-up — 22 October 2026

The user requested a full-window, five-to-six-second game-title opening instead of the alpha.17 illustrated panels, more visible wind during the five-car race, no Hub preview labels and row-based learning actions in Settings. Alpha.18 replaces the panels with an original **5.6-second TurboType title reveal**: dark start, emblem emergence, slow expanding name, cyan/crimson light sweeps and final tagline/Enter hold. It is a real-time browser animation, with no film download or copied Rockstar artwork. Skip remains available immediately; Enter appears after the sequence. Low effects/Reduced motion show the finished title immediately. Replay/skip-visit/loading/failure behavior is preserved.

Race airflow now has 26 curved travelling ribbons, eight near-edge gusts and up to two slipstream trails per car (44 bounded paths maximum), driven by recent typing pace and the existing frame clock. Wind stops outside active racing and is disabled for Low/Reduced. No scoring, CPU schedule, road/cosmetic ownership, audio or saved-data changes. The Hub uses Your circuit and no successful-load message; loading/error/retry feedback remains. Settings opening/learning actions now use the same setting-row layout as Motion/Track effects. Current branch/PR remains codex/phase6-onboarding / [PR #6](https://github.com/sahilshah2904/TurboType/pull/6), pending user review; no merge/deployment. Exact final evidence belongs in docs/TESTING.md. Earlier alpha.17 screenshots describe the superseded opening.

## Phase 6 implementation — 22 October 2026

Alpha.17 implementation `3bac5e7` is pushed on `codex/phase6-onboarding` / open [PR #6](https://github.com/sahilshah2904/TurboType/pull/6) against main: cinematic entrance with actual essential-asset readiness and recovery, welcome/rules, three native-input tutorial lessons, optional thirty-active-second pace calibration, returning-visitor skip/replay preferences and natural Quick Race setup with seed in Advanced / Replay. See [Phase 6 implementation](docs/PHASE6_ONBOARDING.md) and [laptop review checklist](docs/PHASE6_REVIEW.md). Phase 6 implementation is complete and locally verified (102 unit / 50 browser cases), pending the user's new visual/interaction acceptance; integration remains pending. No Phase 7 implementation or deployment is authorized by this checkpoint. Older checkpoints below are historical.

The user accepted all five starter tracks and requested Phase 6. Accepted alpha.16 PR #5 was merged into main as `1b832ce3683e9791690cc58c1046138552bebf1b` after freshly confirming its exact-head `2a0a6f8af5ae0466b7d7635db5ccdcca24b86426` hosted check [39771450182](https://github.com/sahilshah2904/TurboType/actions/runs/39771450182) passed. Phase 6 is separate, not merged. Review remains at http://192.168.0.31:5173/TurboType/ on the preserved existing server; automation stays headless on 4173.

Rules 3 and save/content 1 remain. Only validated local preferences/tutorial completion/calibration sample persist; no race history, accounts, cloud, campaign maps/levels or multiplayer exists. Next after Phase 6 acceptance/integration: Phase 7 maps, Phase 8 curriculum, Phase 9 rewards/learning/guest and optional cloud saves, Phase 10 solo release/Pages, Phase 11 private rooms. Preserve independent reward milestones (23 cars / 26 tracks), ten simultaneous players and free-tier-only infrastructure plan.

## Private multiplayer and zero-cost scope — 22 October 2026

User requests rooms for up to **10 human players including host**, for up to 100 approved friends/relatives, with a **$0/free-tier-only** budget. Plan: Multiplayer → Create room / Join room by code → host chooses an owned track and shared passage preset → each player chooses an owned car → everyone including host clicks I'm ready → host starts a synchronized race. Host/roster/configuration changes invalidate readiness; server validates admission, readiness, progress and results. No single-player pause online; reconnect/host-transfer/rematch policies are in docs/MULTIPLAYER_ROOMS.md.

The initial free-capacity interpretation is at most ten active racers across the project, also ten per room. Host track is temporarily shared for that match without granting ownership; multiplayer does not generate campaign unlock progress. GitHub Pages plus **Supabase Free is the preferred architecture to validate**, not provisioned infrastructure or a promise of unlimited service. Prefer approved social login, private channels, bounded shared snapshots and quota controls; no paid services, SMTP/SMS, add-ons or automatic upgrades. Pause/restrict online features when free capacity is unavailable and preserve local solo. Phase 9 owns identity/saves and the free-only provider gate; Phase 11 owns rooms/races after solo launch. This request updates plans only; no new runtime feature, account, deployment, merge or app-version bump. Cars/tracks keep their staggered milestone plan (23 cars / 26 tracks).


## Alpha.16 — starter tracks and staggered reward plan, 22 October 2026

The user accepted the compact score/metrics presentation and requested Final standings expanded by default below it. This supersedes alpha.15's collapsed default; the disclosure can still be closed manually. Implemented on codex/results-and-fire-dial / open PR #5, which already contains alpha.15. No merge or deployment is implied by acceptance of the previous presentation.

Five starter environments are now implemented for Hub preview and Quick Race: Neon Harbor, Coral Coast, Copper Canyon, Emerald Trail and Frostline Pass. Track choice is a validated optional browser preference; the active race pins its track through countdown/pause/navigation/final state, and retry applies the next chosen preference. Original bounded geometric scenery, road/edge palettes and shared renderer preserve the typing/CPU/rules behavior. Rules 3 and save/content 1 remain.

Latest reward schedule correction (22 October 2026): cars unlock at **15/30/45/60/75/90** eligible unique main clears within each category (6 × 3 = 18 rewards; **23 cars total** with starters). Tracks unlock independently at **10/25/40/55/70/85/100** (7 × 3 = 21 rewards; **26 tracks total** with starters). This supersedes the paired-unlock plan: car and track rewards are staggered and have separate receipts/IDs. Any owned car or track remains usable across Easy/Medium/Hard on already-unlocked levels and replays; replays cannot inflate earning counters or unlock levels. Phase 7 briefing/replay selection, Phase 8 content and Phase 9 independent ownership/saves remain the delivery plan. Five starter tracks are implemented; future reward unlocks are not. See docs/TRACK_PROGRESSION.md.

Manual review stays at the existing LAN link http://192.168.0.31:5173/TurboType/. The server and active feature checkout are preserved. See docs/TESTING.md for current verification; do not reuse alpha.15's hosted pass for this new source. Starter visuals await review; no repeat review of accepted cars/music/palette is needed.

## Alpha.15 presentation follow-up — 22 October 2026

User-requested Race result simplification and fiery Live WPM instrument are implemented on `codex/results-and-fire-dial`, branched from accepted main `e1bbaff`. The default result has place, average WPM, accuracy and active time; unfinished runs include completion percentage. CPU standings expand on demand with simulation labels intact. Original SVG fire animates only during racing with High effects/full motion; Low/Reduced and pause/finish are static. No scoring/storage changes (rules 3, save/content 1), new dependencies or Phase 6 onboarding. See docs/IMMERSIVE_APP.md and docs/TESTING.md for validation and captures.

Normal human review uses the existing LAN link http://192.168.0.31:5173/TurboType/, which serves the active local checkout, including this unmerged branch. The existing server is preserved. Automated regressions remain headless on 4173. PR #4 is verified merged; base e1bbaff has successful exact-source main run 39727697321. This follow-up requires its own checks and user review before merge; no deployment.

## Phase 5 complete and integrated — 22 October 2026

The user reported “I believe everything worked fine” after the final physical checklist. Reviewed recorder evidence: 120-second hardware-accelerated session, 100 trusted racing keys, 99 trusted inputs, zero page errors, median/p95/max handler-to-next-rAF 9.3/18.8/22.2ms. This is a bounded input diagnostic and available-laptop acceptance, not universal performance certification. TT-506/511/512/513/522 are closed for the agreed Phase 5 scope; broader release testing stays in Phase 10. All Phase 5 backlog items are now complete, including explicitly canceled scope. [PR #4](https://github.com/sahilshah2904/TurboType/pull/4) merged into main as `de464ce` after exact acceptance-head `398d455` passed hosted run [39727202033](https://github.com/sahilshah2904/TurboType/actions/runs/39727202033). The local checkout is now main. This post-merge documentation update has its own main-push check; inspect actual HEAD/checks. See [closeout](docs/PHASE5_CLOSEOUT.md). No Phase 6 implementation or deployment started. Older pending-acceptance paragraphs below are historical.


## Historical pre-integration checkpoint — 22 October 2026

Verified implementation `2eadeef`; feature history-sync head `d168720` has identical file contents and successful hosted PR [run 39725624773](https://github.com/sahilshah2904/TurboType/actions/runs/39725624773). The sync resolves the README-only conflict with main d86d046; it does not integrate the preview into main. This evidence-only follow-up has its own check. PR #4 is open/unmerged; the two-minute physical report/evidence remains TT-506/511/512/513/522 before integration. Working branch remains feat/race-polish.

The user authorized finishing Phase 5. Alpha.14 implements independent body/wheel assets and chassis suspension for all five accepted models, compact shared previews and actual-GPU profiling tools. Full local checks pass: 96 unit / 36 browser cases. See [Phase 5 closeout](docs/PHASE5_CLOSEOUT.md) for current evidence and the remaining physical-input acceptance/integration gate. PR #4 stays open until that gate is reviewed; no deployment. Older stop-and-save/artwork-pending sections below are historical.

**Reward correction:** 100 levels per category; a distinct car at 15/30/45/60/75/90 eligible main clears independently in Easy/Medium/Hard. Eighteen rewards plus five starters replace the ten-car aggregate curve. See docs/GARAGE_PROGRESSION.md. No unlock implementation is claimed.


## New-chat audit — 22 October 2026

Read AGENTS.md, the full session handoff, backlog, engineering/workflow guidance and current art/performance/test evidence. Local checkout was clean on feat/race-polish at 2eebd92 (implementation b76392b); GitHub PR #4 is open/unmerged and reports mergeable. Exact-head PR run [39584421655](https://github.com/sahilshah2904/TurboType/actions/runs/39584421655) completed successfully for 2eebd9248f4a4a7d0a80d52fa46396a3d691fd24. Main is d86d046, the README-only publication, with separate successful push run [39584487911](https://github.com/sahilshah2904/TurboType/actions/runs/39584487911). These were freshly read from GitHub, not inferred from the older handoff runs.

Resume Phase 5 with separated body/wheel art (TT-501/510), then hardware-accelerated physical typing/performance and longer-session resource evidence (TT-505/506/511/512/519/522), reconcile remaining integration gates and review PR #4 (TT-502/508/509/513/515/518/520). Accepted silhouettes/palette/music and previous functional reports remain accepted. Alpha.13 has automated car-lock/fullscreen/readability evidence; subjective confirmation is distinct from measured hardware evidence. No task was marked complete in this audit. No application change, new local gameplay test run, merge or deployment occurred. See the dated backlog reconciliation and handoff continuation below their titles.

## Saved handoff — 21 October 2026

The user asked to stop and continue in a new project chat. Read the refreshed [AGENTS.md](AGENTS.md) and [detailed session handoff](docs/SESSION_HANDOFF.md) before resuming; the old chat is not required. No new implementation, merge or deployment is requested in this handoff task.

The README now describes alpha.13 and shows actual current race/hub/car-selector/Settings screenshots. Its default-branch publication is documentation-only: main game code remains the accepted Phase 4 baseline, while the latest preview stays on feat/race-polish / open PR #4. Documentation links deliberately target the preview branch. The local checkout must return to feat/race-polish after publishing the main README.

**Phase 5 is not fully closed.** Main features and 93 unit / 35 browser checks are complete; remaining developer gates are separate body/wheel art (TT-501/510), measured hardware performance/tuning and final integration (TT-505/506/511–513/522). User-accepted silhouettes/colors/music and reported functional checks are recorded, not reopened. Ten future reward cars remain TT-911, not a Phase 5 blocker. Then Phase 6 cinematic loading/onboarding, followed by the preserved eleven-phase roadmap.

Verified pre-handoff hosted run 39582296673 passed for 717c76e, separately from implementation b76392b / run 39581833203. This documentation handoff has newer commits/checks; do not attribute an old pass to a new head. See docs/TESTING.md for evidence and docs/SESSION_HANDOFF.md for exact source/commands/limitations.


## Historical checkpoint — alpha.13, 21 October 2026

The user reported the other laptop tests good, requested one car per race (no paused switching), a visible fullscreen symbol on every page and larger readable copy. Alpha.13 locks selection whenever state is not ready, hides it in pause and rejects synthetic mid-race changes; retry/new race reopens it. Shared app-owned 44px fullscreen/restore corner control replaces Race-only text. Main prose/controls are 16px+, compact metadata 14px, with brighter secondary copy and laptop layout adjustments.

CI investigation found real failures: runs 39578553613 (push/722ee85) and 39579044713 (PR/8e28d2a) timed out in the 30-second all-in-one garage browser scenario; their counterpart runs passed. Earlier passing-PR reports did not imply all copies passed. Alpha.13 splits that scenario into focused tests without raising the global timeout or removing assertions, keeps feature checks on PR updates/main checks on push/manual, and cancels superseded runs. Do not mute notifications or claim a hosted pass until checking the exact new source. See docs/TESTING.md and docs/GITHUB_WORKFLOW.md.

Phase 5 stays open for separate wheel/body art and measured hardware performance/tuning. Record the user's “rest every testing looks good” as available-laptop acceptance of the previous checklist, not presented-frame-rate/latency certification. No repeat approval of accepted art/music is needed. Latest car lock/fullscreen/type changes require their own regression/layout evidence. Future ten-car rewards remain TT-911 (Phases 8/9), not implemented or a Phase 5 blocker. Eleven phases, laptop-only scope, rules 3 and save/content 1 remain; no merge/Pages/backend deployment.

Local final full check: formatting/types/build, 93 unit and 35 browser cases pass; garage cases passed three repeats each (12 executions). Fresh 1024/1440 captures and focused final fullscreen/readability validation are in docs/TESTING.md and docs/images/alpha13. Hosted PR run 39581833203 passed for exact implementation `b76392b`, with one PR event and no duplicate feature-push execution. The later documentation-only checkpoint has its own CI state; preserve that distinction.

## Historical alpha.12 checkpoint



The user accepted the four distinct CPU cars (“these cars looks very nice”), requested player choice, ten future locked reward cars and sound controls only in Settings. Alpha.12 implements a five-starter car selector before a race or while paused, updates the existing renderer without resetting typing/timing/CPUs, remembers the cosmetic choice in a separate validated browser preference, and shows it in the hub hero/preview. CPUs use the other four models. Sound controls and the hub radio section were removed from Hub/Race; enable/mute/volumes live only in Settings. Current colors and both music masters remain accepted.

[docs/GARAGE_PROGRESSION.md](docs/GARAGE_PROGRESSION.md) defines the ten required future reward cars: milestones 10/25/50/75/100/140/180/220/260/300 unique eligible main-level clears across the three campaigns, progressively sportier designs and cosmetic-only performance. This is planned Phase 8/9 work (TT-911), not current unlock/save behavior. Five starters are selectable now; no fake locked assets or completed reward system are claimed. Selected-car preference is not an ownership entitlement.

Phase 5 remains open on `feat/race-polish` / PR #4 for separate body/wheel art and actual laptop performance/tuning (TT-501/510, TT-505/506/511–513/522). Current fleet silhouettes, palette and music are user-accepted; do not repeat those approval requests. Native laptop input, rules 3 and save/content 1 remain. No new campaign, backend or Pages deployment. Eleven phases and laptop-only scope are preserved. Local full check passed formatting/types/build, 93 unit and 30 browser cases; final preview-anchor/CSS cleanup passed build and all four affected garage/audio cases (21.0 seconds). Captures are in docs/images/alpha12. Current evidence is in docs/TESTING.md; alpha.11 performance data is historical, not a new alpha.12 benchmark.

Progress review: hosted PR run 39578558652 passed for implementation `722ee85`; PR #4 is open/unmerged. The final laptop checklist is refreshed for alpha.12 in docs/PHASE5_POLISH_TESTS.md. User action is limited to latest selector/Settings behavior and a short physical smoothness session; developer art/performance work remains. Ten future reward cars do not block Phase 5.

## Historical alpha.11 checkpoint



The user said “yes everything is good. lets go ahead” after the restored alpha.10 palette and Ignition review. Record those colors/menu music as accepted, alongside previously accepted Overdrive, typing/dial and pause/resume/retry. Do not ask them to repeat that acceptance. Current scope remains laptop/desktop physical keyboards only; the historical phone/tablet requirements below are superseded.

Phase 5 continues on `feat/race-polish`, open PR #4. Alpha.11 adds four original distinct CPU models, shared race/hub anchors, 800×400 WebP exports (267,580 bytes total), tracked PNG masters/prompts and export script. Player kart, accepted colors and both soundtrack WAVs are unchanged. Standings nodes are retained rather than rebuilt. See docs/KART_FLEET.md and docs/PERFORMANCE_ALPHA11.md for source/verification/measurement limits.

Still open in Phase 5: separately authored body/wheel assets and final fleet review (TT-501/510); physical laptop frame/input-latency evidence, low-end tuning and final acceptance/integration (TT-505/506/511–513, TT-522). Full-app software-renderer measurements show long-tail frame callbacks; they do not certify 60 fps. Current art includes baked wheels plus rotating highlights. No Phase 6 onboarding, campaign, database/backend or Pages deployment was added. Rules 3, save/content 1. Preserve the eleven phases; do not merge or mark Phase 5 complete solely from these automated checks.

Final local `npm run check` passed formatting/types/build, 87 unit and 28 desktop browser cases. Current evidence/captures: docs/TESTING.md, docs/images/alpha11 and docs/performance/alpha11-full-app.json. Implementation `96b8f96` is pushed; hosted Linux run 39576297805 passed for that exact source. This subsequent documentation checkpoint has a separate CI state; earlier runs do not certify newer implementation.

Earlier checkpoints below describe earlier source versions, not current pending color/music acceptance.


**Latest palette decision — 0.1.0-alpha.10:** Alpha.10 restores the previous alpha.8 graphite/crimson/cyan palette at the user's request, replacing the rejected alpha.9 red/gold armor panels. Laptop-only scope, Ignition browsing music, the accepted Overdrive racing master, typing rules and mobile-removal changes stay in place.

Last reviewed: 21 October 2026. This file is the persistent status source for future progress questions. Update it with each meaningful implementation change and verify claims against the actual repository, checks, and deployment. Do not rely on chat memory alone.

[BACKLOG.md](BACKLOG.md) is the persistent future-work checklist with stable task IDs, phase grouping, dependencies and optional ideas. Read it before starting a phase and update it when deferring or completing work.

## Historical position

**Latest alpha.9 revision:** **Current scope override — 21 October 2026:** the user explicitly narrowed TurboType to laptop/desktop browsers with a physical keyboard. Phone/tablet compatibility, software-keyboard layout, rotation and mobile acceptance are canceled requirements. Earlier multi-device statements are historical. Keep laptop window responsiveness (960 CSS px minimum; verify 1024/1366/1440/1920 widths), accessibility, hardware-keyboard IME composition, cloud saves before solo launch and multiplayer afterward. Do not restore mobile work without a new user request.

User feedback accepted Overdrive racing music and functional checks 5/6 (typing/speedometer, pause/resume/retry); requested red/gold nanotech-style colors and happier browsing music. Alpha.9 implements the red/gold emphasis, upbeat major-key Ignition at 124 BPM and preserves the exact accepted Overdrive WAV checksum. Phone/tablet profiles, small-screen/OS-keyboard CSS, VisualViewport module and touch input-profile type were removed. Desktop native IME behavior is retained. Local final evidence is in docs/TESTING.md. Phase 5 remains open for laptop audiovisual/performance review and distinct fleet; no phone acceptance is required. The alpha.8 checkpoint below is historical.


**Handoff saved 21 October 2026: alpha.8, Phase 5 still in progress.** Phases 1–4 are complete for their agreed scopes; existing-page Phase 6 visuals are implemented, but cinematic opening/rules/tutorial/calibration remain future work. The user asked to document progress and continue later. The detailed resumable checkpoint is now in [AGENTS.md](AGENTS.md) and the [README](README.md#progress-checkpoint-and-next-session).

Current branch **feat/race-polish**, implementation **0b4eef6**, open/unmerged [PR #4](https://github.com/sahilshah2904/TurboType/pull/4). Final local npm run check passed formatting/types/build, **87 unit and 78 Chromium profile cases**. [Hosted run 39524238316](https://github.com/sahilshah2904/TurboType/actions/runs/39524238316) was verified completed successfully for that exact implementation at the final handoff check. Do not apply that result to newer source without verifying its own checks. This documentation change has its own later commit/check status.

Implemented now: full-window four-CPU kart race, one native-backed typing strip, Live WPM dial, full-width hub preview, exhaust/nitro/parallax/bounded effects, revamped existing pages, saved display/audio preferences and graphics recovery. The current palette is **graphite/steel, metallic crimson, cyan lighting and restrained gold**, using the supplied Iron Man image as color/lighting inspiration only. New original rendered **Nightforge** browsing music and **Overdrive** racing music replace the rejected oscillator loop. Separate 3–2–1/GO and effects remain. Personal-file controls/loader were explicitly canceled and removed. Rules **3**, save/content **1**; no migration. [Current implementation](docs/IMMERSIVE_APP.md), [audio recreation](docs/AUDIO.md), [captures](docs/images/alpha8), [verification](docs/TESTING.md).

**Resume first with Phase 5 gates:** user listening/visual acceptance of alpha.8, actual ASUS/Samsung native keyboard/rotation/caret/dial/audio/interruptions and performance/decode/transfer/memory checks, and distinct original fleet/body/wheel art. TT-505/506/508–513/515/518/519 remain open; palette copies do not close TT-510. Earlier user Phase 4 acceptance does not accept the replacement. No iPhone/tablet is available to the user; broader physical coverage remains TT-1008. Do not merge PR #4 or mark Phase 5 complete based on headless profiles alone.

Then continue Phase 6 onboarding, Phase 7 maps, Phase 8 all 300 reviewed levels, Phase 9 rewards/learning/guest saves plus optional account-backed cloud progress, Phase 10 testing/Pages launch and Phase 11 friends multiplayer immediately afterward. Preference storage exists, but race/results are in memory: no saved campaign, account, database or realtime service exists. Supabase remains a candidate, not provisioned infrastructure. Pages/backend are not deployed. Git commits/pushes publish source, not a playable release.

“Design baseline complete” means major systems have defined behavior and a delivery/verification plan, not authored/implemented/playtested production scope. Preserve the eleven phase numbers and stable backlog IDs. See docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md for the responsive/cloud/multiplayer boundaries.

## The eleven phases

| Phase | Scope | Status | Evidence / completion requirement |
| --- | --- | --- | --- |
| 1 | Finalize design | Baseline complete | Game plan, research, reference analysis, engineering conventions, and RULES_AND_STORAGE_BASELINE.md; tuning and production work explicitly separated |
| 2 | Set up application | Foundation complete, with exceptions | Code/local/CI checks and available ASUS/Samsung checks recorded. TT-204 closed with word-completion work moved to TT-305 and unavailable iOS/tablet verification to TT-1008; not blanket device certification |
| 3 | Build typing engine | Complete for agreed scope | TT-301–305 implemented/verified, 48 unit/39 browser checks and user-reported ASUS/Samsung strict-input acceptance; broader device evidence remains TT-1008 |
| 4 | Complete playable race | Complete for agreed scope | TT-401–404 complete: core/browser evidence and user-reported ASUS/Samsung race checks; requested metrics-above-track layout included |
| 5 | Polish racing experience | Complete for agreed scope, accepted and merged | Alpha.14 independent parts, 96 unit/36 browser checks, actual-GPU evidence and final physical input/user acceptance; PR #4 merged as de464ce. Broader release validation remains Phase 10. |
| 6 | Opening and onboarding | Alpha.17 implemented; local checks pass | TT-601–604 implemented/tested in PR #6; user visual/interaction acceptance and integration pending |
| 7 | Campaign maps | Not started | Three rightward 100-node maps, locks, accessibility, saved location/progress |
| 8 | All 300 levels | Not started | 300 reviewed playable definitions/passages, progression curve, chapter/bonus events; manifest validation |
| 9 | Progression and learning | Not started | Garage/rewards/coaching/drills; local guest saves plus optional permanent-account cloud progress, sync/conflicts, migrations, access policies and recovery |
| 10 | Test and launch single-player | Not started | Real phone/tablet/laptop play, cross-device account sync, access controls, browser/performance/accessibility evidence, CI/Pages workflow and live test |
| 11 | Friends multiplayer | Next after single-player launch | Reuse account/database foundation; choose race service, add invites/lobbies, synchronized races/reconnects, multiple-client verification and deployment docs |

Phases 2–10 may overlap where dependencies require it: for example, save settings belong in the foundation before full progression. Never count a whole phase complete because a shared prerequisite exists. The game plan's engineering milestones M0–M6 group this work differently: M0 = phase 1, M1 = phase 2, M2 = phases 3–4, M3 = phases 5–6 and the complete slice, M4 = phases 7–9, M5 = phase 10, M6 = phase 11. This table is the user-facing phase numbering.

## Completed work

- Implemented the user-requested red/black palette in alpha.6, with charcoal/burgundy worlds, crimson controls/caret/gauge, a runtime red kart palette and amber underlined mistake feedback. Existing rules/preferences remain compatible. Local focused checks pass; ASUS/Samsung visual acceptance and final PR #4 merge remain pending.

- Reviewed screenshots and researched rendering, UI animation, GitHub Pages hosting, and later multiplayer options.
- Reviewed timestamp samples from the supplied reel recording; documented observations separately from inferred mechanics.
- Defined onboarding, cinematic loading, typing rules, CPUs, correction/penalty behavior, stars, progression, bonuses, results, and the original/licensed soundtrack direction.
- Defined three independent 100-level campaigns, chapter structure, rightward circular-node maps, locks, replay, and Driver Rank.
- Created the public repository at https://github.com/sahilshah2904/TurboType and linked this local checkout as origin.
- Set the repository-local Git author to the user's supplied name Sahilshah; committed and pushed planning documentation.
- Added naming/versioning/change-management conventions, formatting settings and ignore rules. Reference media remain local.
- Audited rule/storage gaps and selected explicit implementation defaults; see the baseline document.
- Implemented the Phase 2 foundation with a clean lockfile install, passing formatting/types/build, 20 unit tests and 18 Chromium profile tests; visually caught/fixed SVG texture sizing. Setup, architecture, ADRs, assets and test evidence are documented. Physical device coverage is not claimed.
- Pushed implementation commit 5534591 (`Build the responsive app foundation`) and opened pull request #1; hosted Linux checks passed in run 39404088628. At that checkpoint the branch was unmerged; it subsequently merged as recorded below. Pages remains undeployed.
- Recorded Samsung S25 Ultra/ASUS user checks: input/editing, phone rotation and keyboard reopening, Clear text/next-key highlighting, settings persistence and browser-tab return. Word completion remains possible; TT-305 covers the actual race adapter and eligibility. With no iPhone/tablet available, TT-1008 carries unverified coverage/metadata forward as a release gate. Phase 2 foundation is complete with those explicit exceptions; Phase 3 subsequently implemented the strict practice adapter; its physical retest was subsequently accepted by user report (TT-305).

- Implemented Phase 3 pure typing/timing/metrics, validated shared standings, strict DOM input adapter and practice sprint with countdown, correction, pause/navigation preservation, timed expiry and frozen results. Rules version is 2; app is 0.1.0-alpha.2. No rewards/results are persisted. Local formatting/types/build, 48 unit and 39 browser checks pass. The available-device strict-input checklist was subsequently accepted by user report (TT-305); detailed native prediction traces remain unavailable.

- Pushed typing implementation commit `0e19dcf` (`Build the typing engine and practice sprint`) and opened [PR #2](https://github.com/sahilshah2904/TurboType/pull/2) against `feat/app-foundation`. Hosted Linux checks passed in [run 39418022536](https://github.com/sahilshah2904/TurboType/actions/runs/39418022536). It was initially stacked on foundation PR #1; both subsequently merged as recorded below. No deployment occurred.

- User accepted Phase 3 after reporting all requested laptop/phone tests working and supplying five laptop screenshots. TT-305 is complete by this available-device report. Normal textarea resizing was observed and retained. Fixed the stale paused notice visible after timed expiry; transition messages now match countdown/racing/final states, with regression coverage (TT-306). Phase 4 subsequently completed as recorded below.

- Merged foundation PR #1 (`3cd9dd9`) and typing PR #2 (`08cddb4`) into main after successful head checks, preserving history. Phase 4 branch `feat/solo-race` starts from that main baseline. No Pages deployment occurred.
- Implemented seeded four-CPU Quick Race, shared active clock, live five-lane scene/standings, final simulated CPU outcomes, optional 60-second DNF, pause/navigation preservation, same-seed retry and graphics/context-loss recovery. App 0.1.0-alpha.3 / rules 3; original prototype art retained. Local formatting/types/build, 69 unit and 54 Chromium profile checks pass. Visually inspected desktop/phone race layouts; this is not physical-keyboard or measured frame-rate certification. Detailed recreation and the accepted TT-404 user-check procedure are in docs/QUICK_RACE.md and docs/PHASE4_RACE_TESTS.md.

- User accepted all five requested Phase 4 checks on ASUS/Samsung and supplied a paused-race laptop screenshot. Closed TT-404 on the available-device report, retaining broader device/metadata release gates. Moved status/metrics above the course, leaving track → passage → typing unobstructed. The current three short exercise passages remain a functional preview; longer progressive campaign content is Phase 8, with learning goals and reviewed lengths already planned.

- Merged Phase 4 PR #3 into main `c4127c7` after its accepted device checks and successful head CI; created `feat/race-polish`.
- Implemented original vehicle generator/three SVG silhouettes, Neon Harbor art bible, layered camera/road/exhaust/nitro/speed/finish effects, compact metrics and scrolling text, reduced/low variants, authored synth music/cues and isolated saved audio controls. App 0.1.0-alpha.4, rules remain 3, save/content remain 1. Local full check: 83 unit and 66 browser tests pass; software-renderer profile is in docs/PERFORMANCE.md. Implementation `cdd8e4a` is published in PR #4; hosted Linux run 39451394088 passed for that commit. Actual ASUS/Samsung sound/performance acceptance remains TT-505/506.

- Rewrote the public README as a player/developer guide on 21 October 2026: overview, actual preview image, current-versus-planned features, reproducible setup/phone instructions, controls, stack, source tree, checks, roadmap, storage/hosting boundaries and contribution guidance. Published on main in `3e9ae7f` and brought that documentation into the Phase 5 branch without merging Phase 5 gameplay. README local links, screenshot path, section anchors and documented npm commands were checked. Phase 5 device gates remain open.

- Expanded the README roadmap into all eleven numbered phases with scope descriptions and explicit current statuses, including Phase 5 acceptance, Phase 9 cloud saves and multiplayer after launch. Published on main in `1a38ef3` and synchronized into the preview branch. Verified all eleven headings, local links and section anchors; no gameplay changed.

- Reviewed user recordings 2–4 with overview/detail/quarter-second samples. User rejected the current boxed race, cars and duplicated passage/input. Required Phase 5 rework now includes a full-viewport race, one visible typing strip, a new vehicle-art pass, responsive keyboard-aware composition and staged visual review. See docs/RACE_REDESIGN.md and TT-507–513. This turn documents analysis/proposal only; no replacement gameplay or art is implemented. Phase 6 has not started.

- Started TT-507 with an original lime/teal arcade-kart raster concept (built-in image_gen; prompt/provenance saved) and a separate playable full-viewport desktop/phone review prototype in docs/design/race-direction. It reuses SoloRace/strict input, has one visible typing strip, and offers local-file personal music after the user identified Misirlou. No song file was supplied/downloaded/committed; public game music remains original. Scripted desktop/phone composition, correction/pause/finish/retry and synthetic local-audio tests passed; screenshots are saved. Recolored CPU concepts, simulated phone keyboard and baked wheels are review placeholders. User visual review, real Samsung input, distinct fleet, production integration and actual song playback remain pending. TT-514 tracks local music integration.

- User approved the TT-507 kart/full-window design and requested exhaust flames. Added bounded CSS orange flame flicker and larger blue nitro flame tied to per-car authoritative progress, with stall/error/pause/finish shutoff and system reduced-motion suppression. Updated prototype captures. Other production routes still use the earlier layout; TT-604 now explicitly tracks their coherent full-window redesign in Phase 6, with maps in Phase 7 and garage/progression in Phase 9. This approval does not close production integration or physical-device acceptance.

- Implemented alpha.5 production integration after explicit user authorization: actual full-window Phaser Race, PNG kart/palette textures, native integrated typing, proportional responsive lanes, moving exhaust and reserved Live WPM dial; revamped hub/practice/keyboard/settings over one full-window backdrop. Dial reads existing three-active-second recentWpm, clamps only the 0–160 needle, leaves numeric pace uncapped and retains average WPM in HUD/results. Added browser regression cases for all routes and pace/pause/idle behavior. TT-510 distinct fleet and physical-device acceptance remain; existing-page redesign does not complete Phase 6 onboarding. See docs/IMMERSIVE_APP.md and ADR 0006.

## Remaining design and production work

Package versions and implemented module boundaries are pinned/documented; future schema/provider interfaces still need their integration checks. Author and review all 300 levels in phase 8. Extend the original art/music library for later chapters and continue recording asset provenance. Playtest bot speeds, pacing, progression, reward balance and animation intensity. Measure performance on named hardware/browsers rather than assuming targets are met. Validate/select the cloud persistence provider before integration, implement optional accounts/sync by phase 9 and test before single-player launch. Select/deploy the live race service in phase 11. No cloud project or database exists now.

These are tracked future tasks, not missing claims of implemented functionality. Proposed numeric defaults can change, with rules/content/save version changes when required.

## How to answer future status questions

Report: current phase and subtask; what changed since the last update; what works versus what is only designed; checks actually run; relevant commit/branch; blockers or uncertainties; and the next concrete deliverable. Keep this file and the changelog/milestone notes synchronized with the code.

Do not give an overall percentage by dividing completed phases: phases differ substantially in size. The foundation, typing engine and playable race are implemented; Phase 5 device acceptance and later systems remain outstanding. Introduce a percentage only when a stable scoped task checklist exists, label its denominator, and avoid implying it measures time or effort remaining.

Useful supporting documents: [game plan](GAME_DESIGN_PLAN.md), [rule/storage baseline](docs/RULES_AND_STORAGE_BASELINE.md), [research](IMPLEMENTATION_RESEARCH.md), [engineering conventions](docs/ENGINEERING_CONVENTIONS.md), [GitHub workflow](docs/GITHUB_WORKFLOW.md).

Newest scope and service contract: [responsive and online architecture](docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md).

## Archived current-position notes before this handoff

These earlier checkpoint statements are retained as history. They are superseded by the current-position section above, particularly the alpha.8 theme, original mastered assets and cancellation of personal-file music. Their CI/device observations apply only to the named earlier source.

### Earlier checkpoint narrative

**Latest: alpha.8 replaces the rejected burgundy gradient with graphite, metallic crimson and cyan lighting, and replaces the rejected oscillator loop with two distinct rendered original masters: Nightforge (browsing) and Overdrive (racing).** Personal-file controls/loader were removed at the user's explicit request. The separate countdown remains. Source, deterministic asset generator, audio lifecycle and recreation are documented in docs/AUDIO.md. The full local check passes: formatting/types/build, 87 unit and 78 browser cases; final desktop/phone captures are in docs/images/alpha8. Physical ASUS/Samsung listening and final Phase 5 acceptance remain open. Older alpha.6/7 descriptions below are historical, not the current product direction.


**Latest implementation: alpha.7 removes the hub preview side gutters, adds energetic menu percussion and a separate countdown score, and integrates visit-only personal audio-file playback.** No Misirlou recording was supplied/downloaded/bundled. The full baseline check passed (87 unit / 78 browser); the final countdown-unlock regression brings the passing unit total to 88. Final rebuilt preview/audio/polish verification passed 18 browser cases; full-width desktop/phone captures are in docs/images/alpha7. Technical regression evidence is in docs/TESTING.md; actual ASUS/Samsung listening and visual acceptance remain open. This is Phase 5 refinement with existing-page integration, not completion of Phase 6 onboarding or later phases.


**Latest visual update: 0.1.0-alpha.6 applies the requested red-and-black theme to all existing routes, both Phaser scenes, the player kart and Live WPM dial.** Formatting, strict types and production build pass; 18 focused browser cases pass across desktop/phone/tablet Chromium. Scripted screenshots and palette recreation details are in docs/IMMERSIVE_APP.md. This is a Phase 5/6 visual refinement, not completion of the remaining fleet, onboarding or device gates. Alpha.5 full-suite/CI evidence below remains historical; Theme source `dec855d` is pushed in PR #4; hosted [run 39521010519](https://github.com/sahilshah2904/TurboType/actions/runs/39521010519) was still running at handoff, so no new hosted pass is claimed.

**Phases 1–4 remain complete for their agreed scopes. Phase 5 redesign is integrated into the normal application as 0.1.0-alpha.5; the full local check passed with 83 unit and 72 browser cases; new physical-device acceptance remains open. Phase 6 existing-page visual work is also implemented, but cinematic opening/tutorial/calibration remain unstarted.** The user approved the TT-507 kart direction and then explicitly requested a realtime speedometer and revamp of all existing pages. The actual Race route now has a responsive full-window Phaser kart scene, one visible typing surface, moving exhaust, setup/pause/results controls and a recent-WPM dial. Hub, Practice, Keyboard check and Settings share the open full-window world. Rules remain 3; save/content remain 1. Distinct fleet art and final device/performance acceptance are still pending. [Implementation guide](docs/IMMERSIVE_APP.md).

Current branch is `feat/race-polish`, in [PR #4](https://github.com/sahilshah2904/TurboType/pull/4). Earlier cdd8e4a/e62ea47 CI/test results certify the prior implementation only. Implementation `2a2c11b` is pushed; new local verification is 83 unit / 72 browser (exit 0), and hosted Linux [run 39519820938](https://github.com/sahilshah2904/TurboType/actions/runs/39519820938) passed for that exact source. See docs/TESTING.md; old 83/66 evidence remains historical. PR #4 is not merged, Pages/backend are not deployed, and no Misirlou recording is bundled. The review prototype's local-file player remains separate from the production original synth score (TT-514).

Available-device ASUS/Samsung checks must be repeated for the integrated design, native keyboard, gauge readability and new renderer/texture performance. The old software profile does not certify this renderer. Physical iPhone/tablet and missing environment metadata remain TT-1008. Campaign maps/content, progression/cloud saves, cinematic onboarding and launch remain future work.

“Design baseline complete” means all major systems have defined behavior and a delivery/verification plan. It does not mean every passage is authored, balancing is playtested, every technical detail is fixed, or any feature is implemented. Defaults may change through documented decisions when implementation exposes evidence.

Latest scope update: phones/tablets/laptops are first-release targets. Design account/data/network boundaries in phase 2, add optional cloud-backed single-player progress before the public launch, and implement friends multiplayer immediately afterward. Supabase Auth/Postgres is the recommended persistence candidate; no provider project is selected/provisioned yet. See docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md.
