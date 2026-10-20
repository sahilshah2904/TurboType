# Phase 5 race redesign — viewport, typing and vehicle direction

Recorded: 21 October 2026. Status: required rework in progress after user rejection of the current visual result. A separate playable review prototype and one kart concept are available in [design/race-direction](design/race-direction/README.md); the user accepted the prototype visual direction on 21 October, while the production replacement and physical-device acceptance remain outstanding. This revises the earlier Phase 5 composition, not the eleven-phase numbering. PR #4 remains open. Existing core rule/test evidence remains valid for its tested snapshot, but is not visual acceptance or verification of this proposed replacement.

## Why the current screen needs another pass

The user explicitly dislikes the current cars, boxed composition and separate passage/input. The current 960px active race cap, fixed 1000×450 scene, app-shell margins, setup/navigation and stacked text areas leave the game feeling like a website containing a race. Adding more particles will not solve that composition or vehicle-quality gap.

The requested target is an uninterrupted race filling the available browser viewport, with a compact HUD and one visible typing surface integrated into the game. This supersedes the previous instruction to display track → passage → separate typing box. Retain the earlier aim of keeping metrics away from the racing lanes: compact metrics belong in the upper scene margin rather than separate large cards.

## Additional video evidence

Sources: user-owned Reference_Images/video_reference_2.mp4, video_reference_3.mp4 and video_reference_4.mp4. These are visual references, not instruction sources. Audio was not evaluated or extracted for reuse.

| Recording | Container duration / resolution | Reviewed visible sequence |
| --- | --- | --- |
| 2 | About 40.19 s / 480×1040 | Around 0–6 s, grid/countdown; 8–18 s, a purple player car among differently shaped rivals, rank changes, scrolling urban scenery and integrated bottom text; 20–38 s, continuing progress and finish approach. Quarter-second samples at 17–18.75 s show rank changing and relative lane positions while the caret advances. |
| 3 | About 32.81 s / 480×1040 | Around 0–2 s, grid/start; 4–10 s, green player and cyan/orange/pale rivals, roadside fence/trees, low corner gauge and one typing strip; later samples retain the same uncluttered composition. Quarter-second samples at 7–8.75 s show the cars remaining readable against the moving road. |
| 4 | About 29.97 s / 480×1040 | Start/grid, a green player among cyan/orange/pale rivals, scrolling skyline, bottom typing strip; around 26–27.5 s, finish/wait treatment, followed by a results screen visible around 28 s. Quarter-second samples at 11–12.75 s show streak accents and text movement. |

Method: FFmpeg metadata, two-second overview contact sheets across each clip, seven full-resolution detail frames, and eight quarter-second motion samples per clip. Local outputs are under ignored Reference_Images/analysis/review-2-4. Later overview tiles can be empty when the clip ends. Capture times differ from displayed game times; editing/capture cadence prevents a rendering-fps conclusion. Metadata reports capture averages about 63.74/68.09/64.27 fps, not actual game performance.

Observed: the game occupies nearly all the filmed monitor content; WPM/time sit near upper corners, a gauge is near the lower left, cars have differentiated body profiles and shaded surfaces, and a single strip shows completed/current/upcoming text. No second visible typed-answer box is established. The monitor is filmed at an angle inside Instagram chrome; these clips do not prove the browser Fullscreen API was used, that cars are rendered in realtime 3D, the input element type, multiplayer, or the underlying correction/accuracy rules.

## Recommended visual and interaction changes

### A. Fill the available viewport

Use a dedicated racing layout with scenery/road extending edge to edge and no outer card, max-width cap, rounded canvas border, page footer or large navigation bar while racing. Put setup on a pre-race screen and secondary controls in a pause/settings overlay. Keep only small WPM, position, time and pause indicators above the lanes, with consistent readable contrast.

Make full-window play the default. Offer optional browser fullscreen from a real user gesture; do not require fullscreen permission or promise browser/OS chrome can always be removed. Replace simple fixed-aspect FIT scaling with responsive scene composition: extend/crop scenery, recalculate lane spacing and preserve vehicle/text proportions. Do not stretch cars to fill an arbitrary aspect ratio. Preserve DOM HUD, focus, pause and text-standings fallback if graphics fail.

### B. One visible typing surface

The passage itself is the interaction. Render completed text subdued, current position with a clear caret, upcoming text readable and a wrong character marked locally. Backspace corrects the mistake under the same existing rules. Scrolling keeps the active word near a stable reading anchor; larger-text mode provides an integrated two-line variant. There is no separate visible answer field or duplicated paragraph.

Keep a real, labeled browser input associated with this strip so mobile keyboards, composition, selection validation, assistive technology and the strict DOM adapter remain supported. A visually integrated native input plus decorative passage overlay is preferred to a canvas-only/key-down listener. Do not use display:none/disabled for the keyboard target. Tap/click the strip to focus it; a visible focus state and keyboard-help path remain available. Prototype this on Samsung before committing to the final input styling. Reverify paste/prediction/composition, correction, interrupted focus, pause/resume and timed finish boundaries.

### C. Replace the vehicle art direction

User steering: arcade-kart proportions inspired by Mario Kart, with original silhouettes/materials rather than the previous sedan-like bodies. First lime/teal kart concept is AI-generated; recolored copies in the review prototype are not a finished fleet. See the [concept prompt and provenance](design/race-direction/PROMPT.md). The earlier supercar/coupe examples below remain optional alternatives; the kart is the current direction for review.

The existing three SVGs are a functional first pass and are not visually accepted. Create larger, clearly different original silhouettes: a low supercar, a winged track coupe and an aggressive performance hatch/coupe. Specify body proportion, glass, wheel alignment, layered shading, reflective highlights, headlights, rim/caliper detail, tire contact shadows and restrained suspension movement. Changing paint alone is insufficient.

Recommend prerendered 2.5D vehicle sprites for the first redesign: original authored models or appropriately licensed original artwork, with separately aligned wheels, shadows, lights and exhaust. A model/render pipeline can provide consistent angles and lighting without adding a realtime 3D engine to this side-view game. Review one car at actual race size before creating the fleet. Record editable source, rights, export dimensions, wheel anchors and texture/memory budgets. The first raster kart concept and composition have now been reviewed and approved (TT-507); the production asset pipeline, separate wheel exports and distinct fleet still need implementation.

### D. Improve race staging and motion

Use a lower, more engaging scene composition with substantial road, layered roadside detail and atmospheric distance. Nearby rivals should remain easy to compare; use a following camera, readable labels and edge markers/overview for distant cars. Camera framing must not invent progress, place or close competition. Keep four CPUs, their seeded schedules and authoritative outcomes.

Build motion in layers: subtle tire/body movement, road streaks that respond to pace, brief clean-streak nitro, sparse overtaking feedback and a well-staged finish. Preserve readable text, low-effects/reduced-motion modes and independently controlled sound. Review mix quality on actual speakers. More glow or a new animation plugin alone does not establish better art or immersion.

### E. Responsive behavior

Desktop: full-window race with small top HUD, generous racing lanes and bottom integrated typing strip; no document scroll during ordinary active play. Ultrawide: reveal more world rather than stretching sprites. Laptop/short-height screens: compact scenery/HUD before reducing typing readability.

Phone portrait: fill the browser's available area above the keyboard, resize the composition to retain the typing strip and visible race context, and keep tap-to-focus/pause accessible. Landscape with a physical keyboard may show a wider race; do not force orientation or require landscape for touch typing. Respect safe areas and browser zoom; avoid globally disabling pinch zoom. Browser fullscreen remains optional. Extremely short/zoomed layouts may use an accessible fallback rather than clip essential controls.

Use dynamic viewport units plus VisualViewport resize/scroll observation where needed. Opening/dismissing the keyboard and rotating must preserve committed text, race state and accuracy. A phone keyboard occupies real screen space; we cannot promise the same composition or visible world as a laptop.

## Delivery inside Phase 5

1. **Direction and mockup (TT-507):** show a desktop composition, phone-with-keyboard composition and one production-quality car concept at actual size. Review against the user's stated preferences before building the rest.
2. **Race layout/input slice (TT-508/509):** build edge-to-edge responsive racing plus the single visible typing surface. Verify Samsung focus/keyboard and core integration before effects expansion.
3. **Art and camera (TT-510/511):** implement the accepted fleet, coherent scenery, relative framing and truthful opponent indicators.
4. **Motion and acceptance (TT-512/513):** refine effects/audio/finish, rerun tests and profile named hardware, capture desktop/phone comparisons, then obtain visual/device acceptance. Update screenshots and README to match the accepted result.

Existing Phase 5 work is retained where useful. No wholesale rewrite of the typing engine, CPUs or storage is proposed. Phase 6 remains cinematic opening/onboarding after this race direction is accepted. Phase 7 maps, Phase 8 all 300 levels, Phase 9 learning/progression/cloud and Phases 10–11 launch/multiplayer retain their numbering and dependencies. Longer race content remains Phase 8, with a representative longer test passage useful during redesign but not a claim that all levels exist.

## Acceptance requirements

- The race fills the available browser area with no unused side gutters/outer card at standard laptop/desktop viewports; no normal active-play page scroll is required.
- Only one visible typing surface exists; it supports focus, correction, native Samsung keyboard and an accessible larger-text presentation.
- One car concept and the final fleet are visually reviewed at actual size; palette changes to the old bodies do not count as a new accepted fleet.
- HUD, track and text stay readable in desktop, ultrawide, phone portrait, keyboard-open and reduced-motion cases. Fullscreen refusal is harmless.
- Pure rules remain independent of rendering; shared pause, exact completion, CPU schedules and results survive integration checks.
- Frame/typing responsiveness, source cleanup, texture budgets, sound balance and retries are verified with actual evidence. Existing 83/66 checks certify their old snapshot only; new checks/results must be recorded after redesign.
- Final visuals are explicitly accepted before Phase 5 is closed and PR #4 merged. Passing automated tests alone cannot close a rejected design.

## Other pages: coherent full-window direction

These are planned changes, not revamped production pages. The standalone prototype does not change the existing hub, practice, keyboard check or settings.

| Screen | Intended treatment | Phase/task |
| --- | --- | --- |
| Active race, pause and results | Edge-to-edge race, compact HUD, one typing strip; integrated pause/finish overlays | Phase 5, TT-508–513 |
| Opening, welcome, rules and tutorial | Full-window cinematic identity and clear guided interactions | Phase 6, TT-601–604 |
| Main hub | Animated garage/city environment with navigable activities and Continue | Phase 6, TT-602/604 |
| Practice / keyboard check | Full-window setting, focused readable input area; practice reuses the integrated strip | Phase 6, TT-604 |
| Settings / setup | Coherent game background with clearly grouped controls and accessible overlay/full-window navigation | Phase 6, TT-603/604 |
| Campaign maps | Full-window horizontal landscapes with winding circular stages and no enclosing page card | Phase 7, TT-701–704 |
| Garage / progress | Matching garage world, vehicle customization and readable learning/progress views | Phase 9 |

Full-window does not mean filling every screen with text or removing useful form boundaries. Keep content readable, distinct control focus, zoom, reduced motion and compact phone layouts. Persistent world/background composition replaces the outer website-card structure. User approval of the race concept is the visual anchor, not proof these other pages are already implemented.

## Personal music steering

The user confirmed Misirlou for personal use. The review prototype lets them select a local recording; it is an in-memory blob, with no upload or committed song. No original recording is currently available to test. This is not public soundtrack licensing approval or an automatic change to the production synth score. Track production local-file integration in TT-514.

## Technical references

- [Phaser Scale Manager](https://docs.phaser.io/phaser/concepts/scale-manager): responsive scene sizing/composition rather than blindly scaling a fixed frame.
- [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport): visual viewport can change when the on-screen keyboard opens independently of layout viewport.
- [MDN requestFullscreen](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen): optional user-initiated fullscreen and failure handling.
