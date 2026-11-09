import { expect, it } from "vitest";
import { parseRoute } from "./router";

it("supports direct screen links and safe unknown-route fallback", () => {
  expect(parseRoute("#/bonus/easy/1")).toBe("level");
  expect(parseRoute("#/campaign/easy/1")).toBe("campaign");
  expect(parseRoute("#/cars")).toBe("cars");
  expect(parseRoute("#/tracks")).toBe("tracks");
  expect(parseRoute("#/keyboard")).toBe("keyboard");
  expect(parseRoute("#/settings")).toBe("settings");
  expect(parseRoute("")).toBe("hub");
  expect(parseRoute("#/room/not-implemented")).toBe("hub");
});
