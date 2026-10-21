# Immersive application integration

21 October 2026. App 0.1.0-alpha.8, rules 3 unchanged. This implements the user-approved kart direction in the actual hash-routed app, rather than only the earlier docs/design review prototype. Formal verification results belong in TESTING.md; available-device acceptance remains open.

## Alpha.8 current visual and soundtrack direction

All existing pages now use graphite/steel depth, localized metallic crimson, cyan reactor-style lighting and gold instrument details. CSS world rings/facets are static lightweight layers; Phaser skies/cities/road accents use the same palette. The earlier flat burgundy direction below is historical. The user requested removal of personal music: that UI and loader are deleted. New original Nightforge and Overdrive masters replace Harbor Circuit; browsing and racing have different instruments/melodies/tempi. See [audio generation and lifecycle](AUDIO.md). No Iron Man artwork or film music is included. Current captures: [desktop hub](images/alpha8/desktop-hub.png), [phone hub](images/alpha8/phone-hub.png), [desktop racing](images/alpha8/desktop-racing.png), [phone racing](images/alpha8/phone-racing.png), [desktop settings](images/alpha8/desktop-settings.png) and [phone settings](images/alpha8/phone-settings.png). Older screenshots below retain historical layouts/palettes.

## Alpha.7 preview and audio follow-up (historical)

The hub preview now uses Phaser RESIZE rather than fitting a fixed 1200×420 canvas inside a capped-height container. A 420-unit-high world scales uniformly with container height; scenery is redrawn to the corresponding full logical width, car positions follow width fractions, and road dashes extend through both edges. This removes the empty side columns without stretching artwork. ResizeObserver updates both canvas dimensions and scene layout; navigation destroys the scene/observer. See src/game/track-preview.ts. Verified captures: [1920px preview](images/alpha7/wide-preview.png), [390px preview](images/alpha7/phone-preview.png), [desktop audio controls](images/alpha7/wide-audio.png) and [phone audio controls](images/alpha7/phone-audio.png).

The hub exposes Pit lane radio. Original menu percussion is more energetic, Race setup/results have background music, and a separate countdown score accompanies 3/2/1. A visit-only personal file can replace menu/race music, including the user's own Misirlou copy. No recording was downloaded or bundled. See [audio lifecycle and reproduction](AUDIO.md). Original audio paragraphs further below describe the alpha.5 baseline; this section and AUDIO.md supersede the previously prototype-only local-file limitation.

## Red-and-black theme (alpha.6)

The current theme applies to all five normal routes, not the historical standalone review prototype. src/styles.css supplies shared control/focus/diagnostic colors; src/immersive.css supplies the world, HUD, typing strip and SVG speedometer. The accent is #ff5364 with dark button text; near-black and charcoal surfaces use warm-white/muted text. Mistakes retain a visible amber underline/background and textual correction feedback; completed text is muted. Focus and the active caret remain crimson.

Recreate the palette by following those two CSS files and the scene color constants in src/game/race-track.ts and src/game/track-preview.ts. The approved PNG stays byte-for-byte unchanged. CSS hue-rotate(285deg) colors the hub hero; Phaser bakes the same rotation into a 640×320 player texture once per scene. Race still uses four baked variants total, with CPU 1 using the original asset. The decorative hub adds one 640×320 red texture (about 0.8 MB RGBA), disposed with its scene. No per-frame bitmap filtering, additional dependency, rules or storage changes are introduced. Distinct vehicle models remain TT-510.

Current red/black captures: [desktop race](images/alpha6/desktop-racing.png), [hub](images/alpha6/desktop-hub.png), [phone race](images/alpha6/phone-racing.png) and [phone settings](images/alpha6/phone-settings.png). Alpha.5 captures below preserve earlier composition evidence and the previous palette. Settings captures wait until all reveal elements reach opacity 1, avoiding a misleading mid-transition contrast sample. Real ASUS/Samsung contrast and native-keyboard acceptance remain pending.

## Existing pages revamped

- Race: responsive edge-to-edge Phaser canvas, compact HUD, pre-race/pause/results controls, integrated typing surface and Live WPM dial. Setup/secondary controls appear before racing or while paused. The recovery buttons remain in that visible control deck after graphics failure; a text-only race keeps the same core rules.
- Hub: shared full-window city/garage backdrop, large approved kart hero, open activity/campaign previews and updated decorative kart scene. Campaign cards remain previews, not functional maps.
- Practice: open world background, existing engine/session/setup/results, one visible typing surface and the same recent-WPM dial.
- Keyboard check: open composition over the shared scene; retains free editing/paste, next-key assistance and diagnostics. It deliberately does not apply race restrictions.
- Settings: open responsive grouping over the shared world, with unchanged saved motion/effects/text preferences and original audio controls.

There is no encompassing page card. Non-race pages can scroll for readable content, accessibility/zoom or long diagnostics; full-window visual composition does not mean forcing all content into a single height. Active racing fills the available visual viewport. Useful local form/overlay grouping remains. New welcome/rules/tutorial/calibration/intro flows, maps, garage unlocks, progression and multiplayer are not implemented by this visual integration. Those retain their original phases.

## Native typing surface

Race and Practice keep their labeled textarea and existing strict input adapter. It occupies the same rectangle as a rendered passage; text/caret are transparent in the native control so there is only one visible passage/caret. Tap/click focuses that control, not a canvas imitation. Expected passage and correction help remain accessible descriptions. Character spans are updated in place, canonical input is not reconstructed every HUD tick, and input/composition/Backspace/assistance behavior stays in race-input.ts/TypingEngine.

Standard text scrolls horizontally to a stable active-character anchor. Larger typing text uses a wrapped, vertically scrolling integrated area. Input margin is explicitly zero: the old global textarea margin otherwise offset the touch target. Core state remains in-memory across route navigation, pauses on leaving, and is discarded on reload as before.

## Live WPM speedometer

src/ui/speedometer.ts renders a small native SVG analog dial with a numeric reading. It consumes TypingSnapshot.recentWpm, the existing count of correct committed attempts over up to three active seconds. HUD/results continue to show whole-run average WPM; these are intentionally different measurements.

The existing 100ms UI update calls updateSpeedometer. The gauge rises with recent correct typing, decays when that activity leaves the rolling window, freezes with paused/final active time, and resets with a new engine. Scale is 0–160 WPM; only the needle angle is clamped. A faster measured value remains visible numerically, including above 160. No frame-based speed, animation callback or dial angle changes game rules. The SVG is decorative; its numeric text and Live typing speed label remain available without noisy per-tick live announcements. Reduced motion removes needle smoothing. The gauge has reserved space beside the typing strip and does not cover racing lanes.

## Responsive scene and world

src/immersive.css supplies the shared world layer and route-specific layouts. app.ts owns route data attributes; viewport.ts owns VisualViewport resize/scroll and window-resize listeners plus CSS height/offset/compact data. Cleanup removes all listeners and state. A shrinking OS keyboard does not rebuild the engine; compact composition uses visual viewport height even where layout media queries remain unchanged. Native Samsung keyboard/panning still requires a real-device check.

race-track.ts uses Phaser RESIZE and parent dimensions, redraws scenery on resize, and recomputes lane/vehicle placement without stretching individual sprites. The player is centered in lane three; four named CPU lanes retain authoritative standings. Full-motion x gaps use a signed monotonic exponential compression, so it is a race overview, not a physical-distance scale. Distant markers expose exact percent; the DOM standings always use core progress/place. Reduced motion uses a stable progress overview. The finish gate approaches from remaining player progress and aligns with the player's front at completion.

## Art, effects and limitations

public/assets/karts/volt-kart.png is an exact copy of the accepted original AI-generated concept; source prompt/provenance remains in docs/design/race-direction. A PNG source replaces the old SVG race asset request; failure/retry tests must intercept the actual PNG. Phaser bakes four hue variants into textures once per scene. These are palette variants of one concept, **not a completed distinct vehicle fleet**. The bitmap contains baked wheels; subtle runtime spoke overlays rotate, but separate production body/wheel renders still belong to TT-510.

The original PNG is 1774×887, about 1.69 MB; the original RGBA texture is roughly 6.3 MB and four 640×320 palette textures add roughly 3.3 MB before other scene resources. Palette variants are downsampled once at creation; cars render at at most 220px width. Download, decode, GPU memory and actual phone behavior need measurement before launch; the previous smaller-SVG profile cannot certify this renderer. No downloaded Nintendo art or Misirlou recording is included.

Exhaust uses authoritative progress activity with a 200ms presentation tail. Orange triangles/core flicker while moving; player nitro produces a longer crimson burst with a pale core. Stalls/errors, pause/finish and reduced motion suppress movement effects. A small suspension offset and spoke movement are presentation-only. Sparks/confetti retain fixed high/low limits, clear on ready/retry/reduced motion, and age using bounded presentation deltas. Outcomes freeze independently of effects.

## Integration boundaries and recreation

Run the pinned Node/npm setup and normal Vite server, then open /TurboType/#/race, /#/practice, /#/keyboard, /#/settings or the hub. Build/preview uses the same /TurboType/ base with hash routes. No new package, API key, storage migration or backend is introduced. Optional browser fullscreen is user-initiated and failure reports a useful message while retaining browser-window play.

Original RaceAudio ownership, gesture unlock, saved controls and mute/focus/navigation behavior remain. Personal local-file audio is now integrated into the production app; actual recording/device acceptance remains TT-514. The original soundtrack is the public app default. The user requested personal Misirlou playback, but no recording has been supplied or shipped.

Run npm run check after installing the pinned dependencies and Playwright Chromium. New browser regressions cover the open shell across all existing routes, full-width racing, dial separation from the track, rolling pace, needle-only clamping, pause/idle/retry behavior. Existing suites verify input, seeded CPU timing, failure fallback, preferences, audio and repeated navigation. Actual device acceptance and release coverage remain separate requirements.

Browser checks use two SwiftShader workers to bound peak simultaneous decode/render memory. Graphics-readiness assertions allow the same 12-second window as the app loader watchdog; other assertions are unchanged. This is a test-resource configuration, not a claim about actual-device startup or fps.

## Captured layouts and current renderer evidence

| Page | Desktop | Phone |
| --- | --- | --- |
| Hub | [Capture](images/alpha5/desktop-hub.png) | [Capture](images/alpha5/phone-hub.png) |
| Race in motion | [Capture](images/alpha5/desktop-racing.png) | [Capture](images/alpha5/phone-racing.png) |
| Setup | [Capture](images/alpha5/desktop-race.png) | [Capture](images/alpha5/phone-race.png) |
| Practice | [Capture](images/alpha5/desktop-practice.png) | [Capture](images/alpha5/phone-practice.png) |
| Keyboard check | [Capture](images/alpha5/desktop-keyboard.png) | [Capture](images/alpha5/phone-keyboard.png) |
| Settings | [Capture](images/alpha5/desktop-settings.png) | [Capture](images/alpha5/phone-settings.png) |

Also captured [390×480 compact racing](images/alpha5/phone-compact.png). All are scripted Chromium captures, not physical Samsung keyboard evidence or human speed records. No console errors or horizontal overflow were observed. At 1440×1000 the track ends at y=875 and the reserved gauge begins there; at 390×844 the track ends at y=724 and the gauge starts at y=746. Input remains separate from the gauge and aligned with the visible passage.

See [current renderer measurement](PERFORMANCE_ALPHA5.md) for the post-suite isolated profile and its limits.
