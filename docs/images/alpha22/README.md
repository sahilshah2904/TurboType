# Alpha.22 review captures

Generated sequentially after the complete 117-unit/79-browser local pass, from the existing LAN server using scripts/capture-review-polish.mjs. Headless Chromium/SwiftShader, isolated storage, no user Chrome window. Full-page captures start at document top so fixed controls are not embedded mid-page.

- keyboard-check-1024: every printable English character in the sample and independently detected common physical keys.
- quick-race-1440: standalone Quick Race naming/purpose, unchanged selectable setup.
- paragraph-third-line-top-fixture-1024: third original wrapped line has moved to the top, with three full lines visible. Seeded prerequisite clears in an isolated context open sample 6; this is not evidence of five earned clears or physical WPM.
- arrival-trail-1440 / burnout-clear-road-1440 / launch-trail-1440 / clear-title-1440: native CSS animation frames sampled at 1000/2100/3500/5600ms. Bounded car-following trail, stop/reverse fade and readable title with a small underlay. No full-screen road ribbon/crown across the name. Sampled frames do not certify presented frame rate.

Low effects/Reduced motion remain static, verified separately by browser cases. User visual review remains pending. Older alpha19 road-fire/crown and alpha21 centered wrapped-text examples are superseded for these behaviors.
