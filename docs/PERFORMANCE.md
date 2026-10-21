> Current alpha.11: four distinct original CPU models replace palette copies; the accepted player, restored graphite/crimson/cyan palette and Ignition/Overdrive masters are preserved. See [fleet sources and remaining wheel work](KART_FLEET.md) and [full-app evidence](PERFORMANCE_ALPHA11.md). Earlier version-specific sections below are historical.

> Historical alpha.4 measurement. Alpha.5 replaces the SVG/fixed-size scene with responsive PNG kart rendering and palette textures; the numbers below do not certify the new renderer. The new isolated measurement is in [PERFORMANCE_ALPHA5.md](PERFORMANCE_ALPHA5.md); actual-device acceptance remains separate. See [IMMERSIVE_APP.md](IMMERSIVE_APP.md).

# Phase 5 renderer measurement and limits

Recorded 20 October 2026 on Windows, ASUS TUF Gaming A15 FA506II_FA506II, Ryzen 7 4800H, approximately 7 GiB system-reported memory. The workstation reports AMD Radeon Graphics and NVIDIA GTX 1650 Ti, but **this profile used headless Chromium 156.0.8078.4 with SwiftShader software rendering**, not those hardware GPUs.

## Reproduce

Run the pinned Node/npm install and Vite dev server from [SETUP.md](SETUP.md), then run `node scripts/profile-race.mjs`. An optional first argument changes the dev URL. The script discovers the Vite source-module root from the actual page entry, so it supports root-served or `/TurboType/` dev configurations; it rejects a production preview without source modules. It starts/closes its own browser and never stops the user's dev server.

The harness loads only the original scene and pure SoloRace core on a blank same-origin page. It uses a 1000×450 scene inside an 1100×700 viewport, a fixed seed 42/hard tier, 1000-character synthetic passage, and 120 ms per accepted character (100 WPM). Each profile samples about eight seconds through repeated nitro events. Audio, app HUD/DOM typing, actual keyboard events and the opening/loading flow are excluded. This is a reproducible isolated renderer workload, not an end-to-end latency or GPU presentation benchmark.

The reported values are requestAnimationFrame callback intervals after dropping the initial interval. They do not measure GPU-present timestamps, input-to-paint latency or physical display smoothness. CPU throttling approximates extra CPU pressure; it is not a Samsung emulator or real lower-powered device. No other browser test workload was run concurrently with the recorded profile.

| Preset / CPU throttle | Samples | Median | p95 | p99 | Max observed sparks | Canvas count after dispose |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| High / 1× | 480 | 16.7 ms | 16.8 ms | 16.8 ms | 25 | 0 |
| Low / 1× | 480 | 16.7 ms | 16.8 ms | 16.8 ms | 7 | 0 |
| Low / 4× | 426 | 16.7 ms | 33.3 ms | 33.4 ms | 7 | 0 |
| Reduced / 1× | 478 | 16.7 ms | 16.7 ms | 16.8 ms | 0 | 0 |

Each profile reached three core nitro bursts. Reduced motion kept those gameplay metrics while rendering no particles. The slower CPU run exceeds the 16.7 ms budget in its tail; do not report the 60 fps target achieved on all devices. Raw captured values are in [phase5-renderer.json](performance/phase5-renderer.json). Working outputs remain under ignored Reference_Images/analysis/phase5; reruns will vary.

## Budgets and remaining acceptance

High effects bounds sparks at 40 and confetti at 64; low bounds them at 10 and 16. Actual milestone emission is smaller (25/7 sparks). Pools are cleared on ready/retry and reduced motion, aged with bounded deltas, and owned by one disposable scene. No dynamic bloom passes are added to the race. The inherited hub preview has its own effects and is not part of the isolated measurement. Browser tests separately exercise finish confetti caps, renderer failure/retry, navigation cleanup, reduced/low modes and audio lifecycle.

The production app chunk is approximately 100 kB minified / 35 kB gzip; the lazy Phaser chunk remains approximately 1.37 MB / 357 kB gzip. Cars are small original SVGs and synthesized music adds no audio download. Build size is not the same as verified transfer/cache/startup time; collect a real network trace before calling the initial-transfer release budget passed.

TT-505 still requires actual device audio/performance evidence, coordinated with TT-506. Run the [Phase 5 device checklist](PHASE5_POLISH_TESTS.md) on ASUS/Samsung. A real-device performance recording should identify OS/browser, effects/motion/text settings, viewport, passage, active test duration and audio state; inspect frame distribution and typing responsiveness through nitro, a mistake, finish and retries. TT-1003/1008 retain broader hardware/browser, memory and input-latency release work. No physical iPhone/tablet, actual audible mix or universal 60 fps claim is established here.
