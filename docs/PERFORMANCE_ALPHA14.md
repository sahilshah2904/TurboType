# Alpha.14 actual-GPU performance evidence

22 October 2026, ASUS TUF Gaming A15 FA506II, Windows 10.0.26100, AMD Ryzen 7 4800H, approximately 7.42 GiB RAM. Chromium 156.0.8078.4 ran headed at 1440×900, using **AMD Radeon Direct3D11**, driver 31.0.12014.6, with GPU compositing/rasterization/WebGL enabled. NVIDIA GTX 1650 Ti is also installed but was not the renderer for this run. The default headless probe reported SwiftShader; it is not used for these hardware results.

Reviewed JSON: [final guarded alpha.14](performance/alpha14-hardware.json), [earlier wall-window experiment](performance/alpha14-hardware-wall-window.json), [pre-change alpha.13 baseline](performance/alpha13-hardware-baseline.json). Large raw traces and diagnostics remain ignored under `Reference_Images/analysis/alpha14/` (final run: `hardware-validated/`). This is an actual-GPU automated experiment with synthetic DOM typing, not a physical keyboard session.

## Workload and results

Each final preset loads the actual app and all parts, decodes both accepted music masters, starts the real countdown and samples eight seconds with synthetic input. Instrumentation verifies 8000 ms of active-clock advancement and that the race ends the sample still Racing; a paused/invalid workload fails. It then pauses/retries and runs twelve Race→Settings→Race cleanup cycles. Fresh contexts isolate presets, which run sequentially without browser suites/captures alongside. Collected JS heap is measured outside the timing interval. A hardware guard rejects software fallback; trace tasks are restricted to renderer main threads.

| Preset | rAF samples | Median / p95 / p99 callback interval | >33.4 ms | Renderer task maximum | >50 ms tasks | JS heap delta after 12 cycles |
| --- | --- | --- | --- | --- | --- | --- |
| High | 1149 | 6.9 / 7.4 / 7.6 ms | 0 | 27.457 ms | 0 | +62,400 bytes |
| Low | 1151 | 6.9 / 7.2 / 7.4 ms | 0 | 10.451 ms | 0 | +47,396 bytes |
| Reduced | 1152 | 6.9 / 7.3 / 7.5 ms | 0 | 4.637 ms | 0 | −72,600 bytes |

All presets recorded zero page errors, zero canvases on every Settings visit and one on every Race return. Each kept one AudioContext, decoded the two masters once and ended with one expected browsing loop. Particle maxima were 25/7/0. Asset readiness was 1056/958/896 ms under local/cache-dependent conditions; this is not a public-network loading benchmark. Decode timing/resource entries are retained in the JSON; listening approval is separate.

The initial alpha.13 High baseline sampled twelve seconds and six route cycles: median 6.9 ms, p95 7.3 ms, p99 13.9 ms, four intervals >33.4 ms, zero page errors. Its trace did not include usable renderer-task instrumentation, so its zero-valued task fields are unavailable measurements, not proof of zero long tasks. A subsequent duplicate baseline and the first final-run attempt ended with a closed target before a completed sample; neither is counted as a pass. The final three-preset run completed successfully. The different durations and single sample per preset are insufficient for a statistically established frame-rate speedup.

An earlier run with 400×200 previews had clean twenty-second callback samples. After increasing previews to 800×400 for the hub hero, another run completed High but timed out loading Low; it is not an all-preset pass. The trace analyzer originally buffered/parsed hundreds of megabytes at once. It now streams traces to disk and summarizes one event per line; its results were cross-checked against an existing trace. This reduces profiler memory pressure without asserting that it caused the readiness failure. The subsequent full wall-window experiment recorded 1/10/0 intervals >33.4ms, with Low retaining +1,189,088 JS bytes after cleanup. Its instrumentation did not validate active race time/focus, so those variable tails are preserved as observations rather than presented as a clean workload. The final guarded experiment above resolves that instrumentation gap; its short clean samples do not erase earlier variability or close physical/long-session gates.

The traces include DrawFrame, DroppedFrame, PipelineReporter and sparse FramePresented events. Those event counts have different scopes, so they are not divided into a displayed FPS or dropped-frame percentage. The callback intervals above are **not GPU presentation intervals or physical key-to-photon latency**. No universal 60/144 fps certification is claimed. The bounded JS heap deltas do not measure total process, driver, decoded-image or GPU allocation, nor do twelve cycles prove absence of long-session leaks.

## Resource change and tuning

The measured asset bottleneck was the large original player/composite imagery. Independent parts and compact static previews reduce current requested kart files from 1,953,343 to 678,340 bytes (65.27% reduction): bodies 317,118, wheels 38,060, previews 323,162. The app no longer requests the old composites, though they remain available for provenance. Race textures are all 800×400 bodies and 128×128 wheels, plus a 640×320 baked player palette: about 7.20 MiB nominal RGBA storage compared with the earlier 11.67 MiB estimate. This is an estimate excluding copies/driver overhead. Rules, CPU pace, typing timing and the accepted audio masters were not changed for performance.

No additional speculative renderer rewrite is justified by these short clean main-thread samples. Keep High/Low/Reduced and the physical/long-session release gates; tune further if the interactive follow-up reveals a reproducible bottleneck.

## Reproduce and finish the physical gate

With the existing dev server running, in PowerShell:

```powershell
$env:TT_HARDWARE = '1'
$env:TT_SAMPLE_MS = '8000'
node scripts/profile-app.mjs
```

Optional `TT_CYCLES`, `TT_SAMPLE_MS`, `TT_PROFILES` and `TT_PROFILE_LABEL` control an experiment; document any changed values. Leave the temporary browser open and foreground during sampling. The script deliberately uses separate contexts and does not terminate the user's Vite server. Default software mode remains available by clearing `TT_HARDWARE`; label it honestly. Do not run either mode alongside suites/captures or a physical recorder.

For the remaining two-minute physical session run `node scripts/profile-laptop-input.mjs`, type at least twenty racing keys and follow [the focused checklist](PHASE5_POLISH_TESTS.md). The recorder has no automated typing, records no key contents, verifies GPU compositing and saves its result locally. Handler-to-next-rAF timing is a useful bounded diagnostic, not OS-to-photon latency. The developer must review this evidence and the user's new-parts/responsiveness report before closing TT-506/513/522 and integrating PR #4.
