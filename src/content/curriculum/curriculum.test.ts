import { expect, it } from "vitest";
import {
  CAMPAIGN_LEVELS,
  CAMPAIGN_BONUSES,
  CATEGORIES,
  campaignLevel,
  campaignBonus,
  readCampaignRoute,
} from "../campaign";
import { INTRO_PASSAGES } from "./introductions";
import { CHAPTER_SKILLS } from "./authoring";
import { validateCurriculum } from "./validate";
import { TypingEngine } from "../../core/typing-engine";
import { createCpuSchedules, cpuProgress } from "../../core/cpu-schedule";
import {
  emptyCampaign,
  recordCampaignFinish,
  currentLevel,
  categorySummary,
  isUnlocked,
  validateCampaign,
} from "../../core/campaign-progress";

it("validates all 300 definitions and 30 reachable, distinct side challenges", () => {
  expect(validateCurriculum()).toEqual([]);
  for (const category of CATEGORIES) {
    expect(CHAPTER_SKILLS[category]).toHaveLength(10);
    for (let n = 1; n <= 6; n++)
      expect(campaignLevel(category, n)!.passage).toBe(
        INTRO_PASSAGES[category][n - 1],
      );
    const levels = CAMPAIGN_LEVELS.filter(
      (level) => level.category === category,
    );
    for (let i = 6; i < 100; i++) {
      expect(
        Math.abs(levels[i].passage.length - levels[i - 1].passage.length),
      ).toBeLessThan(300);
      expect(
        levels[i].paceGoal - levels[i - 1].paceGoal,
      ).toBeGreaterThanOrEqual(0);
      expect(levels[i].paceGoal - levels[i - 1].paceGoal).toBeLessThanOrEqual(
        1,
      );
    }
    expect(levels[99].passage.length).toBeGreaterThan(
      { easy: 1300, medium: 2100, hard: 2900 }[category],
    );
    expect(levels[99].paceGoal).toBe(
      { easy: 30, medium: 55, hard: 90 }[category],
    );
    expect(campaignLevel(category, 101)).toBeUndefined();
    expect(campaignBonus(category, 11)).toBeUndefined();
  }
  const hard = CAMPAIGN_LEVELS.filter((l) => l.category === "hard")
    .map((l) => l.passage)
    .join(" ");
  for (const symbol of "\"':;()-%.[]/\\@#$&{}<>!=_`|^~*+")
    expect(hard).toContain(symbol);
});

it("rejects broken identities, references, duplicates, advanced Easy text and prerequisite cycles", () => {
  for (const patch of [
    { id: "easy-101" },
    { passage: "Oops!" },
    { passage: CAMPAIGN_LEVELS[1].passage },
    { prerequisite: "easy-001" },
    { assets: { trackId: "missing", kartId: "missing" } },
    { passage: "a".repeat(3001) },
  ]) {
    const main = structuredClone(CAMPAIGN_LEVELS);
    Object.assign(main[0], patch);
    expect(validateCurriculum(main)).not.toEqual([]);
  }
});

it("completes every passage through the real engine, opens 9→10→11 and 99→100, and keeps bonuses separate", () => {
  for (const category of CATEGORIES) {
    let progress = emptyCampaign();
    for (let n = 1; n <= 100; n++) {
      const level = campaignLevel(category, n)!;
      let now = 0;
      const engine = new TypingEngine({
        passage: level.passage,
        now: () => now,
      });
      engine.start();
      now = 63000;
      engine.insert(level.passage);
      const result = recordCampaignFinish(progress, level, engine.snapshot());
      for (const cpu of createCpuSchedules(
        level.passage.length,
        category,
        level.seed,
        level.cpuBand,
      )) {
        expect(cpu.characterTimesMs).toHaveLength(level.passage.length);
        expect(cpuProgress(cpu, cpu.finishTimeMs)).toBe(1);
      }
      expect(result.accepted, level.id).toBe(true);
      progress = result.progress;
      expect(currentLevel(progress, category)).toBe(Math.min(100, n + 1));
      if (n % 10 === 0) {
        const bonus = campaignBonus(category, n / 10)!;
        expect(isUnlocked(progress, bonus)).toBe(true);
        const bonusEngine = new TypingEngine({
          passage: bonus.passage,
          now: () => now,
          countdownMs: 0,
        });
        bonusEngine.start();
        now += 60000;
        bonusEngine.insert(bonus.passage);
        const done = recordCampaignFinish(
          progress,
          bonus,
          bonusEngine.snapshot(),
        );
        expect(done.accepted).toBe(true);
        progress = done.progress;
        expect(categorySummary(progress, category).cleared).toBe(n);
        expect(
          recordCampaignFinish(progress, bonus, bonusEngine.snapshot())
            .newlyCleared,
        ).toBe(false);
      }
    }
    expect(Object.keys(progress.bonuses)).toHaveLength(10);
    expect(categorySummary(progress, category).cleared).toBe(100);
    expect(validateCampaign(progress)).toEqual(progress);
  }
});

it("creates deterministic CPU schedules and enforces the exact 3000-character boundary", () => {
  const longest = [...CAMPAIGN_LEVELS, ...CAMPAIGN_BONUSES].reduce((a, b) =>
    a.passage.length > b.passage.length ? a : b,
  );
  const cpus = createCpuSchedules(
    longest.passage.length,
    longest.tier,
    longest.seed,
    longest.cpuBand,
  );
  expect(cpus).toEqual(
    createCpuSchedules(
      longest.passage.length,
      longest.tier,
      longest.seed,
      longest.cpuBand,
    ),
  );
  for (const cpu of cpus) {
    expect(cpu.characterTimesMs).toHaveLength(longest.passage.length);
    expect(cpuProgress(cpu, cpu.finishTimeMs)).toBe(1);
  }
  new TypingEngine({ passage: "a".repeat(3000), now: () => 0 });
  expect(createCpuSchedules(3000, "hard", 1)[0].characterTimesMs).toHaveLength(
    3000,
  );
  expect(
    () => new TypingEngine({ passage: "a".repeat(3001), now: () => 0 }),
  ).toThrow(RangeError);
  expect(() => createCpuSchedules(3001, "hard", 1)).toThrow(RangeError);
});

it("rejects locked or paused bonuses and accepts only strict chapter routes", () => {
  const bonus = campaignBonus("easy", 1)!;
  expect(isUnlocked(emptyCampaign(), bonus)).toBe(false);
  expect(readCampaignRoute("#/bonus/hard/10")).toEqual({
    category: "hard",
    number: 10,
    bonus: true,
  });
  for (const route of [
    "#/bonus/easy/0",
    "#/bonus/easy/11",
    "#/bonus/easy/01",
    "#/bonus/easy/10/extra",
  ])
    expect(readCampaignRoute(route)).toBeUndefined();
  const p = emptyCampaign();
  for (let n = 1; n <= 10; n++)
    p.clears[campaignLevel("easy", n)!.id] = {
      stars: 1,
      bestWpm: 10,
      bestAccuracy: 90,
      bestTimeMs: 60000,
      revision: 1,
    };
  let now = 0;
  const e = new TypingEngine({
    passage: bonus.passage,
    now: () => now,
    countdownMs: 0,
  });
  e.start();
  now = 10000;
  e.pause();
  e.start();
  now += 3000;
  e.insert(bonus.passage);
  expect(e.snapshot().state).toBe("finished");
  expect(recordCampaignFinish(p, bonus, e.snapshot()).accepted).toBe(false);
  p.bonuses[bonus.id] = {
    stars: 1,
    bestWpm: 10,
    bestAccuracy: 90,
    bestTimeMs: 60000,
    revision: 1,
  };
  delete p.clears["easy-010"];
  expect(validateCampaign(p)).toBeNull();
});
