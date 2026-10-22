import { describe, it, expect } from "vitest";
import { LocalOnboardingRepository, DEFAULT_ONBOARDING } from "./onboarding";

describe("optional onboarding preferences", () => {
  it("validates/migrates optional fields without inventing completion or rewards", () => {
    let raw: string | null = null;
    const repo = new LocalOnboardingRepository(() => ({
      getItem: () => raw,
      setItem: (_key, value) => {
        raw = value;
      },
    }));
    expect(repo.load()).toEqual(DEFAULT_ONBOARDING);
    const next = {
      ...DEFAULT_ONBOARDING,
      welcomeSeen: true,
      tutorialComplete: true,
      skipIntro: true,
      preferredPace: "medium" as const,
      calibration: { wpm: 36, accuracy: 98 },
    };
    expect(repo.save(next)).toBe(true);
    expect(repo.load()).toEqual(next);
    for (const bad of [
      "oops",
      "null",
      '{"schemaVersion":2,"tutorialComplete":true}',
    ]) {
      raw = bad;
      expect(repo.load()).toEqual(DEFAULT_ONBOARDING);
    }
    raw = JSON.stringify({
      schemaVersion: 1,
      skipIntro: "true",
      tutorialComplete: 1,
      preferredPace: "expert",
      calibration: { wpm: Infinity, accuracy: -5 },
    });
    expect(repo.load()).toEqual(DEFAULT_ONBOARDING);
    raw = JSON.stringify({
      schemaVersion: 1,
      calibration: { wpm: 20, accuracy: 101 },
    });
    expect(repo.load().calibration).toBeNull();
  });
  it("keeps a blocked preference store optional", () => {
    const repo = new LocalOnboardingRepository(() => {
      throw new Error("blocked");
    });
    expect(repo.load()).toEqual(DEFAULT_ONBOARDING);
    expect(repo.save({ ...DEFAULT_ONBOARDING, skipIntro: true })).toBe(false);
  });
});
