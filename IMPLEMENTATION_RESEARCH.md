# TurboType: implementation research and delivery plan

Research date: 20 October 2026. First-release scope confirmed by the user: computer opponents, hosted entirely on GitHub Pages.

**Planning update:** [GAME_DESIGN_PLAN.md](./GAME_DESIGN_PLAN.md) is the authoritative product, rules, onboarding, progression, documentation, and phased-delivery specification. Read it before implementation. This research document retains the technology comparisons and sources; where earlier scope suggestions differ, the game design plan takes precedence. Current status: planning only; no game has been implemented or deployed.

**Latest hosting/data update:** [responsive and online architecture](./docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md) replaces the initial desktop-first/local-only public launch assumption. The frontend stays on GitHub Pages, with responsive phones/tablets/laptops and optional account-backed cloud progress before single-player launch. A separate live race service follows immediately afterward. The earlier GitHub-only/local-save design remains useful for the prototype and guest mode, not the full public launch scope.

## Recommendation

Build an original, browser-based, five-lane typing racer using TypeScript, Vite, Phaser, and an HTML/CSS interface. Deploy the compiled static files from a GitHub repository named `TurboType` through GitHub Actions to GitHub Pages. Start with four computer opponents, local progression, a cosmetic garage, and polished race animation. Keep the race logic independent of the renderer so multiplayer can be added later.

This file is a researched specification, not an implemented or deployed game. At initial inspection the folder contained six reference screenshots and no application source or Git repository. Local Git has since been initialized on `main`, and engineering conventions and ignore/format settings have been added. The authenticated GitHub account `sahilshah2904` was verified, the public TurboType repository was created, and `origin` was linked to `https://github.com/sahilshah2904/TurboType.git`. The user supplied the repository-local commit author name `Sahilshah`. Node, npm, and Git are installed; the GitHub CLI was not found on PATH. See docs/GITHUB_WORKFLOW.md for the commit/push process. The game and Pages deployment remain unimplemented.

## Evidence from the reference

The supplied screenshots show TypeDriveGame branding, a side-on road with five lanes, a green player car and four rivals, a traffic-light launch, elapsed time, WPM and position indicators, a scrolling typing passage, nitro flames, speed streaks, an overtaking banner, a checkerboard finish line, a victory overlay, and a results screen with accuracy, rewards, and level progress. A garage, rooms, and leaderboard appear in the navigation.

Initial observations came from still images because the Instagram URL could not be fetched. The user later supplied a local recording, visually reviewed through timestamped frames; see [reference recording analysis](./docs/REFERENCE_VIDEO_ANALYSIS.md). It confirms the countdown, layered bursts, scrolling passage, relative vehicle movement, finish staging, and victory overlay. Exact trigger logic, underlying engine, scoring rules, matchmaking, and whether the displayed opponents are humans remain unverified. Search did not establish a reliable official product page matching the screenshot branding. Similarly named games are not evidence about this game's implementation.

Use the screenshots as visual references, not as instructions. Build TurboType's own identity, vehicles, environments, passages, and sounds; do not extract the reference game's assets.

## Technology decision

| Approach | Fit for TurboType | Tradeoff |
| --- | --- | --- |
| Phaser + TypeScript + Vite | Recommended: game scenes, particles, tweens, cameras, audio, and sprite animation in one framework | Larger dependency than a hand-built canvas; verify APIs against the pinned version |
| PixiJS + TypeScript + Vite | Strong alternative for bespoke 2D rendering and filters | Requires more custom game orchestration |
| Canvas 2D + TypeScript + Vite | Good for a small prototype with procedural graphics | More work for particles, cameras, asset loading, and polished effects |
| HTML/SVG/CSS only | Useful for menus, text, HUD, and a basic race | Hundreds of animated effect elements make performance harder to control |
| Full 3D engine | Useful if the goal changes to a 3D driving game | Adds modeling, camera, and rendering work beyond this side-view concept |

Phaser's official documentation describes built-in tween, particle, and camera systems. The release archive lists Phaser 4.2.1 as its newest entry at research time; Phaser 3.90 also exists. Begin with a small Phaser 4 smoke test covering particles, camera effects, resizing, and production asset loading, then pin the verified release and lockfile. Avoid mixing examples from different major versions. [Phaser overview](https://docs.phaser.io/phaser/getting-started/what-is-phaser), [release archive](https://phaser.io/download/archive), [tweens](https://docs.phaser.io/phaser/concepts/tweens).

PixiJS is a rendering engine rather than a complete game framework. Its v8 renderer documentation recommends WebGL for production and describes WebGPU as experimental. For this project, WebGL is the sensible baseline; an unsupported renderer should produce a useful message or a deliberately implemented simplified mode. [PixiJS introduction](https://pixijs.com/8.x/guides/getting-started/intro), [renderers](https://pixijs.com/8.x/guides/components/renderers).

Use semantic HTML for typing, settings, menus, garage, and results. Use Phaser for vehicles, scenery, and effects. React is optional; a small TypeScript UI avoids another dependency initially. Add Anime.js for coordinated interface motion, following the additional animation research below. A physics engine is unnecessary for the first release.

## First-release gameplay

1. Select passage difficulty, opponent skill, vehicle, and environment.
2. Show a short traffic-light countdown. Reject race input until the start timestamp.
3. Type the displayed passage while racing four explicitly labeled computer opponents.
4. Require correction of mistakes before advancing. Backspace removes input without erasing the historical error count.
5. Trigger visual nitro on clean typing streaks, and call out meaningful overtakes.
6. Finish when the passage is completely correct; freeze the player's exact finish timestamp.
7. Show placement, WPM, accuracy, elapsed time, pace history, XP, and cosmetic rewards. Offer an immediate retry.

The game design plan expands the product into onboarding, three 100-level Easy/Medium/Hard campaigns with horizontal progression maps, quick races, practice drills, a garage, bonuses, and local progress tracking. Build a complete city-track slice first, then expand content and environments through the documented milestones. A deterministic daily passage can also work without a backend, but its records would remain local.

Cosmetic unlocks should not change competitive typing speed. Avoid fake online players, fabricated global scores, or nonfunctional room buttons in the first release.

## Typing and race rules

Separate the user's current input, validated prefix length, total inserted character attempts, correct attempts, current streak, and elapsed time.

- Race progress: validated prefix length divided by passage length. An uncorrected error blocks advancement. Deleting correct text reduces current progress; retyping it cannot repeatedly farm rewards.
- Displayed WPM: validated character count / 5 / elapsed minutes. Return zero at zero elapsed time. This is the declared TurboType convention, not a claim about the reference game.
- Accuracy: correct character attempts / all character attempts × 100. Count corrections as new attempts; Backspace itself is not a character attempt. Show an unset state before any attempts.
- Recent pace: a rolling 2–3 second window of correct input events. Use it for engine pitch, wheels, and exhaust; do not replace the final average WPM with this value.
- Placement: compare each racer's validated progress; finished racers sort by finish time. Resolve exact ties consistently and visibly.
- Nitro: visual and audio feedback for a clean streak in the first release. It must not let a racer cross the line before completing the passage.

Use a real focusable textarea/input with `input`, `beforeinput`, and composition handling. `keydown` alone misses important text-entry behavior. MDN notes that `beforeinput` is not always fired or cancelable, so validate the resulting input value too. Disable spellcheck and autocorrection where supported, define a paste policy, and handle multi-character insertions without silently corrupting metrics. Keep shortcuts separate from character input. Start with English passages and document that multilingual scoring needs grapheme-aware handling. [Input behavior](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event).

Use `performance.now()` for elapsed durations and timestamps, with an explicit solo pause policy on tab hiding. Do not advance opponents by frame count: gameplay must be consistent at 30, 60, and 144 Hz. On resume, reset rendering deltas so cars and particles do not jump. [Monotonic timing](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now).

## Animation design

These are proposed TurboType effects, not verified reference-game mechanics.

| Moment | Proposed implementation | Initial tuning target |
| --- | --- | --- |
| Grid | Idle body movement, soft exhaust, wheel details, sequenced traffic lights | Approximately 3 seconds before launch |
| Acceleration | Smooth car translation, rear suspension dip, wheel rotation, exhaust growth | 120–220 ms visual response |
| Clean streak | Flame core, glowing exhaust, sparks, short shock ring, speed streaks | Around 20 clean characters, then tune |
| Overtake | One brief banner, accent burst, rank change animation | Approximately 700 ms; cooldown prevents spam |
| Mistake | Red character/underline, interrupted streak, short exhaust sputter | Immediate text feedback; subtle scene response |
| Environment | Independently scrolling skyline, distant structures, barriers, and road | Different scroll rates create depth |
| Finish | Checkerboard gate, brief scene slowdown, player celebration, confetti | Approximately 0.5–1 second before results |
| Results | Staggered metric reveal, reward count-up, XP fill | Keep retry available immediately |

Render every vehicle from consistent art with separate wheels, shadows, windows, lights, and exhaust anchors. Detailed original vector art or sprite atlases will look more intentional than emoji vehicles. Start with procedural particles and vector vehicles; introduce raster atlases where profiling or art quality justifies them.

Keep world progress and screen position separate. The camera can track the player while rivals move according to relative progress; offscreen rivals get edge indicators. The finish gate enters view based on actual remaining progress. Smooth interpolation must never alter recorded placement or finish time.

Phaser particle emitters support the exhaust/spark/confetti layer; its camera system supports scene movement and finishing effects. Put HUD and typing outside camera shake. Prefer subtle local glow to continuous full-screen blur. [Particles](https://docs.phaser.io/phaser/concepts/gameobjects/particles), [cameras](https://docs.phaser.io/phaser/concepts/cameras).

## Computer opponents

Give each bot a seeded typing schedule with a target WPM, bounded pace variation, launch reaction, occasional hesitation, and simulated correction delay. Convert that schedule into character progress against the same passage. Category-specific opponent ranges and level learning targets are specified in GAME_DESIGN_PLAN.md; keep their tuning in shared configuration.

Choose skill before the race. Do not secretly accelerate rivals whenever the player improves. Seeded schedules make failures reproducible. After the player finishes, use the game design plan's explicit CPU-result policy: derive remaining CPU finish times from their actual seeded schedules, label them as simulated, and mark opponents beyond the event deadline DNF.

## Architecture and assets

Suggested module structure:

```text
src/
  main.ts
  core/       # typing rules, metrics, race state, seeded bot schedules
  game/       # Phaser scenes, cars, track, camera, particles
  ui/         # HTML HUD, passage, setup, results, garage, settings
  audio/      # sound controller and volume management
  storage/    # versioned local save and migration
  content/    # original passages, tracks, cosmetic definitions
public/
  assets/     # original/appropriately licensed graphics, fonts, sounds
tests/        # scoring, bot determinism, race lifecycle, browser flows
.github/workflows/deploy.yml
```

Use explicit setup → countdown → racing → paused → finished → results states. A typed event interface connects race logic to animation; rendering cannot award points or decide winners. Keep race providers replaceable so bots can later be exchanged for a network implementation.

Save settings, selected cosmetics, unlocked items, personal records, and bounded recent history under a namespaced, versioned localStorage key. Validate stored data and recover from malformed saves or storage failures. Saves are specific to the browser/origin and can be cleared or edited; they are not verified rankings. Provide export/import later if useful. [Local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Sound should start after a user gesture and have separate music/effects volume and mute. Use short licensed effects or synthesized tones for countdown, errors, nitro, and finish. Ease engine pitch from recent pace. [Browser audio practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).

## Performance and usability targets

These are engineering goals to measure, not achieved results:

- Target 60 fps on a typical laptop at 1080p; support a lower-effects mode on slower devices.
- Pool particles, cap live effects, reuse textures, and cap device pixel ratio. Avoid per-frame DOM rebuilds and save writes.
- Update text feedback on input; throttle nonessential numeric HUD refreshes to about 10 Hz.
- Aim for under 5 MB compressed initial transfer. Lazy-load extra tracks and music.
- Support phones, tablets and laptops from the foundation; test real mobile text entry, portrait/landscape, safe areas and viewport changes with the soft keyboard open.
- Provide visible focus, keyboard-operable menus, adequate contrast, text error markers beyond color, and concise result announcements.
- Honor reduced-motion preferences and expose independent toggles for shake, flashes, and particles. Reduced motion preserves race information. [Reduced-motion preference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

## GitHub deployment

GitHub Pages serves static HTML, CSS, and JavaScript, making this solo/bot design suitable. The expected project URL is `https://<github-username>.github.io/TurboType/`; the real owner still needs to be identified. Public repositories can use Pages on GitHub Free. [Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Implementation steps:

1. Initialize local Git and create the actual game source, package scripts, and lockfile. Exclude node_modules, build output, secrets, and screenshot references from published assets.
2. Set Vite's project base to `/TurboType/`. Resolve Phaser-loaded assets through Vite's base URL too; root-relative `/assets/...` paths can break project-site deployment.
3. Keep initial navigation within one page, or use hash routes so refreshing a screen does not require server rewrites.
4. Create the GitHub repository under the user's authenticated account and push the reviewed project.
5. Select GitHub Actions as the Pages source. CI installs with `npm ci`, typechecks, runs relevant tests, builds, uploads `dist`, and deploys to the github-pages environment. Use verified current action versions and minimal permissions.
6. Verify the live URL, assets, audio loading, page refresh, and a completed race after deployment.

Vite documents the repository-specific `base` and Pages workflow. [Deployment guide](https://vite.dev/guide/static-deploy.html).

Pages has a 1 GB published-site limit and a soft 100 GB/month bandwidth limit; custom Actions workflows are exempt from its soft 10-builds/hour limit. TurboType should be much smaller, but large video backgrounds would waste the budget. Reassess hosting if the project becomes a commercial service. [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## Later multiplayer

GitHub Pages can still host the frontend, but cannot run an authoritative persistent game server or shared score database. A later Colyseus service is a suitable candidate for room lifecycle and synchronized state; provider selection and cost require fresh research before adoption. [Colyseus rooms](https://docs.colyseus.io/room), [state synchronization](https://docs.colyseus.io/state).

The server would own passage selection, race start, accepted progression, finish ordering, and rewards. Clients send sequenced typing updates; opponents interpolate received progress. Include reconnect/timeout handling, input limits, and score validation. Server validation helps reject impossible claims, but cannot prove a browser user typed manually. A database or realtime channel accepting client-submitted WPM alone does not produce trustworthy rankings.

## Delivery order and acceptance checks

1. **Core prototype:** correct passage input, four deterministic bots, countdown, progress, exact finishing, and results. Verify scoring with mistakes/backspace, repeated text, punctuation, and zero elapsed time.
2. **Visual quality milestone:** finish one track and one polished vehicle, then nitro, parallax, overtakes, finish effects, sound, and reduced motion. Review in the browser before expanding the asset set.
3. **Replay and progression:** difficulty choices, additional cosmetics, local records, rewards, and garage. Verify rewards are applied once and survive reload; repeat retries must not accumulate listeners.
4. **Release:** production build, Pages configuration, clean-browser test, responsive checks, and deployed smoke test.

Browser checks should cover Chrome/Edge and Firefox, plus mobile Safari/Chrome where available. Exercise input focus loss, composition, paste policy, resize, tab hiding, muted audio, storage failure, keyboard-only navigation, and complete races at different bot difficulties. Profile a full race with effects enabled. Explicitly test the `/TurboType/` deployment path rather than only localhost root.

First implementation should prioritize one complete, satisfying race from setup to replay. More cars and tracks come after correct typing behavior and smooth animation have been demonstrated.

## Additional animation and plugin research

Added 20 October 2026 in response to the user's request to evaluate Anime.js and other animation resources. These recommendations are based on published documentation; no performance benchmark or integration prototype has yet been run.

### Updated recommendation: Phaser + Anime.js

Use **Phaser for the race world and Anime.js v4 for the HTML/SVG interface**. Both can ship as bundled browser code through GitHub Pages without an animation service or persistent backend. Install selected packages through npm and pin the tested versions; do not depend on an unversioned CDN script.

[Anime.js](https://animejs.com/) supports CSS, SVG, DOM attributes, and JavaScript objects and uses the MIT license. It fits the original TurboType plan's plain TypeScript interface. It supplies motion tools, not finished racing art or an anime visual style: the cinematic feel will still depend on asset quality, timing, framing, and sound. [Official repository](https://github.com/juliangarnier/anime).

Useful Anime.js capabilities and TurboType applications:

- **Timelines:** coordinate the countdown typography, launch panel exit, victory title, results cards, and XP fill. A timeline can combine animations, labels, timers, and callbacks. [Timeline documentation](https://animejs.com/documentation/timeline/).
- **Scopes:** contain a screen's animations, respond to media queries, and revert them when that screen is removed. This supports repeated retries and reduced-motion variants without leaving old animation instances alive. [Scope documentation](https://animejs.com/documentation/scope/).
- **WAAPI option:** use browser-backed animation for eligible interface transformations and fades. The documentation offers a standalone `animejs/waapi` import; use the standard timeline engine where its richer sequencing is needed. Hardware acceleration depends on the animated property and browser, so this is not a guarantee of smoothness. [WAAPI documentation](https://animejs.com/documentation/web-animation-api/).
- **SVG, text, stagger, and easing tools:** draw the TurboType logo, reveal headings, stagger reward cards, and add restrained spring motion to selections. Keep active passage characters stable; decorative text animation belongs around the typing task. [Documentation index](https://animejs.com/documentation/).

### Other libraries and plugins evaluated

| Tool | Useful TurboType application | Recommendation |
| --- | --- | --- |
| [GSAP and plugins](https://gsap.com/docs/v3/Plugins/) | Elaborate interface timelines; Flip for garage layout changes; DrawSVG/MorphSVG for logo and badge motion | Strong alternative to Anime.js if the prototype needs those capabilities; choose one main interface animation engine |
| [Motion](https://motion.dev/docs/animate) | Spring menus, hover/press feedback, HTML/SVG animation, and sequences | Alternative if interface needs favor it, particularly if we later adopt a component framework; no need to add beside Anime.js initially |
| [Phaser 4 filters](https://phaser.io/news/2026/05/phaser-4-filter-system) | Vehicle highlights, color grading, finish wipes, and selective cinematic effects | First choice for effects inside the race canvas |
| [Rex plugins](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/effect-properties/) | Additional Phaser helpers, effect controls, and features absent from core | Add individual plugins only after identifying a specific gap and verifying engine compatibility |
| [Rive web runtime](https://rive.app/docs/runtimes/web/web-js) | A reactive pit-crew mascot, animated dashboard character, or interactive medal | Later enhancement if we create suitable Rive art; unnecessary for moving the race cars |
| [Lottie Web](https://github.com/airbnb/lottie-web) | Authored victory badges, short trophy animations, and loading illustrations | Optional for isolated authored sequences; procedural nitro stays in Phaser |
| [Howler.js](https://howlerjs.com/) | Audio sprites, fades, and independent interface audio | Optional; try Phaser's existing audio first to avoid two competing sound systems |
| [TexturePacker](https://www.codeandweb.com/texturepacker?source=photonstorm) | Packing vehicle parts, flame frames, and track objects into sprite atlases | Authoring tool to evaluate once we have enough raster assets; not required for initial procedural/vector graphics |

Motion's documentation provides both a mini native-browser build and a hybrid build with broader targets and sequencing. Compare the actual built bundle and prototype performance, rather than assuming any library is fastest from its marketing description. [Motion animate](https://motion.dev/docs/animate).

GSAP's installation documentation says its plugins are available freely on npm. Its standard no-charge license is a custom license, distinct from MIT; retain the applicable terms if selected. There is no need to purchase or install GSAP for the proposed Anime.js approach. [Installation](https://gsap.com/docs/v3/Installation/), [license](https://gsap.com/community/standard-license/).

### Phaser version compatibility refinement

The original plan recommended a pinned, smoke-tested Phaser release. Additional research makes this especially important: **Phaser 4 replaces Phaser 3's preFX/postFX model with internal/external filters**. Some familiar effects are now configured through Actions. Phaser 3 examples using `postFX` or a custom `PostFXPipeline` should not be pasted into Phaser 4 code. [Official filter overview](https://phaser.io/news/2026/05/phaser-4-filter-system), [shader migration](https://www.phaser.io/news/2025/11/migrating-phaser-3-shaders-to-phaser-4).

Rex's documentation includes imports from `phaser4-rex-plugins`, despite the documentation URL retaining `phaser3-rex-notes`. Inspect the actual package and tested version rather than inferring compatibility from the URL. Plugin compatibility is not established until it passes our integration test. [Effect-properties example](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/effect-properties/).

### Websites for art, motion references, and production tools

- [Anime.js easing editor](https://animejs.com/easing-editor): tune acceleration and settling curves before converting them into reusable motion presets.
- [GSAP demos and documentation](https://gsap.com/docs/v3/Plugins/): study SVG motion, transitions, and interaction patterns; adapt the motion principles to our selected library.
- [Codrops](https://tympanus.net/codrops/): useful interface transition and experimental graphics references. Select a few relevant effects; a typing game needs a stable reading area even when its surroundings are expressive.
- [Kenney assets](https://kenney.nl/assets): useful prototype graphics, interface pieces, and audio. Kenney states that assets on its asset pages use CC0; keep the chosen pack's included license with the project. [Kenney support and licensing](https://kenney.nl/support).
- [TexturePacker](https://www.codeandweb.com/texturepacker?source=photonstorm): evaluate its Phaser export and atlas workflow after producing the vehicle art.
- [jsfxr](https://sfxr.me/): generate short arcade sounds for launch, streaks, UI selection, and rewards. A richer engine loop would need separately authored or licensed audio.

These are development resources, not browser extensions that players must install. We have not downloaded assets, purchased tools, or installed packages during this research.

### Proposed cinematic sequence

The following is an original TurboType direction and tuning proposal:

| Event | Race canvas: Phaser | Interface: Anime.js |
| --- | --- | --- |
| Enter race | Slow scenery drift, idling vehicles, illuminated start gantry | Short logo reveal and staggered setup panel exit |
| Countdown | Traffic lights and exhaust pulses | Large numerals with quick scale/opacity transitions |
| Launch | Suspension dip, smoke burst, road acceleration | GO title exits quickly; HUD settles into place |
| Clean streak | Cyan flame core, orange sparks, short speed trails | Compact streak badge and energy-meter pulse |
| Overtake | Brief vehicle highlight and bounded camera response | One rank banner with a cooldown |
| Final stretch | Finish gate approaches from actual text progress | Subtle final-stretch notification outside the passage |
| Finish | Record exact result, then play a short visual slowdown and confetti | Victory reveal followed by result cards, rewards, and XP |
| Garage | Selected vehicle lighting and idle animation | Smooth card selection and cosmetic panel transitions |

Suggested timing presets: 100–160 ms for control feedback, 200–350 ms for panels and banners, and 600–1000 ms for the finish/results reveal. These are starting points to test, not requirements to wait before retrying. An optional graphic-novel treatment could use a diagonal overtaking banner, a brief radial speed-line burst, and a stylized finish card. Avoid continuous flashes or motion behind the passage.

### Integration rules for smoothness

1. Give each animated property one owner. Phaser controls world positions, wheels, particles, and cameras; Anime.js controls interface transforms, opacity, and decorative counters.
2. Race state owns countdown completion, finish time, placement, and rewards. Animation callbacks may decorate those events but cannot determine their outcome. Disabling motion must preserve gameplay.
3. Prefer transform and opacity for frequent interface motion. Minimize layout-changing animations, large animated blur areas, and repeated DOM reconstruction.
4. Never delay a keypress response behind a cinematic transition. The typing caret and correction feedback update immediately.
5. Cancel/revert interface animation when leaving a screen, stop world effects on race reset, and apply page-visibility and pause behavior to both systems.
6. Offer low/medium/high effect presets. Reduce particles and expensive filters first while retaining clear race progress.
7. Measure frame times, input response, initial transfer size, and memory through several retries. A visually impressive demo is not evidence of performance on our game or target devices.

The initial motion prototype should demonstrate launch, typing at several speeds, a mistake, nitro, an overtake, finishing, results, and retry. Check it at the GitHub project base path with reduced motion on and off. Start with Phaser + Anime.js only; add a specialist plugin when the prototype exposes a concrete need.
