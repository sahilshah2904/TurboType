# TurboType — resume in a new chat

## Alpha.20 atmosphere, action alignment and future vehicle variety — 22 October 2026

The user rejected the white curved air lines. Alpha.20 removes them entirely and uses researched, layered atmospheric movement across the full race scene: soft distant haze over sky/mountains, small suspended motes and feathered peripheral speed accents. These are 42 reused sprites from three tiny generated gradient textures, including 20 in the upper sky/mountain area. Smooth WPM response and slower scenery parallax replace stepwise scene movement. Cars, labels, HUD and typing stay sharp. Pause/end/Low/Reduced hide the atmosphere. Research/design/limits: docs/ATMOSPHERE_RESEARCH.md. User visual acceptance is pending; do not describe quality or physical frame rate as certified.

Shared action rows now centre-align buttons and plain links, with a minimum 44px link target, fixing Skip to hub in Welcome/tutorial/calibration and other action rows. The user also requests future monster trucks, hoverboards, flying cars and other original vehicle families. Proposed Phase 8/9 briefs now vary body/propulsion structures; eighteen stable reward IDs, milestones, 23 total vehicles and cosmetic-only gameplay stay unchanged. No future vehicles/ownership are implemented. See docs/GARAGE_PROGRESSION.md. Work stays in codex/phase6-onboarding / open PR #6; no merge/deployment or Phase 7 implementation.

## Alpha.19 purple-car opening — 22 October 2026

The latest user request supersedes alpha.18's simple title-only reveal: the accepted purple Volt Electric enters fast from the left, brakes at the middle, holds briefly, spins its independent tyres with burnout smoke, rolls back slightly and launches right as TURBOTYPE reveals. Original three-layer SVG flames burn along its invisible middle road and around the title. Choreography remains 5.6 seconds after its original body/wheel artwork decodes; Skip stays immediately available. Low/Reduced show the finished static title without the car/fire sequence. A four-second decode watchdog or failed opening art falls back to the static title with feedback and an available Enter action. Route cleanup cancels both timers and ignores stale image promises.

This remains Phase 6 refinement on codex/phase6-onboarding / open PR #6, pending user visual acceptance and integration. No new raster assets, dependencies, copyrighted footage, audio, gameplay rules, ownership or storage were added. Purple in this opening is a fixed cinematic role; the player's selected race car is preserved. Evidence and captures: docs/TESTING.md / docs/images/alpha19; the previous alpha.18 opening frames are historical.

## Alpha.18 visual follow-up — 22 October 2026

The user requested a full-window, five-to-six-second game-title opening instead of the alpha.17 illustrated panels, more visible wind during the five-car race, no Hub preview labels and row-based learning actions in Settings. Alpha.18 replaces the panels with an original **5.6-second TurboType title reveal**: dark start, emblem emergence, slow expanding name, cyan/crimson light sweeps and final tagline/Enter hold. It is a real-time browser animation, with no film download or copied Rockstar artwork. Skip remains available immediately; Enter appears after the sequence. Low effects/Reduced motion show the finished title immediately. Replay/skip-visit/loading/failure behavior is preserved.

Race airflow now has 26 curved travelling ribbons, eight near-edge gusts and up to two slipstream trails per car (44 bounded paths maximum), driven by recent typing pace and the existing frame clock. Wind stops outside active racing and is disabled for Low/Reduced. No scoring, CPU schedule, road/cosmetic ownership, audio or saved-data changes. The Hub uses Your circuit and no successful-load message; loading/error/retry feedback remains. Settings opening/learning actions now use the same setting-row layout as Motion/Track effects. Current branch/PR remains codex/phase6-onboarding / [PR #6](https://github.com/sahilshah2904/TurboType/pull/6), pending user review; no merge/deployment. Exact final evidence belongs in docs/TESTING.md. Earlier alpha.17 screenshots describe the superseded opening.

## Phase 6 implementation — 22 October 2026

Alpha.17 implementation `3bac5e7` is pushed on `codex/phase6-onboarding` / open [PR #6](https://github.com/sahilshah2904/TurboType/pull/6) against main: cinematic entrance with actual essential-asset readiness and recovery, welcome/rules, three native-input tutorial lessons, optional thirty-active-second pace calibration, returning-visitor skip/replay preferences and natural Quick Race setup with seed in Advanced / Replay. See [Phase 6 implementation](PHASE6_ONBOARDING.md) and [laptop review checklist](PHASE6_REVIEW.md). Phase 6 implementation is complete and locally verified (102 unit / 50 browser cases), pending the user's new visual/interaction acceptance; integration remains pending. No Phase 7 implementation or deployment is authorized by this checkpoint. Older checkpoints below are historical.

The user accepted all five starter tracks and requested Phase 6. Accepted alpha.16 PR #5 was merged into main as `1b832ce3683e9791690cc58c1046138552bebf1b` after freshly confirming its exact-head `2a0a6f8af5ae0466b7d7635db5ccdcca24b86426` hosted check [39771450182](https://github.com/sahilshah2904/TurboType/actions/runs/39771450182) passed. Phase 6 is separate, not merged. Review remains at http://192.168.0.31:5173/TurboType/ on the preserved existing server; automation stays headless on 4173.

Rules 3 and save/content 1 remain. Only validated local preferences/tutorial completion/calibration sample persist; no race history, accounts, cloud, campaign maps/levels or multiplayer exists. Next after Phase 6 acceptance/integration: Phase 7 maps, Phase 8 curriculum, Phase 9 rewards/learning/guest and optional cloud saves, Phase 10 solo release/Pages, Phase 11 private rooms. Preserve independent reward milestones (23 cars / 26 tracks), ten simultaneous players and free-tier-only infrastructure plan.

## Private multiplayer and zero-cost scope — 22 October 2026

User requests rooms for up to **10 human players including host**, for up to 100 approved friends/relatives, with a **$0/free-tier-only** budget. Plan: Multiplayer → Create room / Join room by code → host chooses an owned track and shared passage preset → each player chooses an owned car → everyone including host clicks I'm ready → host starts a synchronized race. Host/roster/configuration changes invalidate readiness; server validates admission, readiness, progress and results. No single-player pause online; reconnect/host-transfer/rematch policies are in docs/MULTIPLAYER_ROOMS.md.

The initial free-capacity interpretation is at most ten active racers across the project, also ten per room. Host track is temporarily shared for that match without granting ownership; multiplayer does not generate campaign unlock progress. GitHub Pages plus **Supabase Free is the preferred architecture to validate**, not provisioned infrastructure or a promise of unlimited service. Prefer approved social login, private channels, bounded shared snapshots and quota controls; no paid services, SMTP/SMS, add-ons or automatic upgrades. Pause/restrict online features when free capacity is unavailable and preserve local solo. Phase 9 owns identity/saves and the free-only provider gate; Phase 11 owns rooms/races after solo launch. This request updates plans only; no new runtime feature, account, deployment, merge or app-version bump. Cars/tracks keep their staggered milestone plan (23 cars / 26 tracks).


## Alpha.16 — starter tracks and staggered reward plan, 22 October 2026

The user accepted the compact score/metrics presentation and requested Final standings expanded by default below it. This supersedes alpha.15's collapsed default; the disclosure can still be closed manually. Implemented on codex/results-and-fire-dial / open PR #5, which already contains alpha.15. No merge or deployment is implied by acceptance of the previous presentation.

Five starter environments are now implemented for Hub preview and Quick Race: Neon Harbor, Coral Coast, Copper Canyon, Emerald Trail and Frostline Pass. Track choice is a validated optional browser preference; the active race pins its track through countdown/pause/navigation/final state, and retry applies the next chosen preference. Original bounded geometric scenery, road/edge palettes and shared renderer preserve the typing/CPU/rules behavior. Rules 3 and save/content 1 remain.

Latest reward schedule correction (22 October 2026): cars unlock at **15/30/45/60/75/90** eligible unique main clears within each category (6 × 3 = 18 rewards; **23 cars total** with starters). Tracks unlock independently at **10/25/40/55/70/85/100** (7 × 3 = 21 rewards; **26 tracks total** with starters). This supersedes the paired-unlock plan: car and track rewards are staggered and have separate receipts/IDs. Any owned car or track remains usable across Easy/Medium/Hard on already-unlocked levels and replays; replays cannot inflate earning counters or unlock levels. Phase 7 briefing/replay selection, Phase 8 content and Phase 9 independent ownership/saves remain the delivery plan. Five starter tracks are implemented; future reward unlocks are not. See docs/TRACK_PROGRESSION.md.

Manual review stays at the existing LAN link http://192.168.0.31:5173/TurboType/. The server and active feature checkout are preserved. See docs/TESTING.md for current verification; do not reuse alpha.15's hosted pass for this new source. Starter visuals await review; no repeat review of accepted cars/music/palette is needed.

## Alpha.15 presentation follow-up — 22 October 2026

User-requested Race result simplification and fiery Live WPM instrument are implemented on `codex/results-and-fire-dial`, branched from accepted main `e1bbaff`. The default result has place, average WPM, accuracy and active time; unfinished runs include completion percentage. CPU standings expand on demand with simulation labels intact. Original SVG fire animates only during racing with High effects/full motion; Low/Reduced and pause/finish are static. No scoring/storage changes (rules 3, save/content 1), new dependencies or Phase 6 onboarding. See docs/IMMERSIVE_APP.md and docs/TESTING.md for validation and captures.

Normal human review uses the existing LAN link http://192.168.0.31:5173/TurboType/, which serves the active local checkout, including this unmerged branch. The existing server is preserved. Automated regressions remain headless on 4173. PR #4 is verified merged; base e1bbaff has successful exact-source main run 39727697321. This follow-up requires its own checks and user review before merge; no deployment.

## Phase 5 complete and integrated — 22 October 2026

The user reported “I believe everything worked fine” after the final physical checklist. Reviewed recorder evidence: 120-second hardware-accelerated session, 100 trusted racing keys, 99 trusted inputs, zero page errors, median/p95/max handler-to-next-rAF 9.3/18.8/22.2ms. This is a bounded input diagnostic and available-laptop acceptance, not universal performance certification. TT-506/511/512/513/522 are closed for the agreed Phase 5 scope; broader release testing stays in Phase 10. All Phase 5 backlog items are now complete, including explicitly canceled scope. [PR #4](https://github.com/sahilshah2904/TurboType/pull/4) merged into main as `de464ce` after exact acceptance-head `398d455` passed hosted run [39727202033](https://github.com/sahilshah2904/TurboType/actions/runs/39727202033). The local checkout is now main. This post-merge documentation update has its own main-push check; inspect actual HEAD/checks. See [closeout](PHASE5_CLOSEOUT.md). No Phase 6 implementation or deployment started. Older pending-acceptance paragraphs below are historical.


## Historical pre-integration checkpoint — 22 October 2026

Current implementation is `2eadeef`, followed by history-sync `d168720` with an identical file tree. That sync resolves the README-only conflict from main's prior documentation publication; no preview code was merged into main. Exact-head hosted PR run [39725624773](https://github.com/sahilshah2904/TurboType/actions/runs/39725624773) passed for `d1687206a2130cc6e5356d24cd16a10f7c5b6561`, freshly verified. This subsequent evidence-documentation checkpoint has its own CI status. PR #4 stays open/unmerged; inspect actual HEAD/checks on resume. The two-minute physical recorder/report remains the next user action, followed by review of TT-506/511/512/513/522 and final integration. No deployment.

The user authorized finishing Phase 5. Alpha.14 implements independent body/wheel assets and chassis suspension for all five accepted models, compact shared previews and actual-GPU profiling tools. Full local checks pass: 96 unit / 36 browser cases. See [Phase 5 closeout](PHASE5_CLOSEOUT.md) for current evidence and the remaining physical-input acceptance/integration gate. PR #4 stays open until that gate is reviewed; no deployment. Older stop-and-save/artwork-pending sections below are historical.

**Reward correction:** 100 levels per category; a distinct car at 15/30/45/60/75/90 eligible main clears independently in Easy/Medium/Hard. Eighteen rewards plus five starters replace the ten-car aggregate curve. See GARAGE_PROGRESSION.md. No unlock implementation is claimed.


## Resumed audit — 22 October 2026

The new chat read this handoff and the project trackers, inspected source/art/performance/test evidence and freshly queried GitHub. Starting checkout was clean on feat/race-polish at 2eebd92. PR #4 remains open/unmerged; its exact-head check/run 39584421655 passed for 2eebd9248f4a4a7d0a80d52fa46396a3d691fd24. Main d86d046 is the README-only publication and passed separate push run 39584487911. No app/version/dependency changes, fresh local gameplay suite, merge or deployment were part of the audit.

The next implementation remains TT-501/510 separated body/wheel art preserving the accepted fleet, followed by measured hardware performance/resource work and final Phase 5 reconciliation/integration. The dated section at the top of BACKLOG.md groups every still-open Phase 5 ID and clarifies superseded mobile/paused-switch/repeated-approval wording. The eleven-phase roadmap and future ten reward cars remain intact. These audit edits are local documentation until explicitly committed/pushed; hosted results above certify the audited source, not subsequent edits.

Saved 21 October 2026 at the user's request to stop and continue later. This is a documentation handoff, not permission to start a new phase, merge PR #4 or deploy. Read this file with `AGENTS.md`, `PROJECT_STATUS.md`, `BACKLOG.md` and current Git status before working. Earlier chat messages are not required to resume.

## Historical handoff checkpoint — 21 October 2026

| Item | Verified state at handoff preparation |
| --- | --- |
| Workspace | `S:\AI_Engineer_Journey\Projects\TurboType` |
| Repository / account | `sahilshah2904/TurboType`, HTTPS origin; author `Sahilshah` |
| Latest implementation | `b76392b` — Lock race cars and improve fullscreen, text and CI checks |
| Latest pre-handoff documentation | `717c76e` — Record the passing GitHub checks after the CI fix |
| Working branch | `feat/race-polish`; reuse it for the remaining Phase 5 work |
| Integration | [PR #4](https://github.com/sahilshah2904/TurboType/pull/4), open and unmerged |
| Main code | Accepted Phase 4 baseline; README-only updates do not merge the preview |
| App / rules / save / content | `0.1.0-alpha.13` / `3` / `1` / `1` |
| Deployment | No GitHub Pages game, backend, account provider or database deployed |
| Current phase | Phase 5, main features implemented/verified; remaining developer gates below |

The handoff itself creates newer documentation commits. Verify actual HEAD and hosted checks rather than treating the hashes above as the future current HEAD. The README on the default branch must show the latest screenshots while clearly naming the preview branch; do not merge unfinished game code merely to refresh a README image.

## User decisions that must survive the new chat

- **Scope is laptop/desktop physical-keyboard typing improvement only.** The user explicitly canceled phone/tablet compatibility, mobile keyboard/rotation work and mobile testing. Historical Samsung/iPhone/tablet requirements are superseded. Keep native hardware IME/accessibility. Minimum layout width is 960 CSS px; representative laptop checks are 1024/1366/1440/1920.
- Build single-player against **four CPUs** first. Then optional account-backed cloud progress before public solo launch, and friends multiplayer immediately afterward. GitHub Pages hosts the frontend; storage/auth/realtime need external services. Supabase is a candidate, not provisioned infrastructure.
- Keep the **eleven phases** and their numbering. Do not estimate progress by counting completed phases. Distinguish planned, implemented, tested, user-accepted and deployed.
- Accepted visual direction: full-window racing, five distinct detailed original karts, open city/garage pages, one visible integrated typing strip, exhaust flames and real-time WPM gauge. The old boxed layout/retro cars were rejected.
- Accepted palette: restored graphite/steel, crimson and cyan lighting. The later red/gold nanotech variation was rejected and reverted. Do not redesign the colors again without a new request. The Iron Man image was color/lighting inspiration, not shipped artwork.
- The user explicitly liked the distinct cars. Five starters are now selectable: Volt Kart, Neon Fox, Apex Nova, Comet and Volt Electric. **One chosen car stays locked from countdown through the entire race, including pause/navigation.** Retry/new race reopens selection. Alpha.12's paused switching is superseded by alpha.13.
- The chosen model is remembered locally and shown on the hub. CPUs use the other four models; CPU driver identities/schedules stay independent of cosmetic model assignment. All cars have identical gameplay performance.
- Keep the hub clean. **All enable/mute/volume controls live only in Settings.** Do not restore Pit lane radio, hub sound controls or Race sound controls.
- Original **Ignition** browsing music and **Overdrive** race music are accepted. The sad Nightforge browsing track and earlier oscillator loop were rejected. Separate 3–2–1/GO and effects remain.
- Personal music upload/chooser was explicitly canceled. Do not download/bundle Misirlou, reel music, Nintendo or Marvel assets. Reference media and local analysis tools remain ignored under `Reference_Images/`.
- Shared fullscreen/restore is a visible 44px icon at the top-right of every page, not the old tiny red Race-only label. It preserves state through navigation and handles browser refusal without blocking play.
- Important prose/controls use at least 16px; compact metadata 14px, brighter secondary text and usable laptop spacing. Keep Larger typing text and Reduced motion.
- The user wants thorough recreation documentation, stable names and short plain-English commits, without `docs(...)`/`feat:` prefixes. Never rewrite shared commits or force-push.

## What has been delivered

### Phases 1–4

1. Research: supplied screenshots and local reel recordings reviewed; Anime.js/Phaser and hosting/online boundaries researched. Main findings and linked primary sources live in `IMPLEMENTATION_RESEARCH.md`, `docs/REFERENCE_VIDEO_ANALYSIS.md` and `docs/RACE_REDESIGN.md`.
2. Product design: screen flow, typing/correction, timing/pauses, stars/rewards/bonuses, campaign structure, storage/auth and future multiplayer boundaries. Rules/rewards that are only designed are not runtime features.
3. Repository: public GitHub project, local origin, author identity, branch/PR workflow, formatting, naming/version rules, ignore rules and reproducible setup. Foundation PR #1 and typing PR #2 were merged; core solo-race PR #3 was merged into main. Full history remains in `PROJECT_STATUS.md`/Git.
4. App foundation: TypeScript/Vite, Phaser, Anime.js, routes, recovery, preferences, pinned dependency/runtime files, automated unit/browser checks and GitHub Actions.
5. Pure typing engine: validation, Backspace correction, accuracy, average/recent WPM, novel-position streaks, monotonic clock, countdown, pause, timeout and frozen final results; native input adapter and independent core tests.
6. Complete solo race: four seeded CPU schedules, shared active clock, real standings, simulated post-finish CPU outcomes, retry/new seed, DNF and renderer recovery. CPUs continue during player mistakes and freeze on pause. User accepted the earlier functional checks.

### Phase 5 / existing-page visual work

- Full-window Phaser race and full-width decorative hub preview, no empty side columns or stretched karts. Player in center lane; compact upper metrics, course, then typing strip and live gauge.
- Integrated native textarea-backed visual typing surface in Race/Practice, rather than a separate paragraph and answer box. Keyboard check intentionally remains a diagnostic free-editing field.
- Native SVG **Live WPM** analog/numeric gauge uses correct input over up to three active seconds. Average WPM is a separate HUD/result metric. Needle caps at 160; numeric value is uncapped. Pause/final freeze and retry reset are tested.
- Original player PNG plus four separately generated CPU silhouettes, tracked masters/prompts, optimized 800×400 WebP exports and shared per-model wheel/exhaust anchors. New rival textures total 267,580 bytes; the player master/palette are preserved.
- Procedural moving exhaust/nitro, rotating spoke highlights, mild whole-kart suspension, parallax, speed/overtake cues and bounded finish particles. High/Low/Reduced modes preserve core outcomes.
- Hub, Practice, Keyboard check and Settings share an open full-window visual style. Latest hub shows the chosen car and has no audio section. Existing-page visual work is partial Phase 6, not onboarding completion.
- Separate original, reproducibly authored WAV scores, gesture unlocking, remembered volumes/mute, countdown cues, source ownership, loading failure/retry and visibility/pause cleanup. No personal-file loader.
- Five illustrated starter choices with separate validated local cosmetic preference. Starting countdown locks the car for the whole run; synthetic change events cannot bypass the state guard. Reload retains the cosmetic preference but discards the unsaved race.
- One app-owned fullscreen control across all routes, accessible state/restore icon and refusal status. Larger text/contrast and nav spacing, including avoiding Settings/icon overlap on the 1024px Race header.
- UI avoids rebuilding standings nodes and unchanged passage classes. Scene/observer/listener disposal, asset failure fallback, refused storage/audio/fullscreen and repeated navigation are tested.

## Implemented gameplay and storage facts

- Exact case, punctuation and spaces, printable English ASCII passages bounded to 1–2000 characters. Only three short validation exercises exist; these are not the 300 campaign levels.
- Three-second start/resume countdown; pre-GO input ignored. Only active race time counts. Untimed completion or opt-in 60-second event.
- One unresolved wrong character blocks progress. Further incorrect attempts still count; Backspace removes the error. Correct-text deletion reduces progress and never erases previous attempts.
- Average WPM is validated characters / 5 / active minutes; accuracy is correct committed attempts / all committed attempts. Errors cost correction time and streak; no hidden extra time fine.
- Streaks grow only beyond furthest reached positions, preventing deletion/retyping farming. Every twentieth clean milestone may produce an 800ms visual nitro event, subject to cooldown. **Nitro never adds progress or speed.**
- Pausing after GO marks a run practice-only. Browser focus loss, hidden tab and leaving the route pause; native composition is handled once and follows documented practice eligibility. No complete client anti-cheat guarantee.
- Finishing freezes the exact timestamp/metrics; timeout wins at the deadline. CPU results after the player's finish are clearly marked simulated. CPU difficulty/seed, not graphics or selected car, determines CPU progress.
- Saved today: display settings (`turbotype:settings:v1`), audio preferences (`turbotype:audio:v1`), selected starter (`turbotype:garage:v1`). Invalid/unsupported car IDs fall back to Volt Kart; denied storage applies for the visit with a notice.
- Not saved/implemented: race history, campaign clears/stars/rewards, ownership receipts, cloud sync, accounts or multiplayer. Selected-car preference is not an entitlement store.
- `docs/GAME_RULES.md`, `docs/QUICK_RACE.md` and the core source are the implemented rules; broader design prose may describe future behavior.

## Current verification and the CI-email incident

- Full local alpha.13 check: formatting/types/build, **93 unit cases and 35 desktop Chromium browser cases passed** (1.5 minutes). Four garage cases passed three repetitions each: 12 executions, 38.0 seconds.
- Final Race header spacing correction passed build and all three affected fullscreen/readability cases (10.2 seconds). Assertions include actual fullscreen enter/exit/navigation/refusal, meaningful text sizes, 44px target, no nav overlap and no horizontal overflow at 1024/1440.
- Current screenshots: `docs/images/alpha13/`, all five routes at 1024/1440 and an active Comet race. These are actual app captures, not concept mockups.
- Hosted PR [run 39581833203](https://github.com/sahilshah2904/TurboType/actions/runs/39581833203) passed for implementation `b76392b`; all 35 browser cases passed without retries (2.0 minutes).
- Hosted [run 39582296673](https://github.com/sahilshah2904/TurboType/actions/runs/39582296673) passed for pre-handoff documentation `717c76e`, verified separately. New handoff commits have their own CI state.
- Earlier emails were genuine failures: push run 39578553613 / `722ee85` and PR run 39579044713 / `8e28d2a` timed out in the combined garage test's 30-second total budget, including retries. Their duplicate counterparts passed. Never claim all runs passed from one successful copy.
- Fixed by splitting that long test into isolated selection, locked-session and persistence scenarios, preserving coverage/default timeout/retry policy. Feature checks now run on PR updates; main on push; manual dispatch retained. Concurrency cancels superseded runs. Account email preferences were not changed.
- The user accepted the art/music/palette and reported the rest of the previous laptop checklist good. New alpha.13 fullscreen/font/car-lock behavior is automatically verified; a new subjective preference is not fabricated.
- Headless tests/profiling use SwiftShader. `docs/PERFORMANCE_ALPHA11.md` / `docs/performance/alpha11-full-app.json` include HUD, synthetic input, decoded music, four route cycles, rAF cadence, transfer and CDP JS heap. They show callback tails; **not a 60fps, physical key latency or GPU-memory certification**, and not a fresh alpha.13 benchmark. Default headless GPU probe also reported SwiftShader.

## Historical pre-closeout Phase 5 gates

Do not tell the user it is finished just because the visible features and tests pass. The two main remaining developer gates are:

1. **Separate body/wheel source assets and proper wheel animation (TT-501/510).** Current raster karts include baked wheels plus rotating highlight overlays; the whole assembly bobs for suspension. Preserve accepted silhouettes/palette, create and review real component parts/anchors, verify exhaust/rotation, inspect actual race/hub, and measure extra resource cost. Do not call the current raster masters editable 3D meshes.
2. **Measured physical hardware performance/tuning and final integration (TT-505/506/511–513/522).** User-reported smoothness is accepted subjective evidence; hardware-accelerated presented frames/input response/long-session resource behavior remain unmeasured. Obtain a useful browser trace on the actual supported laptop, identify the bottleneck before tuning, retain Low/Reduced modes, rerun appropriate checks and update evidence. Do not repeatedly ask for accepted colors/music/basic functional checks.

Then reconcile the linked backlog gates, verify exact PR head/checks, and review/integrate PR #4. Do not merge merely because this handoff exists. No public deployment is part of this documentation task. No more implementation is requested for today.

## Future eleven-phase roadmap

| Phase | Status / next scope |
| --- | --- |
| 1 — Finalize design | Baseline complete; production content and tuning are separate |
| 2 — Set up application | Complete for agreed foundation; historical phone reports are not current scope |
| 3 — Typing engine | Complete for agreed engine/input scope |
| 4 — Complete playable race | Complete for agreed four-CPU slice, merged to main |
| 5 — Polish racing | Complete for agreed scope, final physical acceptance recorded, PR #4 merged into main as de464ce |
| 6 — Opening/onboarding | Existing pages visually revamped; cinematic loading/welcome/rules/tutorial/calibration not implemented (TT-601–604) |
| 7 — Campaign maps | Three rightward winding Easy/Medium/Hard maps, 100 numbered circular nodes each, locks/stars/chapters/bonus branches, accessible navigation and saved position (TT-701–704) |
| 8 — All 300 levels | Author/review/validate passages, learning goals, difficulty curves/CPU pace/star targets, chapter/bonus events; current short exercises do not satisfy this (TT-801–806) |
| 9 — Progression/learning | Guest saves/recovery/migration, stars/rewards/rank/garage/records/charts/coaching/drills, category-specific reward cars, optional account-backed cloud progress before solo launch (TT-901–911) |
| 10 — Test/launch solo | Desktop browser/keyboard/accessibility/performance/recovery/cloud policy/sync, Pages workflow and real public-link checks (TT-1001–1008 with mobile scope retired) |
| 11 — Friends multiplayer | Immediately after solo launch: backend/private rooms/invites/ready/synchronized races/reconnect/rematch, reused auth/data boundaries and multi-client validation (TT-1101–1107) |

### Required category-specific reward cars — TT-911

**22 October correction:** keep five starters and plan eighteen distinct rewards: one at 15/30/45/60/75/90 unique eligible main-level clears within each 100-level Easy/Medium/Hard category. Counters are independent; replays, bonus events, Quick Race and Practice do not count. There is no extra car at 100 under the every-15 rule. IDs are reward-{category}-{threshold}, documented in docs/GARAGE_PROGRESSION.md. This supersedes the former ten-car/global-clear plan; no reward art, unlock code or persisted ownership exists yet. Derive ownership idempotently from category-qualified clear receipts, recover interrupted awards, migrate guest saves, merge cloud clear sets safely and validate online entitlements. Cars stay cosmetic and this remains Phase 8/9 TT-911, not a Phase 5 blocker.

## Code map for the next developer

| Area | Entry points |
| --- | --- |
| Pure typing, metrics, CPUs, results | `src/core/typing-engine.ts`, `cpu-schedule.ts`, `solo-race.ts`, `standings.ts` |
| Input adapter and application routes | `src/ui/race-input.ts`, `app.ts`, `router.ts`, `quick-race.ts`, `typing-practice.ts` |
| Gauge / fullscreen | `src/ui/speedometer.ts`, `fullscreen.ts` |
| Rendering | `src/game/race-track.ts`, `track-preview.ts`, `kart-fleet.ts`, `race-view.ts` |
| Cosmetics/content | `src/content/kart-catalog.ts`, `practice-passages.ts`; `assets-source/karts/`; `public/assets/karts/` |
| Audio | `src/audio/race-audio.ts`, `src/storage/audio-settings.ts`, `src/ui/audio-controls.ts`, `assets-source/build-soundtracks.mjs` |
| Preferences / future contracts | `src/storage/settings.ts`, `garage.ts`, `src/core/contracts.ts`, `src/config/versions.ts` |
| Layout | `src/styles.css`, `src/immersive.css` |
| Checks | colocated `src/**/*.test.ts`, `tests/browser/*.spec.ts`, `playwright.config.ts`, `.github/workflows/checks.yml` |
| Art/performance recreation | `scripts/export-karts.mjs`, `profile-race.mjs` (isolated), `profile-app.mjs` (full app) |

Phaser owns the canvas; native HTML owns input/navigation; Anime.js owns brief DOM motion. Keep core rules independent of rendering/audio. Current Phaser scenes preload model textures, bake the accepted coral player palette once and own their objects/observers; do not create per-keystroke games/textures. The fleet manifest/catalog order is covered by all-starter browser checks; preserve ID/model mapping when extending it.

## Reproduce, inspect and continue

1. Read this handoff and project tracker/backlog; inspect `git status --short`, branch/log/remotes and PR #4 before edits. Preserve intervening user changes. No force pushes or destructive cleanup.
2. Use current main as the base for future authorized feature work. PR #4 is merged and main contains the alpha.14 preview. Preserve the old feature branch as history unless cleanup is requested. Source integration is not deployment.
3. Use `.nvmrc` Node **24.13.0**, npm **11**, pinned lockfile. `npm ci`, then `npx playwright install chromium` if needed. No API key/database/.env is required for local solo preview.
4. `npm run dev`; normal URL `http://127.0.0.1:5173/TurboType/`. An existing user-owned Vite server on 5173 was used; do not kill/restart it blindly. HMR refresh discards the in-memory run.
5. `npm run check` runs formatting, types, unit tests, build and browser suite. Playwright uses preview port 4173 and two SwiftShader workers. Do not run profiling/captures/browser suites concurrently on this approximately 7GiB workstation. A Windows shell AutoRun warning sometimes appears; inspect real exit status, do not change the user's registry.
6. Artwork: see `docs/KART_FLEET.md`, committed masters and `assets-source/karts/PROMPTS.md`. `node scripts/export-karts.mjs` exports WebP; generation is nondeterministic, committed masters make export reproducible. Never overwrite accepted art casually.
7. Music: `node assets-source/build-soundtracks.mjs`; metadata in `public/assets/audio/soundtracks.json`. Preserve accepted WAVs. Overdrive SHA-256 `b8a95059350b3a10cd0cfac876a90d247deb3fca4d77093d0b4ae658583a45cd`; Ignition `a8e088a4bea68612376f307f142063fc2062ebcd7ca2e0dd39a8025867cef19b`.
8. Phase 5 is complete for agreed scope. The next implementation is Phase 6 loading/onboarding when requested, not 300 levels or a new palette. Update code/tests/docs/backlog together, use meaningful checks and short English commits. Create a new feature branch from current main for authorized work and attach any new/relevant PR.
9. When the user requests the next phase, start Phase 6 cinematic loading/onboarding with real asset progress, skip/replay, welcome/rules, interactive correction/streak tutorial, optional calibration and first/returning-player flows. Final Quick Race seed belongs under Advanced/Replay; campaign settings will come from level definitions.

## Documents and precedence

`AGENTS.md` = operating instructions; this handoff = resume map; `PROJECT_STATUS.md` = evidence/history/current phase; `BACKLOG.md` = stable future task IDs; `GAME_DESIGN_PLAN.md` = product decisions; `docs/RULES_AND_STORAGE_BASELINE.md` = designed reward/storage defaults; `docs/GAME_RULES.md`/source = implemented rules. Latest explicit user decisions override old planning prose. Old alpha/mobile/palette paragraphs are historical, not a reason to restore rejected behavior. Use source and fresh validation to settle discrepancies.
