# 0006 — Integrate the accepted full-window kart direction and live WPM dial

Date: 21 October 2026. Status: implemented; formal/device evidence is tracked separately.

## Context

The user approved the kart review prototype, requested moving exhaust and a realtime WPM speedometer, and explicitly authorized revamping all existing pages and the race. The earlier boxed composition was rejected. Reuse the accepted deterministic typing/CPU engine and saved preferences.

## Decision

Promote the original kart concept to a production asset, use responsive Phaser RESIZE with proportion-preserving sprites and an honest compressed race overview, and replace the race's separate passage/input with one visible native-input-backed strip. Keep setup/pause/results and graphics recovery accessible in the control deck. Apply one full-window world/background and open content layout to hub/practice/keyboard/settings; future onboarding/maps/progression stay in their phases.

Show existing recentWpm in a small analog/numeric speedometer updated by the HUD timer. Whole-run average WPM remains in HUD/results. Clamp only dial angle at 160 WPM; preserve numerical values and core timing. Reserve gauge space outside the racing lanes. Handle native keyboard viewport changes through disposable VisualViewport listeners, without remounting active engines.

## Consequences

App becomes alpha.5; rules 3 and save/content 1 remain unchanged. No new dependency/service. Existing PNG concept is a palette-varied first kart, not the final distinct fleet or fully separated wheel art. Texture/decode cost is larger than the old SVG scene and invalidates any transfer/memory/performance inference from that profile. Real-device input/performance and new visual acceptance remain required. See [IMMERSIVE_APP.md](../IMMERSIVE_APP.md), [TESTING.md](../TESTING.md) and TT-505/506/510/513.
