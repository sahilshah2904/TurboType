# TurboType engineering conventions

Status: Phases 2–4 merged into main; Phase 5 alpha.5 integration and existing-page visual revamp implemented, with new formal/device evidence tracked separately, 21 October 2026. Local Git and the public remote are configured. The Phase 2 app, tests and CI workflow now exist; actual check results are in TESTING.md. Release tags and Pages deployment do not exist yet.

## Git and change management

- Repository name: `TurboType`. Application/package slug: `turbotype`. Primary branch: `main`.
- Initialize Git before implementation; track planning, conventions, and project configuration. Keep user reference screenshots locally and outside the initial history. Track authored game assets and their editable sources intentionally.
- Use short-lived branches: `feat/campaign-map`, `fix/correction-input`, `docs/setup-guide`, or `chore/dependencies`. Branch from current `main`; if a required predecessor is still under review, explicitly document a stacked branch and target its PR at that predecessor. Retarget after the predecessor merges, without rewriting shared history. Do not use numbered filenames as backups or duplicate folders such as `final-v2`.
- Use short, meaningful plain-English commit messages, as requested by the user: `Build the responsive app foundation`, `Fix correction accuracy`, or `Add the campaign map`. Do not use prefixes such as `docs(architecture):` or `feat(campaign):`. Older planning commits retain their historical messages; do not rewrite shared history.
- Keep code, relevant tests, schema/content updates, and documentation in the same reviewable change. Review staged diffs before committing. Do not bundle unrelated refactors into feature work.
- Feature branches receive the relevant checks before merge. Once hosted on GitHub, use PRs for material implementation work and document validation. Configure CI and main-branch protection where the account/repository supports it. Never claim these remote settings exist before verifying them.
- Do not overwrite others' changes or force-push shared history. Use revert commits to undo published changes. Never invent Git author identity, embed credentials in remotes, or commit tokens. Use the user's configured identity; report a missing identity if it prevents a commit.
- Commit the package lockfile and record the tested runtime version once dependencies are chosen. Use `npm ci` to reproduce the locked install. Update dependencies through explicit changes with compatibility checks.

## Versions and releases

Keep these independent:

| Version | Purpose | Example |
| --- | --- | --- |
| App version | Released game behavior/artifact | `0.1.0` for first playable prerelease; `1.0.0` for verified single-player launch |
| Git release tag | Immutable reference to the tested source commit | `v1.0.0`; use `v0.1.0-alpha.1` for a tagged preview |
| Rules version | Typing, scoring, reward eligibility and race semantics | Integer `1`; increment for incompatible rule changes |
| Save schema version | Stored data shape and migration | Integer `1`; explicitly migrate incompatible structures |
| Campaign content version | Version of the complete manifest | Integer `1`; ties a release to reproducible campaign data |
| Passage/content revision | Specific level text/config changes affecting comparability | Integer revision per stable content definition |

Use major/minor/patch app versions: breaking public behavior/save incompatibility requires a major release decision, additive compatible features a minor release, and compatible bug fixes a patch. During `0.x`, document breaking changes explicitly. Tags are created only for verified snapshots and never moved to new commits. Do not create an empty release tag for the plan.

Release notes record source commit, versions above, tested runtime/browser matrix, migration behavior, known issues, and verification results. Roll back deployments by redeploying a known tested commit/artifact; deployment rollback does not automatically reverse browser saves. Document save compatibility before promoting a release.

## Naming and file organization

| Item | Convention | Example |
| --- | --- | --- |
| Source folders and TypeScript files | Lowercase kebab-case | `src/core/race-engine.ts`, `src/ui/campaign-map.ts` |
| Types, interfaces, classes | PascalCase; interfaces have no `I` prefix | `RaceState`, `CampaignLevel`, `RaceProvider` |
| Functions, local values, object fields | camelCase | `calculateAccuracy`, `validatedLength`, `highestUnlockedLevel` |
| Immutable module constants | UPPER_SNAKE_CASE for shared fixed values | `MAX_MAIN_LEVELS`, `RULES_VERSION` |
| Category values | Stable lowercase union values | `easy`, `medium`, `hard` |
| Level IDs | Category + three-digit number | `easy-001`, `medium-057`, `hard-100` |
| Chapter IDs | Category + chapter + two-digit number | `easy-chapter-01` |
| Bonus IDs | Category + chapter + named challenge | `medium-chapter-03-bonus-precision` |
| Asset paths | Category folders and descriptive kebab-case names | `assets/cars/starter-coupe/body.webp` |
| CSS | Component block with named elements/modifiers | `.campaign-map`, `.campaign-map__node`, `.campaign-map__node--locked` |
| Tests | Source name + `.test.ts`; browser flows `.spec.ts` | `race-engine.test.ts`, `campaign-unlock.spec.ts` |
| Architecture decisions | Sequential number + kebab-case title | `docs/adr/0001-game-engine.md` |
| Narrative documentation | Uppercase descriptive names consistent with existing docs | `docs/GAME_RULES.md`, `docs/SAVES.md` |

Avoid unexplained abbreviations and ambiguous `level` fields. Distinguish `levelId`, `levelNumber`, `category`, `chapterId`, and `driverRank`. Specify units in names where they matter: `elapsedMs`, `durationSeconds`, `accuracyPercent`. Convert time units at clear boundaries. Keep asset filename case identical in imports, manifests, and disk paths; GitHub hosting and CI may expose case mistakes hidden on Windows.

## Planned code boundaries

```text
src/
  core/                 # pure typing, metrics, campaign/reward rules, seeded bots
  content/
    campaigns/
      easy/             # chapter-01.json ... chapter-10.json
      medium/
      hard/
    passages/           # reviewed text definitions and revisions
  game/                 # Phaser scenes, vehicles, effects, camera
  ui/                   # HTML/SVG screens, campaign map, Anime.js orchestration
  audio/                # sound ownership and user preferences
  storage/              # validation, receipts, migrations, recovery
  config/               # explicit shared tuning and version values
public/assets/          # shipped graphics/audio/fonts, with provenance
assets-source/          # editable authoring inputs; outside published output
docs/adr/               # decisions and consequences
tests/                  # integration and browser tests; colocate focused unit tests
```

This is planned structure, not a list of existing modules. Choose a single schema for the level manifests before creating all 300 entries. Shared pure rules cannot import Phaser, DOM code, or storage APIs. Rendering and UI cannot write rewards directly. The storage boundary validates one consistent updated snapshot containing progression and reward receipts. This structure supports later server reuse of core rules.

## Campaign invariants

- Exactly 100 main levels per category; IDs remain stable across content revisions.
- All categories start with their own level 1 unlocked. A clear unlocks only the next level in that category.
- Main level numbers 1–100 are independent of ten chapters, optional bonus nodes, 0–3 stars, and Driver Rank.
- Reward eligibility uses stable IDs and saved receipts; animation completion does not award rewards.
- Records include rules/content versions and relevant race conditions. A changed passage cannot silently replace a comparable personal best.
- Validate every manifest entry, prerequisite, passage reference, and reward definition in CI once the implementation exists. Critical logic requires behavioral tests, not only snapshots.

## Review and completion checklist

For each implementation change: inspect scope and naming, run meaningful relevant checks, exercise the user flow, verify cleanup and error paths, update documentation, inspect the staged diff, and commit. For releases, additionally reproduce setup from a clean checkout, build at `/TurboType/`, check asset paths, record performance/accessibility evidence, verify the deployed link, and document rollback.

The README and actual package scripts become the source of truth for executable commands during M1. Do not document a passing test or configured protection without running/reading it. Keep remaining work in the plan/known issues, and distinguish proposed design, implemented behavior, tested behavior, and deployed behavior.
