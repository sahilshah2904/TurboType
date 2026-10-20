# Phase 1 audit: rules, rewards, pace, and storage

Status: design baseline, 20 October 2026. These are explicit starting defaults for implementation and testing, not implemented features or playtested balance. This document resolves omissions/ambiguities in the broader game plan; update both documents when a decision changes. Future implementation rulebook and save documentation must describe the actual shipped behavior.

Scope update: [responsive and online architecture](./RESPONSIVE_AND_ONLINE_ARCHITECTURE.md) supersedes the former local-only public launch decision. The local snapshot rules below now describe guest saves/cache; optional permanent-account cloud sync is required before the public single-player launch. Shared race-room infrastructure still follows in multiplayer.

Implementation update: [GAME_RULES.md](GAME_RULES.md) is the current rulebook (rules version 3, including Quick Race CPU/results). It defines actual countdown/timeouts, correction/metrics and practice-only treatment of committed composition or attempted assistance. Planned rewards and storage below are not implemented by the practice screen.

## Coverage audit

| Concern | Baseline decision | Implementation evidence required |
| --- | --- | --- |
| Countdown | 3, 2, 1, GO at one-second intervals; start after the third interval when ready and focused | Timer/input race-boundary tests |
| Typing rules | Exact case/spacing/punctuation; append-only race input; one unresolved error; correction required | Input, composition, repeated/multi-character input and paste tests |
| Mistake penalty | Progress stops, streak resets, accuracy records the failed attempt; time to correct is the penalty | No progress/time advantage or extra hidden punishment |
| Backspace | Removes the latest entered character; historical attempts remain; deleting correct text reduces progress | Correction example and deletion/retyping tests |
| WPM/accuracy | Five characters per word; exact elapsed active time; attempt-based accuracy | Formula, zero-time and threshold-boundary tests |
| Game pace | Seeded CPU profiles fixed before race; current validated prefix determines progress | Repeatable schedules independent of display refresh rate |
| Streak/nitro | Reward novel correct positions; visual-only nitro every 20 streak characters, with cooldown | Error reset, retype exploit and cooldown tests |
| Win/finish | Complete exact passage; timestamp before celebration; tied times share place | Finish order and animation-independent outcomes |
| Pause/restart | Solo pauses freeze all timing/bots; paused completion is practice only; restart abandons | Pause eligibility and no duplicate reward tests |
| Campaign | 100 levels per category; all category level-1 entries open; clear unlocks next in same category | All manifests valid; boundaries and cross-category isolation |
| Bonuses/rewards | Deterministic, cosmetic, receipt-protected; exact defaults below | Receipt/idempotence and threshold-crossing tests |
| Results/learning | Race metrics, chart, eligibility, rewards, one evidence-based practice suggestion | Results derived from real inputs; no fabricated history |
| Storage/database | Prototype uses local versioned saves; public release adds optional account/cloud progress alongside local guest play | Migration, recovery, ownership, cross-device sync, conflict and retry/idempotence checks |
| Intro/audio/accessibility | Real loading status, skippable decoration, mute, motion preferences and readable text | First/returning visit and failure-path review |

## Concrete race defaults

- A ready state requires essential track resources and enabled input. Run a one-second 3, one-second 2, and one-second 1; GO begins the active timer. Start uses a monotonic timestamp, not the end of an animation callback. Pre-GO input is ignored and cleared. Abort countdown to the ready/pause screen if focus is lost.
- Solo resume uses a three-second countdown; its time is excluded. A run that pauses after GO remains practice-only for stars, unlocks and personal records, even if it later resumes.
- Quick Race and campaign default to exact-passage completion without a maximum time. Timed practice/time trials must declare their limit separately. There are no timed main campaign levels in the initial baseline. A timed mode records DNF at expiry if unfinished.
- Four CPU schedules are selected from the level/category's declared speed band, include their reaction/hesitation time, and remain fixed through the run. CPU speed does not secretly react to player rank. The initial table in the game plan supplies category ranges; per-level definitions are production work.
- Recent pace uses a three-second active-time window of correctly committed character attempts, with a gradual display/audio response. It never changes validated progress. Final WPM uses passage length and the full active duration.
- Each new 20-character clean-streak milestone is a visual nitro candidate. A burst lasts 800 ms with a minimum two-second active-time gap between burst starts. Milestones reached during cooldown do not queue extra bursts. An error resets the streak. Backspace alone does not award streak progress; retyping previously reached positions cannot advance it. Effects off leaves streak metrics intact.
- An overtake callout requires a genuine rank improvement, has a two-second active-time cooldown, and does not fire merely because a rank label refreshes. Shared ranks are handled consistently with the race engine.
- Results show average WPM, accuracy, exact elapsed time, rank, completion/practice/DNF status, longest streak, correction/error counts, and an active-time pace series. Display WPM/accuracy to one decimal, elapsed time to one decimal, with raw values used for eligibility. Do not confuse total attempted characters with final passage length.
- Define error count as incorrect committed insertion attempts (including blocked inserts behind an error). Define corrected-error count as unresolved error characters removed by Backspace; this can be lower than error count. Document both labels clearly.

## Exact initial reward table

Let `A = correctAttempts / totalAttempts` in [0,1]. A completed, unpaused main race or Quick Race grants:

```text
accuracyXp = floor(50 × A)
placementXp = 25 for first, 15 for second, 10 for third, 0 otherwise
ordinaryXp = 50 + accuracyXp + placementXp
ordinaryCredits = 10 + floor(10 × A)
```

Exactly tied racers use the same placement bonus for their shared position. Paused completed races grant only 50 XP and 10 credits. Abandoned/DNF runs earn no completion reward. Tutorial, calibration, and freeform drills do not grant ordinary race credits/XP; their purpose is learning. Optional bonus challenges use their explicit first-completion award below. Replayed races can earn ordinary rewards again, with a new race ID, but never duplicate a prior receipt.

Campaign rewards stack only where their visible conditions overlap:

| Award | Initial numeric default | Eligibility / receipt |
| --- | --- | --- |
| First main-level clear | +20 XP, +5 credits | Once per category-qualified level, unpaused completion |
| Pit stop at levels 5, 15, …, 95 | +50 XP, +20 credits | Once per category/level in addition to first clear |
| Chapter completion at 10, 20, …, 100 | +100 XP, +40 credits, specified badge/cosmetic | Once per category/chapter |
| Star-cache threshold at 30, 60, …, 300 category stars | +100 XP, +25 credits | Once per category/threshold; award every newly crossed threshold |
| Perfect lap | +25 XP and mark | Once per level, 100% accuracy on an unpaused completed run |
| Recovery badge | Badge only | Once locally; correct an error, then reach 20 novel clean positions in the same unpaused completed run |
| Optional chapter challenge | +50 XP, +10 credits | Once on eligible unpaused challenge completion; replay is free and unawarded |
| Category finale | +500 XP, +100 credits, specified vehicle appearance | Once on level 100 clear; stacks with chapter/first-clear awards |

Show the reward breakdown before claims/celebration so the player understands why each award was earned. Store stars independently across eligible completed runs: completion, accuracy ≥95%, and pace ≥level target. Check thresholds using raw counts/time, never rounded display values. No cash purchases, speed boosters, reward randomness, lives, or star gates on the main route.

The initial minimum bonus-challenge goal is completing the short precision passage correctly in an unpaused run; accuracy/pace targets may grant decorative recognition but do not block the stated completion award. Final passage/challenge assets and cosmetic assignments must be authored before release; the reward engine cannot ship references to missing items.

Driver Rank follows cumulative XP `100 × (R−1)²`; derive rank from cumulative XP, never maintain two conflicting writable totals. Numeric values are balancing defaults, reviewed during playtesting, with a documented version change if eligibility changes.

## Storage architecture: what “store everything” means

**Local prototype and guest mode:** keep essential progress in a namespaced, versioned browser-local save. A player's progress does not live in GitHub commits and is not uploaded to the repository. Guest data persists only in that browser/origin, can be cleared or edited, and does not follow them to another device. Before public single-player launch, add optional permanent-account cloud progress through an external service, with local caching, explicit save/sync states and server-side validation. See the responsive/online architecture for the proposed provider and data contracts.

Persist these logical data groups:

| Group | Fields / policy |
| --- | --- |
| Header | Save schema version, monotonically increasing local revision, update timestamp, rules/content versions |
| Profile/settings | Local display name, tutorial completion, chosen category, audio/motion/quality/text preferences |
| Campaign | Completion and star flags per stable level ID, perfect marks, relevant record references, per-category selected/scroll positions |
| Economy/garage | Cumulative XP, credit balance, owned/equipped cosmetic IDs, one-time reward receipts |
| Records | Best eligible records keyed by event/content/rules conditions, final metrics and timestamp; keep paused/practice records separate |
| History | Latest 100 completed/DNF race summaries with IDs and bounded pace samples, not an unbounded keystroke log |
| Learning aggregates | Per-character attempt/error totals and bounded timing summaries for game input only; label small samples |

Store no raw hardware-key log, passwords, or unrelated activity. Retain no raw per-keystroke event history after summarizing a completed run. Save compact summaries and one-time receipts; do not keep every ordinary replay receipt indefinitely. One-time receipts cover the bounded campaign/bonus achievements. Retain recent applied race IDs with history; obsolete ordinary-race receipts may be removed only after the app has no replayable pending result for that ID. Do not resurrect a pending result from a URL or arbitrary UI state.

Use a single validated save snapshot for each reward/progression update so clear state, awards, and receipts are serialized together. Save committed rewards before showing them as granted. If persistence fails, show “not saved” and provide retry/export recovery rather than claiming durable progress. Handle blocked storage/quota errors with an explicit in-memory mode; warn that the session's progress will be lost on close. Do not clear the existing save silently.

Keep the serialized primary snapshot below a proposed 1 MiB application budget by bounding history, chart samples, and aggregates; this is our budget, not a universal browser quota. Validate runtime data, known IDs, versions, finite values and bounds. Recover from malformed/unknown-version saves without overwriting the original; offer export and explicit reset. Document and test migration from every shipped schema version.

Add user-triggered JSON export/import in release 1: validate the entire file before applying it, require explicit confirmation to replace current progress, explain that backups replace rather than merge saves, and never rerun reward logic on import. Corrupt/untrusted imports are rejected with an explanation. A second tab must not silently overwrite active progress: detect another active writer where supported and offer read-only/reload behavior. Specify and test the detailed ownership mechanism during storage implementation.

**Public release 1** adds optional account-backed cross-device sync before launch, while **release 2** adds an authoritative multiplayer service and match data using that identity/persistence foundation. Plan schemas/interfaces now, choose and validate the persistence provider before cloud integration, and finalize room/reconnection policies during multiplayer development. Keep client-run solo results and verified online records distinct; do not trust imported local balances as verified online currency. The frontend remains on GitHub Pages. Neither service exists yet.

## Baseline completion and remaining work

The audit found the major features were already planned, but numeric rewards, cooldowns, bounded persistence, export/recovery behavior, and consistent untimed campaign policy needed sharper definitions. This document supplies those defaults.

Planning is now sufficient to start the application foundation. Package compatibility, actual level content, exact data types, art/music production, measured performance, learning effectiveness and reward balance still require implementation and testing. Do not describe them as finished. Track phase status in [PROJECT_STATUS.md](../PROJECT_STATUS.md).
