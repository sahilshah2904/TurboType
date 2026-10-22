import { describe, it, expect } from "vitest";
import { calibrationPace } from "./calibration";
import { TypingEngine, type TypingSnapshot } from "./typing-engine";
const measured = (patch: Partial<TypingSnapshot> = {}): TypingSnapshot => ({
  ...new TypingEngine({
    passage: "Keep a steady clean rhythm.",
    now: () => 0,
  }).snapshot(),
  state: "timed-out",
  elapsedMs: 30000,
  validatedLength: 90,
  wpm: 36,
  accuracyPercent: 100,
  ...patch,
});
describe("starting pace suggestion", () => {
  it("maps measured pace boundaries and prioritizes accuracy", () => {
    expect(calibrationPace(measured({ wpm: 29.9 }))).toBe("easy");
    expect(calibrationPace(measured({ wpm: 30 }))).toBe("medium");
    expect(calibrationPace(measured({ wpm: 54.9 }))).toBe("medium");
    expect(calibrationPace(measured({ wpm: 55 }))).toBe("hard");
    expect(calibrationPace(measured({ wpm: 80, accuracyPercent: 94.9 }))).toBe(
      "easy",
    );
    expect(calibrationPace(measured({ wpm: 80, accuracyPercent: 95 }))).toBe(
      "hard",
    );
  });
  it("withholds suggestions for insufficient, interrupted or assisted samples", () => {
    for (const patch of [
      { state: "racing" as const },
      { validatedLength: 19 },
      { elapsedMs: 9999 },
      { wpm: 0 },
      { wpm: NaN },
      { accuracyPercent: null },
      { practiceReasons: ["paused" as const] },
      { practiceReasons: ["blocked-assistance" as const] },
    ])
      expect(calibrationPace(measured(patch))).toBeNull();
  });
});
