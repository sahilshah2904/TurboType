# Responsive release and online data architecture

**Current scope override — 21 October 2026:** the user explicitly narrowed TurboType to laptop/desktop browsers with a physical keyboard. Phone/tablet compatibility, software-keyboard layout, rotation and mobile acceptance are canceled requirements. Earlier multi-device statements are historical. Keep laptop window responsiveness (960 CSS px minimum; verify 1024/1366/1440/1920 widths), accessibility, hardware-keyboard IME composition, cloud saves before solo launch and multiplayer afterward. Do not restore mobile work without a new user request.

Optional account-backed progress before solo launch and friends multiplayer immediately afterward remain planned. No cloud project/database/auth or realtime service is provisioned.

## Hosting and service boundaries

GitHub Pages hosts the compiled game, interface, and static content. It serves HTML/CSS/JavaScript; the database and authoritative multiplayer service run separately. Sharing the Pages URL is still the player's entry point. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Proposed architecture:

```text
Laptop / desktop physical keyboard
  → GitHub Pages: responsive TurboType frontend
     → local cache + pending completed-run submissions
     → authentication + persistent database: profiles/progress/results
     → later authoritative race service: rooms/countdown/live race
          → persistent database: finalized online results/rewards
```

**Recommended candidate for authentication/persistence: Supabase Auth + Postgres.** Supabase documents authentication methods and an integrated Postgres database. It can support the account/progress portion without moving the static frontend. Selection remains proposed until implementation checks requirements, current usage limits/costs, account ownership, region, recovery/export needs, and static-site authentication callbacks. Do not promise free unlimited hosting or create billable resources as part of this planning update. [Auth](https://supabase.com/docs/guides/auth), [database](https://supabase.com/docs/guides/database/overview).

For live rooms, evaluate a server-authoritative WebSocket service such as Colyseus during phase 11. A database stores durable state; it does not by itself decide fair race start times or validate finish order. Supabase Realtime provides realtime primitives, while Colyseus documents server-mutated room state; choose the actual room implementation after a small multi-client prototype. Avoid shipping both systems without a demonstrated need. [Supabase Realtime](https://supabase.com/docs/guides/realtime), [Colyseus state](https://docs.colyseus.io/state).

## Laptop responsiveness and input

Target modern Windows/macOS/Linux laptop and desktop browsers with a physical keyboard. Design for a minimum 960 CSS px window and verify representative 1024×768, 1366×768, 1440×900 and 1920×1080 layouts, plus zoom and window resizing. Preserve race text/state during resize; actual focus loss follows the pause policy.

Use mouse and keyboard navigation, visible focus, readable typing, reduced motion and usable controls at supported window sizes. The rightward campaign map needs mouse scrolling/drag, keyboard navigation, Jump to Current and an accessible list. Do not depend on hover alone for essential explanations. Keep hardware IME composition and native input accessibility; removing phone support does not mean capturing only keydown events.

Alpha.9 removes phone/tablet browser profiles, OS-keyboard VisualViewport offsets, compact touch-screen CSS and touch input-profile support. Smaller screens have no compatibility guarantee; they are not a launch gate. Records/network contracts may still identify hardware/unspecified input. Browser storage, auth and network boundaries remain independent of layout.

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
3. **Phases 5–8:** build every screen for laptop/desktop window behavior; keep the model ready for shared results. Begin cloud schema/auth integration when the completed-run model stabilizes.
4. **Phase 9:** implement account-backed single-player progress, sync, access controls, conflict handling, import and recovery along with the garage/learning features. Local guest mode remains.
5. **Phase 10:** verify cross-device sign-in/progress, cloud failure behavior and responsive play, then launch the single-player game on Pages. Provider account/configuration is a launch dependency and must be reported if unavailable.
6. **Phase 11, immediately following single-player launch:** add friends rooms, invitation links, readiness, authoritative countdown/progress/results, reconnect handling and rematch. Reuse identity, data contracts, migrations and persistence from single-player rather than starting them from scratch.

Minimum launch evidence: representative physical-keyboard laptop races in supported desktop browsers/resolutions and zoom, reduced motion, verified same-account progress across two supported computers, account access isolation, idempotent/retried awards, honest sync state and no secrets in the public bundle.
