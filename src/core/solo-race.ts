import { TypingEngine, type TypingOptions } from "./typing-engine";
import { createCpuSchedules, cpuProgress, type CpuTier } from "./cpu-schedule";
import { rankStandings } from "./standings";

export interface SoloRaceOptions extends TypingOptions {
  tier: CpuTier;
  seed: number;
}
export interface RacerRow {
  id: string;
  name: string;
  cpu: boolean;
  progress: number;
  finishTimeMs: number | null;
  place: number;
  status:
    "racing" | "finished" | "simulated" | "projected-dnf" | "dnf" | "stopped";
}

/** Composes the existing typing clock; bots never own a second running timer. */
export class SoloRace {
  readonly typing: TypingEngine;
  readonly opponents;
  readonly options: Readonly<SoloRaceOptions>;
  constructor(options: SoloRaceOptions) {
    this.options = Object.freeze({ ...options });
    this.typing = new TypingEngine(this.options);
    this.opponents = createCpuSchedules(
      this.options.passage.length,
      this.options.tier,
      this.options.seed,
    );
  }
  start(): void {
    this.typing.start();
  }
  pause(): void {
    this.typing.pause();
  }
  abandon(): void {
    this.typing.abandon();
  }
  snapshot() {
    const player = this.typing.snapshot();
    const ended = ["finished", "timed-out", "abandoned"].includes(player.state);
    const playerRow = {
      id: "player",
      name: "You",
      cpu: false,
      progress: player.progress,
      finishTimeMs: player.state === "finished" ? player.elapsedMs : null,
      status:
        player.state === "finished"
          ? "finished"
          : player.state === "timed-out"
            ? "dnf"
            : player.state === "abandoned"
              ? "stopped"
              : "racing",
    } as const;
    const cpuRows = this.opponents.map(
      (cpu) =>
        ({
          id: cpu.id,
          name: cpu.name,
          cpu: true,
          progress: cpuProgress(cpu, player.elapsedMs),
          finishTimeMs:
            cpu.finishTimeMs <= player.elapsedMs ? cpu.finishTimeMs : null,
          status: cpu.finishTimeMs <= player.elapsedMs ? "finished" : "racing",
        }) as const,
    );
    const standings: RacerRow[] = rankStandings([playerRow, ...cpuRows]);
    let results: RacerRow[] | null = null;
    if (ended) {
      results = rankStandings([
        playerRow,
        ...this.opponents.map((cpu) => {
          // A completed player need not wait for bots. Future finishes are explicit simulations.
          const scheduled =
            player.state === "finished" &&
            (this.options.timeLimitMs === undefined ||
              cpu.finishTimeMs <= this.options.timeLimitMs);
          const finished = cpu.finishTimeMs <= player.elapsedMs;
          const resultTime = scheduled || finished ? cpu.finishTimeMs : null;
          const cutoff =
            player.state === "finished"
              ? (this.options.timeLimitMs ?? player.elapsedMs)
              : player.elapsedMs;
          return {
            id: cpu.id,
            name: cpu.name,
            cpu: true,
            progress: resultTime === null ? cpuProgress(cpu, cutoff) : 1,
            finishTimeMs: resultTime,
            status: finished
              ? "finished"
              : scheduled
                ? "simulated"
                : player.state === "abandoned"
                  ? "stopped"
                  : player.state === "finished"
                    ? "projected-dnf"
                    : "dnf",
          } as const;
        }),
      ]);
    }
    return { player, standings, results };
  }
}
