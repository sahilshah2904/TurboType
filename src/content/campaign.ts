import type { CpuTier } from "../core/cpu-schedule";

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
  passage?: string;
  paceGoal: number;
  accuracyGoal: 95;
  tier: CpuTier;
  cpuBand: { minWpm: number; maxWpm: number };
  seed: number;
}

// Original, playable map samples. Full reviewed 100-level curricula belong to Phase 8.
const PASSAGES: Record<Category, readonly string[]> = {
  easy: [
    "the road is open and the sky is clear",
    "a small car rolls past the quiet park as the sun rises over the trees",
    "we take the long road by the lake and keep a steady pace as a cool breeze moves through the green grass and the tall reeds",
    "the early light falls across the road as we leave the town behind us. a row of trees runs beside the river and birds rise from the reeds. we keep our hands calm and our eyes on the next word. there is no need to rush each turn. a smooth and steady rhythm will carry us all the way to the little bridge ahead.",
    "a quiet road leads from the village to the coast. we pass a farm with a red gate and a field full of tall grass. near the next bend a small stream runs under a stone bridge. the air feels cool and the road is clear. we slow our thoughts and let each word arrive in its own time. a clean line matters more than a quick start. beyond the hill we can see the sea and a line of white boats near the shore. we follow the road until the trees open and the whole bay comes into view. it is a good place to pause and look back at how far we have come.",
    "the old road winds through a wide valley where the fields meet the edge of a forest. we set out in the soft light of morning and listen to the low hum of the wheels. a small town rests behind us and the next bridge is still far ahead. we do not try to reach it all at once. we work through one clear word and then the next. when a mistake appears we stop and put it right before moving on. soon the road feels less strange and our hands find an even rhythm. near the river a flock of birds lifts into the air and turns toward the hills. we follow the river past a wooden gate and a quiet mill. the sun climbs higher as the last bend brings us to the bridge. the journey has taken time but our pace has stayed calm from the first mile to the last. we cross together and carry that steady feeling into the road ahead.",
  ],
  medium: [
    "The morning road is quiet. Keep a steady rhythm, and let each word lead to the next.",
    "Beyond the harbor, a narrow road follows the water. Small boats move through the mist, while the first lights of the town fade behind us.",
    "We leave the busy streets and follow the coast toward a little cafe. The journey is unhurried, with time to notice the boats, the pale sky, and the trees beside the road. Every clean sentence helps us settle into a more consistent rhythm.",
    "The road along the coast changes as the morning grows brighter. At first, the sea is hidden behind a line of low buildings. Then a bend opens onto a quiet bay, where fishing boats rock beside a wooden pier. We keep a comfortable pace and watch the next stretch of road. There's no prize for rushing past a word that needs attention. A brief correction brings us back into rhythm, and the journey continues with a little more confidence than before.",
    "At the edge of town, we turn away from the traffic and follow a road through the hills. The air is cooler here, and the trees cast long shadows across the ground. A small sign points toward the old station, but we continue beside the river. We've chosen a longer route because it gives us room to settle into a steady rhythm. Some words feel familiar, while others need a little more care. When the rhythm breaks, we take a breath, correct the mistake, and begin again. By the time the road reaches the next village, the sun has climbed above the roofs. A baker opens a door, a cyclist waves, and the quiet street begins to wake. We pass slowly through the square before returning to the open road, ready for the next part of the journey.",
    "A long journey begins with a simple decision: keep moving at a pace you can sustain. We leave the harbor after breakfast and head toward the green hills beyond the city. The first few turns are familiar, but the route soon carries us through places we haven't seen before. There are small farms, stone walls, and narrow bridges over clear streams. Each scene asks for a little attention, just as each sentence asks us to notice its shape. We don't need to race through every difficult word. Instead, we keep the rhythm comfortable and make careful corrections when they are needed. Near midday, the road opens onto a wide valley. We stop beside a field to look at the distant mountains, then return to the route with fresh focus. The final stretch follows the river into a village with bright windows and a quiet square. It feels good to arrive, but the real progress came from staying attentive through the whole journey. Tomorrow, we can bring the same patience to a new road and a new set of words.",
  ],
  hard: [
    'At 7:30, the garage lights flickered on. "Ready for the coast?" Mira asked. We checked the route, closed the gate, and rolled into the quiet street.',
    'The route covered 24 miles, including 3 narrow bridges and a steep climb. "Keep it smooth," the navigator said. A quick start would mean little if we lost our rhythm halfway through the journey.',
    'At the first junction, we chose the longer route: 18 miles beside the river, followed by a climb through the forest. The schedule said 9:45, but the weather had other plans. "Stay patient; we have time," Mira reminded us. We adjusted our pace, watched the changing light, and carried on toward the next checkpoint.',
    'The workshop clock showed 6:15 when the team arrived. Outside, a cool wind carried the smell of rain across the empty road. "We have 42 miles ahead of us," said the navigator, "so find a rhythm you can keep." The first section passed through familiar streets, but the route soon turned toward the hills. There were tight corners, short tunnels, and a long bridge above the valley. We checked each instruction carefully; a missed detail could send us the wrong way. By the second checkpoint, the clouds had begun to lift. The road was still demanding, yet our pace felt calmer because we had stopped treating every turn as an emergency.',
    'Before sunrise, the garage was already busy. A map lay open on the bench, with 5 checkpoints marked in blue and a note beside the final climb: "Save your focus for the last section." We left at 6:40 and followed the river out of town. At first, the route seemed simple; then the road narrowed, the signs became harder to spot, and a sudden shower blurred the hills. Nobody gained anything by rushing. We read each instruction, corrected small mistakes, and kept our pace consistent. At checkpoint 3, the rain stopped. Sunlight broke through the clouds, revealing a line of stone houses above the valley. There were still 16 miles to go, including 2 steep bends near the summit. "One section at a time," the navigator said. We took that advice all the way to the ridge, where the final checkpoint waited beside an old weather station. The finish felt satisfying because our attention had lasted through the difficult middle of the journey.',
    'The final route was longer than any we had attempted that week: 68 miles, 7 checkpoints, and a mountain pass that often disappeared into cloud. At 5:50, the team gathered around a map and agreed on a simple plan. "Read carefully, keep the pace sustainable, and correct a mistake before it grows," Mira said. We left the sleeping town behind and followed the river toward the first checkpoint. The opening miles felt easy, but the road soon demanded more attention. Small signs appeared beside sharp bends; narrow bridges led into dark tunnels; a temporary diversion added 4 miles to the climb. We adjusted without abandoning our rhythm. At the halfway point, a light rain began to fall. It would have been tempting to hurry, yet tired hands and hurried decisions rarely work well together. We stayed patient through the forest and reached the ridge just after 9:20. Beyond it, sunlight filled a broad valley. The final descent required the same care as the first climb, so we kept reading every instruction until the last checkpoint came into view. Only then did we look back at the route. The achievement was more than a quick opening or a dramatic finish; it was the steady attention we had carried through every mile between them.',
  ],
};
export const CAMPAIGN_LEVELS: readonly CampaignLevel[] = CATEGORIES.flatMap(
  (category, c) =>
    Array.from({ length: 100 }, (_, i) => ({
      id: `${category}-${String(i + 1).padStart(3, "0")}`,
      category,
      number: i + 1,
      chapter: Math.floor(i / 10) + 1,
      title:
        i < 3
          ? ["Find your rhythm", "Settle into the road", "Keep it flowing"][i]
          : i < 6
            ? ["The first paragraph", "The longer route", "Stay the distance"][
                i - 3
              ]
            : `Level ${i + 1}`,
      focus:
        c === 0
          ? "Common words, spacing and steady lowercase prose"
          : c === 1
            ? "Capitals, commas, contractions and sustained prose"
            : "Quotes, numerals, punctuation and sustained concentration",
      revision: 1 as const,
      passage: PASSAGES[category][i],
      paceGoal: [15, 30, 50][c] + Math.floor(i / 10) * [2, 3, 4][c],
      accuracyGoal: 95 as const,
      tier: category,
      cpuBand: {
        minWpm: [10, 25, 45][c] + Math.floor(i / 10) * 3,
        maxWpm: [18, 35, 60][c] + Math.floor(i / 10) * 3,
      },
      seed: (0x54540000 + c * 1000 + i + 1) >>> 0,
    })),
);
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
): { category: Category; number?: number } | undefined {
  const match =
    /^#\/(campaign|level)\/(easy|medium|hard)(?:\/([1-9]\d?|100))?$/.exec(hash);
  if (!match || !isCategory(match[2]) || (match[1] === "level" && !match[3]))
    return;
  return {
    category: match[2],
    ...(match[3] ? { number: Number(match[3]) } : {}),
  };
}
