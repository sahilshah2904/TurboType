# Alpha.5 isolated kart renderer profile

Recorded 21 October 2026 after the final local 83-unit/72-browser suite completed, with no simultaneous browser test workload. Same ASUS TUF Gaming A15 / Ryzen 7 4800H workstation as the historical profile. Headless Chromium uses SwiftShader, not the workstation's hardware GPU. This is not real-device certification.

## Method and results

Run the Vite dev server and `node scripts/profile-race.mjs`. The existing harness discovers source-module paths and imports the actual new race-track.ts/SoloRace. Scene 1000×450, viewport 1100×700, seed 42/hard, 1000-character synthetic passage, 100 WPM accepted-character schedule, approximately eight seconds per preset. It measures requestAnimationFrame callback intervals, not GPU-present time or typing-to-paint latency. The new app's larger full-window layout, DOM HUD, speedometer, audio and native keyboard are outside this isolated workload.

| Preset / CPU throttle | Samples | Median | p95 | p99 | Max sparks | Canvases after disposal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| High / 1× | 480 | 16.7 ms | 16.8 ms | 16.8 ms | 25 | 0 |
| Low / 1× | 481 | 16.7 ms | 16.8 ms | 16.8 ms | 7 | 0 |
| Low / 4× | 471 | 16.7 ms | 16.7 ms | 16.8 ms | 7 | 0 |
| Reduced / 1× | 481 | 16.7 ms | 16.7 ms | 16.8 ms | 0 | 0 |

All presets reached three core nitro bursts. Raw results: [alpha5-kart-renderer.json](performance/alpha5-kart-renderer.json). Callback distributions vary between runs and are not a universal 60fps claim. CPU throttling is extra pressure on this host, not Samsung/iPhone emulation. Finish confetti caps and route/input/audio behavior are covered separately by browser checks.

## Resource limits and remaining work

PNG source is about 1.69 MB at 1774×887. Four hue variants are baked once at 640×320, reducing their uncompressed RGBA texture area to about 3.3 MB combined, rather than full-source copies. The original texture is roughly 6.3 MB; these estimates exclude decoded browser images, GPU padding, canvas buffers and framework overhead. They are estimates, not heap/GPU measurements. The bitmap still has baked wheels; separate final body/wheel exports and a distinct fleet remain TT-510.

Sparks/confetti retain high limits 40/64 and low 10/16, bounded lifetimes/deltas and scene-owned cleanup. Reduced motion clears decorative particles. CSS/DOM gauge updates reuse its elements and do not allocate a new scene. Two browser-test workers bound simultaneous software-rendered memory; readiness waits use the application's 12-second loader window rather than asserting startup within five seconds under contention.

Latest production sizes: app JS about 101 kB / 36 kB gzip, styles about 40 kB / 9 kB gzip, lazy Phaser about 1.37 MB / 357 kB gzip, plus the kart PNG/fonts. Transfer/cache/decode and real-device startup budgets are **not** certified by those compressed sizes. Optimize/export assets and collect named-device network, frame, memory, audio and native-input traces before launch. Use [the device checklist](PHASE5_POLISH_TESTS.md); TT-505/506/510/513 remain open.
