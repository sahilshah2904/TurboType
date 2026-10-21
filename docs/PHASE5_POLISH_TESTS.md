# Alpha.8 integrated race, preview and audio acceptance

Updated 21 October 2026. The user accepted the TT-507 kart direction, but this production integration and new speedometer still need available-device acceptance. Use the normal app at /TurboType/ on feat/race-polish, not the separate docs/design prototype. Hub footer should show 0.1.0-alpha.8. No iPhone/tablet is required from the user for this round; their unverified coverage remains a release task.

1. On ASUS/Samsung, open Race and start it. Confirm scenery/road fill the browser width, there is one visible typing strip and the gauge does not cover cars. The setup/pause/results controls may use an overlay; there should be no enclosing webpage card or unused side gutters.
2. Type steadily and watch Live WPM rise. It measures correct typing over up to three active seconds, while the upper HUD/results use whole-run average. Stop for more than three active seconds: live pace should return to zero. Pause: the gauge and clock freeze. Resume has a fresh countdown. Retry resets the gauge. The needle tops out at 160, but faster numeric readings are not clipped.
3. Make a mistake: your progress/exhaust stops while CPUs continue. Correct with Backspace. Build a 20-character clean streak to see longer crimson nitro exhaust. Pause and finish should stop normal movement; retry clears old effects. Results freeze independently of animation. Review the palette variants; the distinct fleet remains future work.
4. On Samsung, tap the typing strip, open/dismiss/reopen the native keyboard and rotate. Check active-character visibility, space above the keyboard and preserved text. Try a longer passage and Larger typing text; wrapped text should keep the caret readable. If the browser pans or hides the strip, report browser/OS/keyboard and orientation.
5. Visit The hub, Practice, Keyboard check and Settings. Confirm a consistent open world layout, readable controls and usable navigation. Practice has the integrated strip/dial; Keyboard check deliberately accepts free editing/paste. Set Reduced motion/Larger typing text/Low effects, refresh and confirm persistence. Try returning to a paused Race/Practice session.
6. Enable original Sound & music and check countdown, engine, race/menu and finish balance. Pause/switch tabs/navigate to Practice: racing audio should stop. Mute/slider preferences should persist. There should be no personal-file option in the current app; Nightforge and Overdrive are the shipped originals.
7. Compare Full/Low/Reduced motion. Report stutter, typing delays, hidden controls or loud/clipping sound, with model/browser/settings and a short recording where possible. The old SVG renderer's headless profile does not certify this PNG/full-viewport renderer. Optional fullscreen should fail harmlessly if unavailable.

Direction approval does not close TT-505/506/510/513/515. Record actual device observations separately from emulated layouts, synthetic WPM screenshots and software-renderer measurements. Phase 6 opening/tutorial/calibration, Phases 7–9 maps/content/progression and public launch remain separate work.


## Current palette and original score review

- Widen/narrow the ASUS browser and rotate Samsung: the preview must fill its width and the graphite/crimson/cyan world should replace the old burgundy wash. Check text/cyan caret/amber corrections at comfortable brightness.
- Enable Sound & music on the hub. Nightforge should accompany navigation across Hub, Practice, Keyboard check and Settings. There must be no music-file chooser.
- Start a race: 3–2–1 should use a distinct pulse/rising cue, followed by faster Overdrive. Pause freezes gameplay and stops music; resume repeats the countdown. Results return to Nightforge.
- Listen through at least two complete loops of both tracks, checking joins, bass/lead/hat balance, countdown prominence and engine loudness. Try master/music/effects sliders, mute, tab/background interruption and repeated retries. Record device/browser/OS/headphone/speaker details. Automated tests do not certify listening quality.
