import { describe, expect, it } from "vitest";
import { SoloRace } from "./solo-race";

function fixture(
  passage = "Every great run starts with a single keystroke.",
  timeLimitMs?: number,
) {
  let now = 0;
  const race = new SoloRace({
    passage,
    tier: "easy",
    seed: 42,
    now: () => now,
    timeLimitMs,
  });
  return {
    race,
    at: (value: number) => {
      now = value;
    },
    go: () => {
      race.start();
      now = 3000;
    },
  };
}
describe("solo race composition", () => {
  it("starts five lanes tied at place one and cannot move CPUs before GO", () => {
    const { race, at } = fixture();
    race.start();
    at(2999);
    expect(
      race.snapshot().standings.every((r) => r.progress === 0 && r.place === 1),
    ).toBe(true);
  });
  it("continues the player's run after all CPUs finish", () => {
    const { race, go, at } = fixture();
    go();
    at(150000);
    const s = race.snapshot();
    expect(s.player.state).toBe("racing");
    expect(
      s.standings.filter((r) => r.cpu).every((r) => r.finishTimeMs !== null),
    ).toBe(true);
    race.typing.insert(s.player.passage);
    expect(race.snapshot().results!.find((r) => !r.cpu)!.place).toBe(5);
  });
  it("freezes CPUs on pause and excludes the resumed countdown", () => {
    const { race, go, at } = fixture();
    go();
    at(8000);
    race.pause();
    const before = race.snapshot();
    at(40000);
    expect(race.snapshot()).toEqual(before);
    race.start();
    at(42999);
    expect(race.snapshot().standings).toEqual(before.standings);
    at(44000);
    expect(race.snapshot().player.elapsedMs).toBe(6000);
    expect(race.snapshot().standings).not.toEqual(before.standings);
    expect(race.snapshot().player.practiceReasons).toContain("paused");
  });
  it("freezes on the final character and clearly projects remaining CPU finishes", () => {
    const { race, go, at } = fixture();
    go();
    at(4000);
    race.typing.insert(race.options.passage);
    const final = race.snapshot();
    expect(final.results![0]).toMatchObject({
      id: "player",
      place: 1,
      finishTimeMs: 1000,
    });
    expect(
      final
        .results!.filter((r) => r.cpu)
        .every((r) => r.status === "simulated" && r.finishTimeMs! > 1000),
    ).toBe(true);
    expect(
      final.standings.filter((r) => r.cpu).every((r) => r.progress < 1),
    ).toBe(true);
    at(150000);
    expect(race.snapshot()).toEqual(final);
  });
  it("records timed DNFs without invented finish times", () => {
    const { race, go, at } = fixture("a".repeat(1000), 60000);
    go();
    race.typing.insert("a");
    at(63000);
    const final = race.snapshot();
    expect(final.player.state).toBe("timed-out");
    expect(
      final.results!.every(
        (r) => r.status === "dnf" && r.finishTimeMs === null,
      ),
    ).toBe(true);
    expect(final.results!.find((r) => !r.cpu)!.progress).toBe(0.001);
  });
  it("does not project a timed CPU beyond the deadline even when the player completes", () => {
    const { race, go, at } = fixture("a".repeat(1000), 60000);
    go();
    at(4000);
    race.typing.insert("a".repeat(1000));
    const rows = race.snapshot().results!;
    expect(rows.find((r) => !r.cpu)!.status).toBe("finished");
    expect(
      rows
        .filter((r) => r.cpu)
        .every(
          (r) =>
            r.status === "projected-dnf" &&
            r.finishTimeMs === null &&
            r.progress < 1,
        ),
    ).toBe(true);
  });
  it("preserves already-finished CPUs on timeout, and never fabricates abandoned finishes", () => {
    const { race, go, at } = fixture("cat", 60000);
    go();
    at(63000);
    expect(
      race
        .snapshot()
        .results!.filter((r) => r.cpu)
        .every((r) => r.status === "finished"),
    ).toBe(true);
    const other = fixture();
    other.go();
    other.at(4000);
    other.race.abandon();
    expect(
      other.race
        .snapshot()
        .results!.every(
          (r) => r.finishTimeMs === null && r.status === "stopped",
        ),
    ).toBe(true);
  });
  it("captures setup by value and repeats schedules on retry without keeping player attempts", () => {
    let now = 0;
    const setup = {
      passage: "cat",
      tier: "easy" as const,
      seed: 8,
      now: () => now,
    };
    const first = new SoloRace(setup);
    setup.seed = 9;
    expect(first.options.seed).toBe(8);
    first.start();
    now = 4000;
    first.typing.insert("x");
    const retry = new SoloRace(first.options);
    expect(retry.opponents).toEqual(first.opponents);
    expect(retry.snapshot().player.totalAttempts).toBe(0);
  });
});
