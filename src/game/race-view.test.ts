import { expect, it } from "vitest";
import { SoloRace } from "../core/solo-race";
import {
  CAR_FRONT_OFFSET,
  projectRace,
  RaceFeedback,
  type RaceSnapshot,
} from "./race-view";
function snapshot(): RaceSnapshot {
  return new SoloRace({
    passage: "a".repeat(100),
    tier: "easy",
    seed: 42,
    now: () => 0,
  }).snapshot();
}
it("follows the player, approaches the finish and retains offscreen lane indicators", () => {
  const s = snapshot();
  s.player.progress = 0.5;
  s.standings.find((r) => !r.cpu)!.progress = 0.5;
  const view = projectRace(s, false);
  expect(view.cars[0].x).toBe(330);
  expect(view.finishX).toBeGreaterThan(1000);
  expect(view.cars[1].edge).toBe("left");
  s.player.progress = 1;
  s.standings.find((r) => !r.cpu)!.progress = 1;
  const finish = projectRace(s, false);
  expect(finish.cars[0].x + CAR_FRONT_OFFSET).toBe(finish.finishX);
  expect(finish.finishX).toBeLessThan(1000);
});
it("uses a stable full-course projection for reduced motion without changing race data", () => {
  const s = snapshot();
  s.player.progress = 0.5;
  s.standings.find((r) => !r.cpu)!.progress = 0.5;
  const before = structuredClone(s),
    view = projectRace(s, true);
  expect(view.camera).toBe(0);
  expect(view.finishX).toBe(880 + CAR_FRONT_OFFSET);
  expect(view.cars.every((c) => c.edge === null)).toBe(true);
  expect(s).toEqual(before);
});
it("announces genuine improvements with active-time cooldown, no pause/retry duplicates", () => {
  const s = snapshot(),
    feedback = new RaceFeedback();
  feedback.update(s);
  s.player.state = "racing";
  s.standings.find((r) => !r.cpu)!.place = 5;
  expect(feedback.update(s)).toBeNull();
  s.player.elapsedMs = 1000;
  s.standings.find((r) => !r.cpu)!.place = 4;
  expect(feedback.update(s)).toContain("OVERTAKE");
  s.player.elapsedMs = 1500;
  s.standings.find((r) => !r.cpu)!.place = 3;
  expect(feedback.update(s)).toBeNull();
  s.player.state = "paused";
  s.player.elapsedMs = 9000;
  expect(feedback.update(s)).toBeNull();
  s.player.state = "racing";
  s.standings.find((r) => !r.cpu)!.place = 1;
  expect(feedback.update(s)).toBe("INTO THE LEAD");
  expect(feedback.update(s)).toBeNull();
  s.player.state = "ready";
  feedback.update(s);
  s.player.state = "racing";
  expect(feedback.update(s)).toBeNull();
});
