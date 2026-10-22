import type Phaser from "phaser";

interface AirSample {
  width: number;
  height: number;
  delta: number;
  racing: boolean;
  reduced: boolean;
  high: boolean;
  wpm: number;
  ready: boolean;
  tint: number;
}
interface AirLayer {
  image: Phaser.GameObjects.Image;
  kind: "haze" | "mote" | "streak";
  y: number;
  depth: number;
  phase: number;
  size: number;
  alpha: number;
}
/** Prebaked, feathered sprites at three depths. No per-frame paths, filters or particle spawning. */
export class RaceAtmosphere {
  private layers: AirLayer[] = [];
  private strength = 0;
  private travel = 0;
  constructor(scene: Phaser.Scene) {
    for (const [key, w, h] of [
      ["air-haze", 256, 64],
      ["air-mote", 16, 16],
      ["air-streak", 256, 16],
    ] as const) {
      if (scene.textures.exists(key)) continue;
      const texture = scene.textures.createCanvas(key, w, h);
      if (!texture) continue;
      const ctx = texture.getContext();
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(w / 2, h / 2);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      gradient.addColorStop(0, "rgba(228,239,241,0.8)");
      gradient.addColorStop(0.3, "rgba(216,232,236,0.35)");
      gradient.addColorStop(1, "rgba(216,232,236,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();
      texture.refresh();
    }
    const add = (
      kind: AirLayer["kind"],
      y: number,
      depth: number,
      size: number,
      alpha: number,
      index: number,
    ) => {
      this.layers.push({
        image: scene.add
          .image(0, 0, `air-${kind}`)
          .setBlendMode("SCREEN")
          .setVisible(false),
        kind,
        y,
        depth,
        size,
        alpha,
        phase: (index * 0.61803398875) % 1,
      });
    };
    // Distant haze lives over the sky/mountains, with only two low foreground wisps.
    [0.12, 0.23, 0.32, 0.38, 0.46, 0.82].forEach((y, i) =>
      add(
        "haze",
        y,
        0.08 + i * 0.055,
        0.36 + (i % 3) * 0.12,
        i < 4 ? 0.25 : 0.14,
        i + 1,
      ),
    );
    for (let i = 0; i < 24; i++)
      add(
        "mote",
        i < 12 ? 0.08 + i * 0.026 : 0.44 + (i - 12) * 0.045,
        0.25 + (i % 7) * 0.18,
        1.6 + (i % 4) * 0.7,
        0.35,
        i + 8,
      );
    for (let i = 0; i < 12; i++)
      add(
        "streak",
        i < 4 ? 0.11 + i * 0.08 : 0.48 + (i - 4) * 0.067,
        0.5 + (i % 5) * 0.24,
        0.045 + (i % 3) * 0.025,
        0.38,
        i + 35,
      );
  }
  update(s: AirSample): { count: number; sky: number; travel: number } {
    const dt = Math.min(50, Math.max(0, s.delta));
    if (s.ready) this.travel = this.strength = 0;
    const target =
      s.racing && !s.reduced ? Math.min(1, Math.max(0, s.wpm) / 90) : 0;
    this.strength += (target - this.strength) * (1 - Math.exp(-dt / 350));
    if (s.racing && !s.reduced) this.travel += dt * 0.7 * this.strength;
    const visible = s.racing && !s.reduced && s.high && s.wpm > 0;
    let count = 0,
      sky = 0;
    for (const layer of this.layers) {
      layer.image.setVisible(visible);
      if (!visible) continue;
      const { kind, depth, phase, size } = layer;
      const length =
        kind === "haze"
          ? s.width * size
          : kind === "streak"
            ? s.width * size * (0.6 + this.strength)
            : size;
      const span = s.width + length * 2;
      const cycle = ((this.travel * depth + phase * span) % span) / span;
      const x = s.width + length - cycle * span;
      const fade = Math.sin(cycle * Math.PI);
      // Long exposures appear near the periphery; the car/central reading area stays clean.
      const peripheral =
        kind === "streak"
          ? 0.08 +
            0.92 *
              Math.min(1, Math.abs(x - s.width * 0.43) / (s.width * 0.4)) ** 2
          : 1;
      const height =
        kind === "haze"
          ? 22 + size * 50
          : kind === "streak"
            ? 2 + this.strength * 2
            : size;
      layer.image
        .setPosition(
          x,
          s.height * layer.y +
            Math.sin(this.travel / 800 + phase * 6) *
              (kind === "haze" ? 4 : 1.5),
        )
        .setDisplaySize(length, height)
        .setTint(s.tint)
        .setAlpha(layer.alpha * this.strength * fade * peripheral);
      count++;
      if (layer.y < 0.4) sky++;
    }
    return { count, sky, travel: this.travel };
  }
}
