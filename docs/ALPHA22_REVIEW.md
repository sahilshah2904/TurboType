# Alpha.22 user review follow-up — 23 October 2026

The user accepted unpaused unlock/refresh, replay deduplication, and paused/practice-only then eligible retry. Keep that acceptance; do not ask them to repeat it. Paragraph look-ahead remained a problem. User also requested meaningful keyboard coverage, clarification of Quick Race and a car-following opening fire trail that does not cover the title. Changes stay in open PR #7; no merge or Phase 8 start.

## Changes

- Wrapped Larger typing text now top-aligns the active visual line as soon as it changes. Three complete 42px lines fit in a 134px viewport, with trailing space so the final line can also align. Race, Practice and learning screens share the same caret-follow helper. Backspace across a wrap follows the previous line immediately; no smooth-scroll delay, font reduction, score or timing change. The race scene reserves 200px for the larger console.
- Navigation says **Quick Race**. Its setup explains standalone warm-ups/car-track experimentation with selectable passage/CPU pace. It uses seeded CPUs and session results, never campaign progress; it is not the category campaign or a promise of random new passages.
- Keyboard check has lower/uppercase pangrams, all ten digits and every printable English ASCII symbol. 68 common physical typing/editing/modifier keys show detected presses independently of sample matching. Paste/free editing/IME diagnostics remain available; pasting a matching sample does not mark physical keys as tested. Tab keeps ordinary focus navigation. Browser/OS/Fn shortcuts may be intercepted, so this is not a hardware certification or a test of keys the browser never receives. Detection lasts only for this visit; Reset key check clears it.
- The opening road flame/glow is a bounded child of the animated car, behind it with a small gap, so it cannot paint ahead of the car. It fades during the stop/reverse and ends before the title reveal. Remove the full-screen road ribbon and crown across the title. One smaller flame accent stays beneath/behind the title, with the name above the driving layer.5.6-second timing, wheel/smoke choreography, Skip, readiness/failure cleanup and static Low/Reduced modes remain.

## Verification

Fresh complete local check passes 117 unit/79 browser cases with one worker. Current evidence/limits: TESTING.md. New tests cover line2→top and line3→top/backspace at 1024/1920 with actual typing, all printable sample characters, physical-key vs pasted-text coverage/reset, bounded flame geometry/timing at 1024/1920, and standalone Quick Race copy. Existing campaign/typing/IME/audio/garage/onboarding suites stay enabled; navigation selectors use the new Quick Race label.

The prior exact-head hosted run 39812462848 for 1c94952 failed after 30.2 minutes of browser execution: 116 units passed,42 browser cases passed and widespread timeouts/browser-context protocol errors affected unrelated existing screens. Some context setup failures occur before application code runs. Logs are retained ignored at Reference_Images/analysis/phase7-ci-failed.log. This is a real failure, not a pass inferred from prior run39810973647. Hosted and local checks now isolate software-rendered Chromium with one worker, retaining every case, retry policy and 30-second timeout. A local two-worker attempt also showed long-text timeout pressure and was stopped before the isolated rerun. A fresh exact-head hosted result is required before integration. Do not claim the worker change proven until that check passes.

## Focused user checks

Use http://192.168.0.31:5173/TurboType/ on the existing server.

1. Open a longer unlocked race with Larger typing text. When typing crosses into the second line, it should move to the top immediately, keeping following words/lines visible. Check the next wrap and Backspace over a wrap.
2. Keyboard check: type the sample and try numbers/symbols, Shift, Backspace and arrows. Indicators turn green for received presses; Clear text keeps detections and Reset key check clears them.
3. Settings → Replay opening: no fire ahead of the arriving car, a short trailing flame on arrival/launch, no road ribbon left across TURBOTYPE. Name stays readable. Low/Reduced remain static.

TT-608 broader atmosphere visibility/visual polish stays deferred. Phase 8 still authors all 300 reviewed passages/bonuses; reward ownership and full guest/cloud saves remain Phase 9.
