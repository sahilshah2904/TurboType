# Car selection and future campaign rewards

Product decision: 21 October 2026. The user accepted the distinct alpha.11 cars, requested player choice, ten later locked vehicles with increasingly sporty styling, and sound controls only in Settings. This extends Phases 5/8/9 without renumbering the eleven phases.

## Available now — alpha.13

Quick Race has five starter cars, all available: Volt Kart, Neon Fox, Apex Nova, Comet and Volt Electric. Choose using the illustrated native radio group before starting a new race. Starting the countdown locks the chosen car for the entire run, including pauses and navigation away/back. Pause does not offer car selection. Retry/new race clears the run and reopens selection, defaulting to the remembered choice. Changing the starter model before countdown updates the existing scene without changing CPU schedules or race rules. Refresh discards the unsaved run under the existing policy.

All cars have identical gameplay performance. Progress comes from correct typing. Increasingly advanced cars are visual rewards, not speed/accuracy/nitro advantages; this keeps later friends multiplayer fair.

The chosen model is used for the player. The CPUs receive the remaining four models in catalog order; driver IDs, names and seeded difficulty stay independent of model assignment. The hub hero and decorative preview reflect your choice. Sound controls, enable/mute and volume sliders exist only in Settings; enabled music continues across browsing/racing under the existing lifecycle rules. The hub has no radio section or sound controls.

`src/content/kart-catalog.ts` defines stable starter IDs/labels. `src/game/kart-fleet.ts` owns visual anchors and in-place model updates. `src/storage/garage.ts` stores only `{schemaVersion: 1, selectedKart}` under `turbotype:garage:v1`. Invalid JSON, unsupported versions or unknown/unavailable IDs fall back to Volt Kart. A blocked write applies the choice in memory for this visit and shows an explicit notice. Display/audio records and rules/save/content versions stay unchanged. This is a cosmetic preference, not campaign or cloud storage.

## Required future scope — rewards every 15 levels in each category

**22 October 2026 user correction supersedes the original ten-car/global-clear plan.** Easy, Medium and Hard each have 100 main levels. Each category awards its own new car at **15, 30, 45, 60, 75 and 90 unique eligible main-level clears**: six per category, **18 reward cars and 23 cars total** including the five starters. Clears in another category never advance this counter. Level 100 retains campaign/finale rewards but does not add an extra car under the every-15 rule. Model names/directions below are authoring briefs; art and unlock behavior are future Phase 8/9 work.

| Clears within category | Easy reward ID / working name | Medium reward ID / working name | Hard reward ID / working name | Art progression |
| --- | --- | --- | --- | --- |
| 15 | reward-easy-015 / Streetline RS | reward-medium-015 / Rallysport R | reward-hard-015 / Phantom RX | Distinct sporty street/rally/track bodies |
| 30 | reward-easy-030 / Vector GT | reward-medium-030 / Apex Sprint | reward-hard-030 / Shadow GT | Lower chassis, sculpted sidepods |
| 45 | reward-easy-045 / Circuit S | reward-medium-045 / Circuit GTR | reward-hard-045 / Vortex Hyper | Larger aero, diffuser, carbon trim |
| 60 | reward-easy-060 / Aero V6 | reward-medium-060 / Aero V8 | reward-hard-060 / Ion Prototype | Advanced supercar/prototype forms |
| 75 | reward-easy-075 / Horizon R | reward-medium-075 / Horizon RX | reward-hard-075 / Zenith R | Dramatic canopy, distinctive lighting |
| 90 | reward-easy-090 / Summit GT | reward-medium-090 / Summit Hyper | reward-hard-090 / Zenith X | Category showcase designs, most advanced in their series |

Count **distinct eligible main-level IDs separately within each category**, using the campaign's clear rules. For example, 14 Easy clears plus 1 Medium clear earns neither category's first car; 15 Easy clears earns only reward-easy-015. Replays, extra stars, Quick Race, Practice and bonus events do not increase these counts. Skipped, failed, practice-only or assisted runs do not create qualifying receipts. Stars/chapter/finale rewards remain separate. Retire the never-shipped reward-001–reward-010 IDs; there are no persisted entitlements to migrate today. If an external draft ever used them, do not silently map aggregate ownership onto category rewards.

## Delivery and verification — Phases 8/9

- Author/review all eighteen distinct original vehicle bodies/parts with increasingly sporty silhouettes; export/anchor/provenance, reduced/low rendering and loading recovery follow the fleet pipeline. Avoid preloading all twenty-three high-resolution models into every race.
- Show locked garage entries with category, silhouette, required milestone and progress such as “Easy: 14 / 15 levels”; no purchase or usable selection until earned. Unlock notifications need reduced-motion and accessible text variants. Keep the hub focused on play; detailed collection management belongs in Garage.
- Derive ownership from versioned campaign clear receipts, not a user-editable selected-car preference or credit balance. Award once per stable reward ID, recover unlocks after interrupted writes and support save migration/import. Legacy players retain valid starter selections; unavailable or not-owned selections fall back safely.
- Optional account/cloud progress must merge category-qualified cleared-level sets without double-counting repeats across devices or adding progress to another category. Server policies validate ownership where online features depend on it. Friends multiplayer shares appearance only after authoritative entitlement checks; car choice never modifies race simulation.
- Verify threshold−1/threshold/threshold+1 for all six milestones in all three categories, category isolation, 90→100 with no seventh award, replay/bonus exclusion, interrupted/repeated awards, save recovery, offline/cloud merge conflicts and multiplayer entitlement handling. These tests belong with the implemented reward system; the current preview does not pretend it exists.

Tracked as TT-911 in [BACKLOG.md](../BACKLOG.md), alongside campaign completion/progression tasks. Current selector and Settings-only audio are TT-523/524.

## Staggered tracks and global use — corrected 22 October 2026

The eighteen category-specific car rewards stay at 15/30/45/60/75/90. Track rewards are independent, at 10/25/40/55/70/85/100 per category: 21 reward tracks plus five starters, **26 tracks total** alongside **23 cars total**. This supersedes the paired car/track plan; a car unlock does not award a track and a track unlock does not award a car. At 100 clears, award the seventh category track but no seventh car. Derive separate idempotent entitlements from validated category clear receipts, with independent reward IDs and interrupted-write/cloud recovery.

The source category controls earning only; once owned, either cosmetic is usable in every category on already-unlocked levels, including replays. Replaying never creates another qualifying clear or unlocks a level. See [TRACK_PROGRESSION.md](TRACK_PROGRESSION.md) for starter implementation, all twenty-one proposed track IDs/briefs and phase dependencies. No campaign entitlements are implemented by the alpha.16 starter-track preference.
