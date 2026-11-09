# TurboType project status

## Phase 7 complete and integrated — 23 October 2026

The user accepted the final Keyboard check correction ("yes it is working"), completing review of alpha.23. Exact accepted source **b7d03f171b7900102f150c19bf1fbe862dad071a** passed hosted run **39881571584**, job **120179897342**, completed 01:07:30 UTC: **118 unit / 80 browser cases**. PR #7 merged into main as **04eb38db636bc9ca74713f28082820265ee7fe7a**. The local checkout returned to main. See docs/PHASE7_CLOSEOUT.md and docs/TESTING.md. This supersedes earlier pending-check/review/merge and feature-branch statements below, which are historical.

Phases 1–7 are complete for agreed scope. Phase 8 is next when requested: review/extend the 18 samples into all 300 main passages, add bonus content and tune length/skill/pace curves. Levels 7–100 remain unavailable until authored. Rewards/earned ownership/robust guest saves/cloud remain Phase 9; deferred TT-608 polish stays separate. No Phase 8 implementation or Pages/backend/multiplayer deployment started. This documentation-only main checkpoint has its own hosted check; do not infer its result from the accepted implementation check.


## Keyboard correction follow-up — alpha.23, 23 October 2026

The user reports all alpha.22 changes work well and requests race-style correction in Keyboard check. The check now shares TypingEngine and connectRaceInput with races: one incorrect character blocks further text until Backspace, exact case/symbols, append-only edits, paste/drop/replacement blocking and committed IME normalization. The sample highlights correct/current/error positions; the next physical-key hint stays on the expected character. Clear text starts a fresh sample while preserving detected keys; Reset key check clears both. Physical-key indicators still record received keys even when their text is rejected. No timer/score is displayed, nothing is saved or awarded. A validated countdownMs=0 option starts this diagnostic immediately; all races retain the default three-second countdown and existing rules/save/content versions.

Alpha.22 source 31b2709 passed exact-head hosted run 39879309550 (check job 120172557695); this was verified again before changes. Fresh alpha.23 full local check passes 118 unit/80 browser cases; sequential 1024px capture has zero page errors. Its own hosted check remains pending; docs/TESTING.md records evidence. Keep the current PR #7 branch; no merge, deployment or Phase 8 start. Earlier free-editing/paste-allowed keyboard descriptions are historical and superseded.


## Alpha.22 review corrections — 23 October 2026

The user accepted campaign unlock/refresh, replay deduplication and pause/practice-only/eligible retry. Remaining feedback: top-align each new wrapped line with three visible look-ahead lines, clarify standalone Quick Race, expand physical keyboard/sample coverage and keep opening fire trailing the car without crossing the name. Implemented for review on the existing PR #7 branch; see [alpha.22 behavior and focused checklist](docs/ALPHA22_REVIEW.md). Broader atmosphere polish remains deferred. Do not merge/start Phase 8 solely from this note.

Prior hosted head 1c94952 failed (run 39812462848): unit tests passed but browser contexts/timeouts failed across many unrelated screens. CI now uses one software-rendered browser worker with all cases/timeouts/retries intact; inspect the new exact-head result before claiming success. Fresh full local verification passes 117 unit/79 browser cases with one worker; evidence and current captures are in docs/TESTING.md and docs/images/alpha22.


Initial implementation source **b1f0d6cf740bfa3aea2e85f12d961814be4e9cee**, [open PR #7](https://github.com/sahilshah2904/TurboType/pull/7). Local full check passed **116 unit / 73 browser cases**; final compact-results adjustment passed fresh build/types and **23 focused browser cases**. Ten current sequential captures had zero page errors. The final follow-up pins each race's car independently, with two regressions proving choices cannot alter the other paused session; retry applies the latest preference. Its fresh full check passed 116 unit/73 browser cases. The current PR head has its own hosted check; inspect its actual PR head/check_run/job before claiming success. User review/integration remains pending; branch is pushed and no game is deployed.


## Current checkpoint — 23 October 2026

Alpha.23 Phase 7 is integrated on `main` as `04eb38d` after user acceptance and successful exact-head checks. The user requested refreshed README/Phase 6 continuity, longer paragraphs and completed maps. See [implementation/review](docs/PHASE7_CAMPAIGN_MAPS.md), [handoff](docs/SESSION_HANDOFF.md), [testing](docs/TESTING.md) and [backlog](BACKLOG.md). Inspect actual Git/CI; implementation, acceptance, integration and deployment remain separate.

| Phase | State |
| --- | --- |
| 1–4 | Complete for agreed design/foundation/typing/four-CPU scope; integrated |
| 5 | Complete for agreed scope and physical acceptance; PR #4 merged de464ce |
| 6 | Complete for agreed scope; PR #6 merged cf741b6; TT-608 polish deferred |
| 7 | Complete for agreed map scope; user-accepted alpha.23 integrated through PR #7 |
| 8 | All 300 reviewed passages, bonuses, curves and future art pending |
| 9 | Rewards/ownership/learning, robust guest saves and optional cloud pending |
| 10 | Broader release verification and Pages pending |
| 11 | Free-only private rooms for 2–10 players pending |

## Implemented

Five original starters with independent wheels, five starter tracks, full-window four-CPU racing, native typing/correction, honest WPM/accuracy, pause/countdown, compact frozen results with expanded standings, fire Live WPM/exhaust/nitro. Original Ignition/Overdrive audio with Settings-only controls.

Phase 6 has the purple-car 5.6-second opening, real readiness/recovery, welcome/rules/tutorial/calibration, skip/replay and clean Hub/Settings. README shows the latest unchanged screenshots. Further atmosphere visibility/opening polish is deferred, not certified final appearance.

Phase 7 has three 100-stop maps, ten chapters/bonus previews, lock/current/completion states, accumulated stars/briefings, chapter/numeric/keyboard/drag/list navigation, saved positions and lazy scenery. Six real races per category: first three short, levels 4–6 substantial original paragraphs. Level 6 reaches 815/1,001/1,233 characters (166/179/212 words). Levels 7–100 and bonus passages await Phase 8 and cannot launch. 300 visible stops are not 300 finished passages.

Eligible unpaused exact completion saves local clears/stars/bests and opens the next same-category stop. Replays improve stars without multiplying unique clears. Paused/assisted finishes are practice-only. Five starter cars/tracks work across categories/replays. Earned reward ownership remains Phase 9.

## Saves and planned scope

App alpha.23 / rules 3 / save 1 / content 2. Preferences remain compatible. `turbotype:campaign-map:v1` stores validated local map progress, preserves/exports malformed or future data, and falls back to this visit when storage is denied. Quick Race and unfinished races remain session-only. Phase 9 migrates map records into its canonical snapshot with receipts/import/recovery/conflicts. No account/backend/cloud/multiplayer/Pages deployed.

Cars at 15/30/45/60/75/90 per category = 23 total; independent tracks at 10/25/40/55/70/85/100 = 26 total. Preserve varied monster/hover/flying vehicle families and the private $0 ten-racer room plan. No extra phase.

## Accepted evidence through Phase 6

PR #4 exact head 398d455 passed 39727202033, merged de464ce; physical acceptance is in docs/PHASE5_CLOSEOUT.md. PR #6 accepted 3f6125c passed exact-head check/job 39801084219, local 102 unit/56 browser; merged cf741b6. Main docs 6554956 passed 39803134301. README/continuity refresh 1ee0aba was pushed before Phase 7. Current Phase 7 source/checks are recorded in docs/TESTING.md; never reuse the Phase 6 pass as new evidence.

## Next

Phase 7 is complete and the [LAN preview](http://192.168.0.31:5173/TurboType/) serves main. Phase 8 next authors/reviews all 300 texts and bonuses with longer-paragraph progression, when requested. No automatic Phase 8 or deployment from handoff. Complete older chronology/checks/source paths remain in [history](docs/history/2026-10-22-before-phase7/SESSION_HANDOFF.md); current statements take precedence.
