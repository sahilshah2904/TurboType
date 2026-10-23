# Cars and Tracks collections

Accepted by the user on23 October2026("all good"). Source bd378c1 passed125 unit/121 browser cases on GitHub run39972392241/job120478169052. PR8 is unmerged. Phase9 was requested, then paused during preparation before code/assets/backend changes. See PHASE9_RESUME.md; save and stop until explicitly resumed.

Latest explicit decision: 23 October 2026, alpha.26. Equipment selection belongs in dedicated tabs, separate from starting a race. This supersedes all earlier Hub dropdown, race radio and level-briefing picker instructions. Five accepted starters in each collection remain usable. The original car models, colors, rules, passages and tracks are unchanged.

## Selection and race lifecycle

- Main navigation and Hub links open `#/cars` and `#/tracks`. Three equal columns fit the supported desktop widths. Five available starters appear first. Select saves the existing independent car/track preference and marks one item selected. All campaign categories, replays, bonus challenges and Quick Race use those preferences for new runs.
- A countdown, racing or paused session in **either** Quick Race or campaign prevents collection selection globally. Disabled buttons and event-handler/application guards enforce it. Browsing or enlarging a starter is allowed. “End current races to change selection” explicitly abandons the unfinished sessions, awards nothing and releases selection. It never deletes saved campaign clears.
- Every session retains the equipment it started with, including completed/abandoned result views. Retry resets the session and reads current preferences. A ready setup can use the updated preference when revisited. Refresh still discards unsaved runs and retains valid saved preferences/progress.
- If storage is denied, choice applies for the current visit and reports the limitation. Unknown/reward IDs are rejected by the existing repositories and the collection handler. These preference records are not ownership receipts.
- Campaign map nodes open one level-details dialog showing objectives, passage preview, stars and a read-only equipment summary. Race/Replay closes it and begins a normal three-second countdown once the track is ready. Loading has no second setup confirmation. Failed artwork restores explicit retry/text-mode controls; it never starts a hidden fallback race. Escape, window blur or hiding the page during initial artwork loading cancels the automatic launch and restores explicit start controls. Direct level URLs and retry/resume also keep explicit start controls. Quick Race passage/pace/mode/seed setup remains available; equipment choice is only in collections.

## Preview and locked rewards

Available cars use the accepted original model previews; their native modal enlarges the complete car. Track cards use lightweight original code-authored environment thumbnails. Enlarge opens the actual shared track scene with the selected car. Only one detail scene exists at a time; close/navigation disposes it, including async load races. Escape closes native dialogs and restores focus. No collection animation is required, and track scenes respect Low effects/Reduced motion. Locked entries have no preview button, selection or detailed art request.

The stable planned manifest in src/content/collection.ts mirrors GARAGE_PROGRESSION.md and TRACK_PROGRESSION.md. Rows group **all three categories for one milestone**, then the next milestone. Cars:15/30/45/60/75/90; tracks:10/25/40/55/70/85/100. There are23 cars and26 tracks including starters. Dark original structural concepts communicate family variety; they are provisional silhouettes, not finished reward models or shipped courses. Names/requirements remain visible, but locked entries cannot enlarge. The page labels these planned rewards honestly.

Final reward bodies/parts/environments, earned ownership, notifications, canonical guest receipts and cloud recovery remain Phase9 TT-911/912/901 scope. Do not grant placeholder artwork or equate a selected starter preference with ownership. Eligible unique main clears count within the earning category; bonus challenges, replays, Practice, Quick Race and multiplayer do not. Once implemented and earned, cosmetic use will remain global across already-unlocked categories. Use the stable IDs for future art/ownership migration.

## Implementation

- src/ui/collection.ts: cards, original SVG thumbnails/concepts, detail modal, guarded selection and bounded scene lifecycle.
- src/content/collection.ts: milestone-first planned manifest, no entitlement calculation.
- src/ui/app.ts/router.ts: routes/navigation, saved preferences and global active-session guard.
- src/ui/campaign-map.ts: read-only equipment briefing and existing prerequisite recheck.
- src/ui/quick-race.ts: removes all equipment selectors and consumes an explicit one-shot map-launch signal after art readiness. Later reload/navigation does not auto-resume a paused run.
- src/immersive.css: three-column collections, selected/locked presentation, detailed art and desktop nav wrapping.

Rules3/content3/map schema2 and starter preference schemas1 are unchanged. Current source is on PR8, unmerged. No backend, account, Pages or multiplayer deployment.

## Focused user checks

1. Open Cars: five usable cars, three across; select one, enlarge it and close with Escape. Scroll to see the three level15 rewards together, then level30, with no enlarge/selection on locked silhouettes.
2. Open Tracks: five usable environments, large preview; locked rows begin with the three level10 rewards, then level25. Choose one and refresh; the selection should remain.
3. Open any available campaign level: one details dialog, no car/track inputs. Click Race; countdown begins directly and uses the saved car/track. Quick Race uses the same choices.
4. While racing, navigate to a collection. The run pauses and selection remains disabled; preview still works. Return and resume with the same equipment. End the unfinished run explicitly if you want to change selection; retry then uses the new choice. Existing map clears stay intact.

Previously accepted curriculum/typing/opening/music checks need no repeated approval.
