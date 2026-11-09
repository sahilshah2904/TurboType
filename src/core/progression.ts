import { CONTENT_VERSION, RULES_VERSION } from "../config/versions";
import {
  CAMPAIGN_BONUSES,
  CATEGORIES,
  categoryLevels,
  type CampaignLevel,
} from "../content/campaign";
import { CAR_REWARDS, TRACK_REWARDS } from "../content/collection";
import {
  categorySummary,
  emptyCampaign,
  validateCampaign,
  type CampaignProgress,
} from "./campaign-progress";
import type { CharacterSample, TypingSnapshot } from "./typing-engine";
import { isKartId, type KartId } from "../content/kart-catalog";
import { isTrackId, type TrackId } from "../content/track-catalog";

export const HISTORY_LIMIT = 100;
export const SAVE_LIMIT = 1024 * 1024;
export interface RunSummary {
  id: string;
  event: string;
  at: number;
  elapsedMs: number;
  wpm: number;
  attempts: number;
  correct: number;
  eligible: boolean;
  finished: boolean;
  pace: number[];
}

export interface GuestSave {
  schemaVersion: 1;
  rulesVersion: typeof RULES_VERSION;
  contentVersion: typeof CONTENT_VERSION;
  revision: number;
  updatedAt: number;
  campaign: CampaignProgress;
  raceXp: number;
  raceCredits: number;
  recoveryBadge: boolean;
  history: RunSummary[];
  records: Record<string, RunSummary>;
  characters: Record<string, CharacterSample>;
  kart?: KartId;
  track?: TrackId;
}

const campaignEvents = [
  ...CATEGORIES.flatMap(categoryLevels),
  ...CAMPAIGN_BONUSES,
];
const eventKeys = new Set(campaignEvents.map((event) => event.id));
const quickEvent = /^quick-[0-2]-(easy|medium|hard)-(timed|untimed)$/;
export function newGuestSave(campaign = emptyCampaign()): GuestSave {
  return {
    schemaVersion: 1,
    rulesVersion: RULES_VERSION,
    contentVersion: CONTENT_VERSION,
    revision: 0,
    updatedAt: 0,
    campaign,
    raceXp: 0,
    raceCredits: 0,
    recoveryBadge: false,
    history: [],
    records: {},
    characters: {},
  };
}

export function milestoneAwards(progress: CampaignProgress) {
  const awards: { id: string; xp: number; credits: number }[] = [];
  for (const category of CATEGORIES) {
    for (const level of categoryLevels(category)) {
      const clear = progress.clears[level.id];
      if (!clear) continue;
      awards.push({ id: `clear:${level.id}`, xp: 20, credits: 5 });
      if (level.number % 10 === 5)
        awards.push({ id: `pit:${level.id}`, xp: 50, credits: 20 });
      if (level.number % 10 === 0)
        awards.push({ id: `chapter:${level.id}`, xp: 100, credits: 40 });
      if (clear.bestAccuracy === 100)
        awards.push({ id: `perfect:${level.id}`, xp: 25, credits: 0 });
      if (level.number === 100)
        awards.push({ id: `finale:${level.id}`, xp: 500, credits: 100 });
    }
    const stars = categorySummary(progress, category).stars;
    for (let threshold = 30; threshold <= stars; threshold += 30)
      awards.push({
        id: `cache:${category}:${threshold}`,
        xp: 100,
        credits: 25,
      });
  }
  for (const id of Object.keys(progress.bonuses))
    awards.push({ id: `bonus:${id}`, xp: 50, credits: 10 });
  return awards;
}

export function economy(save: GuestSave) {
  const awards = milestoneAwards(save.campaign);
  const xp = awards.reduce((sum, award) => sum + award.xp, save.raceXp);
  const credits = awards.reduce(
    (sum, award) => sum + award.credits,
    save.raceCredits,
  );
  return { xp, credits, rank: 1 + Math.floor(Math.sqrt(xp / 100)), awards };
}

export function ownedEquipment(progress: CampaignProgress) {
  const counts = Object.fromEntries(
    CATEGORIES.map((category) => [
      category,
      categorySummary(progress, category).cleared,
    ]),
  );
  return new Set(
    [...CAR_REWARDS, ...TRACK_REWARDS]
      .filter((item) => counts[item.category] >= item.level)
      .map((item) => item.id),
  );
}

export function ordinaryReward(
  snapshot: TypingSnapshot,
  place: number,
  level?: CampaignLevel,
) {
  if (snapshot.state !== "finished" || level?.kind === "bonus")
    return { xp: 0, credits: 0 };
  if (!snapshot.eligible) {
    return snapshot.practiceReasons.length === 1 &&
      snapshot.practiceReasons[0] === "paused"
      ? { xp: 50, credits: 10 }
      : { xp: 0, credits: 0 };
  }
  const accuracy =
    snapshot.correctAttempts / Math.max(1, snapshot.totalAttempts);
  return {
    xp: 50 + Math.floor(50 * accuracy) + ([0, 25, 15, 10][place] ?? 0),
    credits: 10 + Math.floor(10 * accuracy),
  };
}

const whole = (value: unknown, max: number): value is number =>
  Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= max;
const finite = (value: unknown, max: number): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= max;
function validCharacters(value: unknown): value is GuestSave["characters"] {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.entries(value).every(
      ([key, sample]) =>
        /^[\x20-\x7e]$/.test(key) &&
        !!sample &&
        whole(sample.attempts, 1e8) &&
        whole(sample.errors, sample.attempts) &&
        whole(sample.timingCount, sample.attempts) &&
        whole(sample.timingMs, sample.timingCount * 5000),
    )
  );
}
function validRun(value: unknown): value is RunSummary {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<RunSummary>;
  return (
    typeof row.id === "string" &&
    /^[a-f0-9]{32}$/.test(row.id) &&
    typeof row.event === "string" &&
    (eventKeys.has(row.event) || quickEvent.test(row.event)) &&
    whole(row.at, 8.64e15) &&
    finite(row.elapsedMs, 8.64e15) &&
    finite(row.wpm, 1e12) &&
    whole(row.attempts, 1e8) &&
    whole(row.correct, row.attempts) &&
    typeof row.eligible === "boolean" &&
    typeof row.finished === "boolean" &&
    (!row.eligible || row.finished) &&
    Array.isArray(row.pace) &&
    row.pace.length <= 20 &&
    row.pace.every((pace) => finite(pace, 1e6))
  );
}

function cleanRun(run: RunSummary): RunSummary {
  const {
    id,
    event,
    at,
    elapsedMs,
    wpm,
    attempts,
    correct,
    eligible,
    finished,
    pace,
  } = run;
  return {
    id,
    event,
    at,
    elapsedMs,
    wpm,
    attempts,
    correct,
    eligible,
    finished,
    pace,
  };
}

export function parseGuestSave(raw: string): GuestSave | null {
  if (
    raw.length > SAVE_LIMIT ||
    new TextEncoder().encode(raw).length > SAVE_LIMIT
  )
    return null;
  try {
    const value = JSON.parse(raw) as GuestSave;
    const campaign = validateCampaign(value?.campaign);
    if (
      !campaign ||
      value.schemaVersion !== 1 ||
      value.rulesVersion !== RULES_VERSION ||
      value.contentVersion !== CONTENT_VERSION ||
      !whole(value.revision, Number.MAX_SAFE_INTEGER - 1) ||
      !whole(value.updatedAt, 8.64e15) ||
      !whole(value.raceXp, 1e12) ||
      !whole(value.raceCredits, 1e12) ||
      typeof value.recoveryBadge !== "boolean" ||
      !Array.isArray(value.history) ||
      value.history.length > HISTORY_LIMIT ||
      !value.history.every(validRun) ||
      new Set(value.history.map((run) => run.id)).size !==
        value.history.length ||
      (value.kart !== undefined && !isKartId(value.kart)) ||
      (value.track !== undefined && !isTrackId(value.track)) ||
      !validCharacters(value.characters ?? {}) ||
      !value.records ||
      typeof value.records !== "object" ||
      Array.isArray(value.records) ||
      Object.entries(value.records).some(
        ([event, run]) =>
          !validRun(run) || run.event !== event || !run.eligible,
      )
    )
      return null;
    return {
      schemaVersion: 1,
      rulesVersion: RULES_VERSION,
      contentVersion: CONTENT_VERSION,
      revision: value.revision,
      updatedAt: value.updatedAt,
      campaign,
      raceXp: value.raceXp,
      raceCredits: value.raceCredits,
      recoveryBadge: value.recoveryBadge,
      history: value.history.map(cleanRun),
      records: Object.fromEntries(
        Object.entries(value.records).map(([key, run]) => [key, cleanRun(run)]),
      ),
      characters: Object.fromEntries(
        Object.entries(value.characters ?? {}).map(([key, sample]) => {
          const { attempts, errors, timingCount, timingMs } = sample;
          return [key, { attempts, errors, timingCount, timingMs }];
        }),
      ),
      ...(value.kart ? { kart: value.kart } : {}),
      ...(value.track ? { track: value.track } : {}),
    };
  } catch {
    return null;
  }
}
