import { isTrackId, type TrackId } from "../content/track-catalog";
const KEY = "turbotype:track:v1";
/** A starter preference grants no reward or campaign entitlement. */
export class LocalTrackRepository {
  constructor(private storage: () => Pick<Storage, "getItem" | "setItem">) {}
  load(): TrackId {
    try {
      const value: unknown = JSON.parse(this.storage().getItem(KEY) ?? "null");
      if (
        value &&
        typeof value === "object" &&
        "schemaVersion" in value &&
        value.schemaVersion === 1 &&
        "selectedTrack" in value &&
        isTrackId(value.selectedTrack)
      )
        return value.selectedTrack;
    } catch {
      /* Optional storage; keep the game playable. */
    }
    return "neon-harbor";
  }
  save(selectedTrack: TrackId): boolean {
    if (!isTrackId(selectedTrack)) return false;
    try {
      this.storage().setItem(
        KEY,
        JSON.stringify({ schemaVersion: 1, selectedTrack }),
      );
      return true;
    } catch {
      return false;
    }
  }
}
