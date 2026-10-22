import { describe, expect, it } from "vitest";
import { CPU_TIERS, createCpuSchedules, cpuProgress } from "./cpu-schedule";

describe("seeded CPU schedules", () => {
  it("reproduces four distinct monotonic schedules without global random state", () => {
    const schedules = createCpuSchedules(200, "easy", 42);
    expect(schedules).toEqual(createCpuSchedules(200, "easy", 42));
    expect(schedules).not.toEqual(createCpuSchedules(200, "easy", 43));
    expect(new Set(schedules.map((s) => s.finishTimeMs)).size).toBe(4);
    for (const s of schedules) {
      expect(s.characterTimesMs).toHaveLength(200);
      expect(
        s.characterTimesMs.every(
          (t, i) => t > (s.characterTimesMs[i - 1] ?? s.reactionMs),
        ),
      ).toBe(true);
      expect(s.targetWpm).toBeGreaterThanOrEqual(CPU_TIERS.easy.minWpm);
      expect(s.targetWpm).toBeLessThanOrEqual(CPU_TIERS.easy.maxWpm);
      expect(s.hesitationCount).toBeGreaterThan(0);
      expect(s.correctionCount).toBeGreaterThan(0);
      expect(Object.isFrozen(s.characterTimesMs)).toBe(true);
    }
  });
  it("selects pace before GO and includes reaction/correction delays in finish time", () => {
    for (const tier of ["easy", "medium", "hard"] as const) {
      const cpu = createCpuSchedules(100, tier, 99)[0];
      expect(cpu.targetWpm).toBeGreaterThanOrEqual(CPU_TIERS[tier].minWpm);
      expect(cpu.finishTimeMs).toBeGreaterThan(cpu.reactionMs);
      expect(cpuProgress(cpu, 0)).toBe(0);
      expect(cpuProgress(cpu, cpu.characterTimesMs[0] - 0.001)).toBe(0);
      expect(cpuProgress(cpu, cpu.characterTimesMs[0])).toBe(0.01);
      expect(cpuProgress(cpu, cpu.finishTimeMs)).toBe(1);
      expect(cpuProgress(cpu, cpu.finishTimeMs + 1000)).toBe(1);
    }
  });
  it("has identical progress and exact finish times under sparse and frequent renders", () => {
    const cpu = createCpuSchedules(100, "medium", 123)[0];
    for (let t = 0; t < 20000; t += 16) cpuProgress(cpu, t);
    const dense = cpuProgress(cpu, 20000);
    expect(cpuProgress(createCpuSchedules(100, "medium", 123)[0], 20000)).toBe(
      dense,
    );
    expect(cpu.finishTimeMs).toBe(
      createCpuSchedules(100, "medium", 123)[0].finishTimeMs,
    );
  });
  it.each([0, -1, 2001, 1.5])("rejects invalid passage length %s", (length) => {
    expect(() => createCpuSchedules(length, "easy", 1)).toThrow(RangeError);
  });
  it.each([-1, NaN, Infinity, 1.5, 4294967296])(
    "rejects invalid seed %s",
    (seed) => {
      expect(() => createCpuSchedules(10, "easy", seed)).toThrow(RangeError);
    },
  );
  it("accepts unsigned seed boundaries and rejects invalid time queries", () => {
    expect(createCpuSchedules(1, "easy", 0)).toHaveLength(4);
    const cpu = createCpuSchedules(1, "hard", 0xffffffff)[0];
    expect(() => cpuProgress(cpu, -1)).toThrow(RangeError);
    expect(() => cpuProgress(cpu, NaN)).toThrow(RangeError);
  });
});

it("uses a fixed validated campaign band without changing Quick Race defaults", () => {
  const band = { minWpm: 10, maxWpm: 18 };
  const a = createCpuSchedules(900, "hard", 42, band);
  expect(a).toEqual(createCpuSchedules(900, "hard", 42, band));
  for (const cpu of a) {
    expect(cpu.targetWpm).toBeGreaterThanOrEqual(10);
    expect(cpu.targetWpm).toBeLessThanOrEqual(18);
  }
  expect(() =>
    createCpuSchedules(900, "easy", 42, { minWpm: NaN, maxWpm: 18 }),
  ).toThrow();
  expect(() =>
    createCpuSchedules(900, "easy", 42, { minWpm: 20, maxWpm: 10 }),
  ).toThrow();
});
