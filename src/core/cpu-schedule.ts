export const CPU_TIERS = {
  easy: { minWpm: 18, maxWpm: 30 },
  medium: { minWpm: 35, maxWpm: 50 },
  hard: { minWpm: 65, maxWpm: 85 },
} as const;
export type CpuTier = keyof typeof CPU_TIERS;
export interface CpuSchedule {
  readonly id: string;
  readonly name: string;
  readonly targetWpm: number;
  readonly reactionMs: number;
  readonly hesitationCount: number;
  readonly correctionCount: number;
  readonly characterTimesMs: readonly number[];
  readonly finishTimeMs: number;
}

/** Fixed before GO. These quick-race bands are separate from campaign curricula. */
export function createCpuSchedules(
  length: number,
  tier: CpuTier,
  seed: number,
  campaignBand?: { minWpm: number; maxWpm: number },
): readonly CpuSchedule[] {
  if (
    !Number.isInteger(length) ||
    length < 1 ||
    length > 2000 ||
    !Object.hasOwn(CPU_TIERS, tier) ||
    !Number.isInteger(seed) ||
    seed < 0 ||
    seed > 0xffffffff
  )
    throw new RangeError(
      "Invalid CPU passage length, tier or unsigned 32-bit seed.",
    );
  const band = campaignBand ?? CPU_TIERS[tier];
  if (
    !Number.isFinite(band.minWpm) ||
    !Number.isFinite(band.maxWpm) ||
    band.minWpm < 1 ||
    band.maxWpm < band.minWpm ||
    band.maxWpm > 200
  )
    throw new RangeError("Invalid campaign CPU band.");
  return Object.freeze(
    ["Neon Fox", "Apex Nova", "Comet", "Volt"].map((name, index) => {
      let state = (seed ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
      const random = () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let value = Math.imul(state ^ (state >>> 15), state | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
      };
      const targetWpm =
        band.minWpm + (band.maxWpm - band.minWpm) * ((index + random()) / 4);
      const baseMs = 60000 / (targetWpm * 5);
      const reactionMs = 300 + random() * 700;
      let elapsed = reactionMs;
      let hesitationCount = 0;
      let correctionCount = 0;
      const times = Array.from({ length }, () => {
        elapsed += baseMs * (0.82 + random() * 0.36);
        if (random() < 0.08) {
          elapsed += 150 + random() * 400;
          hesitationCount++;
        }
        if (random() < 0.05) {
          elapsed += baseMs * (1.2 + random() * 1.2);
          correctionCount++;
        }
        return elapsed;
      });
      return Object.freeze({
        id: `cpu-${index + 1}`,
        name,
        targetWpm,
        reactionMs,
        hesitationCount,
        correctionCount,
        characterTimesMs: Object.freeze(times),
        finishTimeMs: elapsed,
      });
    }),
  );
}

/** Binary search makes progress a function of active time, never frame integration. */
export function cpuProgress(schedule: CpuSchedule, elapsedMs: number): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0)
    throw new RangeError("Invalid active time.");
  let low = 0;
  let high = schedule.characterTimesMs.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (schedule.characterTimesMs[middle] <= elapsedMs) low = middle + 1;
    else high = middle;
  }
  return low / schedule.characterTimesMs.length;
}
