export interface AudioPreferences {
  muted: boolean;
  master: number;
  music: number;
  effects: number;
}
export const DEFAULT_AUDIO: AudioPreferences = {
  muted: true,
  master: 0.6,
  music: 0.35,
  effects: 0.5,
};
const KEY = "turbotype:audio:v1";
export function validAudio(value: unknown): value is AudioPreferences {
  if (
    !value ||
    typeof value !== "object" ||
    !("muted" in value) ||
    typeof value.muted !== "boolean"
  )
    return false;
  return ["master", "music", "effects"].every(
    (key) =>
      key in value &&
      typeof (value as Record<string, unknown>)[key] === "number" &&
      Number.isFinite((value as Record<string, number>)[key]) &&
      (value as Record<string, number>)[key] >= 0 &&
      (value as Record<string, number>)[key] <= 1,
  );
}
/** Separate optional preference envelope; existing display settings need no migration. */
export class LocalAudioRepository {
  constructor(private storage: () => Pick<Storage, "getItem" | "setItem">) {}
  load(): AudioPreferences {
    try {
      const raw = this.storage().getItem(KEY);
      if (!raw) return { ...DEFAULT_AUDIO };
      const v: unknown = JSON.parse(raw);
      if (
        v &&
        typeof v === "object" &&
        "schemaVersion" in v &&
        v.schemaVersion === 1 &&
        "audio" in v &&
        validAudio(v.audio)
      )
        return { ...v.audio };
    } catch {
      /* Audio never blocks the game. */
    }
    return { ...DEFAULT_AUDIO };
  }
  save(audio: AudioPreferences): boolean {
    if (!validAudio(audio)) return false;
    try {
      this.storage().setItem(KEY, JSON.stringify({ schemaVersion: 1, audio }));
      return true;
    } catch {
      return false;
    }
  }
}
