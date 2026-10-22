import { expect, it } from "vitest";
import { LocalCampaignRepository, CAMPAIGN_STORAGE_KEY } from "./campaign";
import { campaignLevel } from "../content/campaign";
import { TypingEngine } from "../core/typing-engine";
function result() {
  let time = 0;
  const engine = new TypingEngine({
    passage: campaignLevel("easy", 1)!.passage!,
    now: () => time,
  });
  engine.start();
  time = 63000;
  engine.insert(campaignLevel("easy", 1)!.passage!);
  return engine.snapshot();
}
function memory(raw: string | null = null) {
  let value = raw;
  return {
    getItem: () => value,
    setItem: (key: string, next: string) => {
      expect(key).toBe(CAMPAIGN_STORAGE_KEY);
      value = next;
    },
  };
}
it("restores clears, bests and independent map positions without losing writes from another instance", () => {
  const store = memory();
  const a = new LocalCampaignRepository(() => store);
  const b = new LocalCampaignRepository(() => store);
  a.position("easy", 4000);
  b.position("hard", 8000);
  b.finish(campaignLevel("easy", 1)!, result());
  const c = new LocalCampaignRepository(() => store);
  expect(c.read().positions).toEqual({ easy: 4000, medium: null, hard: 8000 });
  expect(Object.keys(c.read().clears)).toEqual(["easy-001"]);
});
it.each([
  "{broken",
  '{"schemaVersion":99}',
  JSON.stringify({
    schemaVersion: 1,
    rulesVersion: 3,
    positions: { easy: 0, medium: 0, hard: 0 },
    clears: { "bad-id": {} },
  }),
])("preserves malformed or future data without overwriting it: %s", (raw) => {
  const store = memory(raw);
  const repo = new LocalCampaignRepository(() => store);
  expect(repo.finish(campaignLevel("easy", 1)!, result()).saved).toBe(false);
  repo.position("easy", 500);
  expect(store.getItem()).toBe(raw);
  expect(repo.exportRaw()).toBe(raw);
  expect(Object.keys(repo.read().clears)).toEqual(["easy-001"]);
});
it("keeps progress for the visit when reads or writes are denied", () => {
  const repo = new LocalCampaignRepository(() => {
    throw Error("denied");
  });
  expect(repo.finish(campaignLevel("easy", 1)!, result()).saved).toBe(false);
  repo.position("easy", 200);
  repo.reload();
  expect(repo.read().clears["easy-001"]).toBeDefined();
  expect(repo.status).toContain("visit only");
});
