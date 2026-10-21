import type { SoloRace } from "../core/solo-race";
interface TrackOptions {
  read: () => ReturnType<SoloRace["snapshot"]>;
  reducedMotion: () => boolean;
  effects: () => "high" | "low";
  onReady: () => void;
  onError: () => void;
}
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  color: number;
  confetti: boolean;
}

/** Responsive presentation only. Progress, timing and placement stay in SoloRace. */
export async function mountRaceTrack(
  parent: HTMLElement,
  options: TrackOptions,
): Promise<() => void> {
  const { default: Phaser } = await import("phaser");
  if (!parent.isConnected) return () => {};
  class HarborCircuit extends Phaser.Scene {
    private cars: Phaser.GameObjects.Container[] = [];
    private flames: Phaser.GameObjects.Graphics[] = [];
    private spokes: Phaser.GameObjects.Graphics[][] = [];
    private labels: Phaser.GameObjects.Text[] = [];
    private markers: Phaser.GameObjects.Text[] = [];
    private previous = new Map<string, { progress: number; at: number }>();
    private backdrop!: Phaser.GameObjects.Graphics;
    private city!: Phaser.GameObjects.Graphics;
    private road!: Phaser.GameObjects.Graphics;
    private gate!: Phaser.GameObjects.Graphics;
    private particles!: Phaser.GameObjects.Graphics;
    private title!: Phaser.GameObjects.Text;
    private pool: Spark[] = [];
    private burst = 0;
    private ended = false;
    private qualityAt = 0;
    preload(): void {
      this.load.image(
        "volt-kart",
        `${import.meta.env.BASE_URL}assets/karts/volt-kart.png`,
      );
      this.load.on("loaderror", options.onError);
    }
    create(): void {
      if (!this.textures.exists("volt-kart")) return;
      // Bake palette variations once; labels distinguish opponents if canvas filters are unavailable.
      const source = this.textures
        .get("volt-kart")
        .getSourceImage() as HTMLImageElement;
      for (let i = 1; i < 5; i++) {
        const texture = this.textures.createCanvas(`kart-${i}`, 640, 320);
        if (texture) {
          const context = texture.getContext();
          context.filter = `hue-rotate(${i * 72}deg)`;
          context.drawImage(source, 0, 0, 640, 320);
          texture.refresh();
        }
      }
      this.backdrop = this.add.graphics();
      this.city = this.add.graphics();
      this.road = this.add.graphics();
      this.gate = this.add.graphics();
      this.title = this.add
        .text(0, 0, "NEON HARBOR", {
          fontFamily: "monospace",
          fontSize: "24px",
          color: "#a3c2c1",
          letterSpacing: 5,
        })
        .setAlpha(0.65);
      [
        "YOU",
        "NEON FOX · CPU",
        "APEX NOVA · CPU",
        "COMET · CPU",
        "VOLT · CPU",
      ].forEach((name, i) => {
        const root = this.add.container(0, 0),
          flame = this.add.graphics();
        const shadow = this.add.ellipse(0, 43, 175, 12, 0x000000, 0.4);
        const body = this.add
          .image(
            0,
            0,
            i && this.textures.exists(`kart-${i}`) ? `kart-${i}` : "volt-kart",
          )
          .setDisplaySize(200, 100);
        root.add([shadow, flame, body]);
        this.spokes.push(
          [
            [-71, 20],
            [42, 20],
          ].map(([x, y]) => {
            const spokes = this.add.graphics().lineStyle(1, 0xe6f2f5, 0.55);
            for (let n = 0; n < 5; n++) {
              const a = (n * Math.PI) / 2.5;
              spokes.lineBetween(
                Math.cos(a) * 7,
                Math.sin(a) * 7,
                Math.cos(a) * 16,
                Math.sin(a) * 16,
              );
            }
            spokes.setPosition(x, y);
            root.add(spokes);
            return spokes;
          }),
        );
        const label = this.add
          .text(0, -53, name, {
            fontFamily: "monospace",
            fontSize: "10px",
            color: i ? "#cee3e4" : "#c2ff69",
          })
          .setOrigin(0.5);
        root.add(label);
        this.labels.push(label);
        this.cars.push(root);
        this.flames.push(flame);
        this.markers.push(
          this.add.text(0, 0, "", {
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#b9d5d9",
            backgroundColor: "#102630",
          }),
        );
      });
      this.particles = this.add.graphics().setDepth(5);
      this.layout();
      this.scale.on("resize", this.layout, this);
      parent.dataset.ready = "true";
      options.onReady();
    }
    private layout(): void {
      if (!this.backdrop) return;
      const w = this.scale.width,
        h = this.scale.height,
        horizon = h * 0.4;
      this.backdrop.clear();
      for (let y = 0; y < horizon; y += 6)
        this.backdrop
          .fillStyle(
            Phaser.Display.Color.GetColor(
              10 + (y / horizon) * 10,
              27 + (y / horizon) * 34,
              39 + (y / horizon) * 34,
            ),
          )
          .fillRect(0, y, w, 6);
      this.backdrop
        .fillStyle(0xe4d1a5, 0.65)
        .fillCircle(w * 0.81, horizon * 0.27, Math.min(w * 0.045, 55));
      this.backdrop
        .fillStyle(0x193e48)
        .fillTriangle(-100, horizon, w * 0.28, horizon * 0.4, w * 0.65, horizon)
        .fillTriangle(
          w * 0.35,
          horizon,
          w * 0.78,
          horizon * 0.23,
          w + 100,
          horizon,
        );
      this.city.clear();
      for (let i = 0; i < Math.ceil((w * 2) / 58); i++) {
        const x = i * 58,
          height = 24 + ((i * 37) % Math.max(25, Math.floor(horizon * 0.48)));
        this.city
          .fillStyle(i % 2 ? 0x1c3945 : 0x21434c)
          .fillRect(x, horizon - height, 45, height);
        for (let y = 10; y < height; y += 18)
          for (let k = 0; k < 3; k++)
            if ((i + y + k) % 3)
              this.city
                .fillStyle(0x83c4c5, 0.19)
                .fillRect(x + 7 + k * 12, horizon - height + y, 3, 5);
      }
      this.title
        .setPosition(Math.max(18, w * 0.03), horizon * 0.68)
        .setFontSize(w < 500 ? 15 : 28);
    }
    private emit(x: number, y: number, count: number, confetti = false): void {
      const high = options.effects() === "high",
        limit = confetti ? (high ? 64 : 16) : high ? 40 : 10;
      for (
        let i = 0;
        i < count &&
        this.pool.filter((p) => p.confetti === confetti).length < limit;
        i++
      ) {
        const angle = (i * 2.4 + this.burst) % 6.28;
        this.pool.push({
          x,
          y,
          vx: confetti ? Math.cos(angle) * 170 : -110 - i * 9,
          vy: confetti
            ? -160 - Math.abs(Math.sin(angle)) * 120
            : Math.sin(angle) * 35,
          age: 0,
          life: confetti ? 1500 : 450,
          color: [0x63e7f2, 0xffa165, 0xb7f36b, 0xf6d46b][i % 4],
          confetti,
        });
      }
    }
    update(_time: number, delta: number): void {
      if (!this.road) return;
      const snapshot = options.read(),
        s = snapshot.player,
        reduced = options.reducedMotion(),
        high = options.effects() === "high";
      const w = this.scale.width,
        h = this.scale.height,
        horizon = h * 0.4,
        laneHeight = (h - horizon - 12) / 5;
      const carWidth = Math.max(
        55,
        Math.min(w * (w < 700 ? 0.26 : 0.155), 220, laneHeight * 1.8),
      );
      const step = Math.min(delta, 50),
        active = s.state === "racing",
        decorative = active && !reduced;
      this.city.x = reduced ? 0 : -(s.progress * w * 0.6) % (w * 0.5);
      this.road
        .clear()
        .fillStyle(0x203b46)
        .fillRect(0, horizon, w, h - horizon);
      this.road.fillStyle(0xaaff6b).fillRect(0, horizon, w, 3);
      this.road.lineStyle(1, 0xa2bdc1, 0.3);
      const offset = reduced ? 0 : (s.elapsedMs * 0.15) % 100;
      for (let i = 1; i <= 5; i++)
        for (let x = -100; x < w + 100; x += 100)
          this.road.lineBetween(
            x - offset,
            horizon + laneHeight * i,
            x + 42 - offset,
            horizon + laneHeight * i,
          );
      if (decorative && high && s.recentWpm > 25) {
        this.road.lineStyle(1, 0x70d6df, 0.15);
        for (let i = 0; i < 9; i++) {
          const x = (((i * 157 - s.elapsedMs * 0.3) % w) + w) % w;
          const y = horizon + 15 + ((i * 43) % (h - horizon - 15));
          this.road.lineBetween(x, y, x + 45, y);
        }
      }
      this.gate.clear();
      const playerX = reduced ? w * (0.12 + s.progress * 0.76) : w * 0.43;
      const finishX = reduced
        ? w * 0.88 + carWidth * 0.46
        : playerX + carWidth * 0.46 + (1 - s.progress) * w * 2.5;
      if (finishX < w + 30)
        for (let y = horizon + 4; y < h; y += 12)
          for (let x = 0; x < 24; x += 12)
            this.gate
              .fillStyle(
                (Math.floor((y - horizon - 4) / 12) + x / 12) % 2
                  ? 0xe4f5ef
                  : 0x0a202a,
              )
              .fillRect(finishX + x, y, 12, 12);
      const ids = ["player", "cpu-1", "cpu-2", "cpu-3", "cpu-4"],
        lanes = [2, 0, 1, 3, 4];
      ids.forEach((id, i) => {
        const row = snapshot.standings.find((r) => r.id === id)!,
          gap = row.progress - s.progress;
        const x = reduced
          ? w * (0.12 + row.progress * 0.76)
          : w *
            (0.43 + Math.sign(gap) * 0.43 * (1 - Math.exp(-Math.abs(gap) * 7)));
        const root = this.cars[i],
          previous = this.previous.get(id);
        const at =
          previous && row.progress > previous.progress
            ? s.elapsedMs
            : (previous?.at ?? -Infinity);
        this.previous.set(id, { progress: row.progress, at });
        const moving =
          decorative &&
          row.progress < 1 &&
          s.elapsedMs - at < 200 &&
          (i > 0 || s.errorCharacter === null);
        root
          .setPosition(
            Math.max(carWidth * 0.52, Math.min(w - carWidth * 0.52, x)),
            horizon +
              laneHeight * (lanes[i] + 0.52) +
              (moving ? Math.sin(s.elapsedMs / 190 + i) * 0.65 : 0),
          )
          .setScale(carWidth / 200);
        this.labels[i].setFontSize(Math.max(11, 9 / (carWidth / 200)));
        this.markers[i]
          .setVisible(!reduced && Math.abs(gap) > 0.3)
          .setPosition(
            gap < 0 ? 5 : w - 5,
            horizon + laneHeight * (lanes[i] + 0.1),
          )
          .setOrigin(gap < 0 ? 0 : 1, 0)
          .setText(`${gap < 0 ? "◀" : "▶"} ${Math.round(row.progress * 100)}%`);
        const flame = this.flames[i];
        flame.clear();
        if (moving) {
          const nitro = i === 0 && s.nitroActive,
            size =
              (nitro ? 100 : 48) *
              (0.83 + Math.sin(s.elapsedMs / 37 + i) * 0.17);
          flame
            .fillStyle(nitro ? 0x3ddcfa : 0xff8d28, 0.9)
            .fillTriangle(-91, -13, -91, 0, -91 - size, -7)
            .fillStyle(0xfff2b0)
            .fillTriangle(-91, -11, -91, -2, -91 - size * 0.6, -7);
          this.spokes[i].forEach(
            (wheel) => (wheel.rotation = s.elapsedMs / 65),
          );
        }
      });
      if (s.state === "ready") {
        this.pool = [];
        this.burst = 0;
        this.ended = false;
        this.previous.clear();
      }
      if (s.nitroBursts > this.burst) {
        this.burst = s.nitroBursts;
        if (!reduced)
          this.emit(
            playerX - carWidth / 2,
            horizon + laneHeight * 2.5,
            high ? 25 : 7,
          );
      }
      const ended = ["finished", "timed-out", "abandoned"].includes(s.state);
      if (ended && !this.ended) {
        this.ended = true;
        if (!reduced && s.state === "finished")
          this.emit(w * 0.5, h * 0.4, high ? 64 : 16, true);
      }
      this.particles.clear();
      if (reduced) this.pool = [];
      this.pool = this.pool.filter((p) => p.age < p.life);
      for (const p of this.pool) {
        if (decorative || ended) {
          p.age += step;
          p.x += (p.vx * step) / 1000;
          p.y += (p.vy * step) / 1000;
          if (p.confetti) p.vy += (140 * step) / 1000;
        }
        this.particles.fillStyle(p.color, Math.max(0, 1 - p.age / p.life));
        if (p.confetti) this.particles.fillRect(p.x, p.y, 5, 3);
        else this.particles.fillCircle(p.x, p.y, 2);
      }
      this.qualityAt += step;
      if (this.qualityAt >= 100) {
        this.qualityAt = 0;
        parent.dataset.particles = String(this.pool.length);
        parent.dataset.motion = reduced ? "reduced" : "full";
        parent.dataset.effects = options.effects();
      }
    }
  }
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: Math.max(1, parent.clientWidth),
    height: Math.max(1, parent.clientHeight),
    backgroundColor: "#102731",
    banner: false,
    audio: { noAudio: true },
    scale: { mode: Phaser.Scale.RESIZE },
    scene: HarborCircuit,
  });
  const observer = new ResizeObserver(() =>
    game.scale.resize(
      Math.max(1, parent.clientWidth),
      Math.max(1, parent.clientHeight),
    ),
  );
  observer.observe(parent);
  const lost = () => options.onError();
  parent.addEventListener("webglcontextlost", lost, true);
  return () => {
    parent.removeEventListener("webglcontextlost", lost, true);
    observer.disconnect();
    game.destroy(true);
  };
}
