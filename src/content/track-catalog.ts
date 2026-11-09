import { TRACK_REWARDS } from "./collection";
import type { Category } from "../core/contracts";

/** Starter scenery is available to every driver. */
export const STARTER_TRACKS = [
  {
    id: "neon-harbor",
    name: "Neon Harbor",
    setting: "City lights · night",
    sky: 0x0a131b,
    glow: 0xa4ebff,
    land: 0x172b34,
    detail: 0x72c4db,
    road: 0x18232c,
    edge: 0x63e7f2,
  },
  {
    id: "coral-coast",
    name: "Coral Coast",
    setting: "Ocean promenade · sunset",
    sky: 0x302436,
    glow: 0xffcb88,
    land: 0x1b4e61,
    detail: 0xffbe8c,
    road: 0x222a35,
    edge: 0xffb68e,
  },
  {
    id: "copper-canyon",
    name: "Copper Canyon",
    setting: "Desert mesas · dusk",
    sky: 0x2c202a,
    glow: 0xffcc8b,
    land: 0x774633,
    detail: 0xd4915e,
    road: 0x29262d,
    edge: 0xf2b66b,
  },
  {
    id: "emerald-trail",
    name: "Emerald Trail",
    setting: "Pine forest · twilight",
    sky: 0x0c252b,
    glow: 0xb4ecdc,
    land: 0x123b34,
    detail: 0x39806a,
    road: 0x182b2b,
    edge: 0x92e3be,
  },
  {
    id: "frostline-pass",
    name: "Frostline Pass",
    setting: "Snow peaks · blue hour",
    sky: 0x172439,
    glow: 0xd9f1ff,
    land: 0x3c536e,
    detail: 0xb7d4e6,
    road: 0x202d3d,
    edge: 0xaddcff,
  },
] as const;
type RewardTrackId = `track-${Category}-${string}`;
export type TrackId = (typeof STARTER_TRACKS)[number]["id"] | RewardTrackId;
export type TrackMotif =
  | "canal"
  | "transit"
  | "docks"
  | "boardwalk"
  | "lighthouse"
  | "switchback"
  | "orchard"
  | "arch"
  | "caldera"
  | "badlands"
  | "waterfall"
  | "aurora"
  | "viaduct"
  | "observatory"
  | "orbital"
  | "skyway"
  | "prism"
  | "skyline"
  | "grandstand"
  | "ring"
  | "citadel";
export interface TrackTheme {
  id: TrackId;
  name: string;
  setting: string;
  sky: number;
  glow: number;
  land: number;
  detail: number;
  road: number;
  edge: number;
  motif?: TrackMotif;
}
const THEMES: readonly (readonly [
  TrackMotif,
  string,
  number,
  number,
  number,
  number,
])[] = [
  [
    "canal",
    "Lantern bridges · teal dusk",
    0x153247,
    0xf3b465,
    0x235256,
    0xffb85d,
  ],
  [
    "transit",
    "Rain and elevated rail · midnight",
    0x14233b,
    0x9b9be4,
    0x293b56,
    0x76d5ff,
  ],
  [
    "docks",
    "Cargo cranes · incoming storm",
    0x242639,
    0xe4bbc4,
    0x333b51,
    0xfa9b78,
  ],
  [
    "boardwalk",
    "Ferris wheel and pier · sunset",
    0x674255,
    0xffc291,
    0x2d5866,
    0xffb898,
  ],
  [
    "lighthouse",
    "Coastal cliffs · sapphire sea",
    0x224b73,
    0xf0f4d9,
    0x24547b,
    0xb7f1ee,
  ],
  [
    "switchback",
    "Alpine switchbacks · midnight",
    0x141d32,
    0xcdd9f4,
    0x3a4a66,
    0xa5bfff,
  ],
  [
    "orchard",
    "Terraced blossoms and windmills",
    0x3e5b60,
    0xf7dbad,
    0x30564a,
    0xffaacc,
  ],
  [
    "arch",
    "Red-rock bridges · afternoon",
    0x65464c,
    0xffcc7f,
    0x884832,
    0xf0a061,
  ],
  [
    "caldera",
    "Volcanic ridges · lava glow",
    0x352333,
    0xfd795c,
    0x503034,
    0xfc8f46,
  ],
  [
    "badlands",
    "Sandstone spires · amber dusk",
    0x744f3b,
    0xffd384,
    0x8d553f,
    0xffbe68,
  ],
  [
    "waterfall",
    "Cascades and forest · mist",
    0x234f51,
    0xb9e9c9,
    0x235148,
    0x80e3ce,
  ],
  ["aurora", "Ice peaks · aurora", 0x16243e, 0xa2f5d6, 0x364c6d, 0x75f0b6],
  [
    "viaduct",
    "Stone viaduct · river lights",
    0x253b56,
    0xf7c98c,
    0x415162,
    0xf2bd86,
  ],
  [
    "observatory",
    "Mountain observatories · warm horizon",
    0x4d354f,
    0xffc9a2,
    0x53445d,
    0xffdfa2,
  ],
  [
    "orbital",
    "Orbital service gantries · stars",
    0x10172f,
    0xd8b4ff,
    0x383656,
    0xc19fff,
  ],
  [
    "skyway",
    "Elevated port skyway · blue hour",
    0x193b54,
    0xfc8f99,
    0x2f5370,
    0x76dae7,
  ],
  [
    "prism",
    "Glass towers · neon twilight",
    0x2a2146,
    0xf496fa,
    0x423461,
    0x7ae7ec,
  ],
  [
    "skyline",
    "Sky bridges · midnight skyline",
    0x181a3c,
    0xb7adff,
    0x344372,
    0x8aa6ff,
  ],
  [
    "grandstand",
    "Festival boulevard and grandstands",
    0x4c3247,
    0xffd197,
    0x553b58,
    0xf7c46e,
  ],
  [
    "ring",
    "Illuminated ring and observatory district",
    0x252846,
    0xefd7ff,
    0x3d4b69,
    0xdf98ff,
  ],
  [
    "citadel",
    "Citadel towers · eventide",
    0x342841,
    0xffa0a0,
    0x503747,
    0xf5a59b,
  ],
];
export const REWARD_TRACKS: TrackTheme[] = TRACK_REWARDS.map(
  (reward, index) => {
    const [motif, setting, sky, glow, land, detail] = THEMES[index];
    return {
      id: reward.id as RewardTrackId,
      name: reward.name,
      motif,
      setting,
      sky,
      glow,
      land,
      detail,
      road: 0x202a35,
      edge: detail,
    };
  },
);
export const TRACKS: readonly TrackTheme[] = [
  ...STARTER_TRACKS,
  ...REWARD_TRACKS,
];
export function isTrackId(value: unknown): value is TrackId {
  return TRACKS.some((track) => track.id === value);
}
export function trackTheme(id: TrackId): TrackTheme {
  return TRACKS.find((track) => track.id === id)!;
}
