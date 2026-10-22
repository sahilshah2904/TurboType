/** Starter scenery is cosmetic. Campaign rewards/ownership are authored separately. */
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
export type TrackId = (typeof STARTER_TRACKS)[number]["id"];
export type TrackTheme = (typeof STARTER_TRACKS)[number];
export function isTrackId(value: unknown): value is TrackId {
  return STARTER_TRACKS.some((track) => track.id === value);
}
export function trackTheme(id: TrackId): TrackTheme {
  return STARTER_TRACKS.find((track) => track.id === id)!;
}
