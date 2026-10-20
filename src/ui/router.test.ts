import { expect, it } from "vitest";
import { parseRoute } from "./router";

it("supports direct screen links and safe unknown-route fallback", () => {
  expect(parseRoute("#/keyboard")).toBe("keyboard");
  expect(parseRoute("#/settings")).toBe("settings");
  expect(parseRoute("")).toBe("hub");
  expect(parseRoute("#/room/not-implemented")).toBe("hub");
});
