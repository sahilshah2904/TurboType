# Alpha.14 final physical laptop check

Completed and accepted on 22 October 2026: user reported “I believe everything worked fine.” Reviewed two-minute recorder evidence has 100 trusted racing keys and zero page errors; see TESTING.md and performance/alpha14-physical-input.json. The checklist below is retained for reproduction, not a request to repeat acceptance. Broader release testing remains Phase 10.

The accepted palette, silhouettes, music and earlier functional reports remain accepted. This is a short check of the newly independent parts and physical responsiveness, not another preference review. Automated regression and actual-GPU synthetic-input evidence are separate from your physical typing report.

1. Keep the existing development server running. In the project terminal run `node scripts/profile-laptop-input.mjs`. It opens a separate hardware-accelerated Chromium test profile for two minutes; leave that test window open until it finishes. It does not touch your normal browser profile or automate typing.
2. Choose a starter, Start and physically type at least 20 keys. Make and correct one mistake; pause/resume, then retry. Watch for detached/double wheels, wheels jumping on resume, or visible typing/animation delay. Try another starter on the new race. Use Settings to compare Low effects and Reduced motion; enable audio if desired and note dropouts rather than reconsidering the accepted tracks.
3. Report whether the new parts/typing feel good and any stutter, wheel artifact or sound dropout. At your normal zoom, also check fullscreen/restore and readability if you have not tried the alpha.13 changes yet. No repeat phone/tablet checks are needed.

The script writes `Reference_Images/analysis/alpha14/manual/session.json` locally. It records GPU/browser, trusted key counts, errors, scene counts and key-handler-to-next-rAF samples, without typed characters. Fewer than 20 racing keys is insufficient evidence and returns a failing exit status. Handler-to-rAF timing is not physical OS-to-photon latency; your perceptual report remains necessary. The developer must inspect this file and your report before closing TT-506/513/522 and integrating PR #4. If the temporary window closes early, the recorder reports an incomplete session instead of a pass.

## Earlier alpha.13 focused checks

The user reported the other alpha.12 laptop checks good. Do not repeat car/music/palette approval or the already reported checklist. Alpha.13 changes only the car lock, fullscreen placement, readability and CI reliability.

1. Refresh to alpha.13. Choose a car, start and pause: car selection must be unavailable. Resume keeps that car; retry/new race permits another selection.
2. Try the top-right expand/restore symbol on Hub, Race, Practice, Keyboard check and Settings. It should enter/exit fullscreen, remain visible and show feedback if the browser refuses.
3. At normal laptop zoom, read the hub descriptions, setup/help, Settings and result text. Resize the window and check that important copy and buttons remain readable/reachable. Prose/controls target 16px+, compact metadata 14px.

Developer work: exact-source local/hosted regression checks, laptop captures, separate body/wheel parts and measured hardware performance tracing/tuning. User acceptance of smoothness is separate from presented-frame-rate/input-latency certification. TT-522 stays open; do not close Phase 5 from CI alone. Existing phases and future ten-car rewards remain unchanged.
