import { describe, expect, it } from "vitest";
import { createLevelId, isLevelId } from "./ids";

describe("campaign IDs", () => {
  it("keeps each category isolated and pads valid numbers", () => {
    expect(createLevelId("easy", 1)).toBe("easy-001");
    expect(createLevelId("medium", 10)).toBe("medium-010");
    expect(createLevelId("hard", 100)).toBe("hard-100");
  });
  it.each([0, 101, -1, 1.5, NaN])("rejects invalid level %s", (value) => {
    expect(() => createLevelId("easy", value)).toThrow(RangeError);
  });
  it.each([
    "easy-000",
    "hard-101",
    "medium-01",
    "unknown-001",
    "easy-001-extra",
    null,
  ])("rejects malformed stored ID %s", (value) => {
    expect(isLevelId(value)).toBe(false);
  });
  it("recognizes every planned main level", () => {
    for (const category of ["easy", "medium", "hard"] as const) {
      for (let level = 1; level <= 100; level++)
        expect(isLevelId(createLevelId(category, level))).toBe(true);
    }
  });
});
