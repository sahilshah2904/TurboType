# TurboType session handoff

## Collection selection follow-up — alpha.26

Verification:125 unit tests/format/content/types/build pass; broad browser117/119 exposed two stale harness assumptions, then corrected final-source34/34 focused cases passed, including the two new loading-interruption guards. Six sequential current captures have zero page errors. See docs/TESTING.md for exact scope/logs; this is not a claimed single full121-case local pass. New exact-head hosted checks are separate. Previously accepted alpha.25 head90e9742 passed run39967016807/job120459414784 before these edits.

The user moved equipment choice out of every race setup and level briefing into dedicated **Cars** and **Tracks** tabs. Each has a three-column scrollable collection: five selectable starters with enlarged detail previews, then dark, non-interactive planned reward silhouettes sorted by milestone first and Easy/Medium/Hard second. Cars:15/30/45/60/75/90 (18+5=23); tracks:10/25/40/55/70/85/100 (21+5=26). Bonuses remain excluded from those counters. This supersedes the alpha.25 briefing-selection/Quick Race picker decision.

Saved starter equipment applies to every new campaign/bonus/Quick Race. Any countdown/racing/paused session globally blocks selection, including synthetic events; previews remain available. The explicit “End current races to change selection” action abandons unfinished runs without rewards and releases that lock. Finished/abandoned session visuals retain their pinned equipment; retry reads the new preference. Existing independent starter preferences and campaign data are preserved; no ownership/save-schema migration is introduced.

A map node still opens its single details dialog; its Race/Replay button starts the countdown automatically after artwork is ready. No second setup confirmation appears. Direct race URLs and retry/resume retain explicit start controls, including artwork/text fallback recovery. Quick Race still offers passage/pace/mode/seed setup but no equipment selector. Hub shows saved equipment and links to the collections. All artwork/ownership beyond the five starters remains **planned and locked**, not falsely earned from current progress; full reward art/receipts/guest/cloud delivery stays Phase 9. No merge, deployment or general Phase 9 start is authorized. See docs/COLLECTIONS.md for implementation and focused checks.


## Phase 8 review follow-up — alpha.25

The user resumed and reports the rest of Phase 8 works well. Only two requested corrections remain for review: choose the campaign/bonus car and track once in the map briefing, then show a read-only setup summary instead of another car picker; remove the flame under the TurboType title while preserving the moving car's trail. Quick Race retains its chooser and each active session keeps its locked cosmetics. Implemented on the existing PR #8 branch; fresh format/types/build and 125 unit/43 focused browser cases pass. New exact-head hosted checks are separate. No merge, Phase 9 or deployment. This supersedes the older stop-and-save instruction and title-underlay decision below. Do not repeat the accepted curriculum/progress checks.


## Stop-and-save checkpoint — 23 October 2026

The user explicitly asked to update README/handoff and continue later because of usage limits. **Stop after saving; do not implement, merge, deploy or start Phase 9 from this handoff.** Resume only when requested.

Current checkout: codex/phase8-curriculum; PR #8 is open/unmerged. Latest verified pre-save head **d96f23cd21d2eedc4b41490324eb56a635a09b65** passed exact-head hosted **run39889378905/job120205188148**, observed completed/success during this audit. Implementation review source13b464d previously passed the full125 unit/116 browser suite in run39888045399/job120200909330; application/test/workflow code is unchanged since that source. Six current captures remain in docs/images/alpha24. This stop-and-save documentation commit receives its own CI; inspect its actual head/check later rather than inferring success.

Phase 8 implementation/automated verification is delivered; **human curriculum acceptance and PR integration remain pending**. Next session: read AGENTS/PROJECT_STATUS/SESSION_HANDOFF/BACKLOG, audit actual Git/PR/checks, then review the checklist in docs/PHASE8_CURRICULUM.md. Keep existing progress: refresh retention; 6→7 continuation and long-text look-ahead; locked50/100 passage preview without launch; bonus after chapter10 clear/replay/refresh without increasing main counts. Do not ask for repeated approval of accepted Phase7/cars/music/palette/opening/Keyboard check. Phase9 rewards/earned ownership/learning/guest/cloud remains future work.

No Pages/backend/account/cloud/multiplayer deployment. Preserve the user Vite server on5173; http://192.168.0.31:5173/TurboType/ serves this feature checkout. No tests/captures/profiling are running locally. Prior detailed source/decisions/limits remain below and in the archived checkpoints; the previous chat is not needed.


## Verified Phase 8 review checkpoint — 23 October 2026

Exact review source **13b464dd06bab566d6b672fb030fc36ae160ffed** (implementation aba056c) passed the full hosted [run 39888045399/job 120200909330](https://github.com/sahilshah2904/TurboType/actions/runs/39888045399/job/120200909330), completed **02:21:23 UTC**: formatting/content drift/types/build, **125 unit / 116 browser cases**, no retries/flaky cases (10.3 minutes for browsers). Downloaded log: Reference_Images/analysis/phase8-hosted-check.log (ignored). Six sequential current captures have zero page errors.

[PR #8](https://github.com/sahilshah2904/TurboType/pull/8) remains open/unmerged for user review. This documentation-only checkpoint changes no application/test/workflow code and has its own CI; inspect that later exact head rather than assuming the earlier pass covers it. No Phase 9 or deployment started. The earlier Phase 7 docs-only main check remains observed in dependency installation; never describe all historical runs as passed.


Implementation source **aba056c6f5b5c0f3b1f4091a4d10ab4a83fff03f** is pushed in [open PR #8](https://github.com/sahilshah2904/TurboType/pull/8). The current documentation checkpoint has identical application/test code. Inspect the current PR head and completed check_run/job; source pushes are not user acceptance or deployment. The PR body records the latest exact-head hosted outcome after verification.

## Current task — 23 October 2026

The user accepted alpha.23 Keyboard check, Phase 7 merged, and then requested updated GitHub README/handoff and completed Phase 8 with a manual checklist. Current implementation is on **codex/phase8-curriculum**, based on main **26a7f1d**. Inspect actual Git/PR/checks before reporting progress. No automatic merge, Phase 9 or deployment. Earlier continuity is archived in history/2026-10-23-before-phase8/; its branches/pending statements are historical.

Read ../AGENTS.md, ../PROJECT_STATUS.md, ../BACKLOG.md, PHASE8_CURRICULUM.md and newest TESTING.md. The previous chat is unnecessary.

## Accepted baseline

Phases 1–7 are complete for agreed scope. Phase 5 PR #4 merged de464ce after physical acceptance; see PHASE5_CLOSEOUT.md. Phase 6 PR #6 merged cf741b6 after accepted 3f6125c/run39801084219, with broader atmosphere polish deferred as TT-608. Phase 7 accepted b7d03f171b7900102f150c19bf1fbe862dad071a passed hosted run39881571584/job120179897342 at 01:07:30 UTC: 118 unit/80 browser cases. PR #7 merged 04eb38db636bc9ca74713f28082820265ee7fe7a; documentation 26a7f1d is on main. See PHASE7_CLOSEOUT.md.

The user accepted cars/music/palette/hardware checks, campaign unlock/refresh/replay/pause behavior, alpha.22 wrapped look-ahead/Quick Race/keyboard coverage/car-following fire, then alpha.23 strict Keyboard check. Do not ask them to repeat those approvals. Preserve five original starters with independent wheels, five tracks, graphite/crimson/cyan, full-window scenes, native typing, fire Live WPM/exhaust, compact metrics/standings open and Settings-only original Ignition/Overdrive/countdown sound. No rejected boxes/retro cars/red-gold, hub radio, uploads, Nightforge or Misirlou.

Laptop/desktop physical keyboards only; minimum 960 CSS px with checks at 1024/1366/1440/1920. Mobile/tablet/rotation work is canceled. Keep accessibility/hardware IME, Low effects, Reduced motion, Larger typing text and shared 44px fullscreen control. Wrong input blocks until Backspace. Paused/composed/assisted runs can finish for practice but cannot clear. Keyboard check shares the race engine/adapter with immediate countdownMs=0, no displayed timer/score and independent physical-key indicators; races retain three seconds.

## Phase 8 implementation

App 0.1.0-alpha.24 / typing rules 3 / content 3 / global future guest schema 1 / map schema 2. The two schema numbers describe different storage boundaries.

- src/content/curriculum/introductions.ts preserves all 18 accepted passage values at revision 1.
- stories.ts contains ten original anthologies and 160 standalone source paragraphs. authoring.ts supplies 30 explicit chapter objectives, category framing and deterministic whole-sentence excerpt assembly. catalog.json commits 282 new main passages and 30 bonuses. scripts/author-curriculum.mjs reproduces it offline; npm run content:check detects drift inside the full check. No runtime text generation, AI or service.
- src/content/campaign.ts defines all 300 main levels and 30 bonuses with stable IDs/revisions, prerequisites, objectives/skills, roles, seed/CPU bands/goals, shipped starter asset references and planned Phase 9 reward/milestone metadata. Finale lengths: 1,400 Easy / 2,158 Medium / 2,968 Hard characters. The first three races stay short; accepted levels 4–6 remain substantial. Distinct excerpts intentionally revisit chapter prose; these are not 330 unrelated stories or validated teaching gains.
- src/content/curriculum/validate.ts and curriculum.test.ts independently validate identity/counts/numbering, text uniqueness/bounds/category restrictions, objectives/assets, prerequisite graphs, goals and bonus/finale roles. Tests finish every main/bonus through the real engine, construct seeded CPUs and verify chapter/finale/bonus boundaries.
- src/config/typing.ts supplies MAX_PASSAGE_CHARACTERS=3000 to both typing and CPU engines, with 3,000/3,001 boundary coverage. Existing accepted passage rules remain unchanged.
- src/core/campaign-progress.ts separates bonus records. Bonuses unlock after showcases 10/20/…/100, never at 5; their stars/clears do not enter main totals/unlocks/cosmetic counters. All exact eligible unpaused main/replay rules remain.
- src/storage/campaign.ts migrates valid turbotype:campaign-map:v1/schema1 into v2/schema2 while retaining the original recovery string. v2 takes precedence. Malformed/future/nonsequential/locked-bonus data is rejected intact and exportable; denied storage remains visit-only. Canonical ledger/import/conflict/cloud work stays Phase 9.
- src/ui/campaign-map.ts has real briefings, objectives/counts, Read passage even when locked, playable bonus choices and completion marks. Viewing text never unlocks a race; launch rechecks locks.
- app.ts/router.ts/quick-race.ts use strict bonus routes and the shared engine/input/CPU/audio/graphics. Next level continues 6→7 through 100; final results say Category complete and never create 101. Bonus results cannot unlock a main node. Per-session cosmetic locks remain.
- tests/browser/curriculum.spec.ts covers native typing for all 30 chapter focuses, long finales, bonus lock/clear/replay/non-inflation, legacy migration and 6→7. Finale tails replay individual beforeinput/input DOM edits in-page after a native prefix, running the actual adapter/engine without thousands of transport calls. This is integration coverage, not physical keyboard latency certification.

## Verification and GitHub

Final local/hosted counts, exact source and capture paths belong in TESTING.md. Do not infer Phase 8 success from Phase 7. An initial format check found generated JSON formatting; the offline author now uses pinned Prettier. An exploratory browser run was stopped while adjusting long-finale transport; no pass was claimed. The final check uses one SwiftShader worker, normal 30-second test timeouts and unchanged retries. No tests are disabled.

The Phase 7 documentation-only main run39882420451/job120182773740 was last observed stalled in Playwright/system dependency installation before tests. Phase 8 removes the Azure fallback from the existing official Ubuntu archive mirror list and bounds dependency installation to ten minutes. Treat this separately from source checks and inspect the actual later conclusion.

Commit/push the feature branch and open/attach its PR; review before integration. Plain-English commits, no force-push/history rewriting/invented identity. Windows GCM is available; never print credentials. Source pushes do not deploy the game.

## User checks and remaining phases

Follow PHASE8_CURRICULUM.md#user-checks without clearing real progress: refresh retains clears/preferences; finish 6 and continue to 7 when unlocked; check long typing/Larger text/Backspace; inspect locked 50/100 without launching; after a showcase, bonus clear/replay/refresh must not change main counts; sample Medium capitals and Hard notation. Automated fixtures cover late finales without editing real user saves.

After acceptance/integration, Phase 9 delivers economy, earned ownership, learning, canonical guest saves and optional cloud when requested. No XP/credits/reward art/ownership is delivered merely by Phase 8 metadata. Cars at 15/30/45/60/75/90 per category mean 18+5=23; tracks independently at 10/25/40/55/70/85/100 mean 21+5=26. Preserve varied monster/hover/flying forms and owned cosmetics across unlocked categories/replays, without replay/bonus inflation.

Phase 10 release/Pages and Phase 11 private rooms remain pending. Up to 100 approved relatives/friends, 2–10 room racers including host, create/join code, host track/shared passage, individual cars, everyone Ready then host Start, hard $0/free only. Supabase remains an unprovisioned candidate. No accounts/backend/cloud/multiplayer/Pages deployed. TT-608 atmosphere polish stays deferred; no new physical-performance certification.

## Environment

Workspace S:/AI_Engineer_Journey/Projects/TurboType; author Sahilshah; remote sahilshah2904/TurboType. Preserve user Vite PID8124 on 5173: http://192.168.0.31:5173/TurboType/ serves the active checkout. Node24.13/npm11/pinned lockfile. Headless preview4173/one SwiftShader worker; never run browser suites/captures/profiling concurrently or open visible Chrome automation. Reference media/logs/tools stay ignored under Reference_Images. Versioned docs/images are original app captures, excluded from the built game.
