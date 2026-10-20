# 0003 — Deterministic typing clock and explicit assistance eligibility

Date: 20 October 2026. Status: implemented; TT-305 accepted by ASUS/Samsung user report on 20 October 2026, with evidence limits recorded in TESTING.md.

## Context

The typing engine must be testable without Phaser or browser timing and reusable for later CPU/multiplayer integration. User testing found Samsung word completion available despite input attributes requesting it off. Browser input event sequences and composition behavior cannot be reduced to physical keydown events.

## Decision

Inject a finite millisecond clock into TypingEngine. Clamp backwards readings, use countdown deadlines and active segments, and finalize expiry/finish before visual updates. The DOM adapter validates beforeinput where cancelable plus the resulting input value, with a canonical engine string as the source of truth. Do not rewrite identical field values on HUD ticks.

Retain a single unresolved error and history-based accuracy. Track novelty separately from current prefix length so deleting/retyping cannot create streak bonuses. Paused/assisted runs are explicitly practice-only. Accept committed appended composition once, marking it practice-only for the first English comparison policy; do not reject all multi-character IME commits or pretend they prove cheating. Reject recognizable replacement/bulk input without awarding attempts. Ignore duplicate final input when the DOM already equals canonical text. Interrupted composition cannot commit into a resumed/new screen.

Preserve the practice engine across in-app screen navigation and pause on leaving/focus loss. This is in-memory continuity, not a saved race or cloud record. Timeout is a first-class state; all finished result metrics freeze at the engine timestamp. Standings helper uses deterministic ID order only for visual tie sorting.

## Consequences

Rules version becomes 2; app version becomes 0.1.0-alpha.2. Display preference save schema stays 1. No campaign/reward record migration is needed because none ship yet. Some keyboard assistance cannot be distinguished from normal inserts; no trusted online score or anti-cheat claim follows from local eligibility. The focused available-device retest was accepted by user report; exact browser/keyboard versions and native prediction traces remain unavailable. Broader physical coverage and missing environment metadata remain TT-1008.

Sources checked: [beforeinput caveats](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event), [isComposing](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/isComposing), [visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event). See GAME_RULES.md, PHASE3_INPUT_TESTS.md and TESTING.md for implemented semantics and evidence.
