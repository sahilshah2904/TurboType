import { describe, expect, it } from "vitest";
import { LocalGarageRepository } from "./garage";
describe("cosmetic garage preference", () => {
  it("restores a starter selection without changing display or audio records", () => {
    const records = new Map([
      ["turbotype:settings:v1", "existing-display"],
      ["turbotype:audio:v1", "existing-audio"],
    ]);
    const storage = {
      getItem: (key: string) => records.get(key) ?? null,
      setItem: (key: string, value: string) => {
        records.set(key, value);
      },
    };
    expect(new LocalGarageRepository(() => storage).save("comet")).toBe(true);
    expect(new LocalGarageRepository(() => storage).load()).toBe("comet");
    expect(records.get("turbotype:settings:v1")).toBe("existing-display");
    expect(records.get("turbotype:audio:v1")).toBe("existing-audio");
  });
  it.each([
    "{broken",
    '{"schemaVersion":99,"selectedKart":"comet"}',
    '{"schemaVersion":1,"selectedKart":"future-hypercar"}',
    '{"schemaVersion":1,"selectedKart":null}',
  ])("falls back for corrupt, future or unavailable cars: %s", (raw) => {
    expect(
      new LocalGarageRepository(() => ({
        getItem: () => raw,
        setItem: () => {},
      })).load(),
    ).toBe("volt-kart");
  });
  it("keeps storage failure optional", () => {
    const repository = new LocalGarageRepository(() => {
      throw Error("Denied");
    });
    expect(repository.load()).toBe("volt-kart");
    expect(repository.save("comet")).toBe(false);
  });
});
