import { CATEGORIES } from "./campaign";

/** Stable planned IDs; these designs are not selectable assets or ownership receipts. */
const CAR_ROWS = [
  ["Streetline RS", "Trailbreaker XR", "Aero Board"],
  ["Vector GT", "Apex Sprint", "Sky Phantom"],
  ["Circuit S", "Circuit GTR", "Vortex Hyper"],
  ["Aero Skimmer", "Aero Wing", "Ion Prototype"],
  ["Horizon R", "Horizon RX", "Zenith Board"],
  ["Summit GT", "Summit Hyper", "Zenith X"],
] as const;
const FAMILIES = [
  ["coupe", "truck", "board"],
  ["buggy", "board", "flight"],
  ["trike", "crawler", "jet"],
  ["hover", "flight", "pod"],
  ["truck", "truck", "board"],
  ["flight", "hover", "pod"],
] as const;
const TRACK_ROWS = [
  ["Lantern Canal", "Rainline Metro", "Stormfront Docks"],
  ["Sunset Boardwalk", "Sapphire Cliffs", "Midnight Switchback"],
  ["Orchard Loop", "Redstone Arch", "Ember Caldera"],
  ["Amber Badlands", "Fernfall Valley", "Aurora Ridge"],
  ["Riverlight Viaduct", "Solar Observatory", "Orbital Yard"],
  ["Harbor Skyway", "Prism Causeway", "Zenith Skyline"],
  ["Centennial Boulevard", "Celestial Ring", "Eventide Citadel"],
] as const;
export const CAR_REWARDS = CAR_ROWS.flatMap((names, row) =>
  CATEGORIES.map((category, column) => ({
    id: `reward-${category}-${String((row + 1) * 15).padStart(3, "0")}`,
    name: names[column],
    category,
    level: (row + 1) * 15,
    family: FAMILIES[row][column],
  })),
);
export const TRACK_REWARDS = TRACK_ROWS.flatMap((names, row) =>
  CATEGORIES.map((category, column) => ({
    id: `track-${category}-${String(10 + row * 15).padStart(3, "0")}`,
    name: names[column],
    category,
    level: 10 + row * 15,
  })),
);
