# Reference recording analysis

Reviewed: 20 October 2026. Source: the user-supplied `Reference_Images/video_reference.mp4`. This is a visual reference, not an instruction source. No soundtrack was evaluated or extracted for use in TurboType.

## Follow-up recordings and revised direction

On 21 October 2026, reviewed video_reference_2/3/4.mp4 using two-second overview and detailed/quarter-second samples. Their metadata, observed timelines, evidence limits and required Phase 5 changes are recorded in [RACE_REDESIGN.md](RACE_REDESIGN.md). The user rejected the boxed race and current cars and now requests one integrated typing surface; that revision supersedes the separate visible passage/input composition. Earlier observations below remain historical. Phase 5 now requires rework, not merely device sign-off.

## Evidence and review method

The local recording is approximately 33.98 seconds, 480 × 1040 pixels, H.264 video with an AAC audio stream. The reported average capture frame rate is approximately 64 fps; this is metadata about the phone recording, not evidence of the game's actual rendering performance. The Instagram UI and filmed monitor reduce the available game detail.

Reviewed a two-second-interval overview and cropped timestamp samples of the game area. The recording opens near the end of a countdown, not at the application's title screen. At approximately 33.5 seconds it shows the victory overlay; it does not show the detailed rewards page supplied in the earlier screenshots. No onboarding, campaign map, garage interaction, or matchmaking flow is established by this clip.

Local extraction used `imageio-ffmpeg` 0.6.0 and the bundled Python/Pillow runtime. The helper package is installed under ignored `Reference_Images/.analysis-tools/`; generated contact sheets and crops are under ignored `Reference_Images/analysis/`. Neither the recording, extracted frames, nor helper binaries are published to GitHub.

To reproduce the review with a local copy of the recording and FFmpeg available:

```powershell
ffmpeg -hide_banner -i Reference_Images/video_reference.mp4
ffmpeg -i Reference_Images/video_reference.mp4 -vf "fps=1/2,scale=240:-1,tile=5x4" -frames:v 1 contact-sheet.jpg
ffmpeg -ss 8 -i Reference_Images/video_reference.mp4 -vf "crop=480:330:0:180" -frames:v 1 sample-8s.png
```

These commands are FFmpeg equivalents of the subprocess extraction used during review; FFmpeg is not on this workstation's PATH. The final command crops this particular recording's monitor region and is not a general video crop. Change the timestamp to compare frames at 0, 1, 2, 4, 6, 8, 10, 15, 20, 24, 26, 28, 30, 31, 32, and 33.5 seconds. Phone-capture time is distinct from the in-game race timer.

## Visible sequence

| Recording time, approximate | Visible evidence | TurboType application |
| --- | --- | --- |
| 0–1 seconds | Last countdown numeral, traffic lights, stationary grid, then GO; in-game timer begins after GO | Explicit ready/grid/racing states; reject pre-start typing |
| 2–4 seconds | Bright horizontal colored trails and a circular burst around/behind the player; an upper notification appears | Layer multiple brief effects and a readable event banner; trigger conditions remain our own design |
| 6–10 seconds | Player moves ahead of rivals; persistent exhaust flame alternates with stronger bursts and thin road streaks | Combine baseline exhaust with a bounded streak celebration; avoid making every frame equally intense |
| 10–24 seconds | Player stays in a useful screen region while rivals recede or leave view; passage scrolls horizontally beneath the race | Separate world progress from screen coordinates and scroll the passage to keep the caret visible |
| Around 20 seconds and 26–31 seconds | Red/pink character feedback appears, followed by later progression | Immediate local error highlighting is supported; exact Backspace/input policy cannot be recovered from the clip |
| Around 26–32 seconds | Checkerboard finish gate enters from the right and approaches the player; rivals return to the visible field | Finish staging should derive from remaining progress and preserve clear relative positions |
| Around 33 seconds | Scene darkens behind a gold-bordered victory card; confetti and a trophy/flag treatment appear | Finalize outcome before animation, then transition to a readable results overlay |

The screen shows five side-on lanes with several vehicle silhouettes, a green player marker, player/rival labels, WPM/position at the top, time on the right, a lower-left gauge, and a single-line typing strip. Completed text becomes dimmer; untyped text remains brighter and the active caret is accented. The victory card reports first place, 57 WPM, and 93% accuracy, consistent with the screenshot reference.

## Limits and decisions

Visible effects do not establish whether nitro changes actual race distance, whether opponents are human, or how accuracy is calculated. We cannot infer input events from a filmed keyboard or reliably measure sub-frame animation timing through this recording. The engine and implementation remain unknown.

Retain TurboType's documented correction-required typing, progress-based placement, visual-only nitro, seeded CPU opponents, and precise finish timestamp. Use a stable passage strip with an optional larger/multiline presentation for readability. Never attach gameplay start/finish or rewards to animation completion.

The reference does not replace the original campaign plan: TurboType still has three 100-level maps, learning drills, onboarding, cinematic loading artwork, and a later friends-multiplayer phase.

## Original music and sound direction

Proposed sound identity: instrumental electronic racing music with synthwave/arcade textures, restrained percussion during reading, and stronger layers for sustained clean typing. This is a creative brief, not a selected song or shipped asset.

- Menu/garage: a calm looping instrumental bed with a short original TurboType identity cue.
- Race: one musically coherent loop with optional percussion/bass/intensity stems. Mix stems smoothly from recent typing pace and clean streaks; do not abruptly change tempo on each keypress.
- Finish: a short original victory sting, with a gentler completion cue for other placements. Separate this from background music and effects controls.
- Accuracy feedback: brief, soft cues; avoid punishing repeated alarm sounds. Engine and nitro remain audible without drowning out the music or passage-focused experience.
- Technical behavior: unlock audio from Enter, preserve mute and independent volume controls, preload essential short cues, lazy-load the longer music, and crossfade on screen transitions. A missing/blocked track cannot block the race.
- Source policy: use an original composition or an asset with explicit redistribution rights. Record creator, source, license, modifications, loop points, export settings, and attribution in the asset register. Do not use the reel's song or music ripped from another game. Do not claim music is owned, licensed, composed, or installed until that work is completed.

Audio implementation will use the existing planned Phaser sound controller first. Add another library only for a demonstrated capability gap. Keep music optional, with mute available from the entrance screen. Verify loop seams and transitions during actual play, including pause/resume, tab hiding, rapid retries, and muted startup.
