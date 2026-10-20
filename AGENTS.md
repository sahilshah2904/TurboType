# TurboType project continuity

- Read `PROJECT_STATUS.md` before reporting progress or starting a new implementation phase. Check the actual repository and validation evidence; update the tracker after meaningful work.
- Read and maintain `BACKLOG.md` for future/deferred tasks. Preserve stable task IDs, capture new follow-ups in the same change, and mark tasks complete only with implementation/verification/documentation evidence. Keep required scope separate from optional ideas.
- Preserve the eleven user-facing phases and their numbering. Distinguish designed, implemented, tested, and deployed behavior. Do not estimate overall completion by counting phases.
- Product decisions live in `GAME_DESIGN_PLAN.md`. `docs/RULES_AND_STORAGE_BASELINE.md` clarifies the initial rule/reward/storage defaults. Research and visual observations are in `IMPLEMENTATION_RESEARCH.md` and `docs/REFERENCE_VIDEO_ANALYSIS.md`.
- Follow `docs/ENGINEERING_CONVENTIONS.md` and `docs/GITHUB_WORKFLOW.md` for naming, versions, documentation, meaningful checks, and commit/push workflow. Keep documentation in the same change as the behavior it describes.
- Use short plain-English commit messages without conventional-commit prefixes, per the user's Phase 2 instruction. Do not rewrite older shared commits.
- Scope: responsive single-player for phones/tablets/laptops first, four CPUs, 100 levels each in Easy/Medium/Hard and rightward maps. Plan storage/auth/network boundaries from the foundation, add optional account-backed cloud progress before public single-player launch, then implement friends multiplayer immediately afterward. See `docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md`; it supersedes earlier desktop-first/local-only launch assumptions.
- Keep user reference media and analysis tools local under ignored `Reference_Images/`. Do not ship the reel's assets or soundtrack. Use original or appropriately licensed game assets/audio and record provenance.
