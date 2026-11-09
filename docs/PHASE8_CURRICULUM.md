# Phase 8 curriculum — alpha.24

Latest checkpoint23 October2026: curriculum and alpha.26 collection flow accepted; exact bd378c1 hosted check passes125 unit/121 browser cases. PR8 remains unmerged. Finished18 reward vehicles/21 track environments and Phase9 ownership/saves/cloud remain pending; silhouette slots are not finished content. Phase9 preparation began, then user requested save-and-stop. See PHASE9_RESUME.md for full continuity.

Implementation on codex/phase8-curriculum; acceptance/integration remain separate. The user requested all Phase 8 work, updated GitHub documentation and a focused test list. No Phase 9, merge or deployment begins automatically.

## Content and objectives

All **300 main levels** now have playable passages, plus **30 optional side challenges**, one after each chapter showcase. Categories remain independent with 100 main levels and 300 main stars each. Existing 18 introductory samples remain unchanged at revision 1; IDs, initial CPU bands and star targets remain compatible. New entries also begin at passage revision 1. Content version advances to 3; typing rules remain 3, global future guest schema remains 1. The map-specific save is now schema 2.

Ten original prose anthologies cover a village workshop, harbor, coastal garden, stone valley, forest survey, ridge weather station, city library, evening rail service, island field trip and community observatory. Reviewed source paragraphs are reused intentionally within a chapter as varied, ordered reading excerpts. These are 330 distinct passages, not 330 unrelated stories. Curated framing introduces category skills. Whole sentences are selected; words are never cut or repeated merely to reach a length. There is no runtime AI/network text generation. The committed catalog is the reviewable source of shipped new passages, reproduced offline from original source pools.

Only the first three races per category stay short. The accepted levels 4–6 already establish substantial prose. From level 7, length grows toward the following endpoints without mandatory time limits:

| Category | New passage lengths (characters) | Level 100 | Pace star, start → end | Fixed CPU target band, start → end |
| --- | --- | --- | --- | --- |
| Easy | about 809–1,400 | 1,400 | 15 → 30 WPM | 10–18 → 20–35 WPM |
| Medium | about 1,008–2,166 | 2,158 | 30 → 55 WPM | 25–35 → 40–60 WPM |
| Hard | about 1,304–2,969 | 2,968 | 50 → 90 WPM | 45–60 → 70–100 WPM |

Goals interpolate gradually; no adjacent pace jump exceeds 1 WPM. Sentence boundaries can make a later passage slightly shorter. Every adjacent length change after the introductions is under 300 characters. A new chapter revisits familiar skills while adding its stated focus; difficulty is a tuning proposal, not a measured teaching-effectiveness claim. The shared typing/CPU bound is exactly 3,000 characters, tested at 3,000 and 3,001.

| Chapter | Easy focus | Medium focus | Hard focus |
| --- | --- | --- | --- |
| 1 | Calm spacing | Sentence capitals | Dialogue and time |
| 2 | Full alphabet | Commas and pauses | Apostrophes in dialogue |
| 3 | Word endings | Contractions | Colons and semicolons |
| 4 | Longer words | Longer vocabulary | Hyphens and parentheses |
| 5 | Steady corrections | Possessive forms | Decimals and percentages |
| 6 | Repeated letters | Questions | Square brackets |
| 7 | Reading ahead | Introductory numerals | Paths and slashes |
| 8 | Sentence rhythm | Compound sentences | Workplace symbols |
| 9 | Sustained flow | Reading for detail | Technical notation |
| 10 | Long-form recap | Sustained mixed prose | Precision endurance |

Easy contains lowercase words, spaces and periods only. Medium adds sentence capitals, commas, contractions, possessives, questions and small numerals. Hard includes quoted dialogue, times, punctuation, decimals/percentages, parentheses/brackets, slashes/backslashes and technical symbols in explanatory prose. Technical examples are inert text, not commands or contact/spending instructions. HTML-sensitive symbols are escaped in passage previews; the native race surface uses text content.

## Manifest, milestones and flow

Every main/bonus definition has a stable ID, passage ID/revision, category/chapter, explicit prerequisite, title/objective/skill, lesson/showcase/finale role, fixed seed/CPU band and goals, existing starter environment/asset references and planned reward data. Pit stops are 5/15/…/95; showcases 10/20/…/100; level 100 is the category finale. No 101 exists. The future reward table is authored metadata only: no XP, credits, reward vehicle/track ownership or celebration claim is granted in Phase 8. TT-901/902/911/912 deliver that in Phase 9.

Every eligible exact unpaused main finish opens the next same-category level regardless of place or extra stars. Next level now continues beyond 6 through 100. Finale results explicitly say Category complete; the map remains replayable. Bonuses require clearing their chapter's level 10/20/…/100, never level 5. They use the same race/input/CPU/cosmetic-lock rules and independent stars, with shorter precision passages and free replay. A paused/assisted bonus is practice-only. Bonus records never enter main clears, the 300-star category total, main unlocks or car/track counters.

Locked briefings show real titles, objectives and character/word counts. Read passage is available to inspect text without unlocking a race. The lock and actual launch boundary remain enforced. Starter car/track selection remains shared across unlocked categories/replays. Future owned cosmetics remain Phase 9.

## Save compatibility

The small map save moves from turbotype:campaign-map:v1/schema1 to turbotype:campaign-map:v2/schema2, adding a separate bounded bonuses record. On first load with no v2, valid v1 clears/stars/bests/positions migrate. The original v1 string remains untouched as a recovery copy. A valid v2 takes precedence; older tabs writing v1 cannot overwrite it. Main passage revisions 1–6 remain unchanged. Malformed/future/non-sequential source data is preserved and exportable; denied migration/storage keeps visit-only progress with honest feedback. Reload/export, cross-tab refresh and bonus prerequisite validation use the new boundary.

This is not the complete Phase 9 canonical guest/economy/cloud save. Phase 9 must migrate v2 records, maintain receipts, provide import/reset/recovery/conflicts and handle optional cloud. Old application tabs do not receive new progress; refresh them to alpha.24. Do not clear real storage for testing.

## Verification and reproduction

- npm run content:check compares the committed catalog with its original authoring sources, and runs within npm run check.
- node scripts/author-curriculum.mjs deliberately rebuilds the catalog after source edits. Change a shipped passage only with an explicit content revision/comparability policy; do not regenerate accepted entries casually.
- src/content/curriculum/validate.ts independently validates all IDs/counts/numbering, text uniqueness/character bounds/category restrictions, objectives, assets, prerequisites/cycles/reachability, goals and finale/bonus roles.
- Pure tests complete all 300 main and 30 bonus passages through the real typing engine, validate seeded CPU schedules and exercise chapter/finale/bonus/star/save boundaries.
- Browser tests exercise actual native typing for every chapter focus, final long-prose completion, bonus lock/clear/replay/non-inflation, legacy migration and 6→7 navigation. Finale tails replay individual beforeinput/input DOM edits in-page after a native prefix to avoid thousands of transport round trips; every character still runs through the actual input adapter and engine. This is integration evidence, not physical-keyboard latency certification.
- Existing laptop/input/IME/garage/audio/onboarding/map suites remain enabled. One headless SwiftShader worker; no concurrent suites/captures/profiling, no visible Chrome windows, no user Vite restart. Final counts/source/hosted result belong in TESTING.md.

## User checks

Use the existing LAN preview. Keep real progress; no reset or test unlocks are needed.

1. Refresh. Your prior clears/stars and selected car/track should still be there. Continue your current category; finish level 6 and use Next level to reach the newly playable 7 when unlocked.
2. Type a longer unlocked passage with Larger typing text: the active line should stay at the top with following words visible, and one mistake must still require Backspace.
3. Open a later locked map stop (for example 50 or 100). Check its real objective/length and Read passage; it must remain locked until its previous level is cleared.
4. After clearing a chapter showcase (10, 20, …), race its Bonus. Finish, replay and refresh: it should keep a checkmark without increasing your main clear count or opening another main level. A paused run stays practice-only.
5. Sample Medium capitals/contractions or Hard symbols on an unlocked route. Pace stars and CPU placement remain optional; finishing carefully opens the route.

Automated fixtures cover the late finales without unlocking your real save. All 100 levels per category remain accessible through normal progress. Report passages that feel awkward, too repetitive or too large a difficulty jump; content balance can be refined without changing the correction model.
