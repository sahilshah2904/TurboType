import { describe, expect, it } from "vitest";
import { DEFAULT_AUDIO, LocalAudioRepository } from "./audio-settings";
function memory(raw: string | null = null) {
  const entries = new Map<string, string>();
  if (raw) entries.set("turbotype:audio:v1", raw);
  return {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
    entries,
  };
}
describe("optional audio preferences", () => {
  it("starts muted and round-trips controls without changing display preferences", () => {
    const storage = memory();
    storage.setItem("turbotype:settings:v1", "existing display data");
    const repository = new LocalAudioRepository(() => storage);
    expect(repository.load()).toEqual(DEFAULT_AUDIO);
    const preferences = { muted: false, master: 0.25, music: 0, effects: 1 };
    expect(repository.save(preferences)).toBe(true);
    expect(new LocalAudioRepository(() => storage).load()).toEqual(preferences);
    expect(storage.entries.get("turbotype:settings:v1")).toBe(
      "existing display data",
    );
  });
  it.each([
    "{broken",
    '{"schemaVersion":99,"audio":{}}',
    '{"schemaVersion":1,"audio":{"muted":false,"master":2,"music":0.2,"effects":0.3}}',
    '{"schemaVersion":1,"audio":{"muted":"false","master":0.2,"music":0.2,"effects":0.3}}',
  ])("preserves malformed data and falls back safely: %s", (raw) => {
    const storage = memory(raw);
    expect(new LocalAudioRepository(() => storage).load()).toEqual(
      DEFAULT_AUDIO,
    );
    expect(storage.getItem("turbotype:audio:v1")).toBe(raw);
  });
  it("rejects nonfinite controls and handles denied writes", () => {
    const storage = memory();
    const repository = new LocalAudioRepository(() => storage);
    expect(repository.save({ ...DEFAULT_AUDIO, music: NaN })).toBe(false);
    expect(storage.entries.size).toBe(0);
    const denied = new LocalAudioRepository(() => {
      throw Error("denied");
    });
    expect(denied.load()).toEqual(DEFAULT_AUDIO);
    expect(denied.save(DEFAULT_AUDIO)).toBe(false);
  });
});
