import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, LocalSettingsRepository } from "./settings";

function storage(initial: string | null = null) {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => {
      value = next;
    },
  };
}

describe("settings persistence", () => {
  it("restores saved preferences across repository instances", () => {
    const memory = storage();
    const settings = {
      motion: "reduced",
      effects: "low",
      largeText: true,
    } as const;
    expect(new LocalSettingsRepository(() => memory).save(settings)).toBe(true);
    expect(new LocalSettingsRepository(() => memory).load()).toEqual(settings);
  });
  it.each([
    "{invalid",
    '{"schemaVersion":99,"settings":{}}',
    '{"schemaVersion":1,"settings":{"motion":"oops","effects":"high","largeText":true}}',
    '{"schemaVersion":1,"settings":null}',
  ])("recovers safely from malformed/unsupported data %s", (raw) => {
    const memory = storage(raw);
    expect(new LocalSettingsRepository(() => memory).load()).toEqual(
      DEFAULT_SETTINGS,
    );
    expect(memory.getItem()).toBe(raw);
  });
  it("does not block startup when the browser denies storage access", () => {
    const repository = new LocalSettingsRepository(() => {
      throw new Error("Storage blocked");
    });
    expect(repository.load()).toEqual(DEFAULT_SETTINGS);
    expect(repository.save(DEFAULT_SETTINGS)).toBe(false);
  });
});
