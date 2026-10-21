# Changelog

## 0.1.0-alpha.9 — 21 October 2026

- Narrow product scope to laptop/desktop physical-keyboard typing at the user's request. Remove mobile/tablet browser profiles, touch-screen CSS and software-keyboard VisualViewport handling; retain regular window resizing and hardware IME composition.
- Make metallic red/gold dominant, with cyan restricted to small lights; original shapes follow the nanotech armor color reference.
- Replace the rejected sad menu score with upbeat major-key Ignition (124 BPM). Preserve the accepted Overdrive race WAV byte-for-byte.
- Record user acceptance of typing/speedometer and pause/resume/retry checks. The phone word-at-a-time symptom is out of scope, not claimed fixed. Rules remain 3, save/content 1.

## 0.1.0-alpha.8 — 21 October 2026

- Replace the rejected burgundy wash with graphite surfaces, metallic crimson controls, cyan reactor-style light/rings and restrained gold details across pages and Phaser scenes.
- Replace the old realtime music loop with two distinct original instrumental WAV masters: Nightforge for browsing and Overdrive for racing. Include a deterministic offline composer, checksums and mix metadata. Preserve independent countdown/FX and lifecycle controls.
- Remove personal-music selection and its loader/tests at the user's request. No external music, film artwork or soundtrack is added. Rules/save/content versions remain compatible.

## 0.1.0-alpha.7 — 21 October 2026

- Fill the hub track preview across its container by resizing/redrawing scenery with uniform kart scaling; remove grey side columns.
- Add energetic menu percussion, hub sound controls and music during Race setup/results. Use a separate pulse score and rising cues during the existing 3–2–1 countdown.
- Integrate visit-only personal audio-file playback with mute/volume/navigation/pause/countdown behavior, blocked-file fallback and object-URL cleanup. No Misirlou recording is supplied or bundled.
- Preserve rules 3 and save/content 1; actual-device audible/visual acceptance remains open.

## 0.1.0-alpha.6 — 21 October 2026

- Apply a red-and-black visual theme across Hub, Race, Practice, Keyboard check and Settings: charcoal surfaces, crimson controls, red horizon, HUD and Live WPM dial.
- Reuse the original kart with a red player palette, warm exhaust and red/white nitro accents. CPU colors and explicit names preserve identification.
- Keep completed typing muted and mistakes amber with an underline, distinct from decorative red. Rules 3 and save/content 1 stay compatible; device acceptance remains open.

## 0.1.0-alpha.5 — 21 October 2026

- Integrate the approved full-window Phaser kart race, moving exhaust, responsive lanes and native single typing surface into the normal app.
- Add Live WPM analog/numeric speedometers in Race/Practice, using the existing rolling pace independently of average WPM and outcomes.
- Revamp hub, practice, keyboard check and settings with a shared open world layout; retain their working controls/preferences.
- Add disposable visual-viewport support, integrated setup/pause/results/recovery controls and browser regression coverage. No rules/save/content migration or backend change; final device acceptance and distinct fleet remain pending.


## 0.1.0-alpha.4 — Neon Harbor polish, 20 October 2026

Working on feat/race-polish from merged main c4127c7; not a tagged or deployed release.

- Merged accepted Phase 4 PR #3, then authored a Neon Harbor art bible and reproducible generator for three original modern sports-car SVGs; replaced the legacy sedan in hub/race and removed its unused current asset.
- Added city parallax, player-relative camera/approaching finish, edge indicators, wheel/suspension/exhaust, bounded nitro/speed effects, short HTML callouts and finish/confetti treatment. Reduced motion uses a stable whole-course view; low reduces effect budgets.
- Kept metrics above the course, reduced panel boxing and added a caret-following text strip; Larger typing text retains wrapping.
- Added original Harbor Circuit menu/race synth score, engine/countdown/error/nitro/overtake/finish cues, opt-in audio, saved master/music/effects/mute controls, bounded scheduler and graceful pause/navigation/failure cleanup. No extra runtime package, audio download, microphone or reference song.
- Local full check passes 83 unit and 66 browser tests. Isolated headless renderer measurements and reproducible scripts are documented. Rules remain 3; existing save/content versions remain 1 and audio has a separate preference key.
- Physical ASUS/Samsung sound/visual/performance acceptance remains TT-505/506. Cinematic opening/onboarding remains Phase 6; no cloud progression or Pages release.

## 0.1.0-alpha.3 — four-CPU Quick Race, 20 October 2026

Working on feat/solo-race from merged main baseline 08cddb4; not a tagged or deployed release.

- Merged the verified Phase 2/3 PRs in order before branching; preserved shared commit history.
- Added four immutable seeded per-character CPU schedules with declared tiers, reaction/hesitation/correction delays and frame-independent progress.
- Added a five-lane Phaser race driven by the shared typing clock, exact live standings, frozen final results, explicitly simulated later CPU outcomes, timed DNFs, same-seed retry and new-seed selection. Rules version is 3; existing typing rules are unchanged.
- Added loading/context-loss recovery, a 12-second watchdog and explicit text racing, plus navigation cleanup and compact active desktop/mobile layouts. Original prototype art remains until Phase 5. No rewards/results are saved.
- Added 21 unit cases and 15 browser profile cases; the full local check passes (69 unit and 54 browser tests). Available-device race checks accepted by ASUS/Samsung user report (TT-404).
- Moved race status/metrics above the track at the user's request, so the course leads directly into passage and input; corrected intrinsic canvas sizing after compaction. Short verification passages remain unchanged. Exact verification evidence is in docs/TESTING.md.

## 0.1.0-alpha.2 — typing practice, 20 October 2026

Working on feat/typing-engine, based on the unmerged foundation branch; not a tagged or deployed release.

- Added a clock-injected typing engine: exact correction, attempts/accuracy, WPM/progress, novel-position streaks/nitro, countdown, pause/resume, finish freeze and opt-in timeout.
- Added strict DOM input validation, replacement/paste handling and once-only composition commits with explicit practice-only eligibility; rules version increased to 2.
- Added three original passages and a responsive practice screen with session-preserving navigation, frozen results and coaching. No results/rewards are saved.
- Added validated shared-place ordering for later CPU integration, 28 new unit tests and 21 new browser checks. Full local check passes: 48 unit and 39 browser tests.
- Documented implementation, reproduction and focused physical input retest. TT-305 accepted after the user reported all requested ASUS/Samsung checks working; exact keyboard event behavior and environment versions were not supplied. Physical iPhone/tablet coverage remains a release gate.
- Fixed the stale paused input notice visible in the user's timeout screenshot; countdown/resume/finish notices now follow the run state, with browser regression coverage. Retained the native textarea resize control.

## 0.1.0-alpha.1 — foundation, 20 October 2026

Working on feat/app-foundation; not a tagged or deployed game release.

- Added the Vite/TypeScript app, pinned Phaser/Anime.js, responsive hub, original decorative track and camera/particle/filter/tween smoke test.
- Added a free-editing keyboard check with composition/viewport diagnostics and safe browser-local display preferences.
- Added framework-free versioned ID/race/auth/sync contracts, cleanup on navigation and recovery for missing art/storage denial.
- Added 20 unit tests, 18 Chromium layout-profile checks, checks-only CI, setup/architecture/decision/asset/testing documents.
- Adopted short plain-English commit messages at the user's request. Earlier shared planning commits are unchanged.
- Open: physical device input checks, actual gameplay/progression, cloud saves, soundtrack, multiplayer and public deployment.
