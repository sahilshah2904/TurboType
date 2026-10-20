# 0005 — Original vectors, bounded world effects and optional synthesized audio

Date: 20 October 2026. Status: implemented/automatically verified; physical sound/performance acceptance remains TT-505/506.

## Context

The user found the Phase 4 sedan, empty margins and boxed HUD insufficiently immersive compared with the reel. The functional core is accepted and must remain deterministic. All art/music must be original or licensed, reproducible and suitable for GitHub Pages; no additional service or backend is needed for audiovisual work.

## Decision

Author three modern sports-car SVGs through a tracked generator and a Neon Harbor palette/composition bible. Phaser owns layered city scenery, a progress-relative camera, wheel/suspension/exhaust, bounded streak/speed effects, edge indicators and a short finish treatment. HTML retains metrics above the course and the passage/input directly below. Anime.js animates short UI callouts; the core owns finish before any celebration or delayed result scrolling. Reduced motion uses a stable whole-course projection and no decorative particles/scrolling; larger text retains wrapping.

Use the existing libraries plus native Web Audio to synthesize an original source-authored menu/race score and cues. One app-owned context starts only on an unmuted user gesture. Separate independent audio preference storage avoids changing existing display saves. Bound overlapping sources and scheduler lookahead, fade gains, skip stale background beats, stop race voices on pause/navigation and isolate audio errors from gameplay. No reel song, external samples, audio downloads, microphone, Rive/Lottie or additional runtime package is introduced.

## Consequences and evidence

App becomes 0.1.0-alpha.4. Rules remain 3: visual camera/interpolation, nitro and audio never modify validated progress, CPU schedules, finish timestamps or eligibility. Preference/content versions remain 1; audio has its own schema-1 key. The old unused sedan asset is removed from the current build and remains recoverable in Git history.

The full local suite passes 83 unit and 66 browser checks. Headless renderer profiling and source/asset regeneration are reproducible, but cannot close physical Samsung/ASUS audible mix and performance acceptance. See [ART_BIBLE.md](../ART_BIBLE.md), [AUDIO.md](../AUDIO.md), [PERFORMANCE.md](../PERFORMANCE.md) and [TESTING.md](../TESTING.md). Phase 4 PR #3 merged to main c4127c7 before feat/race-polish; opening/onboarding still belongs to Phase 6.
