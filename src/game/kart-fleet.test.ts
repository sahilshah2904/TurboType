import { describe, expect, it } from "vitest";
import { animateKart } from "./kart-fleet";

function assembly() {
  return {
    chassis: { y: 0 },
    wheels: [
      { angle: 0, image: { rotation: 0 } },
      { angle: 0, image: { rotation: 0 } },
    ],
  };
}
describe("independent kart motion", () => {
  it("keeps the paused/stopped assembly frozen and resumes without an elapsed-time jump", () => {
    const kart = assembly();
    animateKart(kart, 16, true, 200);
    const paused = structuredClone(kart);
    animateKart(kart, 10000, false, 10200);
    expect(kart).toEqual(paused);
    animateKart(kart, 16, true, 216);
    expect(kart.wheels[0].angle - paused.wheels[0].angle).toBeCloseTo(16 / 65);
  });
  it("leaves a reduced-motion assembly still while moving the full-motion chassis separately", () => {
    const reduced = assembly(),
      full = assembly();
    animateKart(reduced, 16, false, 200);
    expect(reduced).toEqual(assembly());
    animateKart(full, 16, true, 200);
    expect(full.chassis.y).not.toBe(0);
    expect(full.wheels.every((w) => w.image.rotation > 0)).toBe(true);
  });
  it("bounds decorative catch-up after a delayed frame and keeps angles bounded", () => {
    const kart = assembly();
    animateKart(kart, 10000, true, 200);
    expect(kart.wheels[0].angle).toBeCloseTo(50 / 65);
    for (let i = 0; i < 1000; i++) animateKart(kart, 50, true, i * 50);
    expect(kart.wheels[0].angle).toBeLessThan(Math.PI * 2);
  });
});
