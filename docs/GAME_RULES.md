# Implemented rules — version 3

Typing was implemented in Phase 3; Phase 4 adds four-CPU Quick Race in app 0.1.0-alpha.3, rules version 3. Practice still has no opponents. Both modes save no results, rewards or progress. Planned campaign/rewards remain in GAME_DESIGN_PLAN.md and RULES_AND_STORAGE_BASELINE.md.

## Start, timing and finish

Select a passage and either untimed completion or the explicitly labeled 60-second time trial. Start focuses the real input and starts a three-second countdown. Pre-GO edits do not count. GO uses the countdown's monotonic deadline, even if a screen refresh happens late; it does not depend on animation completion.

Only active racing time is counted. Escape, Pause, window focus loss, document hiding or leaving the practice screen pauses an active run. Text and metrics remain in the current app session. Resume has another three-second countdown, excluded from active time. Any pause after GO permanently marks that run practice-only for future record eligibility. Canceling the initial countdown returns to ready without that penalty. Rotation/viewport resizing alone does not pause or clear text.

Finishing means completing the exact passage without an unresolved error. Record the timestamp on the final character and freeze metrics immediately. At a timed event's exact expiry, timeout takes precedence over input; partial text remains with an unfinished result. Untimed runs have no deadline. Restart abandons the old run and creates a fresh ready engine. Page reload, HMR or closing the page ends this unsaved practice session.

## Exact text and correction

The current passages use printable English ASCII characters, 1–2000 characters, including exact case, spaces and punctuation. This is a bounded initial content contract, not multilingual/grapheme-aware support.

Input appends at the end. A wrong character is shown in the field, and the expected passage position is underlined/error-colored. Only one unresolved wrong character is retained. Further individual characters behind it count as incorrect attempts without moving progress. Use Backspace to remove the error; then enter the correct character.

Deleting correct text reduces validated progress. Attempts already made remain in accuracy history. Backspace is not a character attempt. Selection replacement, forward deletion and undo are not shortcuts around the append-only rule; unsupported editing is rejected with guidance. Engine ticks do not rewrite unchanged field values or continually steal native selection.

Example: expected `cat`; enter `c`, `x`, Backspace, `a`, `t`. The result has 4 character attempts, 3 correct attempts, 1 error, 1 corrected error and 75% accuracy. Entering more characters behind the `x` adds incorrect attempts, but still retains only that one displayed error. A mistake costs correction time and resets the clean streak; there is no hidden extra time fine.

## Metrics and streaks

- Progress = validated prefix length / passage length.
- Average WPM = (validated characters / 5) / active elapsed minutes. Zero elapsed time yields zero WPM. Display one decimal without rounding stored values.
- Accuracy = correct committed character attempts / all committed character attempts × 100. No attempts displays an unset value. Corrections do not erase previous errors.
- Error count = incorrect character attempts; corrected errors = unresolved wrong characters removed with Backspace. The latter can be smaller.
- Recent WPM uses correct attempts in a rolling three-second active-time window (or elapsed time so far if shorter); average and recent pace are separate concepts. The current screen shows the whole-run average.
- Clean streak grows only at newly reached furthest passage positions. Repeated deletion/retyping cannot farm streaks. Errors reset it; longest streak remains recorded for that run.
- Every twentieth clean-character milestone can trigger a visual nitro event for 800 ms, at least two active seconds after the previous burst started. Milestones during cooldown do not queue. Nitro never adds progress or changes finish eligibility. The Phase 3 UI shows a status accent; the race effects arrive later.

The core also implements validated standing ordering used by Quick Race: finish time first, then unfinished progress; exact ties share competition places (1,1,3). IDs only break display-order ties using deterministic lexical ordering. The practice UI does not invent a placement without opponents.

## Keyboard assistance and composition

The input requests autocorrection/capitalization/spellcheck/autocomplete off, but a website cannot force every OS keyboard to comply. This is particularly relevant to the Samsung S25 Ultra word-completion finding.

- Reject identifiable replacement, paste/drop and non-composition bulk insertion; leave canonical engine text unchanged. An assistance attempt during racing marks the run practice-only and does not add fake character attempts.
- Recheck actual DOM input values even when beforeinput is absent/non-cancelable. Unsupported earlier-text replacement cannot overwrite accepted engine text.
- Composition updates are temporary. On composition end, commit newly appended text once, count its characters once, and ignore an identical trailing final input. Appended multi-character composition is accepted, rather than falsely classifying all IME text as a pasted word.
- For the initial English comparison policy, **composed input is practice-only**, not a cheating accusation. It can otherwise be indistinguishable from keyboard prediction. Ambiguous input cannot be advertised as verified unassisted typing. Some assistance may still be emitted as indistinguishable individual inserts; no complete anti-cheat guarantee is made.
- If pause/navigation interrupts composition, discard pending composition and restore the last committed text. Do not apply it after resume or double-count it through a queued callback.

The engine reports reasons such as paused, blocked assistance and composed input. “Eligible” means only that this local finished run had no recorded disqualifying condition; it is not server verification. No practice-screen metrics are published or awarded as records.

This policy originated in rules version 2 and remains unchanged in version 3, clarifying assistance/composition and timed states before any progress data ships. Save schema version remains 1 because only foundation display preferences are persisted. A later provider must snapshot rules/content/input-profile conditions with every stored result.

## Quick Race and CPU results (version 3)

Quick Race reuses all typing/correction/assistance rules above. Four named CPUs use immutable seeded per-character schedules, fixed before GO, with declared target pace, reaction, hesitation and correction delays. Their progress uses the same active elapsed clock as the player. Pausing freezes everyone; neither render frequency nor player rank changes the schedules. The quick tiers are independent of future campaign categories.

CPUs finishing first never stop an untimed learner. A player finish freezes live state and derives remaining CPU outcomes, explicitly labeled simulated in results. Future CPU finishes within a timed deadline are simulated; future CPUs beyond the deadline are simulated DNFs. On actual time expiry, unfinished entries are DNF with no invented finish times. Abandonment stops remaining lanes at observed progress. Exact ties share places; display-rounded times are never used for ordering. Retry same race resets player state with identical schedules; New seed deliberately changes the opponent schedule seed.

The graphics must load before Start is enabled, with explicit text-standings fallback after failure. Missing graphics/context loss during racing pauses the shared clock. Results, rewards, account data and campaign unlocks are not persisted. [QUICK_RACE.md](QUICK_RACE.md) specifies generator ranges, reproducible setup, cutoff semantics and cleanup in detail. Rules version 3 adds these race semantics; the existing typing policy is unchanged.

## Verification and remaining gate

Pure tests cover correction, zero time, blocked errors, monotonic timing, pause/resume, timeout boundaries, finish freeze, retyping, nitro, invalid content and shared places. Browser tests exercise the adapter/state/UI under desktop/phone/tablet Chromium profiles, including replacements without beforeinput and composition with a trailing final input. These are not physical keyboard event traces.

**TT-305 accepted on 20 October 2026:** the user reports the focused strict-input cases working on ASUS and Samsung S25 Ultra, with laptop screenshots. See PHASE3_INPUT_TESTS.md and TESTING.md for scope and evidence limits. Native prediction event traces and exact environment versions were not supplied. Physical iPhone/tablet coverage and environment metadata remain TT-1008; no universal assistance-detection claim follows.
