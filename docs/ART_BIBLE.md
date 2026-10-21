> Alpha.6 palette update (21 October 2026): the user requested red/black. The current application uses near-black #100b10 / charcoal #201c21, crimson #ff5364, warm white #f3edf0 and muted text #beb8bb. Burgundy skyline depth replaces teal. The player kart is red; named CPUs retain different palettes. Typing mistakes use amber #ffcc84 plus an underline, rather than sharing decorative red. Earlier lime/cyan specifications below are historical. No new artwork or external assets were added.

> Alpha.5: the user approved the kart direction. The normal app now integrates it; see [IMMERSIVE_APP.md](IMMERSIVE_APP.md). Older sedan/composition text below is historical, not the current renderer. Distinct vehicle bodies and final device acceptance remain open.

# TurboType art and motion bible — Neon Harbor

Initial Phase 5 direction, 20 October 2026. **Superseded in vehicle quality, composition and typing presentation by the 21 October [race redesign plan](RACE_REDESIGN.md), following user rejection.** The content below describes the existing implementation, not accepted final art. Original modern motorsport illustration, independent of TypeDriveGame/GTA artwork, logos and music. The supplied reel informs pacing and layers, not reusable assets. This document defines the implemented first track; campaign districts and the cinematic opening remain later phases.

## World and palette

Neon Harbor is an after-dark waterfront circuit: distant indigo mountains, a hazy moon, two city depths, illuminated windows/signs, a cyan barrier and cool asphalt. Keep the road less detailed than the vehicles and the typing area calm. Use deep navy #07121f, indigo #192446, cyan #63e7f2, lime #b7f36b, coral #ff9568 and pale blue-white #e4f5ff. Gold celebrates a finished run; red is reserved for local correction feedback.

## Vehicles and source

21 October follow-up: the user now prefers a Mario Kart-inspired arcade direction. Review the [original kart concept and full-window prototype](design/race-direction/README.md) before final production. The sedan/coupe SVGs below describe the current unaccepted production implementation; they are not the proposed final fleet.

Replace the retro sedan with three original low-roof sports silhouettes: Neon GT (fastback), Apex R (winged track coupe), Volt X (electric wedge). Use integrated light strips, dark glass, sculpted side intakes, carbon sills, restrained panel lines and bright brake calipers. Wheels/shadows/underglow/exhaust are separate runtime layers. The player is lime/cyan; CPU colors are amber, blue, violet and coral. CPU labels remain explicit and color is never the only identifier.

Editable generator: `assets-source/build-vehicles.mjs`. Run `node assets-source/build-vehicles.mjs` to deterministically recreate `public/assets/cars/*.svg`. Each SVG uses a 760×240 viewBox, wheel centers (192,175)/(585,175) and no embedded wheel raster. Phaser rasterizes at the explicit source dimensions. These are original project-authored vectors, with no external downloads, brands or traced reel assets. The SVGs remain editable directly; use the generator as the source of truth to avoid divergent copies.

## Composition and camera

Status/metrics stay above the race, followed by track → sentence → typing input, per user feedback. Give the track more space without pushing typing below an unnecessarily tall canvas. The camera follows the player's authoritative world progress, with interpolation only for presentation. Opponents leaving the viewport receive lane-edge indicators; the DOM live standings retain exact progress/rank. The finish gate approaches during the last stretch and the player reaches it at validated completion. Reduced motion uses a stable whole-course view with essential progress updates.

## Motion ownership and limits

Phaser owns cars, wheel rotation, mild suspension, parallax, road streaks, exhaust, nitro rings and bounded finish confetti. Anime.js owns short HTML callout transitions. No visual effect moves the validated prefix, awards rewards, changes CPU schedules or delays result finalization. Nitro is the existing 800 ms core event, not a speed power-up. Overtake announcements require an actual place improvement and a two-active-second cooldown. Never cover the passage with an effect.

High effects may use up to 40 transient sparks and 64 confetti pieces; low effects reduces those pools and scenery detail. Reduced motion disables decorative looping movement, particles, suspension and animated callouts/confetti; readable status remains. Avoid fullscreen flashes, camera shake and continuous bloom passes. Audio is optional and cannot gate input/loading. New effects must remain within those bounds and be profiled before a physical performance claim.

## Sound

Original source-authored synth score, “Harbor Circuit”: an A-minor electronic pulse, slower menu arrangement, fuller race beat, soft engine oscillator, countdown ticks, short error/nitro/overtake accents and a finish chord. Music/effects/master are independently adjustable and initially muted. All sound is synthesized from authored notes and envelopes; no reel song, sample pack, vocal, microphone or external stream. See AUDIO.md for tempo, source, lifecycle and reproducibility.

## Review gate

Inspect desktop and phone captures in high/low/reduced modes, a genuine clean streak, a mistake, an overtake, finish and retry. Record actual measured headless frame data separately from ASUS/Samsung perceived smoothness and audible mix checks. Do not call Phase 5 device/performance acceptance complete from screenshots alone. Opening/loading choreography and a redesigned campaign hub belong to Phase 6/7.
