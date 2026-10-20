# Foundation verification

Date: 20 October 2026. Branch: feat/app-foundation. This records observed evidence, not a promise of untested device support.

## Local environment and executed checks

Windows workstation; Node 24.13.0, npm 11.6.2. Tested dependency versions: Phaser 4.2.1, Anime.js 4.5.0, Vite 8.3.4, TypeScript 7.0.2, Vitest 5.0.5, Playwright 1.64.1 and Prettier 3.9.10. Exact transitive versions are locked in package-lock.json.

`npm ci` completed successfully from the lockfile (49 packages audited; zero reported vulnerabilities at that time). After installation finished, `npm run check` completed with exit code 0:

- Formatting and strict TypeScript checks passed.
- **20 unit tests passed** across IDs, router behavior and settings persistence/recovery.
- Production build passed at base `/TurboType/`.
- **18 Playwright browser tests passed**: six behaviors in each of three Chromium profiles (desktop, Pixel 7 emulation and iPad Mini viewport/touch emulation using Chromium).

Browser tests exercise production asset loading and canvas startup, layout overflow, editing/backspace/composition diagnostics/reset, settings reload, repeated scene disposal/remount, unknown routes, landscape resizing without lost input, missing artwork/retry and denied storage. Shader rendering was also visually inspected, not inferred from a ready flag alone.

The first attempted full check during `npm ci` ran before the install finished and could not find Prettier. It was discarded, installation was awaited, and the complete check above was rerun successfully. No change to app behavior was needed for that transient orchestration error.

The workstation's existing Windows Command Processor AutoRun emits a warning on some nested npm scripts; checks still completed successfully. See SETUP.md. No registry settings were changed.

## Visual review

Captured hub previews at 1440, 768, 390 and 320 CSS-pixel widths and the keyboard screen at phone width. Reviewed desktop hub, phone hub and phone keyboard screenshots. Visual QA identified black rectangles for the SVG cars even though loading tests passed; setting explicit SVG raster dimensions fixed them, and the corrected scene was inspected with low/high effects. Reference source and procedural art are documented in ASSETS.md.

QA captures are local generated files under ignored test-results, not source assets. Playwright may clear that directory on a later run. Regenerate using the local app/preview and your browser; reproducible test commands are in SETUP.md. Visual screenshots are evidence of the captured layout, not proof that a real device's keyboard behaves identically.

## Build observations

The Phaser chunk is approximately 1.37 MB minified / 357 KB gzip; the interface script is about 50 KB / 20 KB gzip. Vite warns about the large Phaser chunk. It is deliberately isolated with dynamic import and not requested for direct keyboard/settings routes. The build is well below the proposed 5 MB initial-transfer target, but network/device measurements and final art/music remain future work. File gzip estimates are not a measured user transfer or a frame-rate benchmark.

Fonts are self-hosted Latin subsets; their notices are included in public/assets/licenses. No reel media, credentials, downloaded analysis helpers or external font service is shipped.

## Hosted CI

A checks-only GitHub Actions workflow is committed, pinned to verified action commits. It uses the recorded Node version, npm ci, Chromium/system dependencies and npm run check. [The first hosted Linux run passed](https://github.com/sahilshah2904/TurboType/actions/runs/39404088628) for implementation commit `5534591`, confirming the clean checkout/install and full check outside the Windows workstation. Later documentation-only commits may have their own runs; inspect their actual status separately. CI does not configure Pages deployment or branch protection.

## Open gates and honest limitations

- **TT-204 remains open:** physically test Android/iOS keyboards and tablet input, including autocorrection settings, composition, focus, safe areas, keyboard-open viewport and rotation. Emulation and synthetic composition events cannot verify those behaviors.
- Firefox, Safari/WebKit and actual hardware GPU coverage are not established. Chromium tests use software rendering flags to make WebGL available in headless mode; they do not establish 60 fps on players' devices.
- The keyboard check intentionally accepts paste/editing. It is not the Phase 3 typing/race engine, with scoring/correction-required input.
- No gameplay, campaign saves, cloud synchronization, accounts, music or multiplayer is implemented. Stable contracts are integration boundaries only.
- No live GitHub Pages site or release tag exists. Local preview success is not deployment evidence.

## Continue verification

For each implementation change, run meaningful relevant checks. Before release, verify the broader matrix in the game plan/online architecture, measure performance on named devices, validate cloud ownership/transactions/conflicts and reproduce deployment/recovery. Update PROJECT_STATUS.md and BACKLOG.md only after evidence exists.
