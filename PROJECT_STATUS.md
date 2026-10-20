# TurboType project status

Last reviewed: 20 October 2026. This file is the persistent status source for future progress questions. Update it with each meaningful implementation change and verify claims against the actual repository, checks, and deployment. Do not rely on chat memory alone.

[BACKLOG.md](BACKLOG.md) is the persistent future-work checklist with stable task IDs, phase grouping, dependencies and optional ideas. Read it before starting a phase and update it when deferring or completing work.

## Current position

**Phases 1–3: complete for their agreed scopes, with documented release-test exceptions. Phase 4: complete for agreed scope, with ASUS/Samsung user acceptance recorded (TT-404).** Current branch `feat/solo-race` adds Quick Race with four seeded CPUs, a five-lane Phaser track, exact standings/results, retry and graphics recovery. Local formatting/types/build, 69 unit tests and 54 Chromium profile checks pass. Phase 2/3 PRs are merged into main baseline `08cddb4`; Phase 4 implementation `e4e664d` is under review in [PR #3](https://github.com/sahilshah2904/TurboType/pull/3); hosted Linux checks passed in [run 39441154770](https://github.com/sahilshah2904/TurboType/actions/runs/39441154770).

The user reported all five requested Phase 4 race checks working on ASUS/Samsung, including typing/correction, pause/resume, finish/retry and phone keyboard/rotation. TT-404 is closed on that report. They requested metrics above the race so the course leads directly into passage/input; that layout adjustment is included in the current PR. Phase 5 has not started. Physical iPhone/tablet coverage and missing browser/OS/keyboard metadata remain release-gate TT-1008. Cloud saves, modern car art, music, campaigns and public deployment remain future work. See docs/TESTING.md for actual evidence.

“Design baseline complete” means all major systems have defined behavior and a delivery/verification plan. It does not mean every passage is authored, balancing is playtested, every technical detail is fixed, or any feature is implemented. Defaults may change through documented decisions when implementation exposes evidence.

Latest scope update: phones/tablets/laptops are first-release targets. Design account/data/network boundaries in phase 2, add optional cloud-backed single-player progress before the public launch, and implement friends multiplayer immediately afterward. Supabase Auth/Postgres is the recommended persistence candidate; no provider project is selected/provisioned yet. See docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md.

## The eleven phases

| Phase | Scope | Status | Evidence / completion requirement |
| --- | --- | --- | --- |
| 1 | Finalize design | Baseline complete | Game plan, research, reference analysis, engineering conventions, and RULES_AND_STORAGE_BASELINE.md; tuning and production work explicitly separated |
| 2 | Set up application | Foundation complete, with exceptions | Code/local/CI checks and available ASUS/Samsung checks recorded. TT-204 closed with word-completion work moved to TT-305 and unavailable iOS/tablet verification to TT-1008; not blanket device certification |
| 3 | Build typing engine | Complete for agreed scope | TT-301–305 implemented/verified, 48 unit/39 browser checks and user-reported ASUS/Samsung strict-input acceptance; broader device evidence remains TT-1008 |
| 4 | Complete playable race | Complete for agreed scope | TT-401–404 complete: core/browser evidence and user-reported ASUS/Samsung race checks; requested metrics-above-track layout included |
| 5 | Polish racing experience | Not started | Detailed cars, effects, scenery and audio profiled in an actual race |
| 6 | Opening and onboarding | Not started | Entrance/loading, rules, interactive tutorial/calibration and hub verified on first and returning visits |
| 7 | Campaign maps | Not started | Three rightward 100-node maps, locks, accessibility, saved location/progress |
| 8 | All 300 levels | Not started | 300 reviewed playable definitions/passages, progression curve, chapter/bonus events; manifest validation |
| 9 | Progression and learning | Not started | Garage/rewards/coaching/drills; local guest saves plus optional permanent-account cloud progress, sync/conflicts, migrations, access policies and recovery |
| 10 | Test and launch single-player | Not started | Real phone/tablet/laptop play, cross-device account sync, access controls, browser/performance/accessibility evidence, CI/Pages workflow and live test |
| 11 | Friends multiplayer | Next after single-player launch | Reuse account/database foundation; choose race service, add invites/lobbies, synchronized races/reconnects, multiple-client verification and deployment docs |

Phases 2–10 may overlap where dependencies require it: for example, save settings belong in the foundation before full progression. Never count a whole phase complete because a shared prerequisite exists. The game plan's engineering milestones M0–M6 group this work differently: M0 = phase 1, M1 = phase 2, M2 = phases 3–4, M3 = phases 5–6 and the complete slice, M4 = phases 7–9, M5 = phase 10, M6 = phase 11. This table is the user-facing phase numbering.

## Completed work

- Reviewed screenshots and researched rendering, UI animation, GitHub Pages hosting, and later multiplayer options.
- Reviewed timestamp samples from the supplied reel recording; documented observations separately from inferred mechanics.
- Defined onboarding, cinematic loading, typing rules, CPUs, correction/penalty behavior, stars, progression, bonuses, results, and the original/licensed soundtrack direction.
- Defined three independent 100-level campaigns, chapter structure, rightward circular-node maps, locks, replay, and Driver Rank.
- Created the public repository at https://github.com/sahilshah2904/TurboType and linked this local checkout as origin.
- Set the repository-local Git author to the user's supplied name Sahilshah; committed and pushed planning documentation.
- Added naming/versioning/change-management conventions, formatting settings and ignore rules. Reference media remain local.
- Audited rule/storage gaps and selected explicit implementation defaults; see the baseline document.
- Implemented the Phase 2 foundation with a clean lockfile install, passing formatting/types/build, 20 unit tests and 18 Chromium profile tests; visually caught/fixed SVG texture sizing. Setup, architecture, ADRs, assets and test evidence are documented. Physical device coverage is not claimed.
- Pushed implementation commit 5534591 (`Build the responsive app foundation`) and opened pull request #1; hosted Linux checks passed in run 39404088628. The branch is not merged and Pages is not deployed.
- Recorded Samsung S25 Ultra/ASUS user checks: input/editing, phone rotation and keyboard reopening, Clear text/next-key highlighting, settings persistence and browser-tab return. Word completion remains possible; TT-305 covers the actual race adapter and eligibility. With no iPhone/tablet available, TT-1008 carries unverified coverage/metadata forward as a release gate. Phase 2 foundation is complete with those explicit exceptions; Phase 3 subsequently implemented the strict practice adapter; its physical retest was subsequently accepted by user report (TT-305).

- Implemented Phase 3 pure typing/timing/metrics, validated shared standings, strict DOM input adapter and practice sprint with countdown, correction, pause/navigation preservation, timed expiry and frozen results. Rules version is 2; app is 0.1.0-alpha.2. No rewards/results are persisted. Local formatting/types/build, 48 unit and 39 browser checks pass. The available-device strict-input checklist was subsequently accepted by user report (TT-305); detailed native prediction traces remain unavailable.

- Pushed typing implementation commit `0e19dcf` (`Build the typing engine and practice sprint`) and opened [PR #2](https://github.com/sahilshah2904/TurboType/pull/2) against `feat/app-foundation`. Hosted Linux checks passed in [run 39418022536](https://github.com/sahilshah2904/TurboType/actions/runs/39418022536). It is intentionally stacked on foundation PR #1; neither is merged or deployed.

- User accepted Phase 3 after reporting all requested laptop/phone tests working and supplying five laptop screenshots. TT-305 is complete by this available-device report. Normal textarea resizing was observed and retained. Fixed the stale paused notice visible after timed expiry; transition messages now match countdown/racing/final states, with regression coverage (TT-306). Phase 4 implementation has not started.

- Merged foundation PR #1 (`3cd9dd9`) and typing PR #2 (`08cddb4`) into main after successful head checks, preserving history. Phase 4 branch `feat/solo-race` starts from that main baseline. No Pages deployment occurred.
- Implemented seeded four-CPU Quick Race, shared active clock, live five-lane scene/standings, final simulated CPU outcomes, optional 60-second DNF, pause/navigation preservation, same-seed retry and graphics/context-loss recovery. App 0.1.0-alpha.3 / rules 3; original prototype art retained. Local formatting/types/build, 69 unit and 54 Chromium profile checks pass. Visually inspected desktop/phone race layouts; this is not physical-keyboard or measured frame-rate certification. Detailed recreation and the accepted TT-404 user-check procedure are in docs/QUICK_RACE.md and docs/PHASE4_RACE_TESTS.md.

- User accepted all five requested Phase 4 checks on ASUS/Samsung and supplied a paused-race laptop screenshot. Closed TT-404 on the available-device report, retaining broader device/metadata release gates. Moved status/metrics above the course, leaving track → passage → typing unobstructed. The current three short exercise passages remain a functional preview; longer progressive campaign content is Phase 8, with learning goals and reviewed lengths already planned.

## Remaining design and production work

Implementation must determine tested package versions/API compatibility and detailed module interfaces. Author and review all 300 levels in phase 8. Produce original art/music and verify asset provenance. Playtest bot speeds, pacing, progression, reward balance and animation intensity. Measure performance on named hardware/browsers rather than assuming targets are met. Validate/select the cloud persistence provider before integration, implement optional accounts/sync by phase 9 and test before single-player launch. Select/deploy the live race service in phase 11. No cloud project or database exists now.

These are tracked future tasks, not missing claims of implemented functionality. Proposed numeric defaults can change, with rules/content/save version changes when required.

## How to answer future status questions

Report: current phase and subtask; what changed since the last update; what works versus what is only designed; checks actually run; relevant commit/branch; blockers or uncertainties; and the next concrete deliverable. Keep this file and the changelog/milestone notes synchronized with the code.

Do not give an overall percentage by dividing completed phases: phases differ substantially in size. The foundation is now implemented, while playable racing and later systems remain future work. Introduce a percentage only when a stable scoped task checklist exists, label its denominator, and avoid implying it measures time or effort remaining.

Useful supporting documents: [game plan](GAME_DESIGN_PLAN.md), [rule/storage baseline](docs/RULES_AND_STORAGE_BASELINE.md), [research](IMPLEMENTATION_RESEARCH.md), [engineering conventions](docs/ENGINEERING_CONVENTIONS.md), [GitHub workflow](docs/GITHUB_WORKFLOW.md).

Newest scope and service contract: [responsive and online architecture](docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md).
