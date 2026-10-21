import type { TypingSnapshot } from "../core/typing-engine";
import {
  LocalAudioRepository,
  type AudioPreferences,
  validAudio,
} from "../storage/audio-settings";
import { midiHz, SOUNDTRACKS } from "./score";
type Scene = "silent" | "menu" | "countdown" | "race";
type Source = AudioScheduledSourceNode;
type Cue =
  "countdown" | "go" | "mistake" | "nitro" | "overtake" | "finish" | "timeout";

/** One app-owned optional context. No network, microphone, autoplay or gameplay dependency. */
export class RaceAudio {
  private prefs: AudioPreferences;
  private musicBuffers = new Map<string, AudioBuffer>();
  private musicLoop: AudioBufferSourceNode | undefined;
  private loadingMusic: Promise<void> | undefined;
  private musicFailed = false;
  private musicAbort = new AbortController();
  private context: AudioContext | undefined;
  private master: GainNode | undefined;
  private music: GainNode | undefined;
  private effects: GainNode | undefined;
  private engine: OscillatorNode | undefined;
  private engineGain: GainNode | undefined;
  private noise: AudioBuffer | undefined;
  private sources = new Set<Source>();
  private gains = new Map<Source, GainNode>();
  private listeners = new Set<() => void>();
  private timer: number | undefined;
  private scene: Scene = "silent";
  private nextAt = 0;
  private step = 0;
  private lastState = "";
  private lastCountdown: number | null = null;
  private soundedCountdown: number | null = null;
  private errors = 0;
  private bursts = 0;
  private lastErrorAt = -Infinity;
  private visible = true;
  private unavailable = false;
  private disposed = false;
  private generation = 0;
  constructor(
    private repository = new LocalAudioRepository(() => localStorage),
    private makeContext: () => AudioContext = () => new AudioContext(),
  ) {
    this.prefs = repository.load();
  }
  get preferences(): AudioPreferences {
    return { ...this.prefs };
  }
  get status(): string {
    return this.prefs.muted
      ? "muted"
      : this.unavailable
        ? "unavailable"
        : this.context?.state === "running"
          ? "running"
          : "locked";
  }
  get diagnostics() {
    return {
      scene: this.scene,
      soundtrack:
        this.scene === "countdown"
          ? "Start sequence"
          : this.scene === "race"
            ? SOUNDTRACKS.race.title
            : SOUNDTRACKS.menu.title,
      musicStatus: this.musicFailed
        ? "unavailable"
        : this.musicBuffers.size === 2
          ? "ready"
          : "loading",
      context: this.context?.state ?? "not-created",
      sources: this.sources.size,
    };
  }
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    listener();
    return () => this.listeners.delete(listener);
  }
  private publish(): void {
    this.listeners.forEach((fn) => fn());
  }
  private guard(action: () => void): void {
    if (this.disposed) return;
    try {
      action();
    } catch {
      this.unavailable = true;
      window.clearInterval(this.timer);
      this.timer = undefined;
      this.stopSources();
      this.publish();
    }
  }
  setPreferences(next: AudioPreferences): boolean {
    if (!validAudio(next)) return false;
    this.prefs = { ...next };
    const saved = this.repository.save(this.prefs);
    if (this.prefs.muted) {
      this.stopSources();
      window.clearInterval(this.timer);
      this.timer = undefined;
    }
    this.volumes();
    this.publish();
    return saved;
  }
  /** Must be called synchronously from Start/Enable sound's real click handler. */
  async unlock(): Promise<boolean> {
    if (this.disposed || this.prefs.muted) return false;
    const token = ++this.generation;
    try {
      if (!this.context || this.context.state === "closed") {
        const ctx = this.makeContext();
        this.context = ctx;
        this.master = ctx.createGain();
        this.music = ctx.createGain();
        this.effects = ctx.createGain();
        this.master.gain.value = 0;
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -12;
        compressor.ratio.value = 5;
        this.music.connect(this.master);
        this.effects.connect(this.master);
        this.master.connect(compressor);
        compressor.connect(ctx.destination);
        this.noise = ctx.createBuffer(
          1,
          Math.floor(ctx.sampleRate * 0.22),
          ctx.sampleRate,
        );
        let seed = 5;
        const data = this.noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
          data[i] = seed / 2147483648 - 1;
        }
        ctx.onstatechange = () => {
          if (!this.disposed) this.publish();
        };
      }
      // resume() is issued before awaiting, while the click gesture is still active.
      const resumed = this.context.resume();
      await resumed;
      if (this.disposed || token !== this.generation) return false;
      if (this.timer === undefined)
        this.timer = window.setInterval(
          () => this.guard(() => this.schedule()),
          25,
        );
      this.unavailable = false;
      void this.prepareMusic(this.context);
      this.playCountdown();
      this.nextAt = this.context.currentTime + 0.03;
      this.volumes();
      this.publish();
      return this.context.state === "running";
    } catch {
      if (!this.disposed) {
        this.unavailable = true;
        this.stopSources();
        this.publish();
      }
      return false;
    }
  }
  private volumes(): void {
    this.guard(() => this.applyVolumes());
  }
  private applyVolumes(): void {
    const ctx = this.context;
    if (!ctx || !this.master || !this.music || !this.effects) return;
    this.master.gain.setTargetAtTime(
      this.prefs.muted || !this.visible ? 0 : this.prefs.master,
      ctx.currentTime,
      0.035,
    );
    this.music.gain.setTargetAtTime(this.prefs.music, ctx.currentTime, 0.08);
    this.effects.gain.setTargetAtTime(
      this.prefs.effects,
      ctx.currentTime,
      0.04,
    );
  }
  setVisible(visible: boolean): void {
    this.visible = visible;
    if (!visible) this.stopSources();
    this.volumes();
  }
  setScene(scene: Scene): void {
    if (scene === this.scene) return;
    this.stopSources();
    this.scene = scene;
    if (scene === "countdown") this.soundedCountdown = null;
    this.step = 0;
    this.nextAt = (this.context?.currentTime ?? 0) + 0.03;
    this.publish();
  }
  private track(source: Source, gain: GainNode): void {
    this.sources.add(source);
    this.gains.set(source, gain);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
      this.sources.delete(source);
      this.gains.delete(source);
    };
  }
  private tone(
    hz: number,
    duration: number,
    level: number,
    wave: OscillatorType,
    at: number,
    bus: GainNode,
  ): void {
    const ctx = this.context!;
    if (this.sources.size >= 48) return;
    const source = ctx.createOscillator(),
      gain = ctx.createGain();
    // A future voice must stay quiet if pause cancels its scheduled envelope.
    gain.gain.value = 0.0001;
    source.type = wave;
    source.frequency.value = hz;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.linearRampToValueAtTime(level, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(gain);
    gain.connect(bus);
    this.track(source, gain);
    source.start(at);
    source.stop(at + duration + 0.01);
  }
  private noiseHit(
    duration: number,
    level: number,
    at: number,
    bus: GainNode,
  ): void {
    const ctx = this.context!;
    if (this.sources.size >= 48 || !this.noise) return;
    const source = ctx.createBufferSource(),
      gain = ctx.createGain();
    gain.gain.value = 0.0001;
    source.buffer = this.noise;
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(gain);
    gain.connect(bus);
    this.track(source, gain);
    source.start(at);
    source.stop(at + duration);
  }
  private allowed(): boolean {
    return (
      !this.disposed &&
      !this.unavailable &&
      !this.prefs.muted &&
      this.visible &&
      this.context?.state === "running"
    );
  }
  private async prepareMusic(ctx: AudioContext): Promise<void> {
    if (this.loadingMusic) return this.loadingMusic;
    this.musicFailed = false;
    this.loadingMusic = Promise.all(
      Object.entries(SOUNDTRACKS).map(async ([scene, track]) => {
        const response = await fetch(import.meta.env.BASE_URL + track.path, {
          signal: this.musicAbort.signal,
        });
        if (!response.ok) throw new Error("Soundtrack unavailable");
        const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
        if (!this.disposed && this.context === ctx)
          this.musicBuffers.set(scene, buffer);
      }),
    )
      .then(() => {
        if (!this.disposed) this.publish();
      })
      .catch(() => {
        if (!this.disposed) {
          this.musicFailed = true;
          this.loadingMusic = undefined;
          this.publish();
        }
      });
    return this.loadingMusic;
  }
  private schedule(): void {
    if (!this.allowed() || this.scene === "silent") return;
    const ctx = this.context!;
    if (this.scene === "menu" || this.scene === "race") {
      const buffer = this.musicBuffers.get(this.scene);
      if (buffer && !this.musicLoop) {
        const source = ctx.createBufferSource(),
          gain = ctx.createGain();
        source.buffer = buffer;
        source.loop = true;
        gain.gain.value = 0.72;
        source.connect(gain);
        gain.connect(this.music!);
        this.track(source, gain);
        this.musicLoop = source;
        source.start();
      }
      return;
    }
    if (ctx.currentTime - this.nextAt > 0.25)
      this.nextAt = ctx.currentTime + 0.02; // Never burst missed background beats.
    while (this.nextAt < ctx.currentTime + 0.12) {
      if (this.scene === "countdown") {
        const tick = this.step++ % 16;
        this.tone(
          55 + tick * 5,
          0.09,
          0.07,
          "triangle",
          this.nextAt,
          this.music!,
        );
        if (tick % 2 === 0)
          this.noiseHit(0.04, 0.035, this.nextAt, this.music!);
        this.nextAt += 0.125;
        continue;
      }
    }
  }
  cue(kind: Cue): void {
    this.guard(() => this.playCue(kind));
  }
  private playCue(kind: Cue): void {
    if (!this.allowed()) return;
    const at = this.context!.currentTime,
      bus = this.effects!;
    if (kind === "nitro") {
      this.noiseHit(0.18, 0.075, at, bus);
      this.tone(620, 0.2, 0.055, "sine", at, bus);
    } else if (kind === "finish")
      [69, 72, 76, 81].forEach((note, i) =>
        this.tone(midiHz(note), 0.65, 0.07, "triangle", at + i * 0.08, bus),
      );
    else if (kind === "timeout")
      [62, 57].forEach((note, i) =>
        this.tone(midiHz(note), 0.25, 0.05, "sine", at + i * 0.12, bus),
      );
    else
      this.tone(
        kind === "go"
          ? 880
          : kind === "countdown"
            ? 440 + (3 - (this.lastCountdown ?? 3)) * 110
            : kind === "mistake"
              ? 180
              : 660,
        kind === "mistake" ? 0.055 : 0.16,
        kind === "mistake" ? 0.025 : 0.055,
        "sine",
        at,
        bus,
      );
  }
  private playCountdown(): void {
    if (
      this.scene === "countdown" &&
      this.allowed() &&
      this.lastCountdown !== null &&
      this.soundedCountdown !== this.lastCountdown
    ) {
      this.soundedCountdown = this.lastCountdown;
      this.cue("countdown");
    }
  }
  updateRace(s: TypingSnapshot): void {
    this.guard(() => this.updateSnapshot(s));
  }
  private updateSnapshot(s: TypingSnapshot): void {
    if (s.state === "ready") {
      this.errors = 0;
      this.bursts = 0;
      this.lastCountdown = null;
      this.lastState = "ready";
      this.lastErrorAt = -Infinity;
      this.setScene("menu");
      return;
    }
    this.setScene(
      s.state === "racing"
        ? "race"
        : s.state === "countdown"
          ? "countdown"
          : s.state === "finished" || s.state === "timed-out"
            ? "menu"
            : "silent",
    );
    if (s.state === "countdown") {
      this.lastCountdown = s.countdown;
      this.playCountdown();
    }
    if (s.state === "racing" && this.lastState === "countdown") this.cue("go");
    if (
      s.state === "racing" &&
      s.errorCount > this.errors &&
      s.elapsedMs - this.lastErrorAt >= 200
    ) {
      this.cue("mistake");
      this.lastErrorAt = s.elapsedMs;
    }
    if (s.state === "racing" && s.nitroBursts > this.bursts) this.cue("nitro");
    if (s.state === "finished" && this.lastState !== "finished")
      this.cue("finish");
    if (s.state === "timed-out" && this.lastState !== "timed-out")
      this.cue("timeout");
    if (s.state === "racing" && this.allowed()) {
      const ctx = this.context!;
      if (!this.engine) {
        this.engine = ctx.createOscillator();
        this.engine.type = "sawtooth";
        this.engineGain = ctx.createGain();
        this.engineGain.gain.value = 0.015;
        this.engine.connect(this.engineGain);
        this.engineGain.connect(this.effects!);
        this.track(this.engine, this.engineGain);
        this.engine.start();
      }
      this.engine.frequency.setTargetAtTime(
        45 + Math.min(140, s.recentWpm) * 0.6,
        ctx.currentTime,
        0.15,
      );
      this.engineGain!.gain.setTargetAtTime(
        s.errorCharacter === null ? 0.015 : 0.005,
        ctx.currentTime,
        0.08,
      );
    }
    this.lastState = s.state;
    this.lastCountdown = s.countdown;
    this.errors = s.errorCount;
    this.bursts = s.nitroBursts;
  }
  private stopSources(): void {
    const at = this.context?.currentTime ?? 0;
    for (const source of this.sources) {
      try {
        const gain = this.gains.get(source)!.gain;
        gain.cancelScheduledValues(at);
        gain.setTargetAtTime(0.0001, at, 0.008);
        source.stop(at + 0.04);
      } catch {
        /* Already ended. */
      }
    }
    this.musicLoop = undefined;
    this.engine = undefined;
    this.engineGain = undefined;
  }
  dispose(): void {
    this.disposed = true;
    this.musicAbort.abort();
    this.musicBuffers.clear();
    this.generation++;
    window.clearInterval(this.timer);
    this.stopSources();
    this.listeners.clear();
    if (this.context) {
      this.context.onstatechange = null;
      void this.context.close().catch(() => {});
    }
  }
}
