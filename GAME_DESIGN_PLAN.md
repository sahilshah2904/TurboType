# TurboType — game design and engineering delivery plan

Status: design baseline established; Phase 2 foundation complete with recorded exceptions and Phase 3 typing practice complete for agreed scope, with ASUS/Samsung checks accepted by user report. Phase 4 four-CPU Quick Race is accepted; Phase 5 initial visuals were rejected, then the user approved the kart direction; alpha.5 integrates it and revamps existing pages with a Live WPM dial. Final verification, distinct fleet and device acceptance remain; docs/IMMERSIVE_APP.md describes implementation and docs/RACE_REDESIGN.md retains the redesign plan; docs/QUICK_RACE.md defines actual CPU/result semantics. Read PROJECT_STATUS.md and docs/TESTING.md for actual evidence; docs/GAME_RULES.md describes implemented rules version 3 and takes precedence for current typing behavior.
Updated: 21 October 2026.
Technology research and source links: [IMPLEMENTATION_RESEARCH.md](./IMPLEMENTATION_RESEARCH.md).

Phase 1 design coverage has been audited. [PROJECT_STATUS.md](./PROJECT_STATUS.md) tracks the eleven user-facing phases. [Rules and storage baseline](./docs/RULES_AND_STORAGE_BASELINE.md) supplies exact initial rewards, timing/cooldown defaults, save boundaries, backup/recovery policy, and database scope; its clarifications supersede earlier broad suggestions here. Baseline design completion is not implementation or playtest completion.

Latest scope revision: [responsive and online architecture](./docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md) supersedes the earlier desktop-first/local-only public release assumption. Design data/auth/network contracts from phase 2, add optional account-backed cloud progress before public single-player launch, and follow with friends multiplayer in phase 11. Phones, tablets and laptops are first-release targets.

Latest visual revision: [Phase 5 race redesign](docs/RACE_REDESIGN.md) supersedes the earlier boxed race and separate visible passage/input composition. Target a full-viewport racing scene, compact upper HUD, one integrated native-input-backed typing strip and a reviewed new vehicle-art direction. This is required Phase 5 work before Phase 6 onboarding; core typing/CPU rules remain intact.

## 1. Product brief and scope

Create an immersive typing racing game that makes repeated practice enjoyable and makes improvement visible. The racing spectacle should reward accurate, sustained typing while leaving the passage easy to read. Build original TurboType branding, vehicles, loading artwork, music, and environments.

**Release 1:** one human against four explicitly identified computer opponents, playable from a GitHub Pages link on phones, tablets and laptops. Local guest play requires no account/install; optional permanent sign-in provides cloud progress across devices through an external service. Include onboarding, rules, tutorial, campaign, quick races, practice, garage, settings and results.

**Release 2:** friends open the same GitHub Pages game link, create or join an invitation room, ready up, and race together. This requires a separately hosted realtime backend; sharing the static URL alone does not connect players. Preserve the same typing rules and visual identity across releases.

This document governs product behavior. The research document explains library choices. Values marked as tuning proposals must remain configurable and be adjusted through playtesting rather than represented as measured learning outcomes.

## 2. Complete screen flow

Use hash-based screen navigation so direct links and refreshes work on the GitHub project path. Browsers should have meaningful titles and navigation behavior. Restore safe screens on refresh; never restore an active race as a valid finished record.

| Screen | Purpose and interaction | Completion / exit |
| --- | --- | --- |
| Lightweight boot | Show TurboType identity immediately while checking saved settings and essential resources | Continue to entrance; show recovery actions if resources fail |
| Enter TurboType | A clear Enter button enables sound after a user gesture; mute and motion controls are accessible immediately | User enters; audio failure does not block progress |
| Cinematic loading | Original illustrated racing panels, slow depth motion, logo treatment, real asset status, short driving/typing tips | Continue as soon as essential assets are ready; skip optional montage |
| First-time welcome | Explain “your typing drives the car” and offer a guided start | Tutorial or Skip to hub; help remains available |
| How to Play | Short cards covering controls, corrections, progress, nitro, opponents, scoring, and local saves | Start guided tutorial or return |
| Guided tutorial | Interactive demonstration of correct typing, one mistake, Backspace correction, and a clean streak | Finish guided exercise; replay freely |
| Optional calibration | A short, low-pressure passage estimates a starting opponent tier | Accept recommendation, choose manually, or skip |
| Main hub | A living garage/city backdrop with Campaign, Quick Race, Practice, Garage, Progress, How to Play, Settings | Select activity; Continue campaign is prominent |
| Campaign selection and map | Choose Easy, Medium, or Hard, then browse a horizontal winding path of 100 numbered circular level nodes | Open an unlocked level briefing or return to hub |
| Race setup | Preview level goals, CPU tier, passage category, rewards, and appearance; campaign settings are fixed per level, Quick Race settings are editable | Explicit Ready action begins loading/grid |
| Track briefing and grid | Identify track, challenge goals, and CPU rivals; show traffic lights with focus ready | Countdown begins only when resources and input are ready |
| Race and pause | Stable passage, WPM, accuracy, rank, progress, streak, timer, opponent labels | Finish, pause, restart, or return to hub |
| Finish and results | Cinematic celebration followed by honest metrics and one clear coaching suggestion | Retry, targeted drill, next event, or hub |
| Garage | Inspect/select unlocked paint, cars, wheels, and trails with animated previews | Save appearance and return |
| Progress | Local race history, comparable personal records, campaign stars, accuracy and pace trends | Select practice or replay an event |
| Settings | Audio, motion, effects quality, text size, typing help, intro replay, local save controls | Changes apply predictably; destructive reset requires explicit confirmation |

First-time path: boot → enter → loading → welcome → rules → tutorial → optional calibration → hub → category → campaign map → level briefing → grid → race → results.

Returning path: boot → enter/loading as necessary → hub → race. Remember tutorial completion and “skip intro next time.” Make all cinematic segments replayable from settings. Future multiplayer stays out of the playable navigation until implemented, or is clearly presented as a roadmap item without an active join button.

## 3. Cinematic loading and opening direction

Aim for the atmosphere of a major game's illustrated loading sequence: layered city artwork, a vehicle close-up, a driver silhouette, neon signage, drifting light, subtle grain, smooth panel transitions, and an original audio sting. This is an artistic reference to cinematic pacing; TurboType uses its own assets and composition rather than Rockstar/GTA logos, artwork, music, or recognizable interface copies.

Anime.js choreographs HTML/SVG panel motion and typography; Phaser handles the live garage/track backdrop after it initializes. The minimal loader must render before these larger systems finish loading.

Loading behavior is part of the specification:

- Read stored mute, quality, and reduced-motion preferences before starting effects. Respect the system motion preference on first visit.
- Track essential downloads/decode/initialization explicitly. If byte totals are unknown, show honest stage labels or completed-asset counts instead of an invented percentage.
- Never add an artificial loading delay to display the full montage. Skip optional artwork when the player requests it; do not skip required initialization.
- Keep initial assets small. Defer extra tracks, music, and cosmetic previews until needed.
- Present retry and a useful error for failed essential assets. Optional audio/art failures may fall back gracefully. No infinite spinner.
- On retry races, use a brief track transition instead of replaying the full intro.
- In reduced-motion mode, use static artwork and short fades; all text and controls remain available.

Document the art layers, source files, export settings, animation timings, sound cues, and loading milestones so the sequence can be rebuilt.

## 4. Canonical race rules, version 1

### Typing and correction

1. Every racer receives the same passage. Letters, spaces, case, and punctuation must match exactly. Begin with curated English content using predictable characters; introduce punctuation deliberately through the campaign.
2. The race starts after the synchronized local 3–2–1–GO countdown. Pre-start typing cannot advance the car or affect accuracy. Keyboard focus must be ready before countdown.
3. **Correction-required input:** a wrong character is displayed with an underline and error color at the caret. It stops validated progress and breaks the clean streak. Backspace removes it, then the player enters the expected character.
4. For a bounded and teachable correction model, retain at most one unresolved incorrect character. Additional insertion attempts while that error remains are rejected and counted as incorrect attempts. Announce “Backspace to correct” quietly; do not create repeated alerts or harsh sounds.
5. Use append-at-caret input. Backspace removes the latest entered character. Deleting a previously correct character reduces current progress. Cursor jumping, replacing selected text, and forward deletion cannot bypass the correction rule. Keep normal browser shortcuts working outside the race input.
6. An error costs the time needed to correct it. There is no extra time fine or arbitrary backwards car jump. Any visual sputter is short and cannot obscure text.
7. Reject paste/drop/autofill bulk replacement in race modes with a brief explanation. Handle composition as committed input without double-counting events; validate each committed character in order. Document tested browser behavior and the chosen limitations. This is input policy, not a claim of complete anti-cheat protection.
8. A clean streak advances only when correctly reaching new furthest passage positions; deleting/retyping cannot farm streaks or rewards. An incorrect attempt resets it. Backspace does not erase historical attempts.
9. Finish requires the complete correct passage with no unresolved error. The final committed character records the exact finish time, independently of the finish animation.

Worked example: expected `cat`; typing `c`, `x` yields one validated character, two attempts, one correct attempt, and a visible error. Backspace, then `a`, `t` finishes with four attempts and three correct attempts: 75% accuracy. Correcting a mistake does not turn it into a perfect race.

### Metrics and result ordering

- Progress = current validated prefix length / passage length. Use this value for race positions, even when rendering interpolates car movement.
- WPM = (current validated characters / 5) / active elapsed minutes. Final WPM uses full passage length and exact finish duration. Show 0 at zero elapsed time and an unset accuracy before any attempts.
- Accuracy = correct committed character attempts / total committed character attempts × 100. A correctly retyped character counts as another correct attempt; rejected inserts behind an unresolved error count as incorrect attempts. Backspace and navigation keys are excluded.
- Recent WPM is a separate rolling-window pace used for feedback and animation. Label it separately if displayed; final results use whole-race WPM.
- Finished racers sort by finish time. Exactly equal stored finish times receive a shared place; lane ID controls only display order. Equal unfinished progress receives a shared current rank.
- Mistakes never reduce the elapsed timer or disappear from the attempt history. Rounding is for display only; reward thresholds use the underlying values.
- Personal records are partitioned by mode, passage/event, rules version, and pause eligibility. Never compare an easy short passage directly with a punctuation-heavy long one as if conditions were identical.

### End conditions, pause, and fairness

- Escape opens pause; tab hiding or loss of application focus pauses a solo event. Pause the player timer, bots, audio, and effects together. Resume with a short countdown excluded from active elapsed time and clear any held-key state.
- A paused event can be completed for practice and base participation rewards, but cannot earn a personal record or campaign stars. State this before starting and on the pause/results screens. Practice drills allow unrestricted pausing.
- Restart abandons the active run and awards nothing. Refresh/closing the page abandons it; keep previously earned progress.
- CPU opponents finishing first does not stop the player's learning opportunity. Continue until the player finishes, leaves, or the visible event time limit expires.
- Give opt-in timed practice/time-trial events an explicit limit in setup; expiry produces DNF with actual progress, never an invented finish time. Main campaign levels and default Quick Race are untimed exact-passage races.
- After the player finishes, finish ordering for remaining bots may be derived from their deterministic schedules and labeled as simulated CPU results. A bot beyond the event deadline is DNF. The user need not watch every remaining bot finish before retrying.

### Nitro and controls

Nitro celebrates clean typing; it is visual/audio in release 1. A proposed 20-character clean streak triggers a bounded burst with a cooldown. It changes flames, trails, and sound, not validated progress or the finish requirement. Cosmetics never grant speed advantages.

Controls shown in How to Play: type to move; Backspace to correct; Escape to pause; Enter/Space activate focused menu buttons. Space inside the race input always types a space. Retry is available on results and in pause; avoid a global shortcut that could accidentally reset a race while typing.

## 5. Levels, campaign, and opponent difficulty

Separate **learning stages**, **opponent speed**, and **cosmetic player level**. Players can practice any skill without grinding XP or beating fast opponents. Baseline estimates are recommendations only; no claim of a scientifically validated curriculum is made.

### Campaign structure: 300 levels

Launch scope is **100 Easy + 100 Medium + 100 Hard levels**, replacing the previous five-stage/15-event proposal. Level numbers restart at 1 within each category. Use category-qualified IDs everywhere so Easy 12 and Hard 12 cannot share saves, records, or rewards by accident.

All three categories are selectable from the start, each with level 1 unlocked. This lets a practiced typist begin Hard immediately. Clearing level N unlocks only level N+1 in that category. Clearing Easy is not required to enter Medium or Hard. Progress, stars, current position, and map scroll position are saved separately for each category.

Each category has ten chapters of ten levels. Chapters are visual districts on the map, not additional difficulty categories. Level 10, 20, and so on are showcase events; level 100 is the category finale. Build all 300 validated level definitions before calling the campaign complete; a map of locked placeholders is not a completed campaign.

| Category | Learning content across levels 1–100 | Proposed passage size, early → late | Proposed pace-star goal / CPU band, early → late |
| --- | --- | --- | --- |
| Easy | Lowercase common words, spacing, home-row emphasis expanding to full alphabet, rhythm and accuracy | 60–100 → 160–220 characters | 10–15 / 8–18 WPM → 25–30 / 20–35 WPM |
| Medium | Mixed case, longer vocabulary, commas/periods, contractions, introductory numerals | 120–180 → 260–340 characters | 25–30 / 20–35 WPM → 45–55 / 40–60 WPM |
| Hard | Sustained mixed prose, quotes, numerals and denser punctuation, consistency under longer passages | 180–260 → 400–550 characters | 45–55 / 40–60 WPM → 75–90 / 70–100 WPM |

These are tuning ranges, not rigid requirements or validated teaching claims. Each level stores explicit passage ID/revision, bot configuration, pace goal, accuracy goal, chapter, environment variant, and reward metadata. Design gradual changes with recap levels rather than raising length, punctuation density, and CPU speed simultaneously at every step. A level must use content appropriate to its category; Easy never silently introduces advanced symbols.

Suggested chapter rhythm: levels 1–3 introduce/revisit a skill, 4–6 develop it with varied passages, 7–8 combine skills, 9 rehearses, 10 provides a showcase. Every chapter has its own concrete skill objective and reviewed content, not only a new background color. Author deterministic passages from curated original text/content pools; do not call an AI service during gameplay. Validate uniqueness and accidental repeats within a category, and review the difficulty curve manually.

### Campaign map presentation and navigation

The category map is a landscape path that scrolls **to the right**, using numbered circular level buttons connected by a softly winding road. Distant future levels remain visible and locked, with district artwork and milestone markers along the route. Use original racing-map art and UI; Candy Crush is a reference for clear progression and node-based navigation.

- Category cards show `Easy · 24/100 cleared · 61/300 stars` and a Continue button. The map header shows the category, selected level, highest unlocked level, star total, and a compact overall progress strip.
- A current-level node has a car/player marker, a restrained halo, and an explicit label such as `Easy · Level 25`. A completed node shows a completion mark and 0–3 earned stars; an available unplayed node has a clear active border; a locked node shows a padlock and muted number. Color is not the only distinction.
- Selecting a locked node shows its requirement, such as “Clear Easy Level 24 to unlock.” It never starts a race or spends currency. Unlocked nodes open a briefing with content focus, pace/accuracy star targets, CPU profile, personal best, and first-clear rewards.
- First entry centers the highest unlocked level. Later visits restore the category's map position; Continue and Jump to Current always center the next uncleared level. After a clear, animate the connecting road and next node unlocking, once, with an instant reduced-motion alternative.
- Support drag/swipe, a horizontal scrollbar, previous/next chapter controls, and arrow-key navigation for focused level nodes. Optional wheel-to-horizontal scrolling applies only over the map without trapping normal page navigation. Maintain useful hit targets and visible focus.
- Jump to chapter or select a level by number for navigation; neither bypasses locks. Locked chapters may be previewed. On small screens, retain the rightward path with larger node spacing and a compact briefing drawer.
- Every node has a semantic label: category, level, status, stars, and unlock requirement. Provide a simple list view for accessibility. DOM/SVG buttons should be usable before decorative map imagery loads.
- Render level metadata cheaply; lazy-load district scenery, previews, and race assets near the visible chapter. Do not instantiate 300 running scenes or continuously animate every future node.

### Clearing, stars, and replay

A campaign level is cleared by finishing the exact passage in an eligible unpaused run. Winning, hitting a WPM goal, or collecting all stars is not required. No mandatory campaign countdown deadline: slower learners can finish. Opt-in time trials stay separate. Pause still allows a practice finish and base rewards but does not clear a level; explain this before Ready and provide immediate retry.

Award three independently explained stars: completion, at least 95% accuracy, and meeting that level's stated pace goal. Each goal is stored independently across eligible runs; once earned it remains earned. For example, a careful replay can add the accuracy star even if a previous run earned the pace star. Normal clears therefore have at least one star. Each category has 300 available stars; all three total 900. Winning gives recognition and a cosmetic bonus, not a progression requirement.

Replaying completed levels is always free. No lives, energy meter, mandatory streak, or waiting timer limits practice. A clear grants its first-clear reward once and opens the next node; repeats grant only the ordinary completed-race reward. Hard 100, Medium 100, and Easy 100 each show category completion, keep every completed node replayable, and do not create a level 101. The next suggestion is another category or improving earned stars.

Bots use seeded per-character schedules, bounded pace changes, reaction time, hesitation, and correction delays. Fix their tier before GO; do not secretly speed them up to defeat the user. All bots remain labeled CPU. Calibrate difficulty between races only, with a visible recommendation and a manual override.

### Bonuses, milestones, and cosmetic driver rank

Call XP progression **Driver Rank**, distinct from Easy/Medium/Hard level numbers. Proposed cumulative XP to reach rank R is `100 × (R−1)²`. Keep the formula and reward tables versioned. Never show an ambiguous “Level 12” without category or rank context.

Ordinary completed-race reward defaults are 50 base XP plus `floor(50 × accuracyRatio)` XP and placement XP of 25/15/10 for first/second/third (zero otherwise); credits are `10 + floor(10 × accuracyRatio)`. Paused completions receive base rewards only; abandoned/DNF runs show feedback without completion rewards. Campaign-specific first-clear and other fixed awards are defined in the rules/storage baseline; tutorial/calibration/drills do not award ordinary race currency. Record final implemented behavior in the rulebook before release.

| Bonus | Trigger | Reward and progression behavior |
| --- | --- | --- |
| First-clear pit stop | First eligible clear of levels 5, 15, 25, …, 95 | Fixed visible credits and a small XP bonus; a short optional pit-stop celebration on the map |
| Chapter trophy | First eligible clear of levels 10, 20, …, 100 | Chapter badge and a specified cosmetic; show the actual item before playing |
| Star cache | Category reaches 30, 60, …, 300 total stars | Deterministic credits or cosmetic, claimed once per threshold; never needed to unlock the next level |
| Perfect lap | First 100% accuracy completion of a level | Small one-time XP bonus and a perfect-lap mark; mistakes can be practiced again without punishment |
| Recovery badge | First run that corrects mistakes and then builds the configured clean streak | One-time account-local badge celebrating correction; no repeat credits for deliberately making errors |
| Optional bonus challenge | Unlocked at each chapter clear | Short precision/consistency practice on a side node; reward once, freely replayable, never blocks the main road |
| Category champion | First clear of level 100 | Category-specific vehicle appearance and completion celebration |

All rewards have visible, fixed conditions. No random loot, purchased boosters, speed advantages, mandatory daily logins, or currency to bypass locked levels. Bonus challenges are additional side content, not part of the 100 numbered main levels. Completing 100 levels with the completion star unlocks the full main campaign regardless of bonus participation or total stars.

Persist a race ID and reward receipt so reopening results cannot award twice. Reward keys are category-qualified and stable, for example `chapter-clear:medium:03` or `perfect-lap:hard-027`. Award clear state, next-level availability, and receipts through one validated save update. Re-entry, retries, importing a compatible save, and content updates must not duplicate first-clear rewards. Local saves are editable and are not a trusted online economy.

### Campaign data and migration

Use stable level IDs `easy-001`…`easy-100`, `medium-001`…`medium-100`, and `hard-001`…`hard-100`. User-facing labels omit zero padding. Separate level ID, content revision, and rules version: editing a passage does not rename the level. Retain earned completion/cosmetics; separate records when timing conditions change. Save migration policy must be explicit when the content/rules change.

The level manifest is the source of truth for prerequisites and content. Validate exactly 100 contiguous unique main levels per category, ten chapters, valid passage references, level/category agreement, no missing prerequisites/cycles, and reachable bonus nodes. Derive unlock state from valid completions and manifest prerequisites instead of trusting independent mutable lock flags. Level 1 is always recoverable even if a malformed save is discarded.

## 6. Learning loop and retention

The core loop is race → understand one improvement → short targeted practice → retry under comparable conditions. No promises of guaranteed speed gains.

- Results show accuracy, average WPM, recent-pace chart, correction count, longest clean streak, placement, and relevant personal-best comparison.
- Choose one supportive coaching message based on actual evidence: for example, “Accuracy dropped on capitals; try the capitalization drill.” Avoid presenting every weakness at once.
- Track expected-versus-entered character errors locally, counts, and inter-key timing. Report common errors only with enough samples; do not infer a habit from one typo. Pause intervals are excluded from pace calculations.
- Provide short correction, capitalization, punctuation, and consistency drills. A relaxed drill may offer visual finger/key guidance; competitive race input and scoring stay consistent.
- Offer an optional on-screen keyboard and optional sound feedback. Avoid moving or bouncing the passage as typing speed increases.
- Show trends with sample counts and comparable modes. Small samples should say “keep racing to establish a baseline.” Store only game-session data, never capture keys typed elsewhere.
- Use achievable local challenges and cosmetic unlocks, with optional reminders contained within the game. No push notification service or external messaging is part of release 1.

## 7. Immersion, art, audio, and accessibility

Use a coherent art direction across loading panels, hub, garage, track, HUD, and results. Proposed direction: illustrated neon motorsport with warm highlights and cyan nitro, expressive modern sports cars, atmospheric scenery, and original music. The current retro coupe and boxed foundation screens are prototypes; the user requested a wider immersive composition with coordinated cinematic interface motion and purposeful side scenery/information, while phones stay compact. Create an art bible covering palette, typography, vehicle proportions, layers, icon style, and export sizes before producing many assets.

The supplied reel recording has now been visually reviewed through timestamped frames. [Reference video analysis](./docs/REFERENCE_VIDEO_ANALYSIS.md) records the visible launch, layered burst effects, passage scrolling, player-relative framing, approaching finish gate, and victory card, with evidence limits. Use these observations to refine the race prototype while preserving this plan's explicit typing/scoring rules.

Start with one city environment polished end to end. Introduce dusk/night weather variants through stage progression, then additional scenery after performance testing. Prioritize readable silhouettes, separate rotating wheels, suspension motion, shadows, parallax, exhaust, sparks, and purposeful lighting over permanent heavy blur.

Audio layers include menu ambience, countdown cues, pace-responsive engine sound, streak accents, overtake cues, and finish music. Use separate master/music/effects controls and remember mute. Missing audio never blocks play. Keep mistake feedback gentle.

Add an original or appropriately licensed instrumental electronic/synthwave racing soundtrack, with a calmer garage loop, optional intensity stems during a race, and a short finish cue. Crossfade layers rather than changing tempo on every keypress. Ignore the recording's song entirely. Track provenance, redistribution rights, editable inputs where available, loop/export settings, and attribution in the asset register; preload short cues and defer larger music files. See the reference analysis for the detailed audio brief. Phase 5 now implements original source-authored menu/race synth music and effects; see docs/AUDIO.md. No reference song, downloaded sample or externally licensed track is used. Audible mix and physical device review remain pending.

Anime.js owns interface choreography; Phaser owns world motion and effects. One owner per property. Gameplay state owns race start/finish and rewards. Cinematic playback can be skipped without changing results. Decorative effects never cover the passage or important controls.

Provide reduced motion, adjustable effects, readable text size, visible focus, non-color error indicators, touch and keyboard navigation throughout. Phones, tablets and laptops are first-release targets, in portrait and landscape where appropriate. Test real software keyboards, safe areas and changing visual viewports; keep the passage/input visible and preserve race state across layout changes. Publish tested browser/device support rather than promising every historic device. Segment comparable personal records by explicit input profile.

## 8. Multiplayer evolution and shared-link journey

Future journey: open `https://<owner>.github.io/TurboType/` → Multiplayer → Create private room → copy an invitation such as `#/room/<room-id>` → friends open it → choose names and ready up → host starts once assets are ready → shared passage/countdown → live race → shared results → rematch.

Room links are examples until implemented. The client remains on GitHub Pages; a realtime service and persistence, if required, run elsewhere. Research provider pricing and deployment only when this milestone begins. The existing research identifies Colyseus as a candidate, not a selected or deployed service.

Design now for later reuse:

- Pure, versioned typing/scoring rules and passage definitions, independent of rendering.
- A race provider interface with solo-bot and future network implementations; deterministic seeds for reproducible tests.
- Explicit event IDs and state transitions for countdown, progress, finish, timeout, and reward receipt.
- Future server ownership of room state, accepted progression, race start and finish ordering; client-side smooth rendering of received progress.
- Future ready checks, disconnect/reconnect policy, room expiry, name validation, and connection-failure screens.
- Pause policy changes explicitly online: one player's pause cannot stop everyone. Online timers continue; disconnect grace and DNF rules must be documented before multiplayer release.
- Keep local solo records separate from server-validated online results. Validate impossible inputs and score claims without claiming browser automation can be eliminated.

Release 1 includes optional account/cloud progress while retaining local guest play. Only live race-room infrastructure is deferred to release 2; storage/auth/data contracts begin in the foundation. Supabase Auth/Postgres is the recommended persistence candidate, not a provisioned service; validate selection/configuration before integration. Build friends multiplayer next after single-player launch using the established account/persistence contracts.

## 9. Documentation contract

Documentation is part of every milestone's completion, updated in the same change as its implementation. Document final behavior and explain consequential choices, rather than leaving a transcript of experimentation. Another developer should be able to clone a specific commit, install pinned dependencies, run the game, understand its rules, and reproduce its deployment.

| Document / artifact | Required content |
| --- | --- |
| `README.md` | Product overview, screenshot, current feature status, exact prerequisites, clean-clone setup, run/build/test commands, live link once verified, documentation index |
| `docs/SETUP.md` | Tested Node/npm versions, lockfile usage, Windows PowerShell and CI steps, environment configuration, expected successful outputs, common setup failures |
| `docs/ARCHITECTURE.md` | Module boundaries, state transitions, ownership of input/timing/rendering/audio/storage, race-provider contract, event/data flow |
| `docs/GAME_RULES.md` | Implemented version of every rule above, formulas, correction examples, ties, pauses, timeouts, rewards, eligibility |
| `docs/CONTENT_AND_LEVELS.md` | Event IDs, passages, difficulty configuration, bot seeds/schedules, unlock rules, curriculum changes and their rationale |
| `docs/ENGINEERING_CONVENTIONS.md` | Git workflow, naming, stable IDs, file organization, version policy, review gates, and release/rollback practices |
| `docs/CAMPAIGN_MAP.md` | Three 100-level manifests, chapter layout, map states/navigation, bonus nodes, completion/reward persistence, and accessibility |
| `docs/ANIMATION_AND_ART.md` | Motion presets, timelines, reduced-motion equivalents, art bible, asset authoring/export instructions, animation-library ownership |
| `docs/ASSETS.md` | Each shipped asset's source, creator, license/attribution, modifications, and editable source location; include generated-art provenance if used |
| `docs/SAVES.md` | Versioned schemas, namespaced keys, migration, recovery, export/import if implemented, reset behavior and browser-local limitations |
| `PROJECT_STATUS.md` | Persistent eleven-phase tracker: actual completion, evidence, remaining work, and next deliverable |
| `docs/RULES_AND_STORAGE_BASELINE.md` | Initial rule/reward/save audit decisions; transition these into implemented rulebook and save documentation |
| `docs/RESPONSIVE_AND_ONLINE_ARCHITECTURE.md` | Responsive behavior, phone-keyboard handling, guest/cloud saves, identity, data model, sync and multiplayer service boundaries |
| `docs/TESTING.md` | Automated checks, deterministic cases, manual browser/device checklist, performance method, actual measured results and known limits |
| `docs/DEPLOYMENT.md` | Repository ownership, Pages setup, base path, asset paths, workflow permissions, exact deployment verification and rollback procedure |
| `docs/adr/` | Short decision records: context, chosen option, alternatives, consequences, date; initially engine version, Anime.js ownership, strict correction, pause policy, storage, Pages routing |
| `CHANGELOG.md` and known issues | Changes by milestone/release, migrations, outstanding limitations, evidence-backed completion status |

Provide these documents as their related systems are implemented; do not publish commands for scripts that do not exist yet. Preserve the planning documents as a roadmap and keep implemented specifications synchronized with them. Source comments explain tricky invariants, units, cleanup requirements, and edge cases; avoid comments that merely restate code.

For every milestone record: objective, files/systems changed, setup/run instructions, design decisions, verification commands and results, visual evidence where relevant, limitations, and next work. Keep secrets out of examples. Include the package lockfile and record tested versions and exact commit in release notes. Asset-authoring inputs must accompany exports or have clear retrieval/recreation instructions.

## 10. Delivery milestones and completion gates

| Milestone | Deliverable | Gate before calling it complete |
| --- | --- | --- |
| M0 — Specification | This plan, research, rule examples, screen flow, documentation contract, local Git foundation and engineering conventions | Internal consistency review; planning files tracked; unresolved assumptions listed |
| M1 — Foundation | Responsive Vite/TypeScript shell, pinned Phaser/Anime.js spike, touch input/keyboard spike, routing, loader, settings, stable data/auth/storage interfaces | Clean install/build and `/TurboType/` assets work; phone/tablet/laptop layouts tested; setup and architecture ADR documented |
| M2 — Rules and bots | Pure typing/scoring/state engine and deterministic CPU providers with simple playable race | Correction, timing, ties, pause eligibility, timeout, and finish tests pass; rules and architecture documented |
| M3 — Complete experience slice | Original entrance/loading sequence, rules, tutorial, hub, setup, city race, finish, results, retry | A new player can learn and finish a race; returning players skip onboarding; browser-reviewed animation and input remain smooth |
| M4 — Learning and progression | Three 100-level campaigns, maps/bonuses, drills, garage, local saves plus optional account/cloud progress, sync, export/import and recovery | All 300 levels validated; unlocks/rewards, responsive map, records, cloud access controls/conflicts/idempotence, cross-device sync, migrations and recovery verified; corresponding docs complete |
| M5 — Polish and launch | Finished art/audio, quality presets, recovery screens, accessibility, GitHub deployment | Device/browser checks recorded, performance measured, published build tested, clean-clone and rollback procedures reproduced |
| M6 — Friends multiplayer, later | Join links, private lobby, ready checks, realtime race, reconnect policy, rematch | Backend and frontend deployment docs, synchronized-result tests, multiple-client verification, no regression in solo mode |

Each milestone may contain small reviewable commits. Do not call a milestone complete merely because its screens exist; controls, errors, cleanup, persistence, and documentation must work too. M6 begins immediately after the single-player launch gate passes, reusing the account/cloud foundation rather than introducing storage for the first time.

## 11. Verification and reproduction checklist

Automated tests should verify consequential behavior: the `cat` correction example, attempts after an unresolved error, backspace/retyping exploits, zero-time metrics, paste/composition behavior, countdown input, deterministic bot schedules, shared places, exact finish timestamps, paused-run eligibility, event expiry, reward idempotence, save validation, and migrations. Browser flows should exercise tutorial → first race → results → retry and return visits with saved settings.

Campaign checks must validate all 300 main level definitions and passage references, category-independent unlocks, chapter boundaries (9→10→11 and 99→100), no level 101, star threshold rewards, bonus-node reachability, first-clear idempotence, content/rules revision behavior, and restoring progress on reload. Exercise horizontal scrolling, keyboard navigation, locked-node explanations, Jump to Current, list view, and reduced-motion unlocking. Test representative races at the start/middle/end of each category and every introduced typing mechanic; automate manifest validation for every level rather than writing 300 duplicate tests.

Manually inspect initial load on slow/failed requests, audio unavailable, reduced motion, keyboard-only navigation, focus loss, virtual keyboard resizing, high device pixel ratio, and a long high-effects race. Repeat retries to detect leaked listeners, particles, timers, and audio. Record which browsers/devices were actually tested.

Measure the existing performance goals from the research: target 60 fps on a specified typical laptop, report frame-time distribution during heavy effects, measure initial transfer size against the proposed 5 MB budget, and verify immediate typing feedback. State hardware, browser, resolution, effects preset, and test passage; targets are not measured achievements.

Recreation acceptance: from a fresh directory and documented tool versions, another developer can install from the lockfile, run the documented checks, build the static artifact, preview it at the GitHub base path, reproduce a seeded race, and deploy through the supplied workflow. Link all docs from the README. Verify that reset/recovery and rollback instructions match actual behavior.

## 12. Current decisions and remaining validation

Confirmed by the user: single-player with computer opponents first, multiplayer friends through a shared game link later, comprehensive reproducible documentation, clear rules/onboarding, cinematic animated opening/loading screens, proper version control/naming, and 100 levels in each of Easy, Medium, and Hard displayed as a rightward node-based progression map.

Proposed defaults needing playtesting rather than blocking initial work: ten chapters per category, all category entry levels available, pace bands, 95% accuracy star, bonus conditions/reward amounts, Driver Rank XP curve, strict one-error correction model, and cinematic duration. Validate engine/plugin versions during M1. Local Git is initialized on main, the verified GitHub owner is sahilshah2904, and the public TurboType remote repository has been created and linked as origin. The user supplied Sahilshah as the repository-local commit author name. Git history records the planning baseline; docs/GITHUB_WORKFLOW.md describes how future changes reach GitHub. No playable game, Pages deployment, performance result, or learning gain exists yet.

### 21 October 2026 preview and audio refinement

User requested a full-width hub preview without side columns, energetic non-race background music and a dedicated 3–2–1 start score. Implement these in Phase 5 with the existing-page Phase 6 visuals; do not postpone them until campaigns. Support personal local soundtrack selection for this visit, including the user's own Misirlou recording, while retaining original shipped music. Pause/countdown/visibility rules and independent game timing remain authoritative. No commercial recording is included or downloaded; explicit recording/device verification remains pending.
