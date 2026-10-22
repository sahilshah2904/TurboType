# Track collection and staggered campaign rewards

## Accepted decision — 22 October 2026

Five starter tracks are available without campaign progress. **Latest 22 October correction supersedes paired unlocks:**

| Reward | Milestones within each 100-level category | Per category | Across 3 categories | With 5 starters |
| --- | --- | --- | --- | --- |
| Cars | 15, 30, 45, 60, 75, 90 | 6 | 18 reward cars | **23 cars** |
| Tracks | 10, 25, 40, 55, 70, 85, 100 | 7 | 21 reward tracks | **26 tracks** |

Track count per category is floor((100 − 10) / 15) + 1 = 7. The next track threshold, 115, is outside the campaign. Level 100 awards a track but no extra car. Cars and tracks unlock independently; no paired transaction or shared reward ID is assumed. This required collection supersedes the older optional-extra-tracks wording.

Earning category determines the milestone counter, **not where an owned cosmetic can be used**. For example, the Easy-15 car and Easy-10 track can be equipped for an already-unlocked Hard level, provided that Hard level is playable. All owned cars/tracks work across Easy/Medium/Hard, including replaying completed levels and optional Quick Race. Owning a track never unlocks a campaign node, skips prerequisites or grants a clear. Replaying a level never increases the distinct-clear count. First plays may also use any owned car/track; an authored level supplies its default scenery, not a mandatory cosmetic restriction. A default must be a starter or currently owned track; if unavailable, fall back to an appropriate starter without granting the locked track.

## Implemented now — alpha.16

| Stable starter ID | Name | Authored scenery |
| --- | --- | --- |
| neon-harbor | Neon Harbor | Night skyline, lit windows and mountain silhouette |
| coral-coast | Coral Coast | Sunset ocean, reflected light and palm promenade |
| copper-canyon | Copper Canyon | Layered mesas, rock strata and cactus silhouettes |
| emerald-trail | Emerald Trail | Twilight forest, hills and staggered pine trees |
| frostline-pass | Frostline Pass | Blue-hour alpine peaks and snow caps |

Original code-authored geometric scenery in src/game/track-scenery.ts is shared by Hub preview and the five-lane Quick Race. Themes change environment silhouettes, sky/road colors and edge lights; all retain the same progress geometry, CPU schedules, passage, timing and finish rules. They are cosmetic environments, not different physics courses. No external artwork, new packages or downloads are used.

Choose Track in the Hub preview or before a Quick Race countdown. Race selection updates the existing scene without replacing its canvas or resetting the seed. Starting locks the current race's track through countdown/racing/pause/final state and route navigation. A different Hub choice while paused is a preference for the next race; it cannot alter the active race. Retry/new race applies that preference and reopens selection. Reload keeps only the selected starter, discarding the unsaved race as before.

The independent optional preference `turbotype:track:v1` stores `{schemaVersion: 1, selectedTrack}`. Unknown/reward IDs, malformed JSON and unsupported versions fall back to Neon Harbor. Failed writes apply the selection in memory with clear feedback. The old car preference remains intact. This starter preference is not ownership, campaign progress, an account or cloud storage; rules 3 and campaign save/content version 1 remain unchanged.

## Planned reward manifest — twenty-one distinct environments

These are proposed IDs and working art briefs, **not shipped tracks or usable unlocks**. Track IDs now use their own thresholds, independently of car IDs in GARAGE_PROGRESSION.md. Retire the never-shipped paired track IDs (track-{category}-015/030/045/060/075/090); no persisted track ownership exists to migrate. Preserve starter IDs.

| Category / clears | Track ID | Working environment brief |
| --- | --- | --- |
| Easy / 10 | track-easy-010 | Lantern Canal — lit waterways and footbridges |
| Easy / 25 | track-easy-025 | Sunset Boardwalk — seaside piers and ferris silhouette |
| Easy / 40 | track-easy-040 | Orchard Loop — terraces, blossom trees and windmills |
| Easy / 55 | track-easy-055 | Amber Badlands — sandstone arches and dry riverbeds |
| Easy / 70 | track-easy-070 | Riverlight Viaduct — layered bridges and river lights |
| Easy / 85 | track-easy-085 | Harbor Skyway — elevated port skyline showcase |
| Easy / 100 | track-easy-100 | Centennial Boulevard — anniversary-lit city boulevard and grandstands |
| Medium / 10 | track-medium-010 | Rainline Metro — wet city and transit silhouettes |
| Medium / 25 | track-medium-025 | Sapphire Cliffs — coastal headlands and lighthouse |
| Medium / 40 | track-medium-040 | Redstone Arch — canyon bridge and natural arches |
| Medium / 55 | track-medium-055 | Fernfall Valley — layered forest and waterfalls |
| Medium / 70 | track-medium-070 | Solar Observatory — mountain domes and warm horizons |
| Medium / 85 | track-medium-085 | Prism Causeway — futuristic glass-city showcase |
| Medium / 100 | track-medium-100 | Celestial Ring — observatory district and sweeping illuminated bridges |
| Hard / 10 | track-hard-010 | Stormfront Docks — cranes, ships and storm clouds |
| Hard / 25 | track-hard-025 | Midnight Switchback — alpine road and distant city |
| Hard / 40 | track-hard-040 | Ember Caldera — volcanic terrain and lava glow |
| Hard / 55 | track-hard-055 | Aurora Ridge — snowfields and static aurora ribbons |
| Hard / 70 | track-hard-070 | Orbital Yard — launch structures and futuristic skyline |
| Hard / 85 | track-hard-085 | Zenith Skyline — flagship elevated megacity showcase |
| Hard / 100 | track-hard-100 | Eventide Citadel — flagship fortified skyline and elevated circuit |

## Delivery across the existing phases

- **Now / presentation follow-up (TT-531):** five real starter environments, shared preview/race selector, optional remembered preference, per-race lock and recovery/layout checks. Final standings default open (TT-529 refinement).
- **Phase 7 (TT-705):** put car/track choice in the level briefing/replay flow, gated by both owned cosmetics and separately unlocked level IDs; keep map districts and track choice distinct concepts.
- **Phase 8 (TT-807):** author/review all twenty-one original reward environments and their previews, independent reward references and per-level default scenery. Validate all 300 levels' references. Do not preload all 26 tracks or introduce visibility-obscuring weather.
- **Phase 9 (TT-911/912 with TT-901–910):** implement actual eligible-clear receipts, independent unlock presentation, global collection/equipment, guest save migration/recovery and optional cloud reconciliation. This work depends on real campaign levels and validated clears, which do not exist in the preview.
- **Phase 10:** verify all scenery on the desktop matrix, Low/Reduced settings, readability, bounded rendering and lazy resource loading. Friends later validate ownership; no scenery may change simulation or competitive eligibility.

Use validated category-qualified unique clear receipts to derive **separate** car and track entitlements at their own thresholds. Store reward kind/category/threshold in the stable reward ID, award each idempotently and recover missing awards from the clear set after interrupted writes. A track award must not grant a car or vice versa. Never trust the selected preference as proof of ownership. Cloud merges union valid category-qualified clear IDs and rederive each reward schedule independently, rather than summing counts across devices or categories. Imported/legacy selections fall back safely if unavailable. Initial future reward migration must preserve existing starter choices.

Required tests with implementation: threshold−1/threshold/+1 for all **18 car and 21 track awards**; category counter isolation with globally usable ownership; 9→10 track only, 14→15 car only, 24→25 track only, 29→30 car only; 90→100 grants the seventh track but no seventh car; no milestone beyond 100; no replay/bonus/Practice/Quick Race inflation; failed/assisted runs excluded; duplicate/interrupted independent awards; guest save recovery; offline/cloud duplicate merges; owned cosmetics on unlocked levels in every category; locked levels stay locked; unowned selection rejection; and presentation/cleanup across all 26 environments. Preview tests cover only the starter behavior implemented now.
