import {
  CAMPAIGN_LEVELS,
  CAMPAIGN_BONUSES,
  CATEGORIES,
  type CampaignLevel,
} from "../campaign";
import { isTrackId } from "../track-catalog";
import { isKartId } from "../kart-catalog";
import { MAX_PASSAGE_CHARACTERS } from "../../config/typing";

/** Validate shipped definitions, independently of the offline passage author. */
export function validateCurriculum(
  main: readonly CampaignLevel[] = CAMPAIGN_LEVELS,
  bonuses: readonly CampaignLevel[] = CAMPAIGN_BONUSES,
): string[] {
  const errors: string[] = [];
  const all = [...main, ...bonuses];
  const byId = new Map(all.map((level) => [level.id, level]));
  if (main.length !== 300 || bonuses.length !== 30 || byId.size !== 330)
    errors.push("Expected 300 unique main levels and 30 unique bonuses.");
  const text = new Set<string>();
  const references = new Set<string>();
  for (const category of CATEGORIES) {
    const levels = main.filter((level) => level.category === category);
    if (
      levels.length !== 100 ||
      levels.some((level, i) => level.number !== i + 1)
    )
      errors.push(`${category}: main numbering must be 1–100.`);
    if (bonuses.filter((level) => level.category === category).length !== 10)
      errors.push(`${category}: ten side challenges required.`);
  }
  for (const level of all) {
    const fail = (message: string) => errors.push(`${level.id}: ${message}`);
    const id =
      level.kind === "main"
        ? `${level.category}-${String(level.number).padStart(3, "0")}`
        : `${level.category}-bonus-${String(level.chapter).padStart(2, "0")}`;
    const chapter = Math.floor((level.number - 1) / 10) + 1;
    if (
      id !== level.id ||
      !CATEGORIES.includes(level.category) ||
      chapter !== level.chapter ||
      chapter < 1 ||
      chapter > 10 ||
      level.revision !== 1
    )
      fail("Invalid stable identity/chapter/revision.");
    if (
      !level.title ||
      !level.focus ||
      !level.skills.length ||
      !level.passageId ||
      references.has(level.passageId)
    )
      fail("Missing or duplicate passage/objective reference.");
    references.add(level.passageId);
    const normalized = level.passage?.toLowerCase().replace(/\s+/g, " ");
    if (
      !level.passage ||
      !/^[\x20-\x7e]+$/.test(level.passage) ||
      level.passage.length > MAX_PASSAGE_CHARACTERS ||
      level.passage !== level.passage.trim() ||
      / {2}/.test(level.passage)
    )
      fail("Unsupported or oversized English passage.");
    if (text.has(normalized)) fail("Duplicate passage.");
    text.add(normalized);
    if (level.category === "easy" && !/^[a-z .]+$/.test(level.passage))
      fail("Easy must remain lowercase words, spaces and periods.");
    if (
      !isTrackId(level.environment) ||
      !isTrackId(level.assets.trackId) ||
      !isKartId(level.assets.kartId)
    )
      fail("Missing shipped asset reference.");
    if (
      !Number.isInteger(level.seed) ||
      level.seed < 0 ||
      level.seed > 0xffffffff ||
      level.tier !== level.category ||
      !Number.isFinite(level.cpuBand.minWpm) ||
      !Number.isFinite(level.cpuBand.maxWpm) ||
      level.cpuBand.minWpm < 1 ||
      level.cpuBand.maxWpm < level.cpuBand.minWpm ||
      level.cpuBand.maxWpm > 100 ||
      !Number.isFinite(level.paceGoal) ||
      level.paceGoal < 1 ||
      level.accuracyGoal !== 95
    )
      fail("Invalid fixed goals or CPU band.");
    const prerequisite =
      level.kind === "bonus"
        ? `${level.category}-${String(level.number).padStart(3, "0")}`
        : level.number === 1
          ? null
          : `${level.category}-${String(level.number - 1).padStart(3, "0")}`;
    if (
      level.prerequisite !== prerequisite ||
      (prerequisite && !byId.has(prerequisite))
    )
      fail("Missing or incorrect prerequisite.");
    if (
      level.kind === "bonus" &&
      (level.number % 10 || level.role !== "side-challenge")
    )
      fail("Bonus must follow its chapter showcase.");
    if (
      level.kind === "main" &&
      level.number === 100 &&
      level.role !== "finale"
    )
      fail("Missing category finale.");
    let cursor: CampaignLevel | undefined = level;
    const visited = new Set<string>();
    while (cursor) {
      if (visited.has(cursor.id)) {
        fail("Prerequisite cycle.");
        break;
      }
      visited.add(cursor.id);
      cursor = cursor.prerequisite ? byId.get(cursor.prerequisite) : undefined;
    }
  }
  return errors;
}
