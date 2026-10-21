import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Original compositions and instruments. No imported samples, melodies or recordings.
// Offline rendering keeps the browser's realtime work to one decoded looping source.
const RATE = 22050;
const TAU = Math.PI * 2;
const hz = (note) => 440 * 2 ** ((note - 69) / 12);
const directory = new URL("../public/assets/audio/", import.meta.url);
mkdirSync(directory, { recursive: true });
const reports = [];
for (const race of [false, true]) {
  const bpm = race ? 150 : 124;
  const bars = race ? 16 : 8;
  const beat = 60 / bpm;
  const length = Math.round(bars * beat * 4 * RATE);
  const mix = new Float64Array(length);
  const ambience = new Float64Array(length);
  let seed = race ? 8723 : 4631;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2147483648 - 1;
  };
  const add = (at, duration, render, wet = 0) => {
    const start = Math.round(at * RATE);
    const frames = Math.round(duration * RATE);
    for (let i = 0; i < frames; i++) {
      const t = i / RATE;
      const value = render(t, duration);
      const index = (start + i) % length;
      mix[index] += value;
      ambience[index] += value * wet;
    }
  };
  const kick = (at, power = 1) =>
    add(at, 0.38, (t) => {
      const phase = TAU * (46 * t + 65 * 0.025 * (1 - Math.exp(-t / 0.025)));
      return (
        power *
        (Math.sin(phase) * Math.exp(-t * 15) * 0.62 +
          random() * Math.exp(-t * 600) * 0.13)
      );
    });
  const snare = (at, power = 1) => {
    let previous = 0;
    add(
      at,
      0.24,
      (t) => {
        const noise = random();
        const high = noise - previous * 0.75;
        previous = noise;
        return (
          power *
          (high * Math.exp(-t * 24) * 0.19 +
            Math.sin(TAU * 185 * t) * Math.exp(-t * 35) * 0.17)
        );
      },
      0.16,
    );
  };
  const hat = (at, open, power = 1) => {
    let previous = 0;
    add(
      at,
      open ? 0.19 : 0.055,
      (t) => {
        const noise = random();
        const high = noise - previous;
        previous = noise;
        return high * Math.exp(-t * (open ? 24 : 100)) * 0.055 * power;
      },
      0.05,
    );
  };
  const bass = (at, note, duration, power = 1) => {
    const f = hz(note);
    add(at, duration + 0.035, (t, d) => {
      const attack = Math.min(1, t / 0.007);
      const release = Math.min(1, Math.max(0, (d - t) / 0.035));
      const harmonic =
        Math.sin(TAU * f * t) +
        0.3 * Math.sin(TAU * f * 2 * t) +
        0.1 * Math.sin(TAU * f * 3 * t);
      return (
        Math.tanh(harmonic * (race ? 1.8 : 0.8)) *
        attack *
        release *
        Math.exp(-t * 2.2) *
        0.18 *
        power
      );
    });
  };
  const chord = (at, root, duration, power = 1) => {
    const notes = race
      ? [root + 12, root + 19, root + 24]
      : [root + 24, root + 28, root + 31, root + 36];
    add(
      at,
      duration,
      (t, d) => {
        const envelope =
          Math.min(1, t / (race ? 0.004 : 0.18)) *
          Math.min(1, (d - t) / (race ? 0.04 : 0.45));
        let sum = 0;
        for (const note of notes) {
          const f = hz(note);
          sum +=
            Math.sin(TAU * f * t) +
            0.25 * Math.sin(TAU * f * 2.003 * t) +
            (race ? 0.18 * Math.sin(TAU * f * 3 * t) : 0);
        }
        return (
          Math.tanh(sum * (race ? 1.5 : 0.3)) *
          envelope *
          Math.exp(-t * (race ? 12 : 0.3)) *
          power *
          (race ? 0.1 : 0.085)
        );
      },
      race ? 0.1 : 0.28,
    );
  };
  const lead = (at, note, duration, power = 1) => {
    const f = hz(note);
    add(
      at,
      duration + 0.16,
      (t, d) => {
        const env =
          Math.min(1, t / 0.012) *
          Math.min(1, (d - t) / 0.16) *
          Math.exp(-t * 3.2);
        return (
          (Math.sin(TAU * f * t + 0.002 * f * Math.sin(TAU * 5 * t)) +
            0.24 * Math.sin(TAU * f * 2 * t)) *
          env *
          0.07 *
          power
        );
      },
      0.34,
    );
  };
  const roots = race
    ? [38, 38, 34, 36, 38, 41, 36, 33]
    : [36, 43, 41, 43, 36, 43, 41, 43];
  const hook = race
    ? [74, 77, 81, 79, 77, 74, 72, 69]
    : [76, 79, 84, 83, 81, 79, 77, 79];
  for (let bar = 0; bar < bars; bar++) {
    const at = bar * beat * 4;
    const root = roots[bar % roots.length];
    const breakdown = race && bar === 7;
    if (race) {
      for (const tick of breakdown ? [0, 8] : [0, 3, 6, 8, 10, 14])
        kick(at + (tick * beat) / 4, tick === 0 ? 1 : 0.8);
      snare(at + beat, 1);
      snare(at + beat * 3, 1);
      for (let tick = 0; tick < 16; tick++) {
        if (!breakdown || tick < 8) {
          hat(at + (tick * beat) / 4, tick % 8 === 6, tick % 2 ? 0.5 : 0.85);
          if (![2, 7, 11, 15].includes(tick))
            bass(
              at + (tick * beat) / 4,
              root + (tick === 14 ? 12 : 0),
              beat * 0.2,
            );
          if (tick % 2 === 0)
            chord(
              at + (tick * beat) / 4,
              root,
              beat * 0.23,
              tick % 4 === 0 ? 1 : 0.6,
            );
        }
      }
      if (bar % 4 >= 2)
        for (let n = 0; n < 4; n++)
          lead(at + n * beat + beat / 2, hook[(n + bar) % 8], beat * 0.45);
      if (bar % 4 === 3)
        for (let n = 0; n < 4; n++)
          snare(at + beat * (3 + n / 4), 0.25 + n * 0.12);
    } else {
      for (let n = 0; n < 4; n++) kick(at + beat * n, 0.58);
      snare(at + beat, 0.6);
      snare(at + beat * 3, 0.6);
      chord(at, root, beat * 1.8, 0.8);
      chord(at + beat * 2, root, beat * 1.8, 0.7);
      for (let tick = 0; tick < 8; tick++) {
        hat(at + (tick * beat) / 2, tick % 2 === 1, tick % 2 ? 0.5 : 0.4);
        bass(
          at + (tick * beat) / 2,
          root + (tick % 4 === 3 ? 12 : 0),
          beat * 0.35,
          0.8,
        );
        if (tick % 2 === 1 || bar % 2 === 1)
          lead(
            at + (tick * beat) / 2,
            hook[(tick + bar * 2) % 8],
            beat * 0.3,
            0.65,
          );
      }
    }
  }
  // Circular delay/reverb tails wrap into the start, keeping loop boundaries continuous.
  for (const [delay, gain] of [
    [beat * 0.75, 0.32],
    [beat * 1.5, 0.18],
    [0.071, 0.12],
    [0.113, 0.09],
  ]) {
    const offset = Math.round(delay * RATE);
    for (let i = 0; i < length; i++)
      mix[(i + offset) % length] += ambience[i] * gain;
  }
  let mean = mix.reduce((sum, n) => sum + n, 0) / length;
  let peak = 0;
  for (let i = 0; i < length; i++) {
    mix[i] = Math.tanh((mix[i] - mean) * 1.25);
    peak = Math.max(peak, Math.abs(mix[i]));
  }
  const normalization = 0.84 / peak;
  const wav = Buffer.alloc(44 + length * 2);
  wav.write("RIFF");
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(RATE, 24);
  wav.writeUInt32LE(RATE * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(length * 2, 40);
  let energy = 0;
  for (let i = 0; i < length; i++) {
    const v = mix[i] * normalization;
    energy += v * v;
    wav.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  const name = race ? "overdrive" : "ignition";
  writeFileSync(new URL(`${name}.wav`, directory), wav);
  reports.push({
    name,
    bpm,
    bars,
    sampleRate: RATE,
    channels: 1,
    seconds: length / RATE,
    bytes: wav.length,
    peak: 0.84,
    rms: Math.sqrt(energy / length),
    sha256: createHash("sha256").update(wav).digest("hex"),
  });
}
writeFileSync(
  new URL("soundtracks.json", directory),
  JSON.stringify(reports, null, 2) + "\n",
);
console.log(JSON.stringify(reports, null, 2));
