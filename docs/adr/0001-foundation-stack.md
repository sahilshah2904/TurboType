# 0001 — Use Vite, Phaser 4 and Anime.js for the foundation

Date: 20 October 2026. Status: accepted for Phase 2, subject to documented evidence if changed later.

## Context

TurboType needs a static GitHub-compatible build, a rich 2D scene and accessible responsive text/controls. Existing research compared Phaser, PixiJS and canvas approaches. The user's GitHub hosting choice rules out introducing separate Sites hosting.

## Decision

Use vanilla strict TypeScript with Vite. Pin Phaser 4.2.1 and Anime.js 4.5.0 exactly, together with the chosen build/test tools in package.json and the full lockfile. Phaser owns only the canvas; Anime.js owns interface motion. Load Phaser lazily so keyboard/settings deep links do not require starting a game renderer. Use self-hosted font assets through pinned Fontsource packages; the preview has no external asset/CDN requests.

Use hash navigation and Vite base `/TurboType/`, including explicit base-prefixed Phaser asset URLs. Test production output on that actual path. Use Phaser 4's `Actions.AddEffectBloom`, not copied Phaser 3 postFX APIs. Explicitly size SVG rasterization to avoid incomplete/black texture rendering observed during visual QA.

## Consequences and evidence

Phaser contributes a larger compressed chunk, acceptable within the proposed transfer budget and deferred until needed. More advanced effects require profiling on hardware before promising frame rates. Vitest tests pure behavior; Playwright checks the production artifact under three emulated Chromium layouts. These are not physical-device keyboard checks. See TESTING.md for results and remaining gates.

Official references checked during selection: [Phaser release](https://phaser.io/download/release/v4.2.1), [Anime.js installation](https://animejs.com/documentation/getting-started/installation/), [Vite guide](https://vite.dev/guide/). Runtime API choices were additionally verified against installed source/types and the running preview.
