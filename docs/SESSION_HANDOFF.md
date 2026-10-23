# TurboType session handoff

## Phase 7 complete and integrated — 23 October 2026

The user accepted the final Keyboard check correction ("yes it is working"), completing review of alpha.23. Exact accepted source **b7d03f171b7900102f150c19bf1fbe862dad071a** passed hosted run **39881571584**, job **120179897342**, completed 01:07:30 UTC: **118 unit / 80 browser cases**. PR #7 merged into main as **04eb38db636bc9ca74713f28082820265ee7fe7a**. The local checkout returned to main. See docs/PHASE7_CLOSEOUT.md and docs/TESTING.md. This supersedes earlier pending-check/review/merge and feature-branch statements below, which are historical.

Phases 1–7 are complete for agreed scope. Phase 8 is next when requested: review/extend the 18 samples into all 300 main passages, add bonus content and tune length/skill/pace curves. Levels 7–100 remain unavailable until authored. Rewards/earned ownership/robust guest saves/cloud remain Phase 9; deferred TT-608 polish stays separate. No Phase 8 implementation or Pages/backend/multiplayer deployment started. This documentation-only main checkpoint has its own hosted check; do not infer its result from the accepted implementation check.


## Keyboard correction follow-up — alpha.23, 23 October 2026

The user reports all alpha.22 changes work well and requests race-style correction in Keyboard check. The check now shares TypingEngine and connectRaceInput with races: one incorrect character blocks further text until Backspace, exact case/symbols, append-only edits, paste/drop/replacement blocking and committed IME normalization. The sample highlights correct/current/error positions; the next physical-key hint stays on the expected character. Clear text starts a fresh sample while preserving detected keys; Reset key check clears both. Physical-key indicators still record received keys even when their text is rejected. No timer/score is displayed, nothing is saved or awarded. A validated countdownMs=0 option starts this diagnostic immediately; all races retain the default three-second countdown and existing rules/save/content versions.

Alpha.22 source 31b2709 passed exact-head hosted run 39879309550 (check job 120172557695); this was verified again before changes. Fresh alpha.23 full local check passes 118 unit/80 browser cases; sequential 1024px capture has zero page errors. Its own hosted check remains pending; docs/TESTING.md records evidence. Keep the current PR #7 branch; no merge, deployment or Phase 8 start. Earlier free-editing/paste-allowed keyboard descriptions are historical and superseded.


## Alpha.22 review corrections — 23 October 2026

The user accepted campaign unlock/refresh, replay deduplication and pause/practice-only/eligible retry. Remaining feedback: top-align each new wrapped line with three visible look-ahead lines, clarify standalone Quick Race, expand physical keyboard/sample coverage and keep opening fire trailing the car without crossing the name. Implemented for review on the existing PR #7 branch; see [alpha.22 behavior and focused checklist](ALPHA22_REVIEW.md). Broader atmosphere polish remains deferred. Do not merge/start Phase 8 solely from this note.

Prior hosted head 1c94952 failed (run 39812462848): unit tests passed but browser contexts/timeouts failed across many unrelated screens. CI now uses one software-rendered browser worker with all cases/timeouts/retries intact; inspect the new exact-head result before claiming success. Fresh full local verification passes 117 unit/79 browser cases with one worker; evidence and current captures are in docs/TESTING.md and docs/images/alpha22.


Initial implementation source **b1f0d6cf740bfa3aea2e85f12d961814be4e9cee**, [open PR #7](https://github.com/sahilshah2904/TurboType/pull/7). Local full check passed **116 unit / 73 browser cases**; final compact-results adjustment passed fresh build/types and **23 focused browser cases**. Ten current sequential captures had zero page errors. The final follow-up pins each race's car independently, with two regressions proving choices cannot alter the other paused session; retry applies the latest preference. Its fresh full check passed 116 unit/73 browser cases. The current PR head has its own hosted check; inspect its actual PR head/check_run/job before claiming success. User review/integration remains pending; branch is pushed and no game is deployed.


## Resume checkpoint — 23 October 2026

User requested refreshed README/continuity through Phase 6, substantial paragraphs beyond the first short races, and completed Phase 7 maps with a laptop review checklist. Documentation refresh `1ee0aba` is pushed on main. Phase 7 is separate on `codex/phase7-campaign-maps`; inspect actual HEAD/PR/exact-head checks. No automatic merge, next phase or deployment from this handoff.

Read ../AGENTS.md, ../PROJECT_STATUS.md, ../BACKLOG.md and PHASE7_CAMPAIGN_MAPS.md. The previous chat is unnecessary. Full earlier chronology is archived under history/2026-10-22-before-phase7/; its old branches/check states are historical.

## Accepted baseline through Phase 6

Phases 1–6 complete for agreed scope. PR #4 merged de464ce after accepted 398d455/run39727202033; physical evidence in PHASE5_CLOSEOUT.md. PR #5 accepted five starter tracks/compact results with expanded standings. PR #6 accepted `3f6125c8d9c40405048453f7b7c17233182d14ae`, successful exact-head check/job 39801084219, merged `cf741b6cb27e9fe8da230d52394d40bbc4964baf`. Main docs `655495610b80a2f184e0d09b78bee790c741fc67` passed 39803134301. Local baseline 102 unit/56 browser. Workflow headers have lagged completed successful check_run/job state.

Preserve five original starters/independent wheels, graphite/crimson/cyan, full-window scene, native typing, fire Live WPM, Ignition/Overdrive and Settings-only audio. Physical-keyboard laptop/desktop only. Five tracks: Neon Harbor, Coral Coast, Copper Canyon, Emerald Trail, Frostline Pass. Compact metrics and Final standings open, later CPU finishes explicitly simulated.

Phase 6: 5.6-second purple arrival/brake/burnout/short reverse/right launch, blazing road/flaming title, immediate Skip/static Low/Reduced fallback. Real readiness/decode timeouts/retry/text recovery and bootstrap fallback. Welcome/rules, actual correction/streak lessons, optional 30-active-second calibration, skip/replay preferences and aligned actions. User cannot perceive alpha.20 haze and keeps baseline for now: TT-608 owns later atmosphere/opening polish. No new aesthetic/performance certification.

README shows current alpha.20 race/actions, alpha.19 cinematic, unchanged alpha.17 welcome/rules, alpha.18 clean Hub/Settings and alpha.16 compact results; folder versions preserve capture provenance. Superseded wind/opening artwork is historical. Phase 7 captures are images/alpha21.

## Phase 7 source and behavior

App alpha.22 / rules 3 / save 1 / content 2. Full specification and user checklist: PHASE7_CAMPAIGN_MAPS.md.

- src/content/campaign.ts: 300 stable numbered stops, categories/chapters, eighteen original samples and safe route parsing. Six races/category; first three short, 4–6 longer paragraphs up to 815/1,001/1,233 characters. Remaining282 main passages and bonuses belong to Phase 8; unavailable previews never launch.
- src/core/campaign-progress.ts: pure eligible finish/isolated sequential unlocks, independent star-bit union, best metrics and snapshot validation. No place/star gate for the next stop.
- src/storage/campaign.ts: turbotype:campaign-map:v1, schema 1/rules 3/revision 1, sequential known IDs, local stars/bests/positions, preserve/export malformed/future data, denied-storage visit fallback, reread before writes and other-tab refresh. Best-effort coordination, not a transactional economy ledger or complete Phase 9 guest/cloud save. Phase 9 must migrate these records.
- src/ui/campaign-map.ts: Hub cards, winding maps, lock/current/completed states, chapters/bonus previews, briefings, starter cosmetics, Continue/Jump, chapter/numeric navigation, drag/scrollbar/arrows/Home/End/Enter/list, independent saved positions, one connector/node unlock animation and reduced fallback. Nearby original CSS district scenery; no per-node running scenes.
- src/ui/app.ts/router.ts: valid category/level links, direct lock checks, isolated Quick Race/campaign sessions. Navigation pauses; retry is a fresh eligible attempt.
- src/ui/quick-race.ts: shared engine/input/graphics/audio/results, pinned campaign setup, clear/practice feedback and map/next links. Cosmetics lock through pauses. Changed-prefix character repainting supports paragraphs without rescanning all spans per keystroke.
- src/core/solo-race.ts/cpu-schedule.ts: validated optional fixed campaign bands; default Quick Race bands unchanged.

No dependency/new raster/audio asset. Content2 records the new manifest/sample; typing rules stay3. Current engines cap at 2,000 characters; all samples fit. Phase 8 must raise/test cap before proposed late Hard paragraphs up to 3,000 characters.

## Pending scope

Maps/user acceptance are distinct from full curriculum. Phase 7 starter inventory/briefing interface works; earned inventory stays Phase 9 TT-902/911/912. Cars 15/30/45/60/75/90 eligible unique main clears/category:18+5=23; independent tracks 10/25/40/55/70/85/100:21+5=26. No replay/bonus/Practice/Quick Race/multiplayer counter inflation. Owned cosmetics apply across unlocked categories/replays; future monster/hover/flying forms retained.

Phase 8 fills/reviews300 main passages and bonuses, gradual length/skill/CPU/star curves and reward art. Phase 9 canonical guest migration/backup/import/recovery/receipts/conflicts, learning/rewards and optional account cloud before launch. Phase 10 release/Pages. Phase 11 $0/free-only private rooms 2–10 including host/up to 100approved people, create/join code, host track/shared passage, individual owned cars, everyone Ready then host Start. Supabase candidate only; no provisioning.

## Environment and checks

Workspace S:/AI_Engineer_Journey/Projects/TurboType, remote sahilshah2904/TurboType, author Sahilshah. Preserve user Vite PID8124/5173: http://192.168.0.31:5173/TurboType/ serves active checkout. Headless 4173/SwiftShader/one worker; no concurrent browser suites/captures/profiling. No visible Chrome automation. Plain-English commits, no force-push/automatic watcher. Node 24.13/npm 11/pinned lockfile; npm run check is full suite.

TESTING.md records final totals, exact source/PR/hosted conclusion. Earlier Phase 6 passes do not certify new code. User checklist: PHASE7_CAMPAIGN_MAPS.md#user-review. Check navigation, first clear vs replay, pause/no award, category cosmetics and paragraph caret readability. No renewed approval of accepted music/cars/palette or physical performance requested.
