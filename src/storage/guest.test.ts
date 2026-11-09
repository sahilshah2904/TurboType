import { expect, it } from "vitest";
import { campaignLevel } from "../content/campaign";
import { emptyCampaign } from "../core/campaign-progress";
import { economy, ownedEquipment, parseGuestSave } from "../core/progression";
import { TypingEngine } from "../core/typing-engine";
import { CAMPAIGN_STORAGE_KEY } from "./campaign";
import { GUEST_KEY, LocalGuestRepository } from "./guest";

function memory(initial: [string, string][] = []) {
  const data = new Map(initial);
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

function completed() {
  const level = campaignLevel("easy", 1)!;
  let now = 0;
  const engine = new TypingEngine({ passage: level.passage!, now: () => now });
  engine.start();
  now = 63000;
  engine.insert(level.passage!);
  return { level, snapshot: engine.snapshot(), ...engine.learningSummary() };
}

it("keeps one-time awards and ordinary replay rewards distinct and atomically saves the race", () => {
  const store = memory();
  const repo = new LocalGuestRepository(() => store);
  const { level, snapshot, pace, recovered, characters } = completed();
  const finish = (id: string) =>
    repo.finish(
      id.repeat(32),
      level.id,
      snapshot,
      1,
      pace,
      recovered,
      characters,
      level,
    );
  expect(finish("a")).toMatchObject({
    saved: true,
    newlyCleared: true,
    xp: 170,
    credits: 25,
  });
  expect(finish("a")).toMatchObject({ xp: 0, credits: 0 });
  expect(finish("b")).toMatchObject({
    saved: true,
    newlyCleared: false,
    xp: 125,
    credits: 20,
  });
  const restored = new LocalGuestRepository(() => store).snapshot();
  expect(economy(restored)).toMatchObject({ xp: 295, credits: 45, rank: 2 });
  expect(restored.history).toHaveLength(2);
  expect(restored.records[level.id].id).toBe("a".repeat(32));
});

it("migrates v2 without overwriting it and derives independent category ownership", () => {
  const campaign = emptyCampaign();
  for (let n = 1; n <= 15; n++)
    campaign.clears[campaignLevel("easy", n)!.id] = {
      stars: 1,
      bestWpm: 21,
      bestAccuracy: 95,
      bestTimeMs: 60000,
      revision: 1,
    };
  const v2 = JSON.stringify(campaign);
  const store = memory([[CAMPAIGN_STORAGE_KEY, v2]]);
  const repo = new LocalGuestRepository(() => store);
  expect(store.getItem(CAMPAIGN_STORAGE_KEY)).toBe(v2);
  expect(parseGuestSave(store.getItem(GUEST_KEY)!)?.campaign).toEqual(campaign);
  expect([...ownedEquipment(repo.read())]).toEqual([
    "reward-easy-015",
    "track-easy-010",
  ]);
});

it("retains malformed data, exports visit progress separately, and makes reset explicit", () => {
  const broken = '{"schemaVersion":99}';
  const store = memory([[GUEST_KEY, broken]]);
  const repo = new LocalGuestRepository(() => store);
  repo.position("easy", 100);
  expect(store.getItem(GUEST_KEY)).toBe(broken);
  expect(repo.retry()).toBe(false);
  expect(repo.exportRaw()).toBe(broken);
  expect(parseGuestSave(repo.exportCurrent())?.campaign.positions.easy).toBe(
    100,
  );
  expect(repo.reset()).toBe(true);
  expect(repo.read().positions.easy).toBeNull();
  expect(repo.exportRaw()).toBe(broken);
});
