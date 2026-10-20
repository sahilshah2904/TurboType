# Changelog

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
