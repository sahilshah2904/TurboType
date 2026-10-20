export const ROUTES = ["hub", "practice", "keyboard", "settings"] as const;
export type Route = (typeof ROUTES)[number];

export function parseRoute(hash: string): Route {
  const route = hash.replace(/^#\/?/, "");
  return ROUTES.includes(route as Route) ? (route as Route) : "hub";
}
