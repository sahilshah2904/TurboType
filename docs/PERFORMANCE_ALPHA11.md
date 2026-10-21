# Alpha.11 full-app measurement

21 October 2026, Windows ASUS workstation; pinned Chromium 156.0.8078.4, **headless SwiftShader**, 1440×900, local Vite HTTP. This uses software rendering, not the laptop's hardware GPU. Raw results: [alpha11-full-app.json](performance/alpha11-full-app.json). The old isolated alpha.5 scene excludes important app costs and cannot certify this version.

## Reproduce

Run the normal development server, then `node scripts/profile-app.mjs` (optional first argument: dev base URL). The script uses its own sequential browser contexts and leaves the user's server running. Do not run browser tests/captures concurrently. Raw output goes to ignored `Reference_Images/analysis/alpha11`; copy a reviewed result into `docs/performance/` intentionally. Race/hub captures go to `docs/images/alpha11`.

Each preset loads the actual application, waits for all five textures, unlocks and decodes both original WAVs, selects Steady rhythm, waits through the real countdown, then samples eight seconds while synthetic native DOM input appends one character every 160 ms. HUD, effects, typing strip, sound switching and Phaser run together. It then pauses/retries and makes four Race→Settings→Race cycles. A fresh context per preset prevents earlier scene ownership from contaminating the next measurement. Asset bytes/hashes and resource timing are included. JavaScript heap uses CDP after explicit GC, outside the timing interval.

## Recorded observations

| Preset / CPU rate | Samples | Median callback interval | p95 | p99 | Intervals >33.4 ms | Track ready |
| --- | --- | --- | --- | --- | --- | --- |
| High / 1× | 275 | 33.2 ms | 50.0 ms | 66.7 ms | 71 | 1,906 ms |
| Low / 1× | 289 | 16.7 ms | 66.5 ms | 66.7 ms | 57 | 1,276 ms |
| Low / 4× throttle | 276 | 16.7 ms | 66.6 ms | 83.3 ms | 62 | 2,203 ms |
| Reduced / 1× | 217 | 33.3 ms | 83.3 ms | 100.0 ms | 81 | 1,642 ms |

One short trial per preset is insufficient for a reliable comparative ranking; the variable reduced result particularly shows why this is **not a 60 fps pass**. These are requestAnimationFrame callback intervals, not GPU presentation timestamps, keyboard-to-paint latency or physical display smoothness. Synthetic input and 4× CPU throttling do not simulate another physical machine. Texture loading times are local/cache-dependent, not download-speed estimates. No statistically established before/after speedup is claimed for the reduced DOM churn.

All presets observed zero page errors, zero canvases on each Settings visit and one canvas on each Race return. Particle maxima were 25/7/7/0, inside the current bounded pools. Both music buffers decoded once, one AudioContext survived route changes, and one menu loop remained active on Settings (expected). Decode calls took 29.5–114.3 ms under this workload, including resampling to the AudioContext rate. This is decode wall time, not audible startup/mix approval. User listening approval is recorded separately.

After the four cycles, collected JS heap changed by −151,820 / +364,332 / −228,656 / −57,924 bytes respectively. This short bounded sample shows no large retained-JS increase; it does not prove absence of leaks or measure GPU, native image, total process or audio-device memory. Keep long-session/hardware validation open.

## Asset budget and memory distinction

Four new 800×400 WebP assets total **267,580 bytes**. The accepted player remains 1,685,763 bytes; combined compressed kart files total **1,953,343 bytes**. Those are file payloads, not texture memory. Resource Timing `decodedBodySize` means HTTP content decoding, not decoded image memory.

At four bytes per texel, four rival surfaces require about 4.88 MiB, the 1774×887 player about 6.00 MiB, and its 640×320 palette surface about 0.78 MiB: **about 11.67 MiB nominal RGBA surface storage** before browser/driver copies, intermediate canvases, alignment or mipmaps. This is an estimate, not a measured GPU allocation. PNG authoring masters are outside published `public/`.

## Required follow-up

TT-522 keeps the observed callback tails visible. Capture a hardware-accelerated browser performance trace on the supported ASUS laptop with physical typing, Full/Low/Reduced modes and a longer repeated-race session. Separate main-thread layout, raster/compositor and GPU costs before tuning. Confirm actual typing response and audible scene transitions. TT-505/506/511–513 remain open; emulation alone cannot close Phase 5. The new fleet also still needs separate wheel parts and final visual approval (TT-501/510).
