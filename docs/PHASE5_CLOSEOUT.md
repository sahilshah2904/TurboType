# Phase 5 closeout — alpha.14, 22 October 2026

**Final physical acceptance received.** The user reported “I believe everything worked fine.” The reviewed two-minute recorder session contains 100 trusted racing keydown events, 99 trusted inputs, zero page errors and enabled AMD Direct3D11 compositing. Handler-to-next-rAF median/p95/max are 9.3/18.8/22.2ms. [Published summary](performance/alpha14-physical-input.json), with raw details kept ignored locally. This meets the agreed Phase 5 physical gate together with the prior automated/visual evidence; it is not universal frame-rate or end-to-end latency certification. All Phase 5 tasks are reconciled complete (including canceled scope); PR #4 integration follows the updated exact-head check. Older pending-gate wording below records the pre-acceptance checkpoint.

The user authorized the three remaining steps: component artwork, hardware performance work and final reconciliation/integration. The older stop-and-save restriction is historical. Phases 6–11 are unchanged; campaign/reward correction is documentation for later work.

## 1. Component artwork

All five accepted models now have independent chassis and wheel assets. Built-in image_gen edited each original once to remove tires while preserving framing, materials and silhouettes. Original composites remain intact; committed body PNGs and exact prompts are in `assets-source/karts/parts/`. Editable original SVG wheels have rubber/tread, vented disks, model-specific alloys/spokes, rings and hubs. Export/recreation is `node scripts/export-kart-parts.mjs`.

The shared factory loads body/wheel textures, attaches grounded elliptical wheel carriers and a separate suspension/chassis container, and reuses them for Race/Hub. Rotation advances only while moving, is delta-clamped, freezes on pause/stop and is disabled by reduced motion. Model changes reuse the current assembly; cosmetics cannot change pure race outcomes. Static previews compose the same anchors. Missing chassis or wheels follow existing retry/text-standings recovery.

Body exports total 317,118 bytes; wheel exports 38,060 bytes; previews 323,162 bytes: **678,340 bytes total**, versus 1,953,343 bytes of old composite kart files (65.27% smaller payload). This is kart-file payload, not a total bundle/network speed claim. The original files remain in public for history, but current routes no longer request them. Nominal Phaser RGBA surfaces are about 7.20 MiB including the baked player palette, versus the earlier estimate of 11.67 MiB; this excludes driver/browser copies and is not a GPU allocation measurement.

## 2. Hardware evidence and limits

Use `docs/PERFORMANCE_ALPHA14.md` and its reviewed JSON for the completed hardware experiment. Headed Chromium confirms the actual AMD Direct3D11 renderer and enabled GPU compositing; the default headless probe used SwiftShader. Keep these experiments distinct. Raw large traces and diagnostics stay ignored under `Reference_Images/analysis/`.

Automated typing uses synthetic DOM InputEvents. It does not measure a human key press or end-to-end input/display latency. The interactive `node scripts/profile-laptop-input.mjs` recorder provides the remaining physical-input follow-up in a separate test browser; it records trusted input counts and handler-to-next-rAF timing without key contents. The two-minute session and user perceptual report remain required before final acceptance. No trace or collected JS heap proves total native/GPU memory behavior or universal performance.

## 3. Regression, review and integration

Full local `npm run check` passed formatting/types/build, **96 unit and 36 browser cases**. Three new motion cases cover pause/resume, reduced motion and delayed-frame bounds. Browser checks load every part/preview, preserve selection/pause/CPU/results, validate missing body/wheel recovery, and retain fullscreen/readability/audio/input/route cleanup coverage. The first run exposed an obsolete thumbnail filename assertion; after updating it, the full suite passed. No timeout increase or assertion removal was used.

Developer review preserves core timing/rules, bounded effects, one-car-per-race, existing lifecycle/storage semantics and accepted colors/music. Fresh per-model race, hub, active/paused race and 1024/1366/1440/1920 captures were generated sequentially with `node scripts/capture-fleet.mjs` and inspected. No page errors or horizontal overflow were observed; bodies/wheels align without duplicate baked tires. Hosted PR run 39725624773 passed for exact history-sync head d168720, whose file tree matches implementation 2eadeef. The README-only main/feature history conflict was resolved on the feature branch; no game integration into main occurred. Evidence-only follow-up documentation has its own hosted check.

The backlog now closes implemented/verified feature work TT-501/502/505/508/509/510/515/518/519/520, with final physical acceptance explicitly retained in TT-506/511/512/513/522. This consolidates overlapping historical gate wording without claiming those final gates passed. The old soundtrack/palette/functional approvals are preserved rather than requested again.

**The physical laptop evidence and user report have been reviewed and accepted.** PR #4 is ready for integration after the acceptance-documentation head passes its own check. No Pages/backend deployment is part of Phase 5.

## Reward correction and setup controls

Future TT-911 now awards distinct cars at 15/30/45/60/75/90 eligible main clears **within each** 100-level category: eighteen rewards plus five starters. Counts are independent; replays/bonus/Practice/Quick Race do not inflate them. No extra car at 100 is implied. Stable category-qualified IDs, briefs and save/cloud boundaries are in `GARAGE_PROGRESSION.md`; no unlock code is claimed today.

Quick Race passage/pace/mode remain useful optional player choices. The seed reproduces CPUs for retries/debugging and belongs in Advanced/Replay under TT-603. Campaign levels will supply authored passage/CPU profile/mode/targets automatically; players will not configure these four fields before each campaign level. See `QUICK_RACE.md`.
