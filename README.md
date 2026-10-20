# TurboType

An immersive typing racer: race computer opponents, improve accuracy and speed, and advance through Easy, Medium, and Hard campaigns with 100 levels each.

**Status:** Phase 2 foundation complete on `feat/app-foundation`, with available ASUS/Samsung user checks recorded. Word-completion handling is tracked for Phase 3; unavailable iPhone/tablet testing remains a release gate. This is a working preview, not a playable race or deployed release. See TESTING.md through the documentation links below. Source repository: [sahilshah2904/TurboType](https://github.com/sahilshah2904/TurboType).

## Run the preview

Use Node 24.13.0 and npm 11. From the foundation branch:

```powershell
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/TurboType/**. The hub includes an animated Phaser track, a free-editing keyboard check and saved display preferences. Campaign cards are explicitly marked as previews. No race, rewards, cloud account or multiplayer service is available yet.

To validate the production build:

```powershell
npx playwright install chromium
npm run check
```

See [setup instructions](docs/SETUP.md) and [test evidence](docs/TESTING.md) for reproduction, actual coverage and limitations.

![Actual foundation preview, captured with reduced motion](docs/images/foundation-desktop.png)

## Planned experience

- Single-player races against four computer opponents.
- Three horizontal campaign maps with numbered nodes, sequential unlocks, stars, and optional bonuses.
- Cinematic entrance, interactive rules/tutorial, garage, progression, and targeted practice.
- TypeScript, Vite, Phaser, and Anime.js; planned hosting on GitHub Pages.
- Responsive phone/tablet/laptop play, optional account-backed cloud progress before public single-player launch, then friends multiplayer using a separate realtime backend.

## Documentation

- [Project status and phases](PROJECT_STATUS.md) — persistent progress tracker, completed work, remaining work, and evidence requirements.
- [Future work backlog](BACKLOG.md) — phase-by-phase task checklist, deferred work, dependencies and optional ideas.
- [Setup](docs/SETUP.md), [architecture](docs/ARCHITECTURE.md), [test evidence](docs/TESTING.md), and [asset register](docs/ASSETS.md) — implemented foundation details and verification.
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
