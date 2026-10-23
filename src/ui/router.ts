import { readCampaignRoute } from "../content/campaign";
export const ROUTES = [
  "hub",
  "campaign",
  "level",
  "intro",
  "welcome",
  "rules",
  "tutorial",
  "calibration",
  "race",
  "practice",
  "keyboard",
  "settings",
] as const;
export type Route = (typeof ROUTES)[number];

export function parseRoute(hash: string): Route {
  const campaign = readCampaignRoute(hash);
  if (campaign) return hash.startsWith("#/level/") ? "level" : "campaign";
  const route = hash.replace(/^#\/?/, "");
  return !["campaign", "level"].includes(route) &&
    ROUTES.includes(route as Route)
    ? (route as Route)
    : "hub";
}
