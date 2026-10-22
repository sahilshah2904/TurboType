# TurboType GitHub workflow

## Repository and workspace

- GitHub account: `sahilshah2904`, verified through the authenticated GitHub API during setup.
- Intended repository: [sahilshah2904/TurboType](https://github.com/sahilshah2904/TurboType).
- Local working folder: `S:\AI_Engineer_Journey\Projects\TurboType`.
- Primary branch: `main`.
- HTTPS remote: `https://github.com/sahilshah2904/TurboType.git`.
- Authentication: the existing Windows Git Credential Manager account. Never put tokens into files, commands shown in documentation, or the remote URL.

The local folder is the working copy. GitHub holds pushed commits. Editing a file does not automatically update GitHub, and pushing source does not itself deploy the game unless a deployment workflow has been configured.

## Initial setup verification

From PowerShell in the project folder:

```powershell
git status
git remote -v
git branch -vv
git log -1 --oneline
```

After completed setup, `origin` points to the HTTPS remote, `main` tracks `origin/main`, and the initial planning commit appears locally and on GitHub. A clean status means no remaining changes; it does not prove a live website exists.

## Routine changes

For a substantial feature, start from a clean working tree and current `main`:

```powershell
git switch main
git pull --ff-only
git switch -c feat/campaign-map
```

Implement the feature, update its documentation, and run relevant checks. Phase 2 adds executable scripts documented in SETUP.md and TESTING.md. Then inspect changes:

```powershell
git status --short
git diff
git diff --check
```

Stage specific files deliberately, inspect the staged diff, and commit. Example for a later campaign-map implementation:

```powershell
git add -- src/ui/campaign-map.ts docs/CAMPAIGN_MAP.md
git diff --cached
git diff --cached --check
git commit -m "Add the horizontal campaign map"
git push -u origin feat/campaign-map
```

Those example feature paths are planned, not existing files. The pushed branch appears on GitHub. Review/merge it through a pull request to update `main`; until merged, it remains a branch change. After merging and with a clean local worktree, switch back to `main` and `git pull --ff-only`.

For an authorized small change directly on `main`, review, validate, stage the intended files, commit, and `git push`. Keep the initial setup baseline on `main`. Do not push unrelated local changes or bypass a failed check.

When the user asks this project's agent to implement a change and publish it to the linked repository, complete the validation/documentation and commit-and-push steps as part of the task. Report the branch and commit. If the user asks for a local-only edit, leave it local. Do not run a background file watcher that commits arbitrary files on save.

## Implementation integration

Phase 2 PR #1 and Phase 3 PR #2 were merged in order on 20 October 2026 after their head checks passed. PR #2 was retargeted from the foundation branch to main after PR #1 merged; merge commits preserve the shared history. Main baseline is 08cddb4. Phase 4 PR #3 subsequently merged to main c4127c7 after successful head checks and user acceptance. Phase 5 feat/race-polish starts from that main and uses a normal PR against main. The local checkout serves the current feature preview even before its PR merges. No source merge deploys a website because Pages is not configured.

## Publishing and recovery

The game will be deployed in a later milestone through a reviewed GitHub Actions Pages workflow. The intended project path is `/TurboType/`. Once that workflow exists, an eligible push/merge triggers installation, checks, build, and deployment; verify the workflow result and live game before reporting a release.

Phase 2 adds a checks-only GitHub Actions workflow. It verifies formatting, types, tests and a production build; it does not deploy the app. Pages, a live hosted game, branch protection and recurring sync remain unconfigured. Report actual CI run results separately from the existence of the workflow.

If a push is rejected, fetch and inspect the remote changes; do not force-push. If pulling would overwrite local edits, preserve the edits and resolve deliberately. Undo shared mistakes with revert commits rather than rewriting history. Version and migrate browser saves explicitly; reverting a deployment does not revert a player's saved data.

Reference screenshots, dependencies, build output, local credentials, and logs are excluded by `.gitignore`. Authored source assets, lockfiles, documentation, tests, and workflow definitions are intentionally versioned when created.

## Alpha.13 check triggers and failure investigation

Feature branches run the checks workflow on pull-request creation/update; main runs on push, and manual dispatch remains available. Open a PR for hosted feature validation. Concurrency groups by PR number or ref and cancels superseded runs. This avoids duplicate push+PR copies without disabling checks or changing account email preferences.

Two former copies failed while counterparts passed: runs 39578553613 and 39579044713 exceeded the 30-second total timeout in the all-in-one garage scenario (late navigation/reload/assertion steps). The scenario is split into independently isolated selection, locked-session and persistence cases. The default timeout stays 30 seconds and CI retry policy is unchanged. A prior successful copy does not certify a later failed one; inspect exact source, event, failed steps and logs before reporting hosted success. Documentation-only updates still receive normal PR validation.
