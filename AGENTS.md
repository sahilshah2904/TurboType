# TurboType project continuity


## Current checkpoint — alpha.11, 21 October 2026

The user said “yes everything is good. lets go ahead” after the restored alpha.10 palette and Ignition review. Record those colors/menu music as accepted, alongside previously accepted Overdrive, typing/dial and pause/resume/retry. Do not ask them to repeat that acceptance. Current scope remains laptop/desktop physical keyboards only; the historical phone/tablet requirements below are superseded.

Phase 5 continues on `feat/race-polish`, open PR #4. Alpha.11 adds four original distinct CPU models, shared race/hub anchors, 800×400 WebP exports (267,580 bytes total), tracked PNG masters/prompts and export script. Player kart, accepted colors and both soundtrack WAVs are unchanged. Standings nodes are retained rather than rebuilt. See docs/KART_FLEET.md and docs/PERFORMANCE_ALPHA11.md for source/verification/measurement limits.

Still open in Phase 5: separately authored body/wheel assets and final fleet review (TT-501/510); physical laptop frame/input-latency evidence, low-end tuning and final acceptance/integration (TT-505/506/511–513, TT-522). Full-app software-renderer measurements show long-tail frame callbacks; they do not certify 60 fps. Current art includes baked wheels plus rotating highlights. No Phase 6 onboarding, campaign, database/backend or Pages deployment was added. Rules 3, save/content 1. Preserve the eleven phases; do not merge or mark Phase 5 complete solely from these automated checks.

Final local `npm run check` passed formatting/types/build, 87 unit and 28 desktop browser cases. Current evidence/captures: docs/TESTING.md, docs/images/alpha11 and docs/performance/alpha11-full-app.json. CI must be checked for the pushed source; earlier runs are historical.

Earlier checkpoints below describe earlier source versions, not current pending color/music acceptance.


**Latest palette decision — 0.1.0-alpha.10:** Alpha.10 restores the previous alpha.8 graphite/crimson/cyan palette at the user's request, replacing the rejected alpha.9 red/gold armor panels. Laptop-only scope, Ignition browsing music, the accepted Overdrive racing master, typing rules and mobile-removal changes stay in place.

- Read `PROJECT_STATUS.md` before reporting progress or starting a new implementation phase. Check the actual repository and validation evidence; update the tracker after meaningful work.
- Read and maintain `BACKLOG.md` for future/deferred tasks. Preserve stable task IDs, capture new follow-ups in the same change, and mark tasks complete only with implementation/verification/documentation evidence. Keep required scope separate from optional ideas.
- Preserve the eleven user-facing phases and their numbering. Distinguish designed, implemented, tested, and deployed behavior. Do not estimate overall completion by counting phases.
- Product decisions live in `GAME_DESIGN_PLAN.md`. `docs/RULES_AND_STORAGE_BASELINE.md` clarifies the initial rule/reward/storage defaults. Research and visual observations are in `IMPLEMENTATION_RESEARCH.md` and `docs/REFERENCE_VIDEO_ANALYSIS.md`.
- Follow `docs/ENGINEERING_CONVENTIONS.md` and `docs/GITHUB_WORKFLOW.md` for naming, versions, documentation, meaningful checks, and commit/push workflow. Keep documentation in the same change as the behavior it describes.
- Use short plain-English commit messages without conventional-commit prefixes, per the user's Phase 2 instruction. Do not rewrite older shared commits.
- Scope: laptop/desktop physical-keyboard typing improvement only, four CPUs, 100 levels each in Easy/Medium/Hard and rightward maps. Phone/tablet support and mobile testing were explicitly canceled by the user on 21 October. Plan storage/auth/network boundaries, optional cloud progress before public solo launch and friends multiplayer immediately afterward. Current scope overrides historical multi-device assumptions in older checkpoints.
- Keep user reference media and analysis tools local under ignored `Reference_Images/`. Do not ship the reel's assets or soundtrack. Use original or appropriately licensed game assets/audio and record provenance.

## Latest alpha.9 scope and acceptance update

**Current scope override — 21 October 2026:** the user explicitly narrowed TurboType to laptop/desktop browsers with a physical keyboard. Phone/tablet compatibility, software-keyboard layout, rotation and mobile acceptance are canceled requirements. Earlier multi-device statements are historical. Keep laptop window responsiveness (960 CSS px minimum; verify 1024/1366/1440/1920 widths), accessibility, hardware-keyboard IME composition, cloud saves before solo launch and multiplayer afterward. Do not restore mobile work without a new user request.

The user accepted alpha.8 race music (Overdrive), typing/speedometer checks and pause/resume/retry (points 5/6). They rejected the cyan-dominant palette and sad Nightforge menu score. Alpha.9 makes metallic red/gold dominant with small cyan light details; replaces Nightforge with upbeat major-key Ignition (124 BPM); preserves Overdrive byte-for-byte; removes VisualViewport/software-keyboard handling, small-screen CSS and phone/tablet Playwright projects. Hardware IME composition/correction stays unchanged. The reported Samsung word-at-a-time caret symptom is out of current scope, not claimed fixed. Laptop review/performance and distinct fleet remain open.

## Historical resume checkpoint — 21 October 2026

The following alpha.8 snapshot is historical; the scope update above supersedes its phone/tablet and menu/theme requirements.

The user asked to stop after documenting progress and continue later. Resume from the current checkout; do not start a new phase, merge or deploy merely because this handoff exists.

- Current app: **0.1.0-alpha.8**; rules **3**, save/content **1**. Branch **feat/race-polish**, latest implementation **0b4eef6** (Create separate racing music and a graphite theme), open [PR #4](https://github.com/sahilshah2904/TurboType/pull/4). The documentation checkpoint follows that commit. Main retains the accepted Phase 4 baseline plus README changes; PR #4 is not merged and Pages/backend are not deployed.
- Verification: final local npm run check passed formatting/types/build, **87 unit and 78 Chromium profile cases**. [Hosted run 39524238316](https://github.com/sahilshah2904/TurboType/actions/runs/39524238316) passed for exact source 0b4eef6; this later documentation checkpoint has its own CI status. Recheck newer source rather than carrying that pass forward. Device profiles/screenshots do not certify actual phone keyboards, listening quality or physical fps.

### Work already delivered

1. Phase 1 design/research: screenshots and four local video references reviewed, eleven delivery phases retained, typing/correction/reward/storage rules and responsive/account/network boundaries documented. Plan three independent rightward Easy/Medium/Hard campaigns with 100 levels each, circular locks/chapter/bonus branches. Runtime campaign/reward systems do not exist yet.
2. Phase 2 foundation: TypeScript/Vite, Phaser, Anime.js, routes/layout/preferences, naming/version conventions, reproducible setup, Git/GitHub workflow, automated checks and source/asset documentation. Available ASUS/Samsung foundation checks accepted; no iPhone/tablet available.
3. Phase 3 typing: strict native input/Backspace correction, accurate timing/WPM/accuracy/streaks, pauses, countdown, timed expiry and frozen results, tested independently of graphics. Available-device earlier checks accepted.
4. Phase 4 single-player slice: four seeded CPUs, shared active clock, standings, same-seed retry, timeout/DNF and graphics recovery. Earlier user ASUS/Samsung acceptance recorded; merged to main.
5. Current Phase 5/6 integration: full-window kart racing and full-width hub preview, one visible native-backed typing strip in Race/Practice, Live WPM dial, exhaust/nitro/spoke/suspension/parallax/bounded effects and reduced/low modes. Hub, Practice, Keyboard check and Settings are visually revamped. Screenshots and recreation: [IMMERSIVE_APP.md](docs/IMMERSIVE_APP.md), docs/images/alpha8.
6. Latest visual decision: **graphite/steel, localized metallic crimson, cyan lighting and restrained gold**, using the user's Iron Man screenshot as a palette reference only. Uniform burgundy/pink wash was rejected. No Marvel character, logo or reference screenshot is shipped. One original AI-generated kart with palette variants is integrated; a distinct fleet remains unfinished.
7. Latest audio decision: **Nightforge** (96 BPM / 20s) for browsing all tabs and race setup/results; **Overdrive** (150 BPM / 25.6s) for racing; separate 3–2–1/GO and game FX. Original WAVs are recreated with node assets-source/build-soundtracks.mjs; hashes/mix metadata are tracked. Real decoded-source switching, loading failure/retry, mute/pause/visibility/disposal are tested. [AUDIO.md](docs/AUDIO.md).
8. Personal music was explicitly canceled: chooser, loader and associated tests were removed in alpha.8. **Do not reintroduce file uploads, Misirlou or the rejected Harbor Circuit loop.** Historical alpha.7/prototype documentation is not the current product decision. Reference media stay ignored; shipped music/art is original or appropriately licensed.

### What remains and where to resume

- **First: finish Phase 5 acceptance**, not campaign implementation: user review/listening of the latest theme and both tracks, ASUS/Samsung native keyboard/rotation/caret/dial, sound/loop joins/volume/interruptions and actual performance/decode/memory/transfer evidence. TT-505/506/508/509/511/512/513/515/518/519; use [PHASE5_POLISH_TESTS.md](docs/PHASE5_POLISH_TESTS.md). Previous Phase 4 device acceptance does not accept alpha.8.
- **Distinct fleet:** original separate vehicle bodies/wheels with consistent anchors/provenance, TT-501/510. Current palette variants do not close it. Keep visual review and lifecycle/performance checks before final PR #4 integration.
- **Phase 6:** cinematic loading/welcome/rules/tutorial/calibration and final first/returning-player flow, TT-601–604. Existing-page visual work is partial Phase 6, not completion.
- **Phases 7–8:** three rightward 100-node maps, locks/chapters/bonus nodes and saved location; author/review/validate/balance all 300 passages and level definitions, TT-701–704 and TT-801–806. Current short passages and hub map cards are functional previews.
- **Phase 9:** rewards/stars/unlocks/rank/garage/records/coaching/drills, robust guest saves/migrations/import/export and optional account-backed cloud progress before public solo launch, TT-901–910. Supabase is a candidate; no service has been provisioned. Current storage remembers preferences only; race text/results are in-memory.
- **Phase 10:** broader browser/device/accessibility/performance/recovery checks, cloud isolation/sync, Pages deployment and actual public-link validation, TT-1001–1008. User has ASUS laptop/Samsung S25 Ultra; physical iPhone/tablet coverage is explicitly unavailable, not passed.
- **Phase 11 immediately after solo launch:** backend/private rooms/invites/ready/synchronized races/reconnection/rematches, TT-1101–1107. GitHub Pages hosts the frontend; realtime/database services are separate.
- On resuming: read this checkpoint, PROJECT_STATUS.md, BACKLOG.md and docs/TESTING.md; inspect Git status/branch/PR/CI; preserve any intervening edits. Confirm the latest user feedback, complete the open Phase 5 gates, and then continue the numbered roadmap. Use short plain-English commits, document the same change, and never equate push with deployment.
