# Phase 3 physical input retest

The pure engine and automated adapter tests do not establish how a real Samsung keyboard emits replacement/composition events. TT-305 therefore remains open until this implemented practice screen is retested. Do not repeat all Phase 2 checks unnecessarily.

## Open the current app

Use the `feat/typing-engine` checkout. If your existing dev server is still running in this shared folder, Vite will serve the changed source. Otherwise start `npm run dev -- --host 0.0.0.0`, as documented in SETUP.md. Use the printed **http** Network URL from a phone on the same Wi-Fi. Select **Practice**, not the foundation's separate Keyboard check. The footer should show 0.1.0-alpha.2.

## Focused cases on Samsung and laptop

1. Start an untimed run. Keys before GO must not enter text. After GO, type the sample normally and note whether any composition/assistance message appears without tapping suggestions.
2. Make one wrong character. Progress must stop with one retained error. Backspace should remove it, then correct typing should continue. Further individual characters behind the error count as errors rather than moving progress.
3. Attempt a predictive word completion. Record exactly what you did: tapped a suggestion versus an automatic replacement. A recognizable replacement or bulk insertion should be rejected with a message, while composition may be accepted and labeled practice-only. Record the actual behavior; do not assume all prediction can be detected.
4. Pause or switch browser tabs, then return and resume. Typed text must remain; active time must exclude the pause and new countdown. Rotating/resizing alone should preserve the run. Navigating to Hub/Settings pauses and preserves practice text for this visit, unlike the free-editing keyboard-check screen.
5. Finish a run. WPM, accuracy and active time must freeze. Restart should clear the run without awarding anything. Try the other passage if needed; this is practice, not campaign progression.

Report device/model, browser/version, OS, keyboard app/version if known, and whether prediction is on. Describe any duplicate characters, unexpected deletions, blocked normal typing, incorrect pause, or input/passage hidden by the keyboard. Include a short recording only if it helps demonstrate a failure. Avoid capturing private keyboard suggestions in publicly committed evidence.

We will fix reproducible issues and add appropriate regression coverage. If an OS path cannot be distinguished, document its practice/eligibility behavior rather than claim a nonexistent prevention. iPhone/tablet testing is separately tracked for release because those devices are currently unavailable to the user.
