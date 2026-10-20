# TurboType

An immersive typing racer: race computer opponents, improve accuracy and speed, and advance through Easy, Medium, and Hard campaigns with 100 levels each.

**Status:** design and repository setup. The game is not implemented or deployed yet. Source repository: [sahilshah2904/TurboType](https://github.com/sahilshah2904/TurboType).

## Planned experience

- Single-player races against four computer opponents.
- Three horizontal campaign maps with numbered nodes, sequential unlocks, stars, and optional bonuses.
- Cinematic entrance, interactive rules/tutorial, garage, progression, and targeted practice.
- TypeScript, Vite, Phaser, and Anime.js; planned hosting on GitHub Pages.
- Friends multiplayer in a later release, using a separate realtime backend.

## Documentation

- [Project status and phases](PROJECT_STATUS.md) — persistent progress tracker, completed work, remaining work, and evidence requirements.
- [Game design and delivery plan](GAME_DESIGN_PLAN.md) — authoritative proposed behavior and milestone gates.
- [Rules and storage baseline](docs/RULES_AND_STORAGE_BASELINE.md) — planning audit, exact initial reward/cooldown defaults, and local-save/database boundaries.
- [Implementation research](IMPLEMENTATION_RESEARCH.md) — library comparisons, sources, animation and deployment research.
- [Engineering conventions](docs/ENGINEERING_CONVENTIONS.md) — naming, Git workflow, versions, stable IDs, and module boundaries.
- [Reference recording analysis](docs/REFERENCE_VIDEO_ANALYSIS.md) — timestamped visual observations and the proposed original soundtrack direction.
- [GitHub workflow](docs/GITHUB_WORKFLOW.md) — linking the local folder, committing, pushing, and future deployment.

The repository currently contains planning documents and formatting/ignore configuration. There is no package manifest or runnable application yet; install/build/test instructions will be added and verified with the first implementation milestone. User reference screenshots stay local and are excluded from Git history.

## How changes reach GitHub

Save files → inspect and validate changes → commit → push. Git does not upload each file save. A successful push publishes the selected commits; a future Pages workflow will build and deploy eligible changes separately.

Use focused feature branches for substantial implementation work, with validation and documentation in the same change. The initial planning baseline is prepared on `main`. See the workflow guide for exact commands and safety checks.
