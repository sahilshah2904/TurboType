# Alpha.12 final laptop checks

Current target: laptop/desktop with a physical keyboard. The user accepted the starter silhouettes, restored graphite/crimson/cyan palette, Ignition/Overdrive music, typing/dial and pause/resume/retry. Do not ask for repeat aesthetic approval or phone testing. These checks cover the latest selector/control changes and physical performance.

1. Refresh and confirm footer `0.1.0-alpha.12`. Choose a different starter in Race, visit the hub, then refresh: the selected car should remain. The hub must have no sound controls.
2. Start, type part of the passage, pause and choose another car. Text, elapsed time and standings must remain frozen. Resume, then retry: retry clears the run while retaining the chosen car.
3. In Settings, enable/mute sound and adjust volumes. Return to the hub and race: the preferences must apply; sound controls appear only in Settings.
4. Play for about five minutes with repeated retries. Compare High, Low and Reduced motion, resize the laptop window and check at normal zoom. Report delayed letters, visible judder, hidden text, audio interruptions or worsening behavior over time. Include browser/version and Windows version with the known ASUS laptop model.

Automated evidence: 93 unit / 30 browser cases; final preview-exhaust/CSS cleanup passed build and four affected garage/audio cases. Hosted PR run 39578558652 passed for implementation 722ee85. These checks cover selection, storage failure, input, results, scene cleanup and supported widths; they do not certify physical keyboard-to-paint latency or presented frame rate.

Developer work remains: TT-501/510 separate body/wheel parts and actual rotation (current wheels have baked artwork plus rotating highlights); TT-505/506/511–513/522 hardware performance tracing/tuning, final evidence and PR #4 integration after acceptance. Current software-renderer callback tails remain documented in PERFORMANCE_ALPHA11.md. Do not close Phase 5 from CI alone.

After these gates: Phase 6 cinematic loading, welcome/rules, interactive tutorial and optional calibration. Ten campaign reward cars (TT-911) stay future Phase 8/9 scope, not a Phase 5 prerequisite.
