# Asset register — current preview

Only the following assets are shipped in this phase. The reel, screenshots, extracted frames, local video-analysis helper binaries and working QA captures remain under ignored local directories and are not bundled. Selected screenshots in docs/images are versioned documentation, excluded from the built game.

| Asset | Origin and editable source | Usage / license |
| --- | --- | --- |
| TurboType mark | Original project-authored vector in public/assets/brand-mark.svg | Favicon and wordmark; not derived from the reference game's branding |
| Neon GT, Apex R, Volt X bodies | Original editable generator assets-source/build-vehicles.mjs → public/assets/cars/*.svg | Explicit 760×240 SVG raster; no brand/traced references; runtime wheels/shadows/lighting remain separate. Legacy sedan removed from current build, retained in Git history |
| Harbor Circuit music and cues | Original authored score in src/audio/score.ts and synthesis/envelopes in race-audio.ts | Native runtime synthesis; 116 BPM eight-bar loop, menu/race arrangements, no borrowed samples/song/audio download. See AUDIO.md |
| Road, skyline, wheels, shadow, particles | Original procedural drawings in src/game/track-preview.ts and src/game/race-track.ts | No downloaded raster artwork |
| Barlow Condensed | Fontsource package 5.3.0; upstream font authors and OFL license included in package | Self-hosted Latin weights 600/700; retain accompanying OFL notice |
| DM Sans | Fontsource package 5.3.0; upstream font authors and OFL license included in package | Self-hosted Latin weights 400/500/700; retain accompanying OFL notice |

Font license text is copied verbatim to public/assets/licenses/ during authoring and tracked, so production output includes it. The package lockfile records exact distribution versions. Original source-authored music/effects are now included; no mascot, third-party car images, external audio samples or AI-generated raster art has been added. This asset register does not imply a repository-wide license grant; no overall project license has been chosen.

Future assets must add creator/source/license, modifications, export settings and an editable source or recreation instruction. Never use the reel's music or game assets as shipped TurboType content.

## Phase 5 kart direction review (not shipped by the production entry)

`docs/design/race-direction/volt-kart-concept.png`: original AI-generated transparent raster concept, built-in image_gen, 1774×887 RGBA, approximately 1.69 MB. Editable generation prompt/provenance are in [PROMPT.md](design/race-direction/PROMPT.md); this is not a 3D source model or separated production sprite set. HTML/CSS review scenery is project-authored; desktop/phone captures come from that prototype. CPU copies are temporary hue variations. Mario Kart was user-requested broad inspiration; no Nintendo media is shipped. No Misirlou recording is included: the prototype can play a user-selected local file without upload/persistence. See [prototype notes](design/race-direction/README.md).
