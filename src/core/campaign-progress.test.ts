import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  CAMPAIGN_LEVELS,
  campaignLevel,
  readCampaignRoute,
} from "../content/campaign";
import {
  emptyCampaign,
  recordCampaignFinish,
  currentLevel,
  categorySummary,
  validateCampaign,
  isUnlocked,
} from "./campaign-progress";
import { TypingEngine } from "./typing-engine";
import { SoloRace } from "./solo-race";
function finish(
  number = 1,
  category: "easy" | "medium" | "hard" = "easy",
  paused = false,
) {
  const level = campaignLevel(category, number)!;
  let time = 0;
  const engine = new TypingEngine({ passage: level.passage!, now: () => time });
  engine.start();
  time = 3000;
  engine.snapshot();
  if (paused) {
    time = 4000;
    engine.pause();
    engine.start();
    time = 7000;
  }
  time += 60000;
  engine.insert(level.passage!);
  return engine.snapshot();
}
describe("campaign maps and eligible clears", () => {
  (it("has exactly 100 stable stops per category and six original progressively longer samples", () => {
    expect(CAMPAIGN_LEVELS).toHaveLength(300);
    expect(new Set(CAMPAIGN_LEVELS.map((l) => l.id)).size).toBe(300);
    for (const category of CATEGORIES) {
      const levels = CAMPAIGN_LEVELS.filter((l) => l.category === category);
      expect(levels.map((l) => l.number)).toEqual(
        Array.from({ length: 100 }, (_, i) => i + 1),
      );
      expect(levels.filter((l) => l.passage)).toHaveLength(6);
      let length = 0;
      for (const level of levels.slice(0, 6)) {
        expect(level.passage!.length).toBeGreaterThan(length);
        length = level.passage!.length;
        expect(level.passage).toMatch(/^[\x20-\x7e]{1,2000}$/);
        new SoloRace({
          passage: level.passage!,
          tier: category,
          cpuBand: level.cpuBand,
          seed: level.seed,
          now: () => 0,
        });
      }
      expect(levels[3].passage!.length).toBeGreaterThan(280);
      expect(levels[5].passage!.length).toBeGreaterThan(750);
      expect(campaignLevel(category, 101)).toBeUndefined();
    }
  }),
    it("unlocks one same-category stop, independently of winning or extra stars", () => {
      const start = emptyCampaign();
      const result = recordCampaignFinish(
        start,
        campaignLevel("easy", 1)!,
        finish(),
      );
      expect(result.accepted).toBe(true);
      expect(result.newlyCleared).toBe(true);
      expect(currentLevel(result.progress, "easy")).toBe(2);
      expect(currentLevel(result.progress, "medium")).toBe(1);
      expect(currentLevel(start, "easy")).toBe(1);
      expect(categorySummary(result.progress, "easy")).toEqual({
        cleared: 1,
        stars: 2,
      });
    }),
    it("rejects locked, paused, unfinished, assisted, mismatched and invalid finishes", () => {
      const level = campaignLevel("easy", 1)!;
      const snapshot = finish();
      expect(
        recordCampaignFinish(
          emptyCampaign(),
          campaignLevel("easy", 2)!,
          finish(2),
        ).accepted,
      ).toBe(false);
      for (const result of [
        finish(1, "easy", true),
        { ...snapshot, state: "paused" as const },
        { ...snapshot, practiceReasons: ["blocked-assistance" as const] },
        { ...snapshot, passage: "wrong" },
        { ...snapshot, wpm: NaN },
        { ...snapshot, elapsedMs: 0 },
      ])
        expect(
          recordCampaignFinish(emptyCampaign(), level, result).accepted,
        ).toBe(false);
    }),
    it("unions independently earned stars without inflating first clears or worsening bests", () => {
      const level = campaignLevel("easy", 1)!;
      let progress = recordCampaignFinish(emptyCampaign(), level, {
        ...finish(),
        accuracyPercent: 94,
        wpm: 20,
      }).progress;
      expect(progress.clears[level.id].stars).toBe(5);
      const replay = recordCampaignFinish(progress, level, {
        ...finish(),
        accuracyPercent: 96,
        wpm: 10,
        elapsedMs: 90000,
      });
      progress = replay.progress;
      expect(replay.newlyCleared).toBe(false);
      expect(categorySummary(progress, "easy")).toEqual({
        cleared: 1,
        stars: 3,
      });
      expect(progress.clears[level.id]).toMatchObject({
        bestWpm: 20,
        bestAccuracy: 96,
        bestTimeMs: 60000,
      });
    }),
    it("validates sequential state across chapter and final boundaries without level 101", () => {
      const progress = emptyCampaign();
      for (const category of CATEGORIES)
        for (let n = 1; n <= 100; n++)
          progress.clears[campaignLevel(category, n)!.id] = {
            stars: 1,
            bestWpm: 10,
            bestAccuracy: 90,
            bestTimeMs: 60000,
            revision: 1,
          };
      expect(validateCampaign(progress)).toEqual(progress);
      for (const category of CATEGORIES) {
        expect(currentLevel(progress, category)).toBe(100);
        expect(isUnlocked(progress, campaignLevel(category, 100)!)).toBe(true);
      }
      delete progress.clears["easy-010"];
      expect(validateCampaign(progress)).toBeNull();
    }),
    it("parses only valid category and 1–100 links", () => {
      expect(readCampaignRoute("#/campaign/easy")).toEqual({
        category: "easy",
      });
      expect(readCampaignRoute("#/level/hard/100")).toEqual({
        category: "hard",
        number: 100,
      });
      for (const hash of [
        "#/level/easy/101",
        "#/level/easy/0",
        "#/level/easy/01",
        "#/level/easy/1/extra",
        "#/level/oops/1",
      ])
        expect(readCampaignRoute(hash)).toBeUndefined();
    }),
    it("preserves raw metric thresholds at the accuracy and pace boundaries", () => {
      const level = campaignLevel("easy", 1)!;
      expect(
        recordCampaignFinish(emptyCampaign(), level, {
          ...finish(),
          accuracyPercent: 94.999,
          wpm: 14.999,
        }).progress.clears[level.id].stars,
      ).toBe(1);
      expect(
        recordCampaignFinish(emptyCampaign(), level, {
          ...finish(),
          accuracyPercent: 95,
          wpm: 15,
        }).progress.clears[level.id].stars,
      ).toBe(7);
    }));
});

it("finishes the longest original paragraph in every category through the actual typing engine", () => {
  for (const category of CATEGORIES) {
    const progress = emptyCampaign();
    for (let number = 1; number <= 6; number++) {
      const level = campaignLevel(category, number)!;
      const result = recordCampaignFinish(
        progress,
        level,
        finish(number, category),
      );
      expect(result.accepted).toBe(true);
      Object.assign(progress, result.progress);
    }
    expect(categorySummary(progress, category).cleared).toBe(6);
    expect(currentLevel(progress, category)).toBe(7);
  }
});
