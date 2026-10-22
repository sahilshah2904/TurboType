export const ROUTES = [
  "hub",
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
  const route = hash.replace(/^#\/?/, "");
  return ROUTES.includes(route as Route) ? (route as Route) : "hub";
}
