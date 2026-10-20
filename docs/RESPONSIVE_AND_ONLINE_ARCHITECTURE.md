# Responsive release and online data architecture

Planning revision: 20 October 2026. User requirement: share one GitHub-hosted website that works on phones, tablets and laptops, then add friends multiplayer immediately after the single-player release. Plan the persistent data and network boundaries from the beginning.

This document updates the earlier desktop-first/local-only launch assumption. Single-player prototypes may use local saves, but the public single-player release should support optional account-backed cloud progress. Friends racing follows in phase 11. No cloud project, database, authentication provider, or multiplayer service has been provisioned.

## Hosting and service boundaries

GitHub Pages hosts the compiled game, interface, and static content. It serves HTML/CSS/JavaScript; the database and authoritative multiplayer service run separately. Sharing the Pages URL is still the player's entry point. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Proposed architecture:

```text
Phone / tablet / laptop
  → GitHub Pages: responsive TurboType frontend
     → local cache + pending completed-run submissions
     → authentication + persistent database: profiles/progress/results
     → later authoritative race service: rooms/countdown/live race
          → persistent database: finalized online results/rewards
```

**Recommended candidate for authentication/persistence: Supabase Auth + Postgres.** Supabase documents authentication methods and an integrated Postgres database. It can support the account/progress portion without moving the static frontend. Selection remains proposed until implementation checks requirements, current usage limits/costs, account ownership, region, recovery/export needs, and static-site authentication callbacks. Do not promise free unlimited hosting or create billable resources as part of this planning update. [Auth](https://supabase.com/docs/guides/auth), [database](https://supabase.com/docs/guides/database/overview).

For live rooms, evaluate a server-authoritative WebSocket service such as Colyseus during phase 11. A database stores durable state; it does not by itself decide fair race start times or validate finish order. Supabase Realtime provides realtime primitives, while Colyseus documents server-mutated room state; choose the actual room implementation after a small multi-client prototype. Avoid shipping both systems without a demonstrated need. [Supabase Realtime](https://supabase.com/docs/guides/realtime), [Colyseus state](https://docs.colyseus.io/state).

## Responsive behavior from phase 2

Target modern supported browsers across Android phones, iPhones, tablets/iPads, and Windows/macOS laptops. Responsive layout is a release requirement, not an optional polish task. It does not guarantee compatibility with every historic device/browser; publish the actual tested matrix and limitations.

- Build for narrow touch screens first, then expand layouts with available space. Use content-driven breakpoints; initial test widths include 320, 360, 390, 768, 1024 and 1440 CSS pixels.
- Support portrait and landscape without forcing rotation. On phones, stack a compact race scene, essential HUD, readable passage and input above the software keyboard. Compress decorative scenery before shrinking typing text.
- Keep all four CPUs represented on compact layouts through scaled lanes and, when needed, a compact rank list/edge indicators. Never make the passage unusable to preserve a desktop composition.
- Phone keyboards change the visible area independently of the layout viewport. Observe viewport changes where supported, account for safe-area insets and dynamic browser chrome, and feature-detect enhancements. Do not depend exclusively on the limited-availability VirtualKeyboard API. [VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport), [VirtualKeyboard API](https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API).
- Use a real focusable input and a deliberate Start/Focus action. Preserve focus during text updates, avoid auto-opening the keyboard on unrelated screens, and test correction/composition on real devices. Request spellcheck/autocorrect/autocapitalization off where supported, with fallback behavior documented.
- A viewport resize, rotation, or keyboard appearance must preserve text/progress and must not itself mark a run paused. Actual tab hiding/application focus loss follows solo pause policy; implement these events carefully so keyboard behavior does not accidentally invalidate every mobile run.
- Menus, map nodes, drawers, and dialogs need practical touch targets (aim for at least 44 CSS pixels), visible focus, touch and keyboard controls. No hover-only essential controls.
- The campaign map remains rightward-scrolling on touch devices, with swipe/drag, chapter navigation, Jump to Current and an accessible list view. Do not trap vertical page scrolling.
- Adapt canvas dimensions and device pixel ratio, and reduce particles/filters on lower-power devices. Honor reduced motion from the first entrance screen.
- Audio starts after a user gesture; a blocked audio context cannot block a race. The same rule applies to touch and hardware keyboard players.

Software keyboards, predictive text and hardware keyboards produce different typing experiences. Record an explicit user-selected input profile (`touch`, `hardware`, `unspecified`), allow correction of the selection, and do not claim device detection proves how text was entered. Keep comparable records segmented by input profile and rule/content version. Later competitive room rules must state how mixed-input racing is handled. Do not infer accurate input hardware from user agent alone.

## Account and save experience

Guest play stays available without registration. Local guest saves are browser-specific and clearly labeled. Offer “Save progress across devices” through an optional permanent sign-in before public single-player launch. A permanent account is needed to recover the same progress on another device; an anonymous session alone does not provide that. [Supabase anonymous-user limitations](https://supabase.com/docs/guides/auth/auth-anonymous).

Proposed first sign-in method: email OTP, subject to delivery/rate-limit configuration and testing before adoption. Add social providers only when configured and tested. Do not require players to have GitHub accounts just because the frontend is hosted there. Never build our own password storage.

Show save state explicitly: saved locally, pending sync, synced, or sync failed. Never tell the player progress is cloud-saved before a server acknowledgment. A temporary cloud outage should allow an already loaded solo game to continue with local data; this does not imply a full offline-install/PWA feature. Multiplayer requires a connection.

On the first account link, show a preview of device guest data and account data and ask whether to import the guest run history/progress. Keep account switching isolated; never silently attach one person's local history to another's account.

## Persistent data model to design now

Stable UUID account and race IDs, category-qualified level IDs and explicit schema/rules/content versions are required from the first prototype. The following logical tables are proposed, not created SQL schemas:

| Entity | Durable data and owner |
| --- | --- |
| Profiles | Account ID, public display name, creation/version metadata; private identity stays with auth provider |
| Preferences | Audio, motion, input-profile and tutorial choices; device-specific quality/layout may remain local |
| Campaign progress | Account + level ID, completion, independently earned stars, relevant revision and provenance |
| Race results | Race ID, owner, mode, passage/rules/content versions, input profile, metrics, finish/eligibility and validation status |
| Learning summaries | Bounded owner-private aggregates, not raw keystroke logging |
| Reward ledger | Unique award/event IDs, credit/XP deltas and server-applied receipts |
| Cosmetic ownership/equipment | Owned item IDs, selected appearance; changes validated against ownership |
| Multiplayer matches, later | Match/room identifiers, participants, rules snapshot, final results; authoritative service writes official outcomes |

Game art and the 300-level manifests remain versioned source/static content; player saves do not get committed to GitHub. Active room movement is transient service state, not a database write on every rendered frame. Persist finalized summaries and significant room lifecycle events as necessary.

## Sync, conflicts, validation and recovery

- Define storage interfaces now: a pure race engine, a local repository/cache, an account-aware sync adapter, and a future network race provider. The UI must not depend directly on one vendor's SQL tables or SDK everywhere.
- Submit completed runs with unique idempotency keys. The server validates ownership, rules/content references, bounded metrics and basic timing consistency, derives applicable progress/rewards, and applies accepted changes transactionally. The client cannot directly set arbitrary account balances or trusted online finish results.
- Client-run solo races and imported backups remain distinguishable from server-authoritative multiplayer results. Server checks cannot prove a browser user typed manually. Do not promote imported local personal records into verified online leaderboards.
- Merge completed-level and star flags monotonically from accepted events; do not use a last-write-wins whole-account overwrite. Deduplicate award/event IDs; never add two device balances together. Sync preferences with an explicit conflict policy. Records remain partitioned by their conditions.
- Preserve pending solo submissions across retries/reloads and deduplicate them server-side. Keep the bounded local snapshot policy from the storage baseline, but never prune unacknowledged work silently. Define queue-size and user-visible recovery behavior during implementation.
- Version and test migrations for local saves and SQL schemas. Commit migrations, access policies, seed fixtures and recovery instructions in the repository; credentials remain external.
- Users may read/update only appropriate own data. Supabase RLS can enforce row access; grants, policies and privileged operations need tests with separate accounts. Keep service-role credentials and privileged reward logic off the public frontend. Browser environment variables are bundled public configuration, not a secret store. [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
- Include data export, account/data deletion, bounded history retention, operational backup/recovery and costs/quotas in the launch checklist. Store only purposeful game data; “all data” does not mean collecting unrelated keystrokes or retaining unlimited raw events.

## Implementation order without delaying multiplayer readiness

1. **Phase 2:** responsive shell, real-device input spike, stable IDs and storage/auth/network boundaries. Decide and document the persistence provider before cloud integration code.
2. **Phases 3–4:** correct solo game and CPU race using a tested local adapter; no network request in the per-key rendering path.
3. **Phases 5–8:** build every screen with touch/tablet/laptop behavior; keep the model ready for shared results. Begin cloud schema/auth integration when the completed-run model stabilizes.
4. **Phase 9:** implement account-backed single-player progress, sync, access controls, conflict handling, import and recovery along with the garage/learning features. Local guest mode remains.
5. **Phase 10:** verify cross-device sign-in/progress, cloud failure behavior and responsive play, then launch the single-player game on Pages. Provider account/configuration is a launch dependency and must be reported if unavailable.
6. **Phase 11, immediately following single-player launch:** add friends rooms, invitation links, readiness, authoritative countdown/progress/results, reconnect handling and rematch. Reuse identity, data contracts, migrations and persistence from single-player rather than starting them from scratch.

Minimum launch evidence: representative real Android/iOS phone runs with software keyboards, tablet layout/input checks, laptop hardware-keyboard races, portrait/landscape/resize and reduced motion; verified same-account progress across two devices; two accounts unable to read/write each other's private data; duplicate/retried result submissions not duplicating awards; pending/failed sync shown honestly; and no secrets in the built public site.
