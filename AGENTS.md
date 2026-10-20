# TurboType project continuity

- Read `PROJECT_STATUS.md` before reporting progress or starting a new implementation phase. Check the actual repository and validation evidence; update the tracker after meaningful work.
- Preserve the eleven user-facing phases and their numbering. Distinguish designed, implemented, tested, and deployed behavior. Do not estimate overall completion by counting phases.
- Product decisions live in `GAME_DESIGN_PLAN.md`. `docs/RULES_AND_STORAGE_BASELINE.md` clarifies the initial rule/reward/storage defaults. Research and visual observations are in `IMPLEMENTATION_RESEARCH.md` and `docs/REFERENCE_VIDEO_ANALYSIS.md`.
- Follow `docs/ENGINEERING_CONVENTIONS.md` and `docs/GITHUB_WORKFLOW.md` for naming, versions, documentation, meaningful checks, and commit/push workflow. Keep documentation in the same change as the behavior it describes.
- Scope: single-player with four CPU opponents first, 100 levels each in Easy/Medium/Hard, rightward progression maps. Friends multiplayer and its backend/shared database are deferred until the single-player launch is stable.
- Keep user reference media and analysis tools local under ignored `Reference_Images/`. Do not ship the reel's assets or soundtrack. Use original or appropriately licensed game assets/audio and record provenance.
