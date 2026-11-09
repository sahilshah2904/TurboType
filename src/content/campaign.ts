import type { CpuTier } from "../core/cpu-schedule";
import { STARTER_TRACKS, type TrackId } from "./track-catalog";
import { INTRO_PASSAGES } from "./curriculum/introductions";
import { CHAPTER_SKILLS } from "./curriculum/authoring";
import CATALOG from "./curriculum/catalog.json";

export const CATEGORIES = ["easy", "medium", "hard"] as const;
export type Category = (typeof CATEGORIES)[number];
export const CATEGORY_NAMES = { easy: "Easy", medium: "Medium", hard: "Hard" };
export const DISTRICTS = [
  "Starting lights",
  "Harbor loop",
  "Coastal rhythm",
  "Canyon crossing",
  "Forest run",
  "Mountain climb",
  "Skyline sweep",
  "Night shift",
  "Open horizon",
  "The long run",
];
export function isCategory(value: string): value is Category {
  return CATEGORIES.includes(value as Category);
}
export interface CampaignLevel {
  id: string;
  category: Category;
  number: number;
  chapter: number;
  title: string;
  focus: string;
  revision: 1;
  passage: string;
  kind: "main" | "bonus";
  passageId: string;
  prerequisite: string | null;
  skills: readonly string[];
  role: "lesson" | "pit-stop" | "showcase" | "finale" | "side-challenge";
  environment: TrackId;
  assets: { trackId: TrackId; kartId: "volt-kart" };
  /** Authored data for Phase 9; no XP or credits are granted in Phase 8. */
  plannedReward: { xp: number; credits: number };
  milestones: readonly {
    kind: "pit-stop" | "chapter" | "finale";
    receiptId: string;
    xp: number;
    credits: number;
  }[];
  paceGoal: number;
  accuracyGoal: 95;
  tier: CpuTier;
  cpuBand: { minWpm: number; maxWpm: number };
  seed: number;
}

const catalog = new Map(CATALOG.map((entry) => [entry.id, entry]));
function makeLevel(
  category: Category,
  number: number,
  bonus = false,
): CampaignLevel {
  const c = CATEGORIES.indexOf(category);
  const chapter = Math.floor((number - 1) / 10) + 1;
  const id = bonus
    ? `${category}-bonus-${String(chapter).padStart(2, "0")}`
    : `${category}-${String(number).padStart(3, "0")}`;
  const entry = catalog.get(id);
  const progress = Math.max(0, number - 6) / 94;
  const paceGoal = Math.round([15, 30, 50][c] + progress * [15, 25, 40][c]);
  const track = STARTER_TRACKS[Math.floor((chapter - 1) / 2)];
  const passage =
    !bonus && number <= 6
      ? INTRO_PASSAGES[category][number - 1]
      : entry!.passage;
  return {
    id,
    kind: bonus ? "bonus" : "main",
    category,
    number,
    chapter,
    title:
      entry?.title ??
      [
        "Find your rhythm",
        "Settle into the road",
        "Keep it flowing",
        "The first paragraph",
        "The longer route",
        "Stay the distance",
      ][number - 1],
    focus:
      entry?.focus ??
      `${CHAPTER_SKILLS[category][0][0]}: ${CHAPTER_SKILLS[category][0][1]}`,
    skills: entry?.skills ?? [CHAPTER_SKILLS[category][0][0]],
    revision: 1,
    passageId: `${id}-passage-v1`,
    passage,
    prerequisite: bonus
      ? `${category}-${String(number).padStart(3, "0")}`
      : number > 1
        ? `${category}-${String(number - 1).padStart(3, "0")}`
        : null,
    role: bonus
      ? "side-challenge"
      : number === 100
        ? "finale"
        : number % 10 === 0
          ? "showcase"
          : number % 10 === 5
            ? "pit-stop"
            : "lesson",
    environment: track.id,
    assets: { trackId: track.id, kartId: "volt-kart" },
    plannedReward: bonus ? { xp: 50, credits: 10 } : { xp: 20, credits: 5 },
    milestones: bonus
      ? []
      : [
          ...(number % 10 === 5
            ? [
                {
                  kind: "pit-stop" as const,
                  receiptId: `${id}-pit-stop`,
                  xp: 50,
                  credits: 20,
                },
              ]
            : []),
          ...(number % 10 === 0
            ? [
                {
                  kind: "chapter" as const,
                  receiptId: `${category}-chapter-${chapter}`,
                  xp: 100,
                  credits: 40,
                },
              ]
            : []),
          ...(number === 100
            ? [
                {
                  kind: "finale" as const,
                  receiptId: `${category}-finale`,
                  xp: 500,
                  credits: 100,
                },
              ]
            : []),
        ],
    paceGoal,
    accuracyGoal: 95,
    tier: category,
    cpuBand: {
      minWpm: Math.round([10, 25, 45][c] + progress * [10, 15, 25][c]),
      maxWpm: Math.round([18, 35, 60][c] + progress * [17, 25, 40][c]),
    },
    seed: (0x54540000 + c * 1000 + number + (bonus ? 500 : 0)) >>> 0,
  };
}
export const CAMPAIGN_LEVELS: readonly CampaignLevel[] = CATEGORIES.flatMap(
  (category) =>
    Array.from({ length: 100 }, (_, i) => makeLevel(category, i + 1)),
);
export const CAMPAIGN_BONUSES: readonly CampaignLevel[] = CATEGORIES.flatMap(
  (category) =>
    Array.from({ length: 10 }, (_, i) =>
      makeLevel(category, (i + 1) * 10, true),
    ),
);
export function campaignBonus(
  category: Category,
  chapter: number,
): CampaignLevel | undefined {
  return CAMPAIGN_BONUSES.find(
    (level) => level.category === category && level.chapter === chapter,
  );
}
export function campaignLink(level: CampaignLevel): string {
  return level.kind === "bonus"
    ? `#/bonus/${level.category}/${level.chapter}`
    : `#/level/${level.category}/${level.number}`;
}
export function campaignLevel(
  category: Category,
  number: number,
): CampaignLevel | undefined {
  return CAMPAIGN_LEVELS.find(
    (level) => level.category === category && level.number === number,
  );
}
export function categoryLevels(category: Category): readonly CampaignLevel[] {
  return CAMPAIGN_LEVELS.filter((level) => level.category === category);
}
export function readCampaignRoute(
  hash: string,
): { category: Category; number?: number; bonus?: true } | undefined {
  const bonus = /^#\/bonus\/(easy|medium|hard)\/([1-9]|10)$/.exec(hash);
  if (bonus && isCategory(bonus[1]))
    return { category: bonus[1], number: Number(bonus[2]), bonus: true };
  const match =
    /^#\/(campaign|level)\/(easy|medium|hard)(?:\/([1-9]\d?|100))?$/.exec(hash);
  if (!match || !isCategory(match[2]) || (match[1] === "level" && !match[3]))
    return;
  return {
    category: match[2],
    ...(match[3] ? { number: Number(match[3]) } : {}),
  };
}
