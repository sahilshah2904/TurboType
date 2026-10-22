**Current scope override — 21 October 2026:** the user explicitly narrowed TurboType to laptop/desktop browsers with a physical keyboard. Phone/tablet compatibility, software-keyboard layout, rotation and mobile acceptance are canceled requirements. Earlier multi-device statements are historical. Keep laptop window responsiveness (960 CSS px minimum; verify 1024/1366/1440/1920 widths), accessibility, hardware-keyboard IME composition, cloud saves before solo launch and multiplayer afterward. Do not restore mobile work without a new user request.

# Run TurboType locally

The app includes Phase 4 Quick Race against four CPUs with real progress/standings/results, plus typing practice, the hub preview, free-editing keyboard check and local preferences. Alpha.5 integrates the accepted full-window kart race, Live WPM dial, native single typing surface and shared world revamp of all existing pages, with optional original synthesized audio. Progression/cloud accounts and cinematic onboarding are later tasks.

## Reproducible prerequisites

- Node.js **24.13.0**, as recorded in `.nvmrc`; tested on Windows with npm **11.6.2**. The package engine permits compatible Node 24/npm 11 updates; use the recorded version to reproduce this snapshot.
- Git and a supported Chromium browser for local viewing. Playwright downloads its own browser for automated checks.
- Run commands from the repository root. Dependencies are pinned exactly in package.json; package-lock.json pins the full dependency graph. Do not copy node_modules between machines.

## Fresh checkout and install

```powershell
git clone https://github.com/sahilshah2904/TurboType.git
cd TurboType
```

While the implementation branches are under review, switch to the race-polish branch before installation:

```powershell
git switch main
npm ci
npx playwright install chromium
```

Phases 2–5 are merged into main; PR #4 integrated accepted alpha.14 as de464ce on 22 October 2026. Main is the normal starting branch. No `.env` file, cloud credentials, or API services are required for this preview. On Linux CI, `npx playwright install --with-deps chromium` also installs required system libraries.

## Develop and preview

```powershell
npm run dev
```

Open **http://127.0.0.1:5173/TurboType/**. The dev server watches source changes. Stop it with Ctrl+C. Ports are strict: if 5173 is occupied, stop the conflicting process or explicitly choose another port; Vite will not silently move the preview.

Choose **Race** or open `#/race` for four-CPU racing; see QUICK_RACE.md for exact reproduction with seed 42 and PHASE4_RACE_TESTS.md for available-device checks. Choose **Practice** or open `#/practice` for the engine without opponents. **Keyboard check** remains the earlier free-editing diagnostic and intentionally behaves differently. Do not test word-completion blocking in the wrong screen. Practice sessions are in-memory, not saved; HMR/reload ends them. Physical retest instructions are in PHASE3_INPUT_TESTS.md.

For the exact static production artifact:

```powershell
npm run build
npm run preview
```

Open **http://127.0.0.1:4173/TurboType/**. `dist` is generated output, excluded from Git. `vite preview` is a local artifact check, not production hosting. Hash links such as `#/keyboard` work with the repository base path and do not require server rewrites.


## Recreate original assets and profile

- `node assets-source/build-vehicles.mjs` recreates the earlier SVG car bodies for historical development. Alpha.5 loads public/assets/karts/volt-kart.png, an exact copy of the accepted concept in docs/design/race-direction. Its preserved PNG/prompt/provenance recreate this snapshot; generation itself is nondeterministic. See IMMERSIVE_APP.md.
- Original music masters are recreated with node assets-source/build-soundtracks.mjs; src/audio/score.ts is the manifest and race-audio.ts owns playback/effects. Open Sound & music in Race/Settings to enable; sound defaults off and the shipped original WAVs need no external music service or API credentials.
- `node scripts/profile-race.mjs` profiles the isolated scene against the running Vite dev server. Optional first argument changes the URL. It closes only its own browser; see PERFORMANCE.md for actual scope/limits.
- Follow PHASE5_POLISH_TESTS.md for new physical sound/visual/performance checks; prior typing/race acceptance does not certify this polish.

## Check commands

| Command | Purpose |
| --- | --- |
| `npm run format` | Apply formatting to source, tests and configuration |
| `npm run format:check` | Verify formatting without modifying files |
| `npm run typecheck` | Strict TypeScript checks |
| `npm test` | Unit tests for seeded CPUs/solo outcomes, typing/timing/standings, IDs, routing and safe settings persistence |
| `npm run build` | Typecheck and generate the production artifact |
| `npm run test:browser` | Test the previously built artifact in the desktop Chromium profile, including laptop resizing |
| `npm run check` | Full formatting/type/unit/build/browser sequence |

The browser suite launches a preview server on 4173 if one is not already running locally; stop any stale manually started preview to avoid checking an old artifact. In CI reuse is disabled. Traces and output go to ignored test-results; inspect a retained failure trace with `npx playwright show-trace <trace.zip>`.

## Troubleshooting

- **Missing packages:** use the documented Node version and `npm ci` from the folder containing package-lock.json. Avoid global installs of Vite or TypeScript.
- **Missing browser executable:** run `npx playwright install chromium`. Browser downloads are not stored in Git.
- **404 assets/blank track:** use the `/TurboType/` URL, inspect requests, and retry the artwork. The current kart PNG must load from assets/karts/volt-kart.png; earlier foundation SVG rasterization issues are documented in historical evidence.
- **Blocked browser storage:** settings still apply for the current visit and show an unsaved message. No cloud progress exists yet.
- **Windows AutoRun warning:** this workstation's existing Command Processor AutoRun configuration sometimes prints `& was unexpected at this time` when npm starts nested scripts. Recorded checks still finish successfully. We have not changed the user's registry; assess actual exit codes and errors if reproducing the warning.
- **Laptop layout/input issues:** record browser/OS, window size, zoom and physical keyboard/IME behavior. Mobile keyboards are outside the current scope.

Exact installed versions are in package.json/package-lock.json. Design rationale, lifecycle and data boundaries are documented in ARCHITECTURE.md and the ADRs.
