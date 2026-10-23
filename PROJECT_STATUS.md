# TurboType project status

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

## Phase 8 — alpha.24, 23 October 2026

The user requested completed Phase 8 and up-to-date GitHub README/handoff after accepting Phase 7. Current implementation is on **codex/phase8-curriculum**, based on main **26a7f1d**. Inspect actual Git/PR/exact-head checks; user acceptance/integration/deployment remain separate. No automatic Phase 9 or merge.

**300 playable main passages + 30 optional chapter challenges** replace the old 18-sample limit. Existing first six/category passages, stable IDs/revisions and early goals remain unchanged. Original chapter anthologies, explicit skills, smooth pace/length curves, showcases/finales, manifest prerequisites/reward metadata/shipped asset references, full route continuation, optional bonus save/lock/replay, long input support and legacy save migration are implemented. [Specification and review checklist](docs/PHASE8_CURRICULUM.md).

App 0.1.0-alpha.24 / typing rules 3 / content 3 / global future guest schema 1 / map save schema 2. The shared typing/CPU cap is 3,000 characters. Main finales reach 1,400 Easy / 2,158 Medium / 2,968 Hard characters. Only the first three races/category are short. Distinct committed excerpts intentionally revisit original chapter prose; no runtime AI or fetched text.

| Phase | State |
| --- | --- |
| 1–6 | Complete for agreed scope and integrated; TT-608 atmosphere polish remains deferred |
| 7 | User-accepted alpha.23; PR #7 merged 04eb38d; closeout 26a7f1d on main |
| 8 | Curriculum/bonuses/validation implemented; 125 unit/116 browser cases covered locally across broad/focused runs; full hosted verification and user review tracked in TESTING.md |
| 9 | Economy/earned ownership/learning/canonical guest save/optional cloud pending |
| 10 | Broader release verification and Pages pending |
| 11 | Free-only private rooms for 2–10 racers pending |

## Progress and compatibility

Eligible unpaused exact main finishes open the next same-category level regardless of place/extra stars. Independent stars union across eligible replays; replays do not multiply unique clears. Paused/assisted runs remain practice-only. Each run pins its own car/track through countdown, pause and final results; retry opens selection. All levels remain replayable, and 100 has a category-complete result with no 101.

Bonuses unlock at chapter clears 10/20/…/100 and save under a separate bonuses record. They never increase main clears/stars, open main levels or count toward cars/tracks. No XP/credits/reward ownership is awarded yet; authored reward metadata belongs to Phase 9 delivery. Read passage in locked briefings allows inspection without launching or bypassing a lock.

Map saves migrate from turbotype:campaign-map:v1 to v2 while retaining the original v1 recovery copy. Valid v2 takes precedence. Corrupt/future data is preserved/exportable; denied writes keep visit-only progress with honest feedback. Phase 9 must migrate v2 into canonical guest snapshots/receipts/import/recovery/conflicts/cloud; this small map repository is not that complete system.

## Accepted baseline and verification

Five original starter karts with independent wheels, five starter tracks, graphite/crimson/cyan full-window scenes, native correction, fire Live WPM/exhaust, compact results with standings open, original Ignition/Overdrive and Settings-only sound remain accepted. Phase 6 includes 5.6-second purple opening, real loading/recovery, welcome/rules/tutorial/calibration. Phase 7 adds maps, saved clears/stars/bests/positions and corrected wrapped look-ahead/Keyboard check/fire trails.

Accepted Phase 7 b7d03f1 passed exact-head hosted run 39881571584/job 120179897342: 118 unit/80 browser cases. Merged 04eb38d. Its later documentation-only main 26a7f1d check (39882420451/job120182773740) was last observed stalled in browser dependency installation, before tests; it is not a source pass or failure. Phase 8 uses only the official Ubuntu archive mirror and bounds browser dependency installation to ten minutes, keeping all tests/retries/timeouts enabled. Fresh Phase 8 evidence belongs in docs/TESTING.md.

## Next and future scope

Finish exact-source verification, review the requested new curriculum at the existing LAN preview and integrate its PR after acceptance. Keep future vehicles varied (monster/hover/flying forms); cars at15/30/45/60/75/90 per category mean23 total, tracks independently10/25/40/55/70/85/100 mean26. Phase 9 handles earned ownership across categories/replays and avoids replay/bonus inflation. Private up to100 approved people/ten room racers, create/join code/host track/everyone Ready/$0 only remains Phase11. No Pages/account/backend/cloud/multiplayer deployed. Earlier continuity is preserved in docs/history/2026-10-23-before-phase8/.
