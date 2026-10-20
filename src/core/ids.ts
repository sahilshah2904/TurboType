import {
  CATEGORIES,
  type Category,
  type LevelId,
  type PlayerId,
  type RaceId,
} from "./contracts";

export function createLevelId(
  category: Category,
  levelNumber: number,
): LevelId {
  if (
    !CATEGORIES.includes(category) ||
    !Number.isInteger(levelNumber) ||
    levelNumber < 1 ||
    levelNumber > 100
  ) {
    throw new RangeError(
      "A campaign level must have a valid category and number from 1 to 100.",
    );
  }
  return `${category}-${String(levelNumber).padStart(3, "0")}`;
}

export function isLevelId(value: unknown): value is LevelId {
  return (
    typeof value === "string" &&
    /^(easy|medium|hard)-(00[1-9]|0[1-9]\d|100)$/.test(value)
  );
}

export function createRaceId(): RaceId {
  return crypto.randomUUID() as RaceId;
}

export function createPlayerId(): PlayerId {
  return crypto.randomUUID() as PlayerId;
}
