# TurboType project status

Last reviewed: 20 October 2026. This file is the persistent status source for future progress questions. Update it with each meaningful implementation change and verify claims against the actual repository, checks, and deployment. Do not rely on chat memory alone.

[BACKLOG.md](BACKLOG.md) is the persistent future-work checklist with stable task IDs, phase grouping, dependencies and optional ideas. Read it before starting a phase and update it when deferring or completing work.

## Current position

**Phase 1: design baseline complete. Phase 2: foundation complete with documented verification exceptions. Phase 3: ready to start, not implemented.** The available Samsung S25 Ultra and ASUS checks passed by user report; the word-completion finding is tracked as required Phase 3 task TT-305. The user has no iPhone/tablet; their physical coverage and missing environment metadata explicitly move to release-gate TT-1008, not a claim of passed tests. The foundation branch is unmerged; gameplay, cloud saves, music and public deployment remain unimplemented. See docs/TESTING.md.

“Design baseline complete” means all major systems have defined behavior and a delivery/verification plan. It does not mean every passage is authored, balancing is playtested, every technical detail is fixed, or any feature is implemented. Defaults may change through documented decisions when implementation exposes evidence.

Latest scope update: phones/tablets/laptops are first-release targets. Design account/data/network boundaries in phase 2, add optional cloud-backed single-player progress before the public launch, and implement friends multiplayer immediately afterward. Supabase Auth/Postgres is the recommended persistence candidate; no provider project is selected/provisioned yet. See docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md.

## The eleven phases

| Phase | Scope | Status | Evidence / completion requirement |
| --- | --- | --- | --- |
| 1 | Finalize design | Baseline complete | Game plan, research, reference analysis, engineering conventions, and RULES_AND_STORAGE_BASELINE.md; tuning and production work explicitly separated |
| 2 | Set up application | Foundation complete, with exceptions | Code/local/CI checks and available ASUS/Samsung checks recorded. TT-204 closed with word-completion work moved to TT-305 and unavailable iOS/tablet verification to TT-1008; not blanket device certification |
| 3 | Build typing engine | Not started | Correction/scoring/timing/pausing/streak state with behavioral tests |
| 4 | Complete playable race | Not started | Four CPUs, countdown, passage, positions, finish/results/retry working end to end |
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
- Recorded Samsung S25 Ultra/ASUS user checks: input/editing, phone rotation and keyboard reopening, Clear text/next-key highlighting, settings persistence and browser-tab return. Word completion remains possible; TT-305 covers the actual race adapter and eligibility. With no iPhone/tablet available, TT-1008 carries unverified coverage/metadata forward as a release gate. Phase 2 foundation is complete with those explicit exceptions; Phase 3 has not started.

## Remaining design and production work

Implementation must determine tested package versions/API compatibility and detailed module interfaces. Author and review all 300 levels in phase 8. Produce original art/music and verify asset provenance. Playtest bot speeds, pacing, progression, reward balance and animation intensity. Measure performance on named hardware/browsers rather than assuming targets are met. Validate/select the cloud persistence provider before integration, implement optional accounts/sync by phase 9 and test before single-player launch. Select/deploy the live race service in phase 11. No cloud project or database exists now.

These are tracked future tasks, not missing claims of implemented functionality. Proposed numeric defaults can change, with rules/content/save version changes when required.

## How to answer future status questions

Report: current phase and subtask; what changed since the last update; what works versus what is only designed; checks actually run; relevant commit/branch; blockers or uncertainties; and the next concrete deliverable. Keep this file and the changelog/milestone notes synchronized with the code.

Do not give an overall percentage by dividing completed phases: phases differ substantially in size. The foundation is now implemented, while playable racing and later systems remain future work. Introduce a percentage only when a stable scoped task checklist exists, label its denominator, and avoid implying it measures time or effort remaining.

Useful supporting documents: [game plan](GAME_DESIGN_PLAN.md), [rule/storage baseline](docs/RULES_AND_STORAGE_BASELINE.md), [research](IMPLEMENTATION_RESEARCH.md), [engineering conventions](docs/ENGINEERING_CONVENTIONS.md), [GitHub workflow](docs/GITHUB_WORKFLOW.md).

Newest scope and service contract: [responsive and online architecture](docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md).
