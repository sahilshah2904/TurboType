import type { CpuTier } from "../core/cpu-schedule";
export interface OnboardingPreferences {
  schemaVersion: 1;
  welcomeSeen: boolean;
  tutorialComplete: boolean;
  skipIntro: boolean;
  preferredPace: CpuTier;
  calibration: { wpm: number; accuracy: number } | null;
}
export const DEFAULT_ONBOARDING: OnboardingPreferences = {
  schemaVersion: 1,
  welcomeSeen: false,
  tutorialComplete: false,
  skipIntro: false,
  preferredPace: "easy",
  calibration: null,
};
export class LocalOnboardingRepository {
  constructor(private storage: () => Pick<Storage, "getItem" | "setItem">) {}
  load(): OnboardingPreferences {
    try {
      const value: unknown = JSON.parse(
        this.storage().getItem("turbotype:onboarding:v1") ?? "null",
      );
      if (
        !value ||
        typeof value !== "object" ||
        !("schemaVersion" in value) ||
        value.schemaVersion !== 1
      )
        return { ...DEFAULT_ONBOARDING };
      const v = value as Record<string, unknown>;
      const calibration = v.calibration as Record<string, unknown> | null;
      return {
        schemaVersion: 1,
        welcomeSeen: v.welcomeSeen === true,
        tutorialComplete: v.tutorialComplete === true,
        skipIntro: v.skipIntro === true,
        preferredPace:
          v.preferredPace === "medium" || v.preferredPace === "hard"
            ? v.preferredPace
            : "easy",
        calibration:
          calibration &&
          typeof calibration.wpm === "number" &&
          Number.isFinite(calibration.wpm) &&
          calibration.wpm > 0 &&
          calibration.wpm <= 1000 &&
          typeof calibration.accuracy === "number" &&
          Number.isFinite(calibration.accuracy) &&
          calibration.accuracy >= 0 &&
          calibration.accuracy <= 100
            ? { wpm: calibration.wpm, accuracy: calibration.accuracy }
            : null,
      };
    } catch {
      return { ...DEFAULT_ONBOARDING };
    }
  }
  save(value: OnboardingPreferences): boolean {
    try {
      this.storage().setItem("turbotype:onboarding:v1", JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
}
