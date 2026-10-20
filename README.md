# TurboType

An immersive typing racer: race computer opponents, improve accuracy and speed, and advance through Easy, Medium, and Hard campaigns with 100 levels each.

**Status:** Phase 5 racing polish implemented on `feat/race-polish`: modern original cars, Neon Harbor scenery/camera/effects and original optional synth audio. Phases 1–4 are accepted and Phase 4 is merged into main. Local formatting/types/build, 83 unit tests and 66 browser tests pass; Phase 5 physical sound/performance acceptance remains TT-505/506. Campaigns, cloud progression, cinematic opening and public deployment are future work. See TESTING.md through the documentation links below. Source repository: [sahilshah2904/TurboType](https://github.com/sahilshah2904/TurboType).

## Run the preview

Use Node 24.13.0 and npm 11. From `feat/race-polish`:

```powershell
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/TurboType/**. Select **Race** for the first complete single-player race. Choose a passage, CPU pace, untimed completion or a 60-second trial; use a seed to repeat opponent schedules. **Practice** remains available without opponents. Countdown, correction, pause/resume and frozen metrics use the same typing engine. The hub also includes an animated Phaser track, a free-editing keyboard check and saved preferences. Open **Sound & music** to enable the original optional synth score and adjust master/music/effects. Reduced motion uses a stable full-course view; Larger typing text wraps the passage. Campaign cards remain previews; rewards, accounts, cloud saves and multiplayer are not available.

To validate the production build:

```powershell
npx playwright install chromium
npm run check
```

See [setup instructions](docs/SETUP.md) and [test evidence](docs/TESTING.md) for reproduction, actual coverage and limitations.

![Actual Neon Harbor race preview](docs/images/neon-harbor.png)

## Planned experience

- Four-CPU Quick Race with original modern cars, relative camera, bounded effects and optional music is implemented; campaign integration follows.
- Three horizontal campaign maps with numbered nodes, sequential unlocks, stars, and optional bonuses.
- Cinematic entrance, interactive rules/tutorial, garage, progression, and targeted practice.
- TypeScript, Vite, Phaser, and Anime.js; planned hosting on GitHub Pages.
- Responsive phone/tablet/laptop play, optional account-backed cloud progress before public single-player launch, then friends multiplayer using a separate realtime backend.

## Documentation

- [Project status and phases](PROJECT_STATUS.md) — persistent progress tracker, completed work, remaining work, and evidence requirements.
- [Future work backlog](BACKLOG.md) — phase-by-phase task checklist, deferred work, dependencies and optional ideas.
- [Setup](docs/SETUP.md), [architecture](docs/ARCHITECTURE.md), [test evidence](docs/TESTING.md), and [asset register](docs/ASSETS.md) — implemented app details and verification.
- [Art bible](docs/ART_BIBLE.md), [audio recreation](docs/AUDIO.md), [measured renderer profile](docs/PERFORMANCE.md) and [Phase 5 device check](docs/PHASE5_POLISH_TESTS.md) — implemented audiovisual direction, source assets, evidence and remaining acceptance.
- [Quick Race implementation and recreation](docs/QUICK_RACE.md) and [Phase 4 device check](docs/PHASE4_RACE_TESTS.md) — exact CPU schedules, timing, simulated results, recovery and verification.
- [Implemented typing rules](docs/GAME_RULES.md) and [Phase 3 phone retest](docs/PHASE3_INPUT_TESTS.md) — actual correction, clock, metrics and assistance policy.
- [Game design and delivery plan](GAME_DESIGN_PLAN.md) — authoritative proposed behavior and milestone gates.
- [Rules and storage baseline](docs/RULES_AND_STORAGE_BASELINE.md) — planning audit, exact initial reward/cooldown defaults, and local-save/database boundaries.
- [Responsive and online architecture](docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md) — phones/tablets/laptops, account-backed progress, data synchronization, and multiplayer foundations.
- [Implementation research](IMPLEMENTATION_RESEARCH.md) — library comparisons, sources, animation and deployment research.
- [Engineering conventions](docs/ENGINEERING_CONVENTIONS.md) — naming, Git workflow, versions, stable IDs, and module boundaries.
- [Reference recording analysis](docs/REFERENCE_VIDEO_ANALYSIS.md) — timestamped visual observations and the proposed original soundtrack direction.
- [GitHub workflow](docs/GITHUB_WORKFLOW.md) — linking the local folder, committing, pushing, and future deployment.

The repository now contains the app, pinned dependency lockfile, unit/browser tests, a checks-only CI workflow and implementation documentation. User reference screenshots/video remain local and excluded from Git history. Pages deployment is not configured yet.

## How changes reach GitHub

Save files → inspect and validate changes → commit → push. Git does not upload each file save. A successful push publishes the selected commits; a future Pages workflow will build and deploy eligible changes separately.

Use focused feature branches for substantial implementation work, with validation and documentation in the same change. The initial planning baseline is prepared on `main`. See the workflow guide for exact commands and safety checks.
