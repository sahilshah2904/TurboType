# Phase 7 campaign maps — alpha.21

Completed for agreed scope and user-accepted in alpha.23. PR #7 merged into main as 04eb38d after exact-head hosted verification of b7d03f1 (118 unit/80 browser cases). See [closeout](PHASE7_CLOSEOUT.md). Earlier implementation evidence below remains historical; no public deployment or backend exists.

## Delivered scope

- Hub category cards lead to independent Easy, Medium and Hard journeys, each with 100 stable numbered circular stops, ten districts, optional bonus branches and a rightward winding road.
- Current/completed/locked states, completion checks and 0–3 stars; current is the available unplayed stop. Locked previews explain prerequisites. Direct links recheck locks. Chapter/numeric jumps never unlock content.
- Briefings show focus, character/word counts, untimed format, independent star targets, fixed CPU band, personal bests and first-clear outcomes. Best pace/accuracy/time can come from different eligible runs.
- Continue, Jump to current, chapter selector/previous/next, level-number jump, drag, horizontal scrollbar, arrows/Home/End/Enter and accessible list view. Category positions persist; first entry/new unlock centers current. One new connector/node animates once, with Reduced motion alternatives.
- Semantic DOM/SVG works before scenery. Nearby district decoration loads through IntersectionObserver; no per-level running scenes, downloaded previews or continuously animated future nodes. Race assets load when entering a race.
- Five starter cars and five starter tracks are selectable across category briefings/replays. Cosmetics lock through countdown/pause/final run; retry reopens selection. Earned inventory binding stays Phase 9.

## Real races and longer paragraphs

The first three introductions stay short; levels 4–6 provide longer original coherent paragraphs against four seeded CPUs.

| Category | Characters, levels 1–6 | Words at level 6 |
| --- | --- | --- |
| Easy | 37 / 69 / 122 / 308 / 543 / 815 | 166 |
| Medium | 84 / 137 / 238 / 448 / 738 / 1,001 | 179 |
| Hard | 148 / 194 / 314 / 635 / 938 / 1,233 | 212 |

**18 playable sample races, 300 map stops.** Levels 7–100 and bonus challenges have no authored passages and cannot launch. After clearing level 6, level 7 becomes a current preview explaining that content arrives in Phase 8. This completes map delivery, not all 300-level curriculum delivery. Phase 8 reviews every sample, fills the remaining 282 main passages, adds bonuses and tunes gradual skill/length/pace curves. No proven teaching-effectiveness claim.

The user requires substantial paragraphs beyond early races. Designed late ranges now reach ~900–1,400 Easy, ~1,400–2,200 Medium, ~2,000–3,000 Hard characters. Current typing/CPU engines cap at 2,000; all samples fit. Phase 8 must raise/test that cap before longer entries and retain untimed learner pacing.

## Eligibility and storage

Exact finished eligible unpaused completion clears the next same-category stop, regardless of place/extra stars. Paused, assisted/composed/uncertain-input, unfinished and abandoned runs do not clear or earn stars. Rules remain 3. Independent stars union across eligible replays: completion, >=95% raw accuracy, >=level pace target. Replays never inflate unique clears; stars never gate the main route. CPU band/seed is fixed before GO.

`src/core/campaign-progress.ts` owns pure progress rules. `src/storage/campaign.ts` persists `turbotype:campaign-map:v1`: schema 1/rules 3, known sequential clear IDs/revision 1, star bits/best metrics/category positions. App alpha.21/content 2; existing preferences remain compatible. This basic map boundary is not Phase 9's complete canonical guest save/economy/cloud system.

Malformed/unknown-version/non-sequential data is preserved without overwrite and exportable. Denied storage retains progress for the visit with feedback. Updates reread valid storage; other-tab events refresh map/Hub. Coordination is best-effort, not an atomic cross-tab/server receipt ledger. Phase 9 must migrate these revision/rules-qualified records into the canonical snapshot, validate comparability, add import/reset/migrations/recovery/conflicts and derive reward receipts exactly once.

No XP, credits, Driver Rank, bonus clears, reward ownership, cloud or multiplayer here. Preserve category-qualified vehicle milestones 15/30/45/60/75/90 and tracks 10/25/40/55/70/85/100: 23 vehicles, 26 tracks total, globally usable on unlocked levels/replays without lock bypass.

## Source

`src/content/campaign.ts` defines metadata, passages/IDs/routes; `core/campaign-progress.ts` and `storage/campaign.ts` own progress/validation/persistence; `ui/campaign-map.ts` owns maps/briefings/navigation; `ui/app.ts`/`router.ts` own isolated routes/sessions. `ui/quick-race.ts` reuses race/input/audio/results with pinned campaign setup and incremental changed-prefix character repainting. `core/cpu-schedule.ts`/`solo-race.ts` support validated campaign bands without changing Quick Race defaults.

## User review

Use the preserved [LAN preview](http://192.168.0.31:5173/TurboType/) serving the active feature checkout.

1. Hub → Continue Easy. Drag, jump chapters/level100, try a lock, arrows/Home/End and List view. Jump to current. Navigation must never unlock a stop.
2. Choose car/track in level1 briefing; finish without pausing. Map shows completion/stars and level2 current. Refresh preserves it; Medium/Hard remain at1.
3. Replay a clear: stars/bests may improve, unique clears do not multiply. Cosmetics work across categories.
4. Pause or visit Settings mid-race, resume and finish: Practice finish, no clear/stars. Retry without pausing should be eligible.
5. Reach levels 4–6 and assess actual paragraphs. Try Larger typing text and a1024px window; current character stays visible. After6, Phase 8 content message is expected.
6. Move right, switch category/Settings and return. Category positions restore; Jump to current returns to next stop. Check Reduced motion.

Do not clear browser storage unless you intend to discard progress. Export is a diagnostic backup; importing is Phase 9. No repeat approval of accepted cars/music/palette or physical-frame-rate certification requested. See TESTING.md for exact verification and images/alpha21 for sequential headless captures.


Final session isolation: each run pins its own kart. Changing a campaign/Quick Race preference never changes the other paused run; retry applies the latest remembered preference. Final full local verification passes 116 unit/73 browser cases, including both directions. See TESTING.md for exact hosted head/state.
