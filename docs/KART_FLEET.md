# Original rival fleet — alpha.11

Phase 5 replaces the four palette-copy CPUs with four independently generated silhouettes. The accepted player remains the original Volt kart with the same runtime coral palette. The hub previews the player, Neon Fox and Apex Nova; the race uses all five. Race rules, CPU IDs/schedules and input eligibility are unchanged.

| CPU | Model direction | Shipped WebP |
| --- | --- | --- |
| Neon Fox | Amber rally cage, twin exhaust, upright wing | 79,284 bytes |
| Apex Nova | Low cobalt/silver aerodynamic chassis | 54,608 bytes |
| Comet | Pearl/magenta streamliner with swept fins | 57,022 bytes |
| Volt | Violet angular electric chassis | 76,666 bytes |

The four exports total **267,580 bytes**, with real transparency. They are 800×400 pixels and share a near-side view facing right. PNG masters are 1774×887 and stay in `assets-source/karts/`, outside Vite's published public directory. Masters preserve generation metadata. The original 1,685,763-byte player PNG is unchanged.

## Recreate and modify

1. Follow [setup](SETUP.md) and install the pinned dependencies/browser.
2. Review the [complete generation prompts](../assets-source/karts/PROMPTS.md). Each new model used the built-in image_gen tool once with `transparent_background=true`, without reference inputs. No manufacturer/franchise art, music, logos or characters were reused. Generation is nondeterministic; these are raster masters, not editable 3D meshes.
3. To reproduce the committed web exports from the masters, run `node scripts/export-karts.mjs`. It uses the pinned Playwright Chromium canvas encoder, 800×400, WebP quality 0.88; it downsamples without cropping, repainting or changing the composition. Different Chromium encoders may produce different bytes.
4. Change per-model anchors in [kart-fleet.ts](../src/game/kart-fleet.ts). Coordinates are local units in a 200×100 centered frame. `bodyY` aligns the tire contact baseline; `wheels` contain x/y/highlight radius, and `exhaust` is the flame source. Uniform root scaling preserves proportions. Race and hub use the same factory and anchors.
5. Run `npm run check`, inspect the race/hub at supported laptop widths and run [the full-app profile](PERFORMANCE_ALPHA11.md). Test a failed rival asset as well as the player; Retry artwork must recover and text standings must remain usable.

## Remaining art work

These sprites include baked wheel art. Rotating procedural spoke highlights use the measured hubs; they are **not independently rendered wheel parts**. TT-501/510 remain open for separated body/wheel sources, final anchor refinement and user fleet approval. Suspension currently moves the complete assembly. Do not claim a completed 3D authoring pipeline or final fleet acceptance from this integration. This step delivers the distinct models and their reproducible export/attachment pipeline.

The fleet is presentation only. Core progress/placement does not depend on texture size, wheel rotation or exhaust. Reduced motion suppresses decoration; low/high particle bounds and graphics-failure fallback are preserved.
