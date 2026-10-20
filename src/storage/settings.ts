import type { SettingsRepository } from "../core/contracts";
import { SAVE_SCHEMA_VERSION } from "../config/versions";

export interface UserSettings {
  motion: "system" | "reduced" | "full";
  effects: "low" | "high";
  largeText: boolean;
}
export const DEFAULT_SETTINGS: UserSettings = {
  motion: "system",
  effects: "high",
  largeText: false,
};
const SETTINGS_KEY = "turbotype:settings:v1";

/** Settings only. Progress/rewards will have their own validated save model in Phase 9. */
export class LocalSettingsRepository implements SettingsRepository<UserSettings> {
  constructor(
    private readonly getStorage: () => Pick<Storage, "getItem" | "setItem">,
  ) {}

  load(): UserSettings {
    try {
      const raw = this.getStorage().getItem(SETTINGS_KEY);
      if (!raw) return { ...DEFAULT_SETTINGS };
      const value: unknown = JSON.parse(raw);
      if (
        !value ||
        typeof value !== "object" ||
        !("schemaVersion" in value) ||
        value.schemaVersion !== SAVE_SCHEMA_VERSION ||
        !("settings" in value)
      )
        return { ...DEFAULT_SETTINGS };
      const settings = value.settings;
      if (
        !settings ||
        typeof settings !== "object" ||
        !("motion" in settings) ||
        !["system", "reduced", "full"].includes(String(settings.motion)) ||
        !("effects" in settings) ||
        !["low", "high"].includes(String(settings.effects)) ||
        !("largeText" in settings) ||
        typeof settings.largeText !== "boolean"
      )
        return { ...DEFAULT_SETTINGS };
      return {
        motion: settings.motion as UserSettings["motion"],
        effects: settings.effects as UserSettings["effects"],
        largeText: settings.largeText,
      };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  save(settings: UserSettings): boolean {
    try {
      this.getStorage().setItem(
        SETTINGS_KEY,
        JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION, settings }),
      );
      return true;
    } catch {
      return false;
    }
  }
}
