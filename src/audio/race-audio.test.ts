import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { RaceAudio } from "./race-audio";
import { DEFAULT_AUDIO, LocalAudioRepository } from "../storage/audio-settings";
import { SoloRace } from "../core/solo-race";
import { scoreStep, SCORE_STEP_SECONDS } from "./score";

class Param {
  value = 0;
  setTargetAtTime(v: number) {
    this.value = v;
  }
  setValueAtTime(v: number) {
    this.value = v;
  }
  linearRampToValueAtTime(v: number) {
    this.value = v;
  }
  exponentialRampToValueAtTime(v: number) {
    this.value = v;
  }
  cancelScheduledValues() {}
}
class Node {
  gain = new Param();
  frequency = new Param();
  threshold = new Param();
  ratio = new Param();
  type = "sine";
  buffer: unknown;
  onended: (() => void) | null = null;
  starts = 0;
  stops = 0;
  connect() {}
  disconnect() {}
  start() {
    this.starts++;
  }
  stop() {
    this.stops++;
    this.onended?.();
  }
}
class Context {
  state = "suspended";
  sampleRate = 8000;
  destination = {};
  onstatechange: (() => void) | null = null;
  sources: Node[] = [];
  get currentTime() {
    return Date.now() / 1000;
  }
  createGain() {
    return new Node();
  }
  createDynamicsCompressor() {
    return new Node();
  }
  createBuffer(_channels: number, length: number) {
    return { getChannelData: () => new Float32Array(length) };
  }
  createOscillator() {
    const s = new Node();
    this.sources.push(s);
    return s;
  }
  createBufferSource() {
    return this.createOscillator();
  }
  async resume() {
    this.state = "running";
  }
  async close() {
    this.state = "closed";
  }
}
function fixture() {
  let stored: string | null = null;
  const repository = new LocalAudioRepository(() => ({
    getItem: () => stored,
    setItem: (_k, v) => {
      stored = v;
    },
  }));
  const context = new Context();
  const factory = vi.fn(() => context as unknown as AudioContext);
  return { audio: new RaceAudio(repository, factory), context, factory };
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  vi.stubGlobal("window", { setInterval, clearInterval });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("creates no audio before an explicit unmuted gesture and reuses a single context", async () => {
  const { audio, context, factory } = fixture();
  expect(await audio.unlock()).toBe(false);
  expect(factory).not.toHaveBeenCalled();
  audio.setPreferences({ ...DEFAULT_AUDIO, muted: false });
  expect(await audio.unlock()).toBe(true);
  expect(await audio.unlock()).toBe(true);
  expect(factory).toHaveBeenCalledTimes(1);
  audio.setScene("menu");
  vi.advanceTimersByTime(200);
  expect(context.sources.length).toBeGreaterThan(0);
  audio.setPreferences({ ...audio.preferences, muted: true });
  expect(context.sources.every((s) => s.stops > 0)).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
  audio.dispose();
  expect(context.state).toBe("closed");
});
it("stops race sources on pause and never repeats an unchanged finish cue", async () => {
  const { audio, context } = fixture();
  audio.setPreferences({ ...DEFAULT_AUDIO, muted: false });
  await audio.unlock();
  const race = new SoloRace({
    passage: "cat",
    tier: "easy",
    seed: 1,
    now: () => 0,
  });
  const s = race.snapshot().player;
  s.state = "racing";
  s.recentWpm = 50;
  audio.updateRace(s);
  expect(audio.diagnostics.scene).toBe("race");
  s.state = "paused";
  audio.updateRace(s);
  expect(context.sources.every((source) => source.stops > 0)).toBe(true);
  s.state = "finished";
  audio.updateRace(s);
  const voices = context.sources.length;
  audio.updateRace(s);
  expect(context.sources.length).toBe(voices);
  audio.setVisible(false);
  expect(context.sources.every((source) => source.stops > 0)).toBe(true);
  audio.dispose();
});
it("isolates failed or interrupted audio startup from gameplay and disposes pending unlock", async () => {
  const repository = new LocalAudioRepository(() => ({
    getItem: () => null,
    setItem: () => {},
  }));
  const failed = new RaceAudio(repository, () => {
    throw Error("unsupported");
  });
  failed.setPreferences({ ...DEFAULT_AUDIO, muted: false });
  expect(await failed.unlock()).toBe(false);
  expect(failed.status).toBe("unavailable");
  expect(() => failed.cue("finish")).not.toThrow();
  failed.dispose();
  const f = fixture();
  let resolve!: () => void;
  f.context.resume = () =>
    new Promise<void>((r) => {
      resolve = r;
    });
  f.audio.setPreferences({ ...DEFAULT_AUDIO, muted: false });
  const pending = f.audio.unlock();
  f.audio.dispose();
  resolve();
  expect(await pending).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});
it("keeps runtime audio graph failures from escaping into typing updates", async () => {
  const { audio, context } = fixture();
  audio.setPreferences({ ...DEFAULT_AUDIO, muted: false });
  await audio.unlock();
  context.createOscillator = () => {
    throw Error("device lost");
  };
  const s = new SoloRace({
    passage: "cat",
    tier: "easy",
    seed: 1,
    now: () => 0,
  }).snapshot().player;
  s.state = "racing";
  expect(() => audio.updateRace(s)).not.toThrow();
  expect(audio.status).toBe("unavailable");
  audio.dispose();
});
it("repeats the authored eight-bar score with bounded note envelopes and a calmer menu", () => {
  for (let i = 0; i < 128; i++) {
    const step = scoreStep(i, true);
    expect(step).toEqual(scoreStep(i + 128, true));
    expect(
      step.notes.every(
        (n) =>
          Number.isFinite(n.midi) &&
          n.duration > 0 &&
          n.duration <= 2 &&
          n.level <= 0.2,
      ),
    ).toBe(true);
  }
  expect(scoreStep(0, false).kick).toBe(false);
  expect(scoreStep(0, true).kick).toBe(true);
  expect(128 * SCORE_STEP_SECONDS).toBeCloseTo(16.55, 1);
});
