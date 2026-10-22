# Track collection and paired campaign rewards

## Accepted decision — 22 October 2026

Five starter tracks are available without campaign progress. Each of the eighteen future car rewards also unlocks one distinct track: six pairs in each of Easy, Medium and Hard at 15/30/45/60/75/90 unique eligible main-level clears. Total collection: **23 cars and 23 tracks** (five starters plus eighteen rewards of each). Level 100 does not create a seventh pair. This required collection supersedes the older optional-extra-tracks wording.

Earning category determines the milestone counter, **not where an owned cosmetic can be used**. For example, the Easy-15 car and track can be equipped for an already-unlocked Hard level, provided that Hard level is playable. All owned cars/tracks work across Easy/Medium/Hard, including replaying completed levels and optional Quick Race. Owning a track never unlocks a campaign node, skips prerequisites or grants a clear. Replaying a level never increases the distinct-clear count. First plays may also use any owned car/track; an authored level supplies its default scenery, not a mandatory cosmetic restriction. A default must be a starter or currently owned track; if unavailable, fall back to an appropriate starter without granting the locked track.

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

## Planned reward manifest — eighteen distinct environments

These are stable proposed IDs and working art briefs, **not shipped tracks or usable unlocks**. Each pair uses the car reward ID in GARAGE_PROGRESSION.md and its category milestone receipt.

| Category / clears | Car reward ID | Track ID | Working environment brief |
| --- | --- | --- | --- |
| Easy / 15 | reward-easy-015 | track-easy-015 | Lantern Canal — lit waterways and footbridges |
| Easy / 30 | reward-easy-030 | track-easy-030 | Sunset Boardwalk — seaside piers and ferris silhouette |
| Easy / 45 | reward-easy-045 | track-easy-045 | Orchard Loop — terraces, blossom trees and windmills |
| Easy / 60 | reward-easy-060 | track-easy-060 | Amber Badlands — sandstone arches and dry riverbeds |
| Easy / 75 | reward-easy-075 | track-easy-075 | Riverlight Viaduct — layered bridges and river lights |
| Easy / 90 | reward-easy-090 | track-easy-090 | Harbor Skyway — elevated port skyline showcase |
| Medium / 15 | reward-medium-015 | track-medium-015 | Rainline Metro — wet city and transit silhouettes |
| Medium / 30 | reward-medium-030 | track-medium-030 | Sapphire Cliffs — coastal headlands and lighthouse |
| Medium / 45 | reward-medium-045 | track-medium-045 | Redstone Arch — canyon bridge and natural arches |
| Medium / 60 | reward-medium-060 | track-medium-060 | Fernfall Valley — layered forest and waterfalls |
| Medium / 75 | reward-medium-075 | track-medium-075 | Solar Observatory — mountain domes and warm horizons |
| Medium / 90 | reward-medium-090 | track-medium-090 | Prism Causeway — futuristic glass-city showcase |
| Hard / 15 | reward-hard-015 | track-hard-015 | Stormfront Docks — cranes, ships and storm clouds |
| Hard / 30 | reward-hard-030 | track-hard-030 | Midnight Switchback — alpine road and distant city |
| Hard / 45 | reward-hard-045 | track-hard-045 | Ember Caldera — volcanic terrain and lava glow |
| Hard / 60 | reward-hard-060 | track-hard-060 | Aurora Ridge — snowfields and static aurora ribbons |
| Hard / 75 | reward-hard-075 | track-hard-075 | Orbital Yard — launch structures and futuristic skyline |
| Hard / 90 | reward-hard-090 | track-hard-090 | Zenith Skyline — flagship elevated megacity showcase |

## Delivery across the existing phases

- **Now / presentation follow-up (TT-531):** five real starter environments, shared preview/race selector, optional remembered preference, per-race lock and recovery/layout checks. Final standings default open (TT-529 refinement).
- **Phase 7 (TT-705):** put car/track choice in the level briefing/replay flow, gated by both owned cosmetics and separately unlocked level IDs; keep map districts and track choice distinct concepts.
- **Phase 8 (TT-807):** author/review all eighteen original reward environments and their previews, stable pair references and per-level default scenery. Validate all 300 levels' references. Do not preload all 23 tracks or introduce visibility-obscuring weather.
- **Phase 9 (TT-911/912 with TT-901–910):** implement actual eligible-clear receipts, paired unlock presentation, global collection/equipment, guest save migration/recovery and optional cloud reconciliation. This work depends on real campaign levels and validated clears, which do not exist in the preview.
- **Phase 10:** verify all scenery on the desktop matrix, Low/Reduced settings, readability, bounded rendering and lazy resource loading. Friends later validate ownership; no scenery may change simulation or competitive eligibility.

Use a category/milestone receipt to derive both car and track entitlements. Persist a completed receipt atomically or reconstruct both entitlements from the same validated clear set, so an interrupted write cannot permanently grant only half the pair. Never trust the selected preference as proof of ownership. Cloud merges union valid category-qualified clear IDs and rederive pairs idempotently, rather than summing counts across devices or categories. Imported/legacy selections fall back safely if unavailable. Initial future reward migration must preserve existing starter choices.

Required tests with implementation: threshold−1/threshold/+1 at all eighteen milestones; category counter isolation with globally usable ownership; 90→100 without another pair; no replay/bonus/Practice/Quick Race inflation; failed/assisted runs excluded; duplicate and interrupted pair awards; guest save recovery; offline/cloud duplicate merges; owned cosmetics on unlocked levels in every category; locked levels stay locked; unowned selection rejection; and presentation/cleanup across all 23 environments. Preview tests cover only the starter behavior implemented now.
