/** Starter cosmetics only. Campaign reward vehicles are planned in docs/GARAGE_PROGRESSION.md. */
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
export type KartId = (typeof STARTER_KARTS)[number]["id"];
export function isKartId(value: unknown): value is KartId {
  return STARTER_KARTS.some((kart) => kart.id === value);
}
/** Driver IDs never change. Only model assignment rotates to avoid duplicate silhouettes. */
export function kartLineup(selected: KartId): number[] {
  const index = STARTER_KARTS.findIndex((kart) => kart.id === selected);
  return [index, ...STARTER_KARTS.map((_, i) => i).filter((i) => i !== index)];
}
