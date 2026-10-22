# TurboType project continuity

## Alpha.16 — starter tracks and paired reward plan, 22 October 2026

The user accepted the compact score/metrics presentation and requested Final standings expanded by default below it. This supersedes alpha.15's collapsed default; the disclosure can still be closed manually. Implemented on codex/results-and-fire-dial / open PR #5, which already contains alpha.15. No merge or deployment is implied by acceptance of the previous presentation.

Five starter environments are now implemented for Hub preview and Quick Race: Neon Harbor, Coral Coast, Copper Canyon, Emerald Trail and Frostline Pass. Track choice is a validated optional browser preference; the active race pins its track through countdown/pause/navigation/final state, and retry applies the next chosen preference. Original bounded geometric scenery, road/edge palettes and shared renderer preserve the typing/CPU/rules behavior. Rules 3 and save/content 1 remain.

New required future scope: eighteen reward tracks paired with the eighteen car milestones, for 23 tracks and 23 cars total. Earn at 15/30/45/60/75/90 eligible unique main clears independently in each category; globally use any owned pair across Easy/Medium/Hard on already-unlocked levels and replays. Replay cannot inflate earnings or open locked nodes. docs/TRACK_PROGRESSION.md records all IDs/briefs, receipt/cloud rules and phase placement: Phase 7 briefing/replay selection, Phase 8 authoring/defaults, Phase 9 ownership/unlocks/saves. No real campaign/reward unlock/save/cloud system is claimed by the starter preference. Keep Phase 6 opening/tutorial next in the main roadmap; preserve all eleven phases.

Manual review stays at the existing LAN link http://192.168.0.31:5173/TurboType/. The server and active feature checkout are preserved. See docs/TESTING.md for current verification; do not reuse alpha.15's hosted pass for this new source. Starter visuals await review; no repeat review of accepted cars/music/palette is needed.

## Current presentation follow-up — 22 October 2026

Alpha.15 on `codex/results-and-fire-dial` adds the user's compact Race results and original SVG fire instrument. This branch starts at accepted main `e1bbaff`; PR #4 remains merged as de464ce. The Phase 5 checkpoint below is the accepted alpha.14 baseline. New presentation changes need their own review/acceptance before merge; no Phase 6 onboarding or deployment is implied. Read the newest sections in PROJECT_STATUS.md, docs/SESSION_HANDOFF.md and docs/TESTING.md for exact validation and PR state.

The user's manual review should use the already-running LAN server at http://192.168.0.31:5173/TurboType/ rather than spawning visible test windows. It serves the active local branch immediately, not a main-only deployment. Keep automated regressions headless and isolated on 4173; preserve the existing 5173 server. Compact results retain optional honest CPU standings and DNF progress; fire stays static when paused/finished, in Low effects or Reduced motion. Scoring, saved data and accepted vehicle/audio direction remain unchanged.

## Read first in a new chat

1. Read [PROJECT_STATUS.md](PROJECT_STATUS.md), [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md) and [BACKLOG.md](BACKLOG.md) before reporting progress or starting work. The handoff records accepted decisions, source paths, evidence, limitations and next steps; the previous chat is not required.
2. Inspect actual Git status/branch/log/remotes and exact-source main checks. [PR #4](https://github.com/sahilshah2904/TurboType/pull/4) is merged. Preserve intervening edits and update status/backlog/docs after meaningful work; never infer success from an older run.
3. Phase 5 is complete for its agreed scope. Do not repeat accepted laptop checks or reopen Phase 5 just because older historical paragraphs describe unfinished work. Start Phase 6 implementation only when requested; merging source is not deployment.

## Current checkpoint — 22 October 2026

- App **0.1.0-alpha.14**, rules **3**, save/content **1**. Implementation **2eadeef**, final acceptance head **398d455**; exact PR run **39727202033** passed. PR #4 merged into main as **de464ce**. This post-merge documentation creates a newer main head with its own check; inspect actual HEAD.
- Workspace: S:/AI_Engineer_Journey/Projects/TurboType. Account/repository: sahilshah2904/TurboType; local author **Sahilshah**. Current checkout **main**; feature history remains feat/race-polish. Main now contains the accepted Phase 5 game.
- Phases **1–5 complete for agreed scope**. Five accepted models have independent chassis/wheel parts and shared race/hub anchors, tested effects/audio/input/fullscreen/readability and bounded actual-GPU evidence. Phase 6 existing-page visuals are partial; cinematic loading/welcome/rules/tutorial/calibration are not implemented.
- Final local full check: formatting/types/build, **96 unit / 36 browser cases**; final exports also passed four garage cases. Actual-GPU guarded High/Low/Reduced samples and twelve route cycles per preset are documented in docs/PERFORMANCE_ALPHA14.md.
- User accepted the final physical checklist (“I believe everything worked fine”). Reviewed 120-second session: **100 trusted racing keys**, 99 trusted inputs, zero page errors, accelerated AMD Direct3D11, median/p95/max handler-to-next-rAF **9.3/18.8/22.2ms**. Summary: docs/performance/alpha14-physical-input.json. This is available-laptop acceptance and bounded timing evidence, not universal FPS, OS-to-photon or GPU-memory certification; broader release testing remains Phase 10.
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
- Phase 5 is integrated; use current main as the base for the next authorized feature branch. Keep feat/race-polish as history unless cleanup is requested. No automatic commit/watchers. Source pushes are not deployments. A documented main README/screenshot-only update must not import unfinished app code.
- Node 24.13.0 / npm 11, pinned lockfile; npm run check is the full check. Playwright preview uses 4173, two SwiftShader workers. Do not kill the existing user-owned Vite server on 5173 blindly. Do not run browser suites/captures/profiling concurrently on the limited-memory workstation.
- CI emails were real: combined garage tests exceeded 30 seconds in duplicate push/PR runs. Alpha.13 splits cases without raising timeouts, runs feature checks on PR updates/main on push/manual, and cancels superseded runs. Do not mute notifications, disable checks or claim all copies passed from one successful run. Inspect current head/event/conclusion.
- Keep reference media/analysis tools ignored under Reference_Images/. Ship only original/appropriately licensed assets/audio and record provenance. Raster masters/prompts are not editable 3D meshes. Alpha.14 now renders independent original wheels and chassis; see the current closeout and accepted physical evidence.

## Resume order

Audit the current main/source checks, then begin Phase 6 when requested: cinematic loading with real asset status/skip/replay/recovery, welcome/rules, correction/streak tutorial, optional calibration and final first/returning-player navigation. Move the Quick Race seed into Advanced/Replay; campaign settings come from level definitions. Then Phase 7 maps, Phase 8 curriculum, Phase 9 rewards/learning/guest and optional cloud saves, Phase 10 release/Pages, Phase 11 friends. Keep all eleven phase numbers and distinguish planned, implemented, tested, accepted and deployed.
