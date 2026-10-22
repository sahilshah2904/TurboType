import type { SoloRace } from "../core/solo-race";
export type RaceSnapshot = ReturnType<SoloRace["snapshot"]>;
export const CAR_FRONT_OFFSET = 72;
export const DRIVER_IDS = [
  "player",
  "cpu-1",
  "cpu-2",
  "cpu-3",
  "cpu-4",
] as const;

/** Presentation coordinates only. Never feed these positions back to race rules. */
export function projectRace(snapshot: RaceSnapshot, reduced: boolean) {
  const camera = reduced
    ? 0
    : Math.max(0, Math.min(3370, 220 + snapshot.player.progress * 4000 - 330));
  const finishX = (reduced ? 880 : 4220 - camera) + CAR_FRONT_OFFSET;
  return {
    camera,
    finishX,
    cars: DRIVER_IDS.map((id) => {
      const row = snapshot.standings.find((r) => r.id === id)!;
      const x = reduced
        ? 120 + row.progress * 760
        : 220 + row.progress * 4000 - camera;
      return {
        id,
        x,
        edge: x < 72 ? "left" : x > 925 ? "right" : null,
        progress: row.progress,
      };
    }),
  };
}

/** Per-visit feedback gate: actual improvements only, cooldown in core active time. */
export class RaceFeedback {
  private place: number | null = null;
  private calloutAt = -Infinity;
  private burst = 0;
  update(snapshot: RaceSnapshot): string | null {
    const s = snapshot.player;
    const place = snapshot.standings.find((r) => r.id === "player")!.place;
    if (s.state === "ready") {
      this.place = null;
      this.calloutAt = -Infinity;
      this.burst = 0;
      return null;
    }
    let message: string | null = null;
    if (s.state === "racing") {
      if (
        this.place !== null &&
        place < this.place &&
        s.elapsedMs - this.calloutAt >= 2000
      ) {
        message = place === 1 ? "INTO THE LEAD" : "OVERTAKE · KEEP YOUR RHYTHM";
        this.calloutAt = s.elapsedMs;
      } else if (
        s.nitroBursts > this.burst &&
        s.elapsedMs - this.calloutAt >= 2000
      ) {
        message = "CLEAN STREAK · NITRO";
        this.calloutAt = s.elapsedMs;
      }
    }
    this.place = place;
    this.burst = s.nitroBursts;
    return message;
  }
}
