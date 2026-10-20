# Run TurboType locally

The app includes Phase 4 Quick Race against four CPUs with real progress/standings/results, plus typing practice, the hub preview, free-editing keyboard check and local preferences. Phase 5 adds original modern cars, Neon Harbor camera/effects and optional synthesized audio. Progression/cloud accounts and cinematic onboarding are later tasks.

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
git switch feat/race-polish
npm ci
npx playwright install chromium
```

Phase 2–4 PRs are merged into main baseline c4127c7. The Phase 5 branch starts from that baseline and targets main; after it merges, main is the normal starting branch. No `.env` file, cloud credentials, or API services are required for this preview. On Linux CI, `npx playwright install --with-deps chromium` also installs required system libraries.

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

To test from your own phone/tablet on the same trusted Wi-Fi network:

```powershell
npm run dev -- --host 0.0.0.0
```

Open the printed Network URL ending in `/TurboType/` on the device. Loopback (`127.0.0.1`) on a phone points to the phone, not your laptop. Allow the dev-server port only on the relevant private network if your firewall asks. This is temporary local testing, not public deployment. The foundation preview does not use secure-context-only player/race ID generation; later cloud/auth flows require their documented HTTPS callback configuration.

## Recreate original assets and profile

- `node assets-source/build-vehicles.mjs` recreates all three modern SVG car bodies; no network or art tool is required. The old sedan is removed from the current runtime and recoverable in Git history.
- Original music/effects are synthesized directly from src/audio/score.ts and race-audio.ts. Open Sound & music in Race/Settings to enable; sound defaults off and no audio downloads or API credentials are needed.
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
| `npm run test:browser` | Test the previously built artifact in three Chromium layout profiles |
| `npm run check` | Full formatting/type/unit/build/browser sequence |

The browser suite launches a preview server on 4173 if one is not already running locally; stop any stale manually started preview to avoid checking an old artifact. In CI reuse is disabled. Traces and output go to ignored test-results; inspect a retained failure trace with `npx playwright show-trace <trace.zip>`.

## Troubleshooting

- **Missing packages:** use the documented Node version and `npm ci` from the folder containing package-lock.json. Avoid global installs of Vite or TypeScript.
- **Missing browser executable:** run `npx playwright install chromium`. Browser downloads are not stored in Git.
- **404 assets/blank track:** use the `/TurboType/` URL, inspect requests, and retry the artwork. The modern SVG loader explicitly rasterizes at 760×240; omitting explicit dimensions caused black image rectangles in the earlier foundation spike.
- **Blocked browser storage:** settings still apply for the current visit and show an unsaved message. No cloud progress exists yet.
- **Windows AutoRun warning:** this workstation's existing Command Processor AutoRun configuration sometimes prints `& was unexpected at this time` when npm starts nested scripts. Recorded checks still finish successfully. We have not changed the user's registry; assess actual exit codes and errors if reproducing the warning.
- **Phone keyboard issues:** record the real browser, OS, orientation, viewport and keyboard behavior. Chromium device emulation cannot verify the physical software keyboard. See TESTING.md for pending checks.

Exact installed versions are in package.json/package-lock.json. Design rationale, lifecycle and data boundaries are documented in ARCHITECTURE.md and the ADRs.
