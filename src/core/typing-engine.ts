export type TypingState =
  | "ready"
  | "countdown"
  | "racing"
  | "paused"
  | "finished"
  | "timed-out"
  | "abandoned";
export type PracticeReason =
  "paused" | "blocked-assistance" | "composed-input" | "uncertain-input";

export interface TypingOptions {
  passage: string;
  now: () => number;
  timeLimitMs?: number;
}

export interface TypingSnapshot {
  state: TypingState;
  passage: string;
  typedText: string;
  validatedLength: number;
  errorCharacter: string | null;
  totalAttempts: number;
  correctAttempts: number;
  errorCount: number;
  correctedErrors: number;
  accuracyPercent: number | null;
  wpm: number;
  recentWpm: number;
  progress: number;
  elapsedMs: number;
  countdown: number | null;
  cleanStreak: number;
  longestStreak: number;
  nitroBursts: number;
  nitroActive: boolean;
  practiceReasons: readonly PracticeReason[];
  eligible: boolean;
}

/** Deterministic rules/timing only: no DOM, storage, animation or wall-clock globals. */
export class TypingEngine {
  private state: TypingState = "ready";
  private validatedLength = 0;
  private furthestLength = 0;
  private errorCharacter: string | null = null;
  private totalAttempts = 0;
  private correctAttempts = 0;
  private correctedErrors = 0;
  private cleanStreak = 0;
  private longestStreak = 0;
  private nitroBursts = 0;
  private lastNitroMs = -Infinity;
  private elapsedMs = 0;
  private activeStartMs = 0;
  private countdownEndMs = 0;
  private started = false;
  private reasons = new Set<PracticeReason>();
  private recentCorrectMs: number[] = [];
  private lastClockMs = -Infinity;

  constructor(private readonly options: TypingOptions) {
    if (!/^[\x20-\x7e]{1,2000}$/.test(options.passage))
      throw new RangeError(
        "Use a nonempty printable English passage of at most 2000 characters.",
      );
    if (
      options.timeLimitMs !== undefined &&
      (!Number.isFinite(options.timeLimitMs) || options.timeLimitMs <= 0)
    )
      throw new RangeError("Time limit must be positive and finite.");
  }

  private time(): number {
    const value = this.options.now();
    if (!Number.isFinite(value))
      throw new RangeError("Clock must return finite milliseconds.");
    // A backwards clock must never reduce elapsed time or reorder input events.
    this.lastClockMs = Math.max(this.lastClockMs, value);
    return this.lastClockMs;
  }

  private advance(): number {
    const now = this.time();
    if (this.state === "countdown" && now >= this.countdownEndMs) {
      this.state = "racing";
      this.activeStartMs = this.countdownEndMs;
      this.started = true;
    }
    if (this.state === "racing") {
      const elapsed = this.elapsedMs + now - this.activeStartMs;
      if (
        this.options.timeLimitMs !== undefined &&
        elapsed >= this.options.timeLimitMs
      ) {
        this.elapsedMs = this.options.timeLimitMs;
        this.state = "timed-out";
      }
    }
    return now;
  }

  private elapsed(now: number): number {
    return this.state === "racing"
      ? this.elapsedMs + now - this.activeStartMs
      : this.elapsedMs;
  }

  start(): void {
    const now = this.advance();
    if (this.state !== "ready" && this.state !== "paused") return;
    this.state = "countdown";
    this.countdownEndMs = now + 3000;
  }

  pause(): void {
    const now = this.advance();
    if (this.state === "racing") {
      this.elapsedMs = this.elapsed(now);
      this.reasons.add("paused");
      this.state = "paused";
    } else if (this.state === "countdown") {
      this.state = this.started ? "paused" : "ready";
    }
  }

  abandon(): void {
    const now = this.advance();
    if (["finished", "timed-out", "abandoned"].includes(this.state)) return;
    this.elapsedMs = this.elapsed(now);
    this.state = "abandoned";
  }

  markPractice(reason: Exclude<PracticeReason, "paused">): void {
    this.advance();
    if (this.state !== "racing") return;
    this.reasons.add(reason);
    this.cleanStreak = 0;
  }

  insert(text: string): void {
    const now = this.advance();
    if (this.state !== "racing") return;
    for (const character of text) {
      if (this.state !== "racing") break;
      this.totalAttempts++;
      if (
        this.errorCharacter !== null ||
        character !== this.options.passage[this.validatedLength]
      ) {
        if (this.errorCharacter === null) this.errorCharacter = character;
        this.cleanStreak = 0;
        continue;
      }
      this.correctAttempts++;
      this.validatedLength++;
      const activeMs = this.elapsed(now);
      this.recentCorrectMs.push(activeMs);
      if (this.validatedLength > this.furthestLength) {
        this.furthestLength = this.validatedLength;
        this.cleanStreak++;
        this.longestStreak = Math.max(this.longestStreak, this.cleanStreak);
        if (
          this.cleanStreak % 20 === 0 &&
          activeMs - this.lastNitroMs >= 2000
        ) {
          this.nitroBursts++;
          this.lastNitroMs = activeMs;
        }
      }
      if (this.validatedLength === this.options.passage.length) {
        this.elapsedMs = activeMs;
        this.state = "finished";
      }
    }
  }

  backspace(): void {
    this.advance();
    if (this.state !== "racing") return;
    if (this.errorCharacter !== null) {
      this.errorCharacter = null;
      this.correctedErrors++;
    } else if (this.validatedLength > 0) {
      this.validatedLength--;
    }
  }

  snapshot(): TypingSnapshot {
    const now = this.advance();
    const elapsedMs = this.elapsed(now);
    this.recentCorrectMs = this.recentCorrectMs.filter(
      (at) => elapsedMs - at <= 3000,
    );
    const activeMinutes = elapsedMs / 60000;
    const windowMinutes = Math.min(elapsedMs, 3000) / 60000;
    return {
      state: this.state,
      passage: this.options.passage,
      typedText:
        this.options.passage.slice(0, this.validatedLength) +
        (this.errorCharacter ?? ""),
      validatedLength: this.validatedLength,
      errorCharacter: this.errorCharacter,
      totalAttempts: this.totalAttempts,
      correctAttempts: this.correctAttempts,
      errorCount: this.totalAttempts - this.correctAttempts,
      correctedErrors: this.correctedErrors,
      accuracyPercent: this.totalAttempts
        ? (this.correctAttempts / this.totalAttempts) * 100
        : null,
      wpm: activeMinutes > 0 ? this.validatedLength / 5 / activeMinutes : 0,
      recentWpm:
        windowMinutes > 0 ? this.recentCorrectMs.length / 5 / windowMinutes : 0,
      progress: this.validatedLength / this.options.passage.length,
      elapsedMs,
      countdown:
        this.state === "countdown"
          ? Math.ceil((this.countdownEndMs - now) / 1000)
          : null,
      cleanStreak: this.cleanStreak,
      longestStreak: this.longestStreak,
      nitroBursts: this.nitroBursts,
      nitroActive:
        this.state === "racing" && elapsedMs - this.lastNitroMs < 800,
      practiceReasons: [...this.reasons],
      eligible: this.state === "finished" && this.reasons.size === 0,
    };
  }
}
