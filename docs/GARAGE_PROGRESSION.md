# Car selection and future campaign rewards

Product decision: 21 October 2026. The user accepted the distinct alpha.11 cars, requested player choice, ten later locked vehicles with increasingly sporty styling, and sound controls only in Settings. This extends Phases 5/8/9 without renumbering the eleven phases.

## Available now — alpha.12

Quick Race has five starter cars, all available: Volt Kart, Neon Fox, Apex Nova, Comet and Volt Electric. Choose using the illustrated native radio group before starting or while paused. Countdown/racing disables selection and hides setup. Choosing in pause updates the existing scene; it does not restart the race, change CPU schedules, clear typing, advance the clock or alter eligibility. Retry keeps your chosen car. Changing a cosmetic while paused does not undo the existing practice-only pause policy.

All cars have identical gameplay performance. Progress comes from correct typing. Increasingly advanced cars are visual rewards, not speed/accuracy/nitro advantages; this keeps later friends multiplayer fair.

The chosen model is used for the player. The CPUs receive the remaining four models in catalog order; driver IDs, names and seeded difficulty stay independent of model assignment. The hub hero and decorative preview reflect your choice. Sound controls, enable/mute and volume sliders exist only in Settings; enabled music continues across browsing/racing under the existing lifecycle rules. The hub has no radio section or sound controls.

`src/content/kart-catalog.ts` defines stable starter IDs/labels. `src/game/kart-fleet.ts` owns visual anchors and in-place model updates. `src/storage/garage.ts` stores only `{schemaVersion: 1, selectedKart}` under `turbotype:garage:v1`. Invalid JSON, unsupported versions or unknown/unavailable IDs fall back to Volt Kart. A blocked write applies the choice in memory for this visit and shows an explicit notice. Display/audio records and rules/save/content versions stay unchanged. This is a cosmetic preference, not campaign or cloud storage.

## Required future scope — ten reward cars

There will be **15 cars total**: these five starters plus ten additional locked rewards. The following milestone curve is the implementation baseline, subject to playtest tuning. Model names/directions are authoring briefs; their art and unlock behavior do not exist in the current app. Do not add selectable fake assets or claim unlocks are already saved.

| Stable reward ID | Unique main levels cleared | Working model name | Increasingly sporty design brief |
| --- | --- | --- | --- |
| reward-001 | 10 | Streetline RS | Clean upgraded street kart, compact spoiler |
| reward-002 | 25 | Rallysport R | Wider stance, reinforced cage, purposeful exhaust |
| reward-003 | 50 | Vector GT | Low sports body, sculpted sidepods |
| reward-004 | 75 | Apex Sprint | Track chassis, exposed suspension, larger aero |
| reward-005 | 100 | Circuit GTR | Aggressive GT form, carbon trim and diffuser |
| reward-006 | 140 | Aero V8 | Lightweight supercar shape, deep intakes |
| reward-007 | 180 | Phantom RX | Long low supercar with refined lighting |
| reward-008 | 220 | Vortex Hyper | Radical hypercar silhouette and active-looking aero |
| reward-009 | 260 | Ion Prototype | Futuristic endurance prototype, dramatic canopy/fin |
| reward-010 | 300 | Zenith X | Most advanced showcase hyperkart, distinctive premium finish |

Count the set of **distinct eligible main-level IDs** across Easy/Medium/Hard (100 each), using the campaign's clear rules. Replaying a cleared level, extra stars, Quick Race, Practice and optional bonus events do not increase this count. A player can reach a milestone through any mix of difficulties; each main level counts once. The final reward requires all 300. Skipped, failed, practice-only or assisted runs do not create a qualifying clear receipt. Stars/chapter bonus rewards remain separate systems.

## Delivery and verification — Phases 8/9

- Author/review all ten original vehicle bodies/parts with increasingly sporty silhouettes; export/anchor/provenance, reduced/low rendering and loading recovery follow the fleet pipeline. Avoid preloading all fifteen high-resolution models into every race.
- Show locked garage entries with a silhouette, required milestone and progress such as “18 / 25 unique levels”; no purchase or usable selection until earned. Unlock notifications need reduced-motion and accessible text variants. Keep the hub focused on play; detailed collection management belongs in Garage.
- Derive ownership from versioned campaign clear receipts, not a user-editable selected-car preference or credit balance. Award once per stable reward ID, recover unlocks after interrupted writes and support save migration/import. Legacy players retain valid starter selections; unavailable or not-owned selections fall back safely.
- Optional account/cloud progress must merge cleared-level sets without double-counting repeats across devices. Server policies validate ownership where online features depend on it. Friends multiplayer shares appearance only after authoritative entitlement checks; car choice never modifies race simulation.
- Verify threshold−1/threshold/threshold+1 for every reward, replay/bonus exclusion, interrupted/repeated awards, save recovery, offline/cloud merge conflicts and multiplayer entitlement handling. These tests belong with the implemented reward system; alpha.12 does not pretend it exists.

Tracked as TT-911 in [BACKLOG.md](../BACKLOG.md), alongside campaign completion/progression tasks. Current selector and Settings-only audio are TT-523/524.
