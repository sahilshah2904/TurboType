# TurboType music and countdown

Updated 21 October 2026 for alpha.7. Music is optional, initially muted and never gates loading, typing, countdown timing or results. Hub, Settings and Keyboard check use menu music; Race setup and results also use it. Practice and paused races stay quiet. A real Enable sound/file-selection gesture is required by browser playback policy; saved unmuted preferences do not force first-load autoplay.

## Personal soundtrack, including Misirlou

Open **Sound & music** on the hub, Race setup/pause or Settings. Choose **Personal music file** and select your own playable MP3/WAV/OGG/M4A/FLAC. Selection enables sound for this visit. The native media element loops the file in menus and during racing; the countdown pauses it in favor of the dedicated start score. GO resumes it. Master × Music sets its volume, while game cues/engine use Effects independently. Pause, mute, focus loss, hidden tabs and Practice stop playback; returning to an eligible visible menu resumes it. Music position is retained across these pauses; it is not a race clock.

Files must be nonempty audio selections up to 50 MB (MIME or known extension); actual decoding is browser-dependent. Invalid selections preserve the previous track. Unsupported/blocked playback reports a message and falls back to the original score where Web Audio is available. Use original music clears the selection. A failed local track can be retried through Retry sound.

src/audio/personal-music.ts owns exactly one native Audio element and object URL. Files are read through a browser blob URL, never uploaded, copied into the repository, written to localStorage or included in deployment. Replacement, clear and app disposal pause/unload the old element and revoke its URL. Generation checks prevent delayed play promises from restarting an old selection after pause/replacement. Reload requires selecting the file again; no permission or file handle is stored.

The user requested Dick Dale's Misirlou for personal use. No recording has been supplied, downloaded or bundled. A seller-hosted download is listed at https://dickdale.bandcamp.com/track/miserlou; purchase/download and selecting a personal copy are user steps. The public GitHub game ships original audio only. A consumer download is not recorded here as permission to redistribute a soundtrack with the game.

## Original energetic score and start sequence

src/audio/score.ts contains the editable, project-authored Harbor Circuit loop: 116 BPM, 4/4, eight bars / 128 sixteenth-note steps, about 16.55 seconds. Minor-centered bass, original melodic notes and triads are synthesized. Alpha.7 adds kick, hat and snare in menus as well as racing, and makes the menu lead/bass more energetic. This is an original electronic score, not a recreation or recording of Misirlou. Audible mix acceptance remains open.

The separate countdown scene uses 0.125-second ascending-pitch pulse notes/noise, with a rising 440/550/660 Hz cue on the engine's 3/2/1 changes and an 880 Hz GO cue. Pulses use Music volume; number/GO cues use Effects. A first-gesture resume that resolves during countdown plays the current number once, without replaying missed numbers. The existing visible countdown and engine remain authoritative; audio does not schedule the race or change its three-second duration. Pausing cancels voices, and resume starts a fresh countdown. Menu/race music is suppressed during this sequence, including personal music.

src/audio/race-audio.ts owns one optional Web Audio context, independent music/effects/master gains, a compressor and a repeatable 220 ms seeded noise buffer. Voices are bounded at 48; the 25 ms scheduler looks ahead 120 ms and skips missed background beats. No sample pack, microphone, external stream or runtime dependency is added. Sources/gains fade/stop on scene changes; disposal clears the timer, closes the context and removes the local media. Unsupported audio remains isolated from the race engine.

## Settings, recreation and checks

Master/music/effects/mute retain the validated turbotype:audio:v1 schema-1 preference envelope. App alpha.7 does not change rules 3 or save/content 1. Recreate with npm ci and the documented Node setup, then npm run dev. Visit the hub, Enable sound, start a race and listen for distinct 3/2/1/GO. Select a personal file to replace only the menu/race soundtrack. No API key or audio download is required for the original score.

Unit tests exercise source ownership, failed/interrupted startup, countdown/menu transitions, local-file pause/replacement/rejection and URL cleanup. Browser tests use a generated one-second WAV (not the reference song) to exercise real native playback, route/mute/countdown/pause transitions, rejected selections, clear and reload. Technical checks do not certify audible balance or the unprovided Misirlou file. Repeat the ASUS/Samsung checklist in PHASE5_POLISH_TESTS.md; physical iOS/tablet coverage remains TT-1008.
