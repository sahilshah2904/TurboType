# Phase 4 available-device race check

Pending user verification (TT-404). Use the ASUS laptop and Samsung S25 Ultra; unavailable iPhone/tablet tests remain release work. Do not repeat every Phase 3 typing test: this round checks the new race integration and actual keyboard space.

1. Open `/TurboType/#/race` in the current preview (footer 0.1.0-alpha.3). On Samsung use the printed **http** Network URL and the same Wi-Fi. Wait for the track to load. Start with easy, First keystroke, untimed, seed 42.
2. Start the race. Before GO, typing should not count. After GO, correct typing should move your car and update the live list. Enter one wrong letter: your progress should stop until Backspace correction while the CPUs continue. There should be four explicitly labeled CPU opponents.
3. Pause, wait about ten seconds, and resume. Everyone's progress and active time should freeze during pause and the resumed countdown. Visit Settings and return to Race: preserve the paused race and text. Rotate the phone with its keyboard open; text should remain. Report if the passage/input is hidden, controls are unreachable or the view jumps unexpectedly.
4. Finish. Check your actual place, accuracy and time, then wait a few seconds: results must stay frozen. CPU finishes after yours must be labeled simulated. Retry same race should clear your run and keep seed 42; New seed should change it to 43.
5. Optionally choose hard and wait for CPUs to finish first; you should still be able to finish. Then select the 60-second time trial, enter only a few characters and wait: stop at 60 active seconds with an unfinished/DNF result, not a fabricated finish.

Report which steps pass/fail on each device, plus browser/version and Samsung keyboard app/version if available. Screenshots or a short recording are useful for failures; keep private suggestions out of public evidence. This preview has no rewards or persistent results. Native keyboard assistance limits/policy are unchanged from [GAME_RULES.md](GAME_RULES.md).
