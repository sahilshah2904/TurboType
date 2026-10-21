import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { RaceAudio } from "./race-audio";
import { DEFAULT_AUDIO, LocalAudioRepository } from "../storage/audio-settings";
import { SoloRace } from "../core/solo-race";
import { SOUNDTRACKS } from "./score";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

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
  async decodeAudioData() {
    return this.createBuffer(1, 100);
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
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(8),
    })),
  );
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
  await vi.advanceTimersByTimeAsync(200);
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
it("ships distinct reproducible menu and racing masters with safe levels and correct WAV headers", () => {
  const reports = JSON.parse(
    readFileSync("public/assets/audio/soundtracks.json", "utf8"),
  );
  for (const [scene, track] of Object.entries(SOUNDTRACKS)) {
    const wav = readFileSync("public/" + track.path),
      report = reports.find((r: { name: string }) =>
        track.path.endsWith(r.name + ".wav"),
      );
    expect(wav.toString("ascii", 0, 4)).toBe("RIFF");
    expect(wav.readUInt32LE(24)).toBe(22050);
    expect((wav.length - 44) / 44100).toBeCloseTo(
      (track.bars * 4 * 60) / track.bpm,
      3,
    );
    expect(createHash("sha256").update(wav).digest("hex")).toBe(report.sha256);
    expect(report.peak).toBeLessThan(0.9);
    expect(report.rms).toBeGreaterThan(0.08);
    expect(
      scene === "race"
        ? report.bpm >= 140
        : report.bpm >= 120 && report.bpm < 140,
    ).toBe(true);
  }
  expect(reports[0].sha256).not.toBe(reports[1].sha256);
});

it("separates countdown music, freezes on pause and returns to menu music on results", async () => {
  const { audio, context } = fixture();
  audio.setPreferences({ ...DEFAULT_AUDIO, muted: false });
  await audio.unlock();
  const s = new SoloRace({
    passage: "cat",
    tier: "easy",
    seed: 1,
    now: () => 0,
  }).snapshot().player;
  audio.updateRace(s);
  expect(audio.diagnostics.scene).toBe("menu");
  s.state = "countdown";
  s.countdown = 3;
  audio.updateRace(s);
  expect(audio.diagnostics.scene).toBe("countdown");
  vi.advanceTimersByTime(150);
  const voices = context.sources.length;
  s.countdown = 2;
  audio.updateRace(s);
  expect(context.sources.length).toBeGreaterThan(voices);
  s.state = "paused";
  audio.updateRace(s);
  const stopped = context.sources.length;
  vi.advanceTimersByTime(500);
  expect(context.sources.length).toBe(stopped);
  s.state = "finished";
  audio.updateRace(s);
  expect(audio.diagnostics.scene).toBe("menu");
  audio.dispose();
});

it("plays the current number once when a first-gesture resume resolves during countdown", async () => {
  const { audio, context } = fixture();
  let resume!: () => void;
  context.resume = () =>
    new Promise<void>((resolve) => {
      resume = resolve;
    });
  audio.setPreferences({ ...DEFAULT_AUDIO, muted: false });
  const unlocking = audio.unlock();
  const s = new SoloRace({
    passage: "cat",
    tier: "easy",
    seed: 1,
    now: () => 0,
  }).snapshot().player;
  s.state = "countdown";
  s.countdown = 3;
  audio.updateRace(s);
  expect(context.sources.length).toBe(0);
  context.state = "running";
  resume();
  await unlocking;
  expect(context.sources.length).toBe(1);
  expect(context.sources[0].frequency.value).toBe(440);
  audio.updateRace(s);
  expect(context.sources.length).toBe(1);
  audio.dispose();
});

it("keeps delayed soundtrack loading silent after pause and aborts loading on dispose", async () => {
  let complete!: (value: unknown) => void;
  const pending = new Promise((resolve) => (complete = resolve));
  vi.stubGlobal(
    "fetch",
    vi.fn(() => pending),
  );
  const { audio, context } = fixture();
  audio.setPreferences({ ...DEFAULT_AUDIO, muted: false });
  await audio.unlock();
  audio.setScene("menu");
  audio.setScene("silent");
  complete({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
  await vi.advanceTimersByTimeAsync(200);
  expect(context.sources.length).toBe(0);
  audio.dispose();
  expect(
    (vi.mocked(fetch).mock.calls[0][1] as RequestInit).signal!.aborted,
  ).toBe(true);
});
it("isolates soundtrack fetch failure and retries without replacing the audio context", async () => {
  const { audio, factory } = fixture();
  vi.mocked(fetch).mockRejectedValueOnce(Error("offline"));
  audio.setPreferences({ ...DEFAULT_AUDIO, muted: false });
  await audio.unlock();
  await vi.advanceTimersByTimeAsync(100);
  expect(audio.diagnostics.musicStatus).toBe("unavailable");
  await audio.unlock();
  await vi.advanceTimersByTimeAsync(100);
  expect(audio.diagnostics.musicStatus).toBe("ready");
  expect(factory).toHaveBeenCalledTimes(1);
  audio.dispose();
});
