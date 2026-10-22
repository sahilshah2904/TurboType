# Independent kart parts — alpha.14

22 October 2026, built-in image_gen edits of the five accepted original masters, with `transparent_background: true`. Original composite masters and exports remain unchanged for provenance; the runtime now uses these wheel-free bodies plus editable original SVG wheels. These PNGs are raster sources, not meshes. No external branded assets were introduced.

Each image was inspected before and after editing. Volt Kart used `public/assets/karts/volt-kart.png`; rivals used `assets-source/karts/{id}.png`. All body outputs are 1774×887 with real alpha. Final files live here as `{id}-body.png`, not only in the image tool's output directory.

Volt Kart prompt:

> Use case: precise-object-edit. Edit target: the supplied original green/teal Volt Kart game sprite. Produce the same isolated chassis sprite on transparent background, same right-facing camera, same 2:1 canvas, same framing, identical seat, exhaust, spoiler, body colors and silhouette. REMOVE ONLY both visible complete rubber tires and their rims/hubs. Also remove any far-side tires. Leave empty transparent wheel wells where tires were, retain suspension/axle components attached to chassis, reveal appropriate short suspension struts behind removed wheels. No black filled disks, no replacement wheels, no ground shadow, no new design, no text. We will attach independently animated wheels at the original tire centers in the game. Preserve exact body position relative to the canvas, do not recenter or rescale chassis after tire removal.

Rival prompt, run separately for neon-fox, apex-nova, comet and volt-rival, substituting `{id}`:

> Use case: precise-object-edit. Edit target: supplied original {id} racing kart sprite. Produce precisely the same isolated CHASSIS with ALL TIRES AND WHEELS REMOVED, genuine transparent background, same 2:1 canvas dimensions and exact body position/framing. Keep the same right-facing camera, accepted silhouette, body colors/materials, seat, exhaust and spoiler. Remove ONLY both complete visible rubber tires and rims, also any far-side tires. Reveal plausible short suspension struts/axles behind them, leaving wheel wells EMPTY with transparent gaps and visible suspension. No black disks, no replacement wheels, no shadow, no text. Preserve every body panel, do not redesign, rescale or recenter chassis; this will receive separate animated wheels at original tire centers.

Wheel sources are original code-authored SVGs with rubber gradients/tread, vented disks, model-specific alloy spokes, accent rings and hubs. `scripts/export-kart-parts.mjs` records all geometry/colors, emits editable `{id}-wheel.svg` and exports 800×400 body / 128×128 wheel / 800×400 static preview WebPs. The preview composes the same anchors from `KART_FLEET`; no separate hand-aligned thumbnail. Run the exporter with pinned Node/Chromium, then inspect race/hub and all five selections. Generation is nondeterministic; committed masters make export reproducible.
