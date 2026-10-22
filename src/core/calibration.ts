import type { TypingSnapshot } from "./typing-engine";
import type { CpuTier } from "./cpu-schedule";
/** Starting Quick Race pace only; never changes campaign unlocks or player speed. */
export function calibrationPace(s: TypingSnapshot): CpuTier | null {
  if (
    !["finished", "timed-out"].includes(s.state) ||
    s.validatedLength < 20 ||
    s.elapsedMs < 10000 ||
    s.practiceReasons.length ||
    !Number.isFinite(s.wpm) ||
    s.wpm <= 0 ||
    s.accuracyPercent === null ||
    !Number.isFinite(s.accuracyPercent)
  )
    return null;
  if (s.accuracyPercent < 95 || s.wpm < 30) return "easy";
  return s.wpm < 55 ? "medium" : "hard";
}
