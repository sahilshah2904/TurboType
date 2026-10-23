import { describe, expect, it } from "vitest";
import { TypingEngine } from "./typing-engine";

function fixture(passage = "cat", timeLimitMs?: number) {
  let now = 0;
  const engine = new TypingEngine({ passage, now: () => now, timeLimitMs });
  return {
    engine,
    at: (value: number) => {
      now = value;
    },
    go: () => {
      engine.start();
      now = 3000;
      expect(engine.snapshot().state).toBe("racing");
    },
  };
}

describe("typing validation and metrics", () => {
  it("counts the documented cat correction as 75% accuracy", () => {
    const { engine, go, at } = fixture();
    go();
    engine.insert("cx");
    expect(engine.snapshot()).toMatchObject({
      validatedLength: 1,
      typedText: "cx",
      errorCount: 1,
    });
    engine.backspace();
    at(9000);
    engine.insert("at");
    expect(engine.snapshot()).toMatchObject({
      state: "finished",
      accuracyPercent: 75,
      totalAttempts: 4,
      correctAttempts: 3,
      correctedErrors: 1,
      elapsedMs: 6000,
      eligible: true,
    });
    expect(engine.snapshot().wpm).toBeCloseTo(6, 10);
  });
  it("counts inserts behind an unresolved error and retains only one error character", () => {
    const { engine, go } = fixture();
    go();
    engine.insert("cxyz");
    expect(engine.snapshot()).toMatchObject({
      typedText: "cx",
      totalAttempts: 4,
      errorCount: 3,
      cleanStreak: 0,
    });
    engine.backspace();
    engine.insert("at");
    expect(engine.snapshot()).toMatchObject({
      totalAttempts: 6,
      correctAttempts: 3,
      accuracyPercent: 50,
      correctedErrors: 1,
    });
  });
  it("matches spaces, punctuation and case exactly", () => {
    const { engine, go } = fixture("A b.");
    go();
    engine.insert("a");
    expect(engine.snapshot().validatedLength).toBe(0);
    engine.backspace();
    engine.insert("A b.");
    expect(engine.snapshot().state).toBe("finished");
  });
  it("reduces progress on deleting correct text without farming streaks", () => {
    const { engine, go } = fixture("abcdef");
    go();
    engine.insert("abc");
    engine.backspace();
    engine.backspace();
    engine.insert("bc");
    expect(engine.snapshot()).toMatchObject({
      validatedLength: 3,
      cleanStreak: 3,
      correctAttempts: 5,
      longestStreak: 3,
    });
    engine.insert("d");
    expect(engine.snapshot().cleanStreak).toBe(4);
  });
  it("does not create negative progress or attempts on empty Backspace", () => {
    const { engine, go } = fixture();
    go();
    engine.backspace();
    expect(engine.snapshot()).toMatchObject({
      totalAttempts: 0,
      validatedLength: 0,
      accuracyPercent: null,
      wpm: 0,
    });
  });
  it("counts a non-ASCII erroneous code point once and removes it once", () => {
    const { engine, go } = fixture();
    go();
    engine.insert("🚗");
    engine.backspace();
    expect(engine.snapshot()).toMatchObject({
      typedText: "",
      totalAttempts: 1,
      correctedErrors: 1,
    });
  });
  it("stops accepting input and freezes metrics at exact finish time", () => {
    const { engine, go, at } = fixture();
    go();
    at(5000);
    engine.insert("catMORE");
    const result = engine.snapshot();
    at(90000);
    engine.insert("x");
    engine.backspace();
    engine.pause();
    expect(engine.snapshot()).toEqual(result);
  });
});

describe("timing and lifecycle", () => {
  it("ignores pre-GO input and uses the real countdown deadline even with delayed ticks", () => {
    const { engine, at } = fixture();
    engine.insert("c");
    engine.start();
    at(2999);
    engine.insert("c");
    expect(engine.snapshot()).toMatchObject({ countdown: 1, totalAttempts: 0 });
    at(7000);
    expect(engine.snapshot()).toMatchObject({
      state: "racing",
      elapsedMs: 4000,
    });
  });
  it("canceling the initial countdown returns to ready without a pause penalty", () => {
    const { engine, at } = fixture();
    engine.start();
    at(1000);
    engine.pause();
    expect(engine.snapshot()).toMatchObject({
      state: "ready",
      elapsedMs: 0,
      practiceReasons: [],
    });
  });
  it("excludes pause and resume countdown time, preserving input", () => {
    const { engine, go, at } = fixture();
    go();
    at(4000);
    engine.insert("c");
    at(5000);
    engine.pause();
    at(10000);
    expect(engine.snapshot().elapsedMs).toBe(2000);
    engine.start();
    at(12999);
    engine.insert("a");
    expect(engine.snapshot().typedText).toBe("c");
    at(16000);
    engine.insert("at");
    expect(engine.snapshot()).toMatchObject({
      elapsedMs: 5000,
      state: "finished",
      eligible: false,
      practiceReasons: ["paused"],
    });
  });
  it("pausing a resume countdown keeps the original pause state", () => {
    const { engine, go, at } = fixture();
    go();
    engine.pause();
    engine.start();
    at(4000);
    engine.pause();
    expect(engine.snapshot()).toMatchObject({ state: "paused", elapsedMs: 0 });
  });
  it("times out exactly at the declared active limit before accepting boundary input", () => {
    const { engine, go, at } = fixture("cat", 1000);
    go();
    engine.insert("c");
    at(4000);
    engine.insert("at");
    expect(engine.snapshot()).toMatchObject({
      state: "timed-out",
      elapsedMs: 1000,
      validatedLength: 1,
      totalAttempts: 1,
      eligible: false,
    });
    at(20000);
    expect(engine.snapshot().elapsedMs).toBe(1000);
  });
  it("untimed races do not expire and repeated starts do not reset clocks", () => {
    const { engine, go, at } = fixture();
    go();
    at(900000);
    engine.start();
    expect(engine.snapshot()).toMatchObject({
      state: "racing",
      elapsedMs: 897000,
    });
  });
  it("abandon preserves partial metrics and rejects further input", () => {
    const { engine, go, at } = fixture();
    go();
    engine.insert("c");
    at(5000);
    engine.abandon();
    at(8000);
    engine.insert("at");
    expect(engine.snapshot()).toMatchObject({
      state: "abandoned",
      typedText: "c",
      elapsedMs: 2000,
      eligible: false,
    });
  });
  it("clamps backwards timestamps and rejects a nonfinite clock", () => {
    const { engine, go, at } = fixture();
    go();
    at(5000);
    engine.snapshot();
    at(4000);
    expect(engine.snapshot().elapsedMs).toBe(2000);
    expect(() =>
      new TypingEngine({ passage: "cat", now: () => NaN }).snapshot(),
    ).toThrow(RangeError);
  });
  it.each(["", "hello\nworld", "café", "a".repeat(2001)])(
    "rejects unsupported passage content",
    (passage) => {
      expect(() => fixture(passage)).toThrow(RangeError);
    },
  );
  it.each([0, -1, Infinity, NaN])("rejects invalid time limit %s", (limit) => {
    expect(() => fixture("cat", limit)).toThrow(RangeError);
  });
});

describe("streak, recent pace and eligibility", () => {
  it("applies nitro milestones/cooldown without queuing missed bursts or adding distance", () => {
    const { engine, go, at } = fixture("a".repeat(100));
    go();
    engine.insert("a".repeat(20));
    expect(engine.snapshot()).toMatchObject({
      nitroBursts: 1,
      progress: 0.2,
      nitroActive: true,
    });
    at(4000);
    engine.insert("a".repeat(20));
    expect(engine.snapshot().nitroBursts).toBe(1);
    at(5500);
    engine.insert("a".repeat(20));
    expect(engine.snapshot().nitroBursts).toBe(2);
    at(6400);
    expect(engine.snapshot().nitroActive).toBe(false);
  });
  it("ages recent pace on active time without changing average WPM", () => {
    const { engine, go, at } = fixture("abcdef");
    go();
    at(4000);
    engine.insert("abc");
    expect(engine.snapshot().recentWpm).toBe(36);
    at(8001);
    expect(engine.snapshot().recentWpm).toBe(0);
    expect(engine.snapshot().wpm).toBeGreaterThan(0);
  });
  it("records assisted/composed runs as practice-only without awarding attempts for a rejected edit", () => {
    const { engine, go } = fixture();
    go();
    engine.markPractice("blocked-assistance");
    expect(engine.snapshot().totalAttempts).toBe(0);
    engine.markPractice("composed-input");
    engine.insert("cat");
    expect(engine.snapshot()).toMatchObject({
      eligible: false,
      practiceReasons: ["blocked-assistance", "composed-input"],
    });
  });
});

it("starts keyboard diagnostics immediately while retaining strict correction", () => {
  const engine = new TypingEngine({
    passage: "the",
    now: () => 0,
    countdownMs: 0,
  });
  engine.start();
  expect(engine.snapshot().state).toBe("racing");
  engine.insert("txhe");
  expect(engine.snapshot().typedText).toBe("tx");
  engine.backspace();
  engine.insert("he");
  expect(engine.snapshot().state).toBe("finished");
  for (const countdownMs of [-1, NaN, Infinity])
    expect(
      () => new TypingEngine({ passage: "a", now: () => 0, countdownMs }),
    ).toThrow(RangeError);
});
