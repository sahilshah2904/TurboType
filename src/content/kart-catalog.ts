import { CAR_REWARDS } from "./collection";
import type { Category } from "../core/contracts";

/** The five original starter vehicles also supply the four CPU models. */
export const STARTER_KARTS = [
  {
    id: "volt-kart",
    name: "Volt Kart",
    file: "parts/volt-kart-preview.webp",
    style: "Coral street racer",
  },
  {
    id: "neon-fox",
    name: "Neon Fox",
    file: "parts/neon-fox-preview.webp",
    style: "Amber rally cage",
  },
  {
    id: "apex-nova",
    name: "Apex Nova",
    file: "parts/apex-nova-preview.webp",
    style: "Cobalt aero racer",
  },
  {
    id: "comet",
    name: "Comet",
    file: "parts/comet-preview.webp",
    style: "Pearl rocket streamliner",
  },
  {
    id: "volt-rival",
    name: "Volt Electric",
    file: "parts/volt-rival-preview.webp",
    style: "Violet electric concept",
  },
] as const;
type RewardKartId = `reward-${Category}-${string}`;
export type KartId = (typeof STARTER_KARTS)[number]["id"] | RewardKartId;
export const KARTS = [
  ...STARTER_KARTS,
  ...CAR_REWARDS.map((item) => ({
    id: item.id as RewardKartId,
    name: item.name,
    file: `rewards/${item.id}-preview.svg`,
    style: `${item.family[0].toUpperCase()}${item.family.slice(1)} · campaign reward`,
  })),
];
export function isKartId(value: unknown): value is KartId {
  return KARTS.some((kart) => kart.id === value);
}
/** Driver IDs never change. Only model assignment rotates to avoid duplicate silhouettes. */
export function kartLineup(selected: KartId): number[] {
  const index = Math.max(
    0,
    KARTS.findIndex((kart) => kart.id === selected),
  );
  return [
    index,
    ...STARTER_KARTS.map((_, i) => i)
      .filter((i) => i !== index)
      .slice(0, 4),
  ];
}
