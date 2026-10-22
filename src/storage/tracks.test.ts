import { describe, expect, it } from "vitest";
import { STARTER_TRACKS, isTrackId } from "../content/track-catalog";
import { LocalTrackRepository } from "./tracks";

describe("starter track preference", () => {
  it("round-trips all five starters and falls back for invalid/unowned/versioned data", () => {
    let raw: string | null = null;
    const repo = new LocalTrackRepository(() => ({
      getItem: () => raw,
      setItem: (_key, value) => {
        raw = value;
      },
    }));
    expect(new Set(STARTER_TRACKS.map((t) => t.id)).size).toBe(5);
    for (const track of STARTER_TRACKS) {
      expect(repo.save(track.id)).toBe(true);
      expect(repo.load()).toBe(track.id);
    }
    for (const value of [
      "bad json",
      "null",
      '{"schemaVersion":2,"selectedTrack":"coral-coast"}',
      '{"schemaVersion":1,"selectedTrack":"track-hard-090"}',
    ]) {
      raw = value;
      expect(repo.load()).toBe("neon-harbor");
    }
    expect(isTrackId("track-easy-015")).toBe(false);
  });
  it("keeps optional storage failures nonfatal", () => {
    const repo = new LocalTrackRepository(() => {
      throw new Error("blocked");
    });
    expect(repo.load()).toBe("neon-harbor");
    expect(repo.save("coral-coast")).toBe(false);
  });
});
