import {
  CATEGORIES,
  campaignLevel,
  type CampaignLevel,
  type Category,
} from "../content/campaign";
import type { TypingSnapshot } from "./typing-engine";
export interface LevelProgress {
  stars: number; // bit 1: completion, bit 2: accuracy, bit 4: pace; union across eligible replays
  bestWpm: number;
  bestAccuracy: number;
  bestTimeMs: number;
  revision: 1;
}
export interface CampaignProgress {
  schemaVersion: 1;
  rulesVersion: 3;
  clears: Record<string, LevelProgress>;
  positions: Record<Category, number | null>;
}
export function emptyCampaign(): CampaignProgress {
  return {
    schemaVersion: 1,
    rulesVersion: 3,
    clears: {},
    positions: { easy: null, medium: null, hard: null },
  };
}
export function starCount(bits: number): number {
  return (
    Number(Boolean(bits & 1)) +
    Number(Boolean(bits & 2)) +
    Number(Boolean(bits & 4))
  );
}
export function currentLevel(
  progress: CampaignProgress,
  category: Category,
): number {
  for (let n = 1; n <= 100; n++)
    if (!progress.clears[campaignLevel(category, n)!.id]) return n;
  return 100;
}
export function isUnlocked(
  progress: CampaignProgress,
  level: CampaignLevel,
): boolean {
  return level.number <= currentLevel(progress, level.category);
}
export function categorySummary(
  progress: CampaignProgress,
  category: Category,
) {
  const clears = Object.entries(progress.clears).filter(([id]) =>
    id.startsWith(`${category}-`),
  );
  return {
    cleared: clears.length,
    stars: clears.reduce((sum, [, value]) => sum + starCount(value.stars), 0),
  };
}
/** Pure navigation progress, separate from the future economy/ownership receipt system. */
export function recordCampaignFinish(
  progress: CampaignProgress,
  level: CampaignLevel,
  result: TypingSnapshot,
): { accepted: boolean; newlyCleared: boolean; progress: CampaignProgress } {
  if (
    !level.passage ||
    !isUnlocked(progress, level) ||
    result.state !== "finished" ||
    !result.eligible ||
    result.practiceReasons.length ||
    result.passage !== level.passage ||
    result.progress !== 1 ||
    result.validatedLength !== level.passage.length ||
    !Number.isFinite(result.wpm) ||
    result.wpm < 0 ||
    !Number.isFinite(result.elapsedMs) ||
    result.elapsedMs <= 0 ||
    result.accuracyPercent === null ||
    !Number.isFinite(result.accuracyPercent) ||
    result.accuracyPercent < 0 ||
    result.accuracyPercent > 100
  )
    return { accepted: false, newlyCleared: false, progress };
  const previous = progress.clears[level.id];
  const stars =
    1 |
    (result.accuracyPercent >= level.accuracyGoal ? 2 : 0) |
    (result.wpm >= level.paceGoal ? 4 : 0);
  return {
    accepted: true,
    newlyCleared: !previous,
    progress: {
      ...progress,
      clears: {
        ...progress.clears,
        [level.id]: {
          stars: (previous?.stars ?? 0) | stars,
          bestWpm: Math.max(previous?.bestWpm ?? 0, result.wpm),
          bestAccuracy: Math.max(
            previous?.bestAccuracy ?? 0,
            result.accuracyPercent,
          ),
          bestTimeMs: Math.min(
            previous?.bestTimeMs ?? Infinity,
            result.elapsedMs,
          ),
          revision: 1,
        },
      },
    },
  };
}
export function validateCampaign(value: unknown): CampaignProgress | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<CampaignProgress>;
  if (
    v.schemaVersion !== 1 ||
    v.rulesVersion !== 3 ||
    !v.clears ||
    typeof v.clears !== "object" ||
    Array.isArray(v.clears) ||
    !v.positions ||
    typeof v.positions !== "object"
  )
    return null;
  const result = emptyCampaign();
  // A partial or non-sequential record is rejected intact, never silently rewritten.
  for (const category of CATEGORIES) {
    const position = v.positions[category];
    if (
      position !== null &&
      (typeof position !== "number" ||
        !Number.isFinite(position) ||
        position < 0 ||
        position > 17000)
    )
      return null;
    result.positions[category] = position;
    let gap = false;
    for (let n = 1; n <= 100; n++) {
      const level = campaignLevel(category, n)!;
      const entry = v.clears[level.id];
      if (!entry) {
        gap = true;
        continue;
      }
      if (
        gap ||
        typeof entry !== "object" ||
        entry.revision !== 1 ||
        !Number.isInteger(entry.stars) ||
        entry.stars < 1 ||
        entry.stars > 7 ||
        !(entry.stars & 1) ||
        !Number.isFinite(entry.bestWpm) ||
        entry.bestWpm < 0 ||
        !Number.isFinite(entry.bestAccuracy) ||
        entry.bestAccuracy < 0 ||
        entry.bestAccuracy > 100 ||
        !Number.isFinite(entry.bestTimeMs) ||
        entry.bestTimeMs <= 0
      )
        return null;
      result.clears[level.id] = {
        stars: entry.stars,
        bestWpm: entry.bestWpm,
        bestAccuracy: entry.bestAccuracy,
        bestTimeMs: entry.bestTimeMs,
        revision: 1,
      };
    }
  }
  if (Object.keys(v.clears).length !== Object.keys(result.clears).length)
    return null;
  return result;
}
