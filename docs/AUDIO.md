# Original Harbor Circuit audio

Implemented in Phase 5, app 0.1.0-alpha.4. Audio is optional, initially muted, and never a dependency of countdown, input, finish or results. No audio file, microphone, stream, external sample library or reference soundtrack is used.

## Authorship and recreation

`src/audio/score.ts` is the editable score for the original project-authored “Harbor Circuit” loop: 116 BPM, 4/4, 8 bars / 128 sixteenth-note steps, approximately 16.55 seconds per cycle. A minor-centered bass progression, authored melodic motif and sustained triads form the menu arrangement. Racing adds a busier lead, bass pulse and synthesized kick/hat/snare. There is no claim that this first synthesized mix is a commercially mastered soundtrack; audible device review remains part of Phase 5 acceptance.

`src/audio/race-audio.ts` synthesizes sine/triangle/saw oscillators and a repeatable 220 ms noise buffer at the context sample rate. The buffer uses seeded arithmetic noise, not downloaded samples. Source notes/envelopes are the authoring inputs and runtime output; no WAV/MP3 export or resampling tool is required to recreate playback. Changing notes/timbre does not alter race rules. These are original project assets; no third-party music attribution or redistribution license is needed for a borrowed work because none is used. No broader repository license grant is implied.

## Controls and browser policy

Open Sound & music in Race or Settings. Enable sound in a real click gesture; Start/Resume can unlock remembered unmuted preferences. Before that, no AudioContext is created. One app-owned context is reused across routes/retries. Master, music, effects and mute preferences are validated finite values in [0,1] under the independent `turbotype:audio:v1` schema-1 envelope. Existing display settings/save schema are unchanged. Denied storage applies choices for the current visit and reports that they were not saved.

Audio uses separate music/effects gain buses, a master gain and gentle dynamics compression. Initial controls are master 0.6, music 0.35, effects 0.5, muted. Gain changes use short AudioParam ramps; stopping sources fades their local envelopes before stop/disconnect. The score schedules at most 120 ms ahead with a 25 ms polling interval. A delayed tab skips stale beats instead of replaying a burst. A 48-source ceiling bounds overlapping notes/effects; muting stops sources and the scheduler. Headless audio checks verify lifecycle/state and cannot establish audible speaker quality.

The implementation follows [MDN user-gesture/audio control guidance](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices), [AudioContext.resume](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume) and [AudioParam.setTargetAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime). Browser policy remains browser-owned; no autoplay bypass is implemented.

## Lifecycle and feedback

The hub/settings use the calmer menu arrangement after unlock; Race uses the race arrangement only while the core is racing. Countdown produces discrete cues, GO starts a higher accent, the engine frequency responds smoothly to recent WPM, mistakes are soft/rate-limited and clean streaks/overtakes get short accents. Finished/timed-out transitions trigger one cue, never a second reward or delayed result. Pausing, focus loss, hiding the page and leaving the race stop race voices; practice is silent. Returning to an unlocked menu may intentionally resume menu music. Resume retains the gameplay countdown and excludes paused time exactly as before.

Mute, page/HMR disposal and retry stop old sources. The app removes its focus/visibility listeners and closes the context on disposal. A generation guard prevents an interrupted asynchronous unlock from restarting after disposal. Unsupported context startup and runtime graph errors become an unavailable message without escaping into typing/gameplay. Toggle off/on to retry. Device-specific browser suspension or missing audio output may still require another user gesture.

## Remaining evidence

Unit tests cover no pre-gesture context, one-context reuse, mute/pause/dispose, interrupted unlock and graph failure isolation. Browser checks exercise opt-in, saved sliders after reload, no race voices during practice, muted failure recovery and normal racing when audio is unsupported. Audible balance, clipping perception, phone interruptions and Samsung/ASUS performance need user verification (TT-505/TT-506). Physical iOS/tablet evidence remains a release gate. The score can be revised after listening without rewriting gameplay metrics or save data.
