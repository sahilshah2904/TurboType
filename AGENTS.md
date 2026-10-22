# TurboType project continuity

## Read first in a new chat

1. Read [PROJECT_STATUS.md](PROJECT_STATUS.md), [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md) and [BACKLOG.md](BACKLOG.md) before reporting progress or starting work. The detailed handoff records accepted decisions, source paths, checks, CI history, limitations and exact next steps; the previous chat is not required.
2. Inspect actual Git status/branch/log/remotes, PR #4 and exact-source hosted checks. Preserve intervening edits. Update status/backlog/docs after meaningful work; never infer success from an older run.
3. The user asked to save the handoff and continue later. Do not start another implementation phase, merge or deploy merely because this handoff exists.

## Current checkpoint — 21 October 2026

**22 October active override:** the user authorized Phase 5 implementation. Alpha.14 now has independent chassis/wheel assets and compact previews for all five accepted cars, full local 96-unit/36-browser evidence, and actual-GPU synthetic-input profiling. See docs/PHASE5_CLOSEOUT.md and docs/PERFORMANCE_ALPHA14.md. Final physical keyboard/new-parts acceptance and PR #4 integration remain; use the two-minute recorder/checklist in docs/PHASE5_POLISH_TESTS.md. The old stop-and-save instruction below is historical. Do not merge before reviewing that remaining evidence/report. Latest source/check hashes must be re-read from Git/CI after pushes.

Alpha.14 implementation `2eadeef`, identical-tree history sync `d168720`; hosted PR run **39725624773** passed for exact d168720. The sync resolved only the README conflict with main's documentation publication. Subsequent evidence-only documentation commits have separate checks. PR #4 remains open/unmerged; physical follow-up and integration remain, with no deployment.

- App **0.1.0-alpha.13**, rules **3**, save/content **1**. Latest implementation b76392b; verified documentation checkpoint 717c76e. This handoff creates newer documentation commits; inspect actual HEAD.
- Workspace: S:/AI_Engineer_Journey/Projects/TurboType. Account: sahilshah2904; repository: TurboType; local author: **Sahilshah**. Current branch: **feat/race-polish**; open/unmerged [PR #4](https://github.com/sahilshah2904/TurboType/pull/4).
- Main code is the accepted Phase 4 baseline. Publishing the README/screenshots on main does not merge the preview or deploy a game.
- Phases **1–4 complete for agreed scope**. **Phase 5 remains open** for separate body/wheel art and measured hardware performance/tuning/final integration (TT-501/510, TT-505/506/511–513/522). Main visible features are implemented/tested. Do not mark complete just because tests pass.
- Existing-page Phase 6 visuals are partial; cinematic loading/welcome/rules/tutorial/calibration are not implemented.
- Local checks: formatting/types/build, **93 unit / 35 desktop browser cases**, 12 repeated garage executions and final three fullscreen/readability cases passed. Hosted run **39581833203** passed for b76392b; **39582296673** passed for 717c76e. Handoff changes have their own CI. Evidence: docs/TESTING.md and docs/images/alpha13.
- No Pages game, database, account provider, cloud saves or multiplayer deployed. Only preferences persist; race/results are in memory. Three short exercise passages are not the 300 campaign levels.

## Authoritative product decisions

- **Laptop/desktop physical-keyboard typing only.** Phone/tablet compatibility/testing and mobile keyboard/rotation work were explicitly canceled. Retain laptop resizing (960 CSS px minimum; verify 1024/1366/1440/1920), accessibility and hardware IME composition. Historical mobile requirements are superseded.
- Solo against **four seeded CPUs** first. Plan **100 levels each in Easy/Medium/Hard**, rightward maps with numbered circular locked/unlocked stages, chapters/bonuses. Design auth/storage/network boundaries early; optional account-backed cloud progress before public solo launch; friends multiplayer immediately afterward. Supabase is a candidate, not provisioned infrastructure.
- Preserve the eleven phase numbers. Distinguish designed, implemented, tested, accepted and deployed. Never estimate completion by counting phases.
- Accepted appearance: full-window kart racing/open city pages, restored **graphite/crimson/cyan** palette, five distinct original starter silhouettes, one native-backed visible typing strip, Live WPM gauge and exhaust flames. Old boxes/retro cars and the red/gold variation were rejected. Do not restart palette experimentation.
- Choose a starter **only before countdown**. It stays locked through the whole race, including pauses/navigation; retry/new race reopens selection. Alpha.12 paused switching is superseded. Remember the cosmetic choice and show it in hub/preview; CPUs use other models. Cars never change gameplay performance.
- **Sound controls only in Settings.** No hub radio section, Race audio controls or personal-music chooser. Accepted original **Ignition** browsing and **Overdrive** racing masters; separate countdown/FX. Do not restore Nightforge, the old oscillator loop, Misirlou or uploads.
- Shared **44px top-right fullscreen/restore icon on all routes**; important prose/controls 16px+, compact metadata 14px, brighter secondary text. Keep Low effects, Reduced motion and Larger typing text.
- The user accepted the cars/music/palette and reported the other laptop tests good. Do not repeat those approvals. That report is not physical presented-frame-rate/keyboard-latency certification; latest alpha.13 controls/fonts have automated/layout evidence.
- **22 October reward correction:** unlock a distinct new car every **15 eligible main-level clears within each category**: 15/30/45/60/75/90 in Easy, Medium and Hard, each with 100 levels. This means **18 rewards plus five starters**, superseding the ten-car/global-clear curve. Category counters are independent; replay/bonus/Practice do not inflate them. Future Phase 8/9 TT-911, not a Phase 5 blocker. See docs/GARAGE_PROGRESSION.md for IDs/art/ownership/save/cloud rules.

## Engineering, documents and Git

- Product decisions: GAME_DESIGN_PLAN.md; designed defaults: docs/RULES_AND_STORAGE_BASELINE.md; implemented semantics: docs/GAME_RULES.md, docs/QUICK_RACE.md and source. Research/reference observations: IMPLEMENTATION_RESEARCH.md and docs/REFERENCE_VIDEO_ANALYSIS.md. Latest explicit user decisions override older prose, including outdated mobile statements.
- Follow docs/ENGINEERING_CONVENTIONS.md and docs/GITHUB_WORKFLOW.md for naming, versions, checks and commit/push. Keep docs/tests/backlog with behavior changes. Preserve stable task IDs; separate required from optional; mark complete only with evidence.
- Short plain-English commits, **no conventional prefixes**. Never rewrite shared commits or force-push. Do not invent author identity or expose credentials. Existing Windows GCM authentication is available; never print its password/token.
- Reuse the current feature checkout for unfinished Phase 5. No automatic commit/watchers. Source pushes are not deployments. A documented main README/screenshot-only update must not import unfinished app code.
- Node 24.13.0 / npm 11, pinned lockfile; npm run check is the full check. Playwright preview uses 4173, two SwiftShader workers. Do not kill the existing user-owned Vite server on 5173 blindly. Do not run browser suites/captures/profiling concurrently on the limited-memory workstation.
- CI emails were real: combined garage tests exceeded 30 seconds in duplicate push/PR runs. Alpha.13 splits cases without raising timeouts, runs feature checks on PR updates/main on push/manual, and cancels superseded runs. Do not mute notifications, disable checks or claim all copies passed from one successful run. Inspect current head/event/conclusion.
- Keep reference media/analysis tools ignored under Reference_Images/. Ship only original/appropriately licensed assets/audio and record provenance. Raster masters/prompts are not editable 3D meshes. Alpha.14 now renders independent original wheels and chassis; see the current closeout and physical acceptance gate.

## Resume order

Read the detailed handoff; audit current Git/CI; finish the remaining Phase 5 art/performance gates and reconcile backlog; verify/review/integrate PR #4 when appropriate. Then Phase 6 opening/tutorial, Phase 7 maps, Phase 8 curriculum, Phase 9 rewards/learning/guest and optional cloud saves, Phase 10 release/Pages, Phase 11 friends. The 22 October request authorizes the remaining Phase 5 work; the earlier stop-and-save request is historical. Retain final physical acceptance before integration.
