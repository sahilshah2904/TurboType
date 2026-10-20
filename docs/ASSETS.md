# Asset register — foundation preview

Only the following assets are shipped in this phase. The reel, screenshots, extracted frames, local video-analysis helper binaries and generated QA images remain under ignored local directories and are not bundled.

| Asset | Origin and editable source | Usage / license |
| --- | --- | --- |
| TurboType mark | Original project-authored vector in public/assets/brand-mark.svg | Favicon and wordmark; not derived from the reference game's branding |
| Starter coupe body | Original project-authored vector in public/assets/starter-coupe.svg | Phaser SVG raster at 680×220; scene owns wheel/shadow layers separately |
| Road, skyline, wheels, shadow, particles | Original procedural drawings in src/game/track-preview.ts | No downloaded raster artwork |
| Barlow Condensed | Fontsource package 5.3.0; upstream font authors and OFL license included in package | Self-hosted Latin weights 600/700; retain accompanying OFL notice |
| DM Sans | Fontsource package 5.3.0; upstream font authors and OFL license included in package | Self-hosted Latin weights 400/500/700; retain accompanying OFL notice |

Font license text is copied verbatim to public/assets/licenses/ during authoring and tracked, so production output includes it. The package lockfile records exact distribution versions. No original music, sound effects, mascot, third-party car images or AI-generated raster art has been added. This asset register does not imply a repository-wide license grant; no overall project license has been chosen.

Future assets must add creator/source/license, modifications, export settings and an editable source or recreation instruction. Never use the reel's music or game assets as shipped TurboType content.
