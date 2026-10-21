# Original TurboType soundtrack

Alpha.8, 21 October 2026. The user rejected the earlier Harbor Circuit oscillator loop and explicitly requested removal of personal music. The normal app now ships two different original rendered instrumental masters. No upload/chooser, object URL, personal file loader, downloaded sample, Misirlou recording or external music service is used.

## Tracks and composition

| Context | Original track | Arrangement | Tempo / length |
| --- | --- | --- | --- |
| Browsing Hub, Practice, Keyboard check, Settings; Race setup/results | Nightforge | Spacious minor extended chords, plucked motif, rounded bass, restrained breakbeat and circular delay | 96 BPM, eight bars, 20 seconds |
| Active race | Overdrive | Driving kick/snare/hat pattern, distorted low bass and power-chord pulses, separate lead hook, fills and a breakdown | 150 BPM, sixteen bars, 25.6 seconds |
| 3–2–1 | Start sequence | Separate pulse bed and rising 440/550/660 Hz number cues, then 880 Hz GO | Existing authoritative three-second engine countdown |

These are new project-authored arrangements and instrument synthesis, not a remix of the earlier loop or a recreation of film/game music. The menu and race masters have different melodies, keys, tempi and drum patterns. Paused races stay quiet; browsing tabs uses Nightforge. Resume starts the countdown again and then Overdrive. Race results return to Nightforge. Master/Music/Effects controls remain; audio starts after a real Enable sound or remembered-unmuted Start gesture. Browser policy may require another click after interruptions.

## Recreate the assets

Use the pinned Node version, then run:

```powershell
node assets-source/build-soundtracks.mjs
npm run check
```

The deterministic generator contains every note, rhythm, envelope and synthesized instrument. It renders kick pitch sweeps, filtered-noise percussion, harmonic bass/chords/lead and circular delay tails offline. A fixed seed produces repeatable noise. Tails wrap at loop boundaries, DC is removed and soft saturation/normalization reserves headroom. No package, instrument bank, sample license or audio tool installation is required. Format the generator with the existing project formatter when editing it.

Outputs are public/assets/audio/nightforge.wav and overdrive.wav, mono 22050 Hz, 16-bit PCM WAV for broad decoding compatibility. They total 2,011,048 bytes (about 1.92 MiB); rendering is build-time work rather than a realtime oscillator arrangement. soundtracks.json records duration, tempo, peak, RMS and SHA-256. Peak is 0.84 full scale; RMS is about 0.1144 for Nightforge and 0.2127 for Overdrive. These measurements prevent digital full-scale clipping but do not certify perceived mix quality. Tracks can be auditioned directly from their WAV files.

## Runtime ownership and failures

src/audio/score.ts is the small track manifest; race-audio.ts owns playback. No music download happens before an unmuted sound gesture. Both same-origin WAV assets load through the Vite base URL and decode once into the existing AudioContext. One loop source plays through the Music bus, with a compressor/master bus shared with independent Effects. Decoded buffers occupy about 8.35 MiB at 48 kHz mono, before browser overhead; measure real devices before launch. There is no repeated per-note music scheduling during menu/race playback.

Scene changes stop the old loop with a short gain fade, reset its source and select the appropriate buffer. Countdown uses its independent bounded pulse scheduler and FX; loading cannot delay the race or change results. First-gesture unlock plays the current countdown number once if needed, without replaying missed numbers. Mute, hidden/focus loss, pause, navigation and disposal stop sources. Visibility return can resume eligible menu music. The race engine separately owns automatic focus-loss pause. Full volume/mute preferences retain turbotype:audio:v1; rules 3 and save/content 1 are unchanged.

Fetch/decode failure leaves typing and sound effects usable, reports music unavailable and allows retry through another sound unlock. Late decoding cannot start playback in a paused scene or after disposal. App disposal aborts fetches, releases buffers, stops voices, clears the scheduler and closes the one context. The removed personal-file class and tests are deleted, not hidden behind an unused option. The old docs/design review prototype remains a historical artifact and is not the current app.

## Verification and remaining acceptance

Unit checks validate WAV headers/durations/checksums/levels, distinct track assets, gesture/context ownership, pause/dispose, late loading, failure/retry and countdown behavior. Browser checks observe real decoded looping sources (20 vs 25.6 seconds), menu continuity across tabs, countdown silence for those masters, racing selection, pause/mute and absence of any file input. Existing audio-unavailable and typing/CPU cases remain required.

Actual ASUS/Samsung listening is still needed: check groove, balance against countdown/engine, loop joins, phone interruptions and sustained play. No subjective acceptance, professional mastering or physical performance claim follows from automated checks. See PHASE5_POLISH_TESTS.md and TESTING.md.
