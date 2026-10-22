# Race atmosphere research and design — alpha.20

The user rejected alpha.18/19's bright curved lines over the road. This revision removes those paths and develops depth and motion across the whole scene, including the mountain/sky area. Appearance still requires user review; “world class” is a design aspiration, not a measured result.

## Primary references reviewed on 22 October 2026

- [Phaser's parallax tutorial](https://phaser.io/news/2019/06/endless-runner-tutorial-part-4) explains using slower background movement to suggest distance. Adaptation: smoothly moving scenery plus different travel rates for distant haze, suspended motes and near-edge speed accents. Distant mountain silhouettes remain crisp; haze moves across their upper scene area.
- [Phaser particle documentation](https://docs.phaser.io/phaser/concepts/gameobjects/particles) describes bounded particle motion, lifespan and alpha behavior. Adaptation: a fixed reusable sprite field with smooth wrap/fade envelopes, rather than allocating particles or redrawing many curve paths every frame.
- [Phaser blend-mode guidance](https://docs.phaser.io/phaser/concepts/display/blend-mode) documents how image colors combine with the scene. Soft gradient textures use SCREEN at low opacity; no bright opaque strokes or full-image blur are applied to the cars/typing.
- [Official Phaser 4 rendering concepts](https://github.com/phaserjs/phaser/blob/master/docs/Phaser%204%20Rendering%20Concepts/Phaser%204%20Rendering%20Concepts.md) explains batching compatible rendering work. The three sprite texture groups share one blend mode, with no per-frame texture generation or shader/filter pass.
- [Sharan et al., Disney Research/MIT: racing motion-blur experiment](https://la.disneyresearch.com/wp-content/uploads/Presence-of-Motion-Blur-Effect-Does-Not-Improve-Gaming-Experience-Paper.pdf) found no improvement in the measured experience/performance of their studied racing game from simulated motion blur. This is evidence against assuming that increasing blur alone improves quality, not proof that blur is always undesirable. Our design emphasizes depth, selective peripheral movement and reading clarity.

## Implemented adaptation

`src/game/race-atmosphere.ts` creates three tiny feathered gradient textures once and reuses **42 sprites**: six broad low-opacity haze wisps, 24 small suspended motes, and twelve soft peripheral exposure accents. Twenty sprites are positioned above the road horizon, over the sky/mountain part of the full-window race scene. Different layer speeds, gentle drift and smoothly feathered fade envelopes avoid the former appearance of floating wires and abrupt wrapping. Long accents fade toward the player's central area; all atmospheric sprites sit behind cars, labels and finish details.

Recent WPM changes the cosmetic travel/strength through a 350ms exponential response. Near scenery and lane markings follow the same decorative travel clock at different rates. Each frame caps its visual delta at 50ms. This is presentation only: CPU schedules, progress, timing, placement and typing rules remain authoritative and unchanged. Normal High/full-motion racing shows the effect; pause/countdown/end hide it, and Low/Reduced disable it. Resize uses the current full scene dimensions; no extra canvas, network asset or dependency is added. Existing scene destruction owns texture/sprite cleanup.

The sky and mountains are inside the race visual's upper scene, not a separate road-only overlay. Interface navigation and the typing surface are deliberately excluded from atmospheric movement. No screen shake or all-screen blur is introduced. The original five accepted environments, vehicles, opening and audio are preserved.

## Validation and review

Browser checks verify upper-scene coverage, fixed sprite bounds, active/pause/Low/Reduced behavior and existing race/input/graphics-recovery regressions. Captures inspect Neon Harbor, a mountain environment and the tutorial action row at laptop widths. See [TESTING.md](TESTING.md) for actual final evidence. Software-rendered checks do not certify physical GPU frame rate; the user should review the new aesthetic at the existing LAN URL with Full motion/High effects.

The shared action-row alignment fix centres buttons and plain links and makes link targets at least 44px tall. Browser geometry checks cover Welcome, rules, tutorial and calibration at 1024/1440 widths. This also applies to completion/other action rows through the shared CSS.
