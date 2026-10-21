# Immersive kart race — review prototype

Created 21 October 2026 for TT-507 (Phase 5 visual direction). **Review artifact, not the replacement production race.** Historical note: this was initially separate from the old Race route. Alpha.5 now integrates the accepted direction into the normal app; see [IMMERSIVE_APP.md](../../IMMERSIVE_APP.md). This review artifact remains independently playable and is not the production renderer. The user approved this car/full-window design on 21 October 2026. This accepts TT-507 direction; production integration and physical-device acceptance remain pending.

## Open and review

With the existing Vite development server running, open:

- Desktop or real phone: http://127.0.0.1:5173/TurboType/docs/design/race-direction/index.html (on a phone, replace 127.0.0.1 with Vite's printed Network address).
- Simulated keyboard composition: add `?keyboard=mock`. This reserves 290px and draws an explicitly labeled fake keyboard; it does not exercise a native Samsung keyboard.

Use Start preview, type directly into the bottom passage, correct with Backspace and pause with Esc or the upper pause button. The notes in the start dialog identify this as a design prototype. The music button pauses the race and opens optional local audio selection/fullscreen. Retry uses the same passage/seed.

Desktop and phone captures are [desktop-preview.png](desktop-preview.png) and [phone-keyboard-preview.png](phone-keyboard-preview.png). The artwork is [volt-kart-concept.png](volt-kart-concept.png). The composition extends to the viewport edges and has only one visible typing surface. A real transparent, labeled textarea uses the existing strict input adapter beneath the passage rendering.

## What is real and what is illustrative

- Reuses src/core/solo-race.ts and src/ui/race-input.ts: one player, four seeded easy CPUs, shared countdown/clock, correction, metrics, pause and final outcomes. Seed 42, one original 145-character review passage; no records/rewards/progress saved.
- HTML/CSS scenery and DOM vehicle placement are a lightweight direction study, not the final Phaser renderer. Horizontal gaps use a monotonic compressed projection; labels show exact CPU percent and the standings dialog shows authoritative rank/progress. It is not a physical-distance scale. No rubber-banding changes CPU schedules.
- The new lime kart is one AI-generated raster concept. Other lanes reuse hue-shifted copies to test size/composition. They are **not** a completed distinct fleet. Wheels are baked into this concept; separate rotating wheel/body exports are future production work.
- CSS skyline/track demonstrate placement. Exhaust now uses per-car progress to show orange flickering flames only while advancing, with larger blue player nitro. Flames stop on stall/error/pause/finish and are hidden for system reduced motion; five fixed effect nodes avoid accumulating particles. Final camera, detailed scenery, finish line staging, low/reduced effects settings, polished audio and production integration remain TT-508–513. The prototype does not declare those complete.
- Uses installed font packages through Vite. Source imports, CSS font paths and review files require the development server. This directory is outside public/ and is not shipped by the current production entry/build.
- Keyboard layout capture is simulated, browser events are scripted, and observed WPM is synthetic. No physical keyboard, audio mix, fullscreen-browser support or real-device frame-rate certification is claimed. Actual Samsung viewport/panning behavior remains to be tested.

## Kart and reference provenance

User requested Mario Kart-inspired cars. Consulted Nintendo's official Mario Kart pages for direction; original exaggerated proportions, broad tires, low cockpit, sculpted surfaces and readable silhouettes guide this concept. No Nintendo artwork, characters, logos, models, soundtrack or game files were downloaded/copied into the project. Direction references: https://mariokart8.nintendo.com/ and https://www.nintendo.com/us/whatsnew/mario-kart-world-direct-revs-up-new-details-on-the-biggest-mario-kart-ever-coming-to-nintendo-switch-2-at-launch/ . Direct fetch of the former timed out in the research tool; do not claim a complete visual asset audit of that page.

Generated using the built-in image_gen tool through the imagegen skill. One transparent PNG, 1774×887, approximately 1.69 MB, copied into this folder from the generated-image output. This is a concept raster, not a source 3D model, licensed external sprite pack, rig or final production export. Full prompt and reproduction notes: [PROMPT.md](PROMPT.md). No project-wide license was added.

## Personal Misirlou playback

The user identified the desired song as Misirlou and requested personal use. No recording was supplied, downloaded, licensed, embedded or committed. Choose a recording from your own device through the music panel. The File API creates a temporary blob URL used by a native audio element; there is no upload, storage write, remote stream, track recognition or saved audio file. The selected filename does not prove which recording it is. Replace/leave closes the old source and revokes its URL. Pause/hide/focus loss stops playback; Start/Resume can play the selected recording after a real gesture. Choice lasts only in this tab. Native controls provide volume and loop.

Public game music remains the existing original synth score. Any future bundled third-party recording is a separate asset/licensing decision; no rights or redistribution clearance are asserted here. For public catalog licensing background, see https://www.umusicpub.com/uk/how-to-license-music . TT-514 tracks production local-file playback and the unresolved bundled-track request.

## Validation performed

- 1440×900 desktop and 390×844 phone with simulated 290px keyboard: captured with real local Vite/Chromium rendering, no console/resource errors or document overflow. Phone input rect y=501–536 stays above the simulated keyboard at y=554.
- Scripted start/countdown, direct append input, wrong-character progress freeze, Backspace correction, shared pause clock freeze, resume, passage completion/frozen result, retry and settings navigation passed.
- Synthetic in-memory WAV selected through the real file input: blob playback succeeded after Start, pause stopped audio, Escape from the settings dialog returned to the paused menu, and there were zero non-GET requests. The synthetic test recording was not saved or committed. Actual Misirlou audio was not tested.
- Prettier formatted HTML/CSS/JS. Production app code/dependencies/rules were not modified, so prior 83-unit/66-browser evidence remains historical for that app snapshot; it is not a full new prototype test-suite run.

Next: review the car at actual size and both compositions, then implement the accepted direction in the production Phaser race, build a distinct fleet, refresh formal regression coverage and test on actual devices. TT-507 direction review is complete by user approval; Phase 5 is not complete.

## Exhaust follow-up verification

Scripted Chromium checks passed for pre-GO suppression, movement-triggered animation, stalled/error shutoff, shared pause shutoff and reduced-motion suppression; desktop/phone captures refreshed. Five fixed flame nodes remain after play. No page errors or phone horizontal overflow were observed. Flames do not change progress, CPU pace or results. This verifies the prototype, not final Phaser effects or actual-device performance.
