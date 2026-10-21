> Current alpha.11: four distinct original CPU models replace palette copies; the accepted player, restored graphite/crimson/cyan palette and Ignition/Overdrive masters are preserved. See [fleet sources and remaining wheel work](KART_FLEET.md) and [full-app evidence](PERFORMANCE_ALPHA11.md). Earlier version-specific sections below are historical.

# Asset register — alpha.9

The reel, supplied screenshots, local analysis frames and helper binaries stay in ignored Reference_Images. Documentation captures under docs/images are versioned review evidence and excluded from the built game. No reference soundtrack, Nintendo media, Marvel character/logo or Iron Man screenshot is shipped.

| Asset | Origin and editable source | Current use / provenance |
| --- | --- | --- |
| TurboType mark | Project-authored public/assets/brand-mark.svg | Original favicon/wordmark with crimson and warm-white accents |
| Player Volt kart PNG | Original built-in image_gen concept, docs/design/race-direction/PROMPT.md | Approved 1774×887 RGBA concept retained with its accepted coral runtime palette. |
| Four CPU kart masters / WebP | Built-in image_gen; assets-source/karts/PROMPTS.md and committed PNG masters | Original distinct Neon Fox, Apex Nova, Comet and Volt rival. scripts/export-karts.mjs exports four 800×400 RGBA WebP assets (267,580 bytes total). Shared anchors in src/game/kart-fleet.ts; separate wheel art remains TT-510. |
| Retained Neon GT/Apex R/Volt X SVGs | Project-authored assets-source/build-vehicles.mjs | Legacy art in public/assets/cars, retained from the previous preview; current hub/race uses the kart PNG |
| Ignition music | Original notes/instruments in assets-source/build-soundtracks.mjs | public/assets/audio/ignition.wav: 124 BPM, approximately 15.484 seconds, mono 22050 Hz 16-bit PCM; no borrowed samples or melody |
| Overdrive music | Same deterministic offline composer; distinct authored arrangement | public/assets/audio/overdrive.wav: 150 BPM, 25.6 seconds, same export format; no borrowed samples or melody |
| Start sequence and game cues | Original synthesis/envelopes in src/audio/race-audio.ts | Bounded runtime Web Audio; independent countdown/engine/error/nitro/finish effects |
| Road, skyline, rings, shadow, particles | Project-authored CSS/Phaser drawing in src/immersive.css and src/game | Graphite/crimson/cyan lighting based on the user's color reference, using original shapes |
| Barlow Condensed | Fontsource 5.3.0, upstream authors / OFL | Self-hosted Latin weights 600/700; accompanying notice in public/assets/licenses |
| DM Sans | Fontsource 5.3.0, upstream authors / OFL | Self-hosted Latin weights 400/500/700; accompanying notice retained |

Run node assets-source/build-soundtracks.mjs to reproduce both masters and soundtracks.json (SHA-256, tempo, duration, level/size metrics). See AUDIO.md for generation/runtime ownership and known limits. The two WAV files total 1,811,886 bytes; no external audio tool or sample bank is needed. Original ownership here does not imply a repository-wide license grant; no overall project license has been selected.

The kart source prompt and exact approved concept remain in docs/design/race-direction. It is AI-generated project artwork, not a 3D model or traced Nintendo asset. The original lime PNG remains unchanged; CSS and pre-baked canvas palettes color its runtime variants. Separate fleet/body/wheel work remains TT-510.

Historical alpha.7 personal-file playback was explicitly canceled by the user and removed from the normal app in alpha.8. The older docs/design prototype is a historical review artifact, not the production music experience. No Misirlou recording was supplied or bundled. Future assets must record creator/source/license, modifications, export settings and an editable source or recreation instructions here.

The alpha.9 Overdrive recording is byte-identical to the user-accepted alpha.8 asset; the generator's menu-only changes do not alter it. Metallic red/gold facets and small cyan lights are code-native. Support is laptop/desktop only.
