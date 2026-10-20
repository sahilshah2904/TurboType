import type { SoloRace } from "../core/solo-race";
import { CAR_FRONT_OFFSET, projectRace } from "./race-view";

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

/** Presentation only: interpolation/effects never determine race results. */
export async function mountRaceTrack(
  parent: HTMLElement,
  options: TrackOptions,
): Promise<() => void> {
  const { default: Phaser } = await import("phaser");
  if (!parent.isConnected) return () => {};
  class HarborCircuit extends Phaser.Scene {
    private cars: Phaser.GameObjects.Container[] = [];
    private wheels: Phaser.GameObjects.Container[][] = [];
    private flames: Phaser.GameObjects.Graphics[] = [];
    private halos: Phaser.GameObjects.Ellipse[] = [];
    private labels: Phaser.GameObjects.Text[] = [];
    private markers: Phaser.GameObjects.Text[] = [];
    private far!: Phaser.GameObjects.Graphics;
    private near!: Phaser.GameObjects.Graphics;
    private road!: Phaser.GameObjects.Graphics;
    private gate!: Phaser.GameObjects.Container;
    private particles!: Phaser.GameObjects.Graphics;
    private finishCard!: Phaser.GameObjects.Container;
    private finishText!: Phaser.GameObjects.Text;
    private pool: Spark[] = [];
    private cameraX = 0;
    private burst = 0;
    private finishAge = 0;
    private ended = false;
    private stage = "";
    private qualityAt = 0;
    preload(): void {
      for (const name of ["neon-gt", "apex-r", "volt-x"])
        this.load.svg(
          name,
          `${import.meta.env.BASE_URL}assets/cars/${name}.svg`,
          { width: 760, height: 240 },
        );
      this.load.on("loaderror", options.onError);
    }
    create(): void {
      if (
        !["neon-gt", "apex-r", "volt-x"].every((key) =>
          this.textures.exists(key),
        )
      )
        return;
      const sky = this.add.graphics();
      for (let y = 0; y < 150; y += 5)
        sky
          .fillStyle(
            Phaser.Display.Color.GetColor(
              Math.round(7 + y / 18),
              Math.round(18 + y / 9),
              Math.round(31 + y / 6),
            ),
          )
          .fillRect(0, y, 1000, 5);
      sky
        .fillStyle(0x73b7d2, 0.05)
        .fillCircle(805, 38, 75)
        .fillStyle(0x8ce4f1, 0.08)
        .fillCircle(805, 38, 46);
      sky.fillStyle(0xb8e7e9, 0.65).fillCircle(805, 38, 21);
      for (let i = 0; i < 26; i++)
        sky
          .fillStyle(0xbbe9ff, 0.28 + (i % 3) * 0.12)
          .fillCircle((i * 173) % 1000, 7 + ((i * 19) % 84), 1);
      sky
        .fillStyle(0x16253e)
        .fillTriangle(-120, 135, 150, 45, 380, 135)
        .fillTriangle(200, 135, 460, 62, 710, 135)
        .fillTriangle(600, 135, 885, 48, 1120, 135);
      this.far = this.add.graphics();
      this.near = this.add.graphics();
      for (let i = 0; i < 48; i++) {
        const x = i * 45,
          h = 22 + ((i * 29) % 72);
        this.far
          .fillStyle(i % 2 ? 0x16253f : 0x1b2d45)
          .fillRect(x, 134 - h, 35, h);
        if (i % 3 === 0)
          this.far.fillStyle(0x60bdd0, 0.35).fillRect(x + 6, 135 - h, 2, h - 8);
      }
      for (let i = 0; i < 35; i++) {
        const x = i * 64,
          h = 27 + ((i * 37) % 64);
        this.near
          .fillStyle(i % 2 ? 0x172b3a : 0x203347)
          .fillRect(x, 142 - h, 45, h);
        for (let j = 0; j < 5; j++)
          for (let k = 0; k < 3; k++)
            if ((i + j + k) % 3)
              this.near
                .fillStyle((i + j) % 2 ? 0x67d8dc : 0xf1bb8e, 0.25)
                .fillRect(x + 7 + k * 11, 149 - h + j * 11, 3, 4);
      }
      const horizon = this.add.graphics();
      horizon.fillStyle(0x0a1723).fillRect(0, 131, 1000, 319);
      horizon
        .fillStyle(0x235d66)
        .fillRect(0, 135, 1000, 5)
        .fillStyle(0x73e9e2, 0.8)
        .fillRect(0, 137, 1000, 2);
      horizon.fillStyle(0x19313c).fillRect(0, 141, 1000, 9);
      for (let i = 0; i < 5; i++)
        horizon
          .fillStyle(i % 2 ? 0x15212e : 0x12202b)
          .fillRect(0, 151 + i * 59, 1000, 59);
      horizon.fillStyle(0x79dadd, 0.13).fillRect(0, 442, 1000, 3);
      this.road = this.add.graphics();
      this.gate = this.add.container(0, 0);
      const flag = this.add.graphics();
      for (let y = 149; y < 443; y += 14)
        for (let x = 0; x < 28; x += 14)
          flag
            .fillStyle(((y - 149) / 14 + x / 14) % 2 ? 0xe4f5ff : 0x102033)
            .fillRect(x, y, 14, 14);
      flag.lineStyle(3, 0x63e7f2).strokeRect(-4, 149, 36, 294);
      this.gate.add([
        flag,
        this.add
          .text(14, 122, "FINISH", {
            fontFamily: "monospace",
            fontSize: "15px",
            color: "#e4f5ff",
            backgroundColor: "#123643",
            padding: { x: 7, y: 4 },
          })
          .setOrigin(0.5),
      ]);
      this.add.text(24, 20, "NEON HARBOR", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#d9f5ff",
        letterSpacing: 3,
      });
      this.add.text(25, 45, "NIGHT CIRCUIT  /  DRIVE CLEAN", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#6cafbc",
        letterSpacing: 2,
      });
      const names = [
          "YOU",
          "NEON FOX · CPU",
          "APEX NOVA · CPU",
          "COMET · CPU",
          "VOLT · CPU",
        ],
        colors = [0xb7f36b, 0xffb562, 0x72c9ff, 0xc9a1ff, 0xff929d];
      names.forEach((name, i) => {
        const root = this.add.container(220, 174 + i * 59),
          halo = this.add.ellipse(0, 16, 170, 23, colors[i], i ? 0.06 : 0.14),
          shadow = this.add.ellipse(0, 21, 164, 10, 0x000000, 0.45),
          flame = this.add.graphics();
        const body = this.add
          .image(0, 0, ["neon-gt", "apex-r", "volt-x", "neon-gt", "apex-r"][i])
          .setDisplaySize(154, 49)
          .setTint(colors[i]);
        root.add([halo, shadow, flame, body]);
        this.wheels.push(
          [-38.1, 41.5].map((x) => {
            const spokes = this.add.graphics().lineStyle(1.3, 0xc7e1e8);
            for (let n = 0; n < 6; n++) {
              const a = (n * Math.PI) / 3;
              spokes.lineBetween(
                Math.cos(a) * 3,
                Math.sin(a) * 3,
                Math.cos(a) * 8,
                Math.sin(a) * 8,
              );
            }
            const wheel = this.add.container(x, 11.2, [
              this.add.circle(0, 0, 10, 0x07121c).setStrokeStyle(2, 0x78949e),
              this.add.circle(0, 0, 6.5, 0x23313d),
              spokes,
              this.add.circle(0, 0, 2, 0xafd1dc),
            ]);
            root.add(this.add.rectangle(x + 5, 11, 3, 8, 0xff9669));
            root.add(wheel);
            return wheel;
          }),
        );
        const label = this.add
          .text(0, -29, name, {
            fontFamily: "monospace",
            fontSize: "11px",
            color: i ? "#b1d2df" : "#c6ff96",
            backgroundColor: "#0b1d29",
            padding: { x: 5, y: 2 },
          })
          .setOrigin(0.5);
        root.add(label);
        this.cars.push(root);
        this.flames.push(flame);
        this.halos.push(halo);
        this.labels.push(label);
        this.markers.push(
          this.add.text(0, 166 + i * 59, "", {
            fontFamily: "monospace",
            fontSize: "11px",
            color: i ? "#b1d2df" : "#c6ff96",
            backgroundColor: "#102431",
            padding: { x: 6, y: 4 },
          }),
        );
      });
      this.particles = this.add.graphics().setDepth(7);
      const card = this.add
        .graphics()
        .fillStyle(0x07121f, 0.93)
        .fillRoundedRect(-195, -47, 390, 94, 15)
        .lineStyle(2, 0xe7c46f)
        .strokeRoundedRect(-195, -47, 390, 94, 15);
      this.finishText = this.add
        .text(0, 0, "", {
          fontFamily: "monospace",
          fontSize: "24px",
          color: "#f6da8e",
          align: "center",
        })
        .setOrigin(0.5);
      this.finishCard = this.add
        .container(500, 245, [card, this.finishText])
        .setDepth(9)
        .setVisible(false);
      parent.dataset.ready = "true";
      options.onReady();
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
        high = options.effects() === "high",
        projection = projectRace(snapshot, reduced);
      const active = s.state === "racing",
        decorative = active && !reduced,
        step = Math.min(delta, 50),
        blend = 1 - Math.exp(-step / 90),
        snap = reduced || !active || this.stage === "ready";
      this.cameraX = snap
        ? projection.camera
        : this.cameraX + (projection.camera - this.cameraX) * blend;
      this.far.x = reduced ? 0 : -(this.cameraX * 0.09) % 1000;
      this.near.x = reduced ? 0 : -(this.cameraX * 0.25) % 1000;
      this.near.alpha = high ? 1 : 0.7;
      const offset = reduced ? 0 : this.cameraX % 75;
      this.road.clear().lineStyle(1.5, 0x7d9cac, 0.3);
      for (let y = 209; y < 440; y += 59)
        for (let x = -75; x < 1100; x += 75)
          this.road.lineBetween(x - offset, y, x + 29 - offset, y);
      this.road.lineStyle(1, 0x6ac3d0, 0.1);
      if (high)
        for (let x = -200; x < 1200; x += 170)
          this.road.lineBetween(x - offset * 2, 157, x + 65 - offset * 2, 157);
      if (decorative && high && s.recentWpm > 25) {
        this.road.lineStyle(1.5, 0x65dce3, Math.min(0.22, s.recentWpm / 600));
        for (let i = 0; i < 9; i++) {
          const x =
            ((((i * 137 - s.elapsedMs * 0.4) % 1100) + 1100) % 1100) - 50;
          const y = 195 + ((i * 31) % 240);
          this.road.lineBetween(x, y, x + 35, y);
        }
      }
      this.gate.x = reduced
        ? projection.finishX
        : 4220 + CAR_FRONT_OFFSET - this.cameraX;
      projection.cars.forEach((car, i) => {
        const x = reduced ? car.x : 220 + car.progress * 4000 - this.cameraX,
          off = x < 72 || x > 925,
          row = snapshot.standings.find((r) => r.id === car.id)!,
          root = this.cars[i];
        root.visible = !off;
        root.x = snap ? x : root.x + (x - root.x) * blend;
        root.y =
          174 +
          i * 59 +
          (decorative && row.finishTimeMs === null
            ? Math.sin(s.elapsedMs / 190 + i) * 0.8
            : 0);
        this.markers[i]
          .setVisible(off)
          .setPosition(x < 72 ? 12 : 982, 166 + i * 59)
          .setOrigin(x < 72 ? 0 : 1, 0)
          .setText(
            `${x < 72 ? "◀" : "▶"} ${i ? row.name : "YOU"} ${Math.floor(row.progress * 100)}%`,
          );
        this.halos[i].alpha = reduced
          ? 0.05
          : i
            ? 0.06
            : s.nitroActive
              ? 0.3
              : 0.14;
        this.labels[i].setText(
          `${i ? row.name.toUpperCase() + " · CPU" : "YOU"}${row.finishTimeMs !== null ? " ✓" : ""}`,
        );
        const flame = this.flames[i];
        flame.clear();
        if (
          decorative &&
          row.finishTimeMs === null &&
          (i > 0 || s.errorCharacter === null)
        ) {
          const size =
              i === 0 && s.nitroActive
                ? 62
                : 18 + Math.min(18, s.recentWpm / 5),
            pulse = 0.85 + Math.sin(s.elapsedMs / 55 + i) * 0.15;
          flame
            .fillStyle(i === 0 && s.nitroActive ? 0x60e9ff : 0xff9a55, 0.3)
            .fillEllipse(-83 - size * 0.3, 14, size * 1.2, 16);
          flame
            .fillStyle(0xffa157, 0.85)
            .fillTriangle(-76, 9, -76, 18, -78 - size * pulse, 14);
          flame
            .fillStyle(0xf8f2b4, 0.95)
            .fillTriangle(-76, 11, -76, 16, -78 - size * 0.6 * pulse, 14);
          this.wheels[i].forEach((w) => {
            w.rotation = s.elapsedMs / 65;
          });
          if (i === 0 && s.nitroActive)
            flame
              .lineStyle(2, 0x63e7f2, 0.45)
              .strokeCircle(-76, 14, 24 + (s.elapsedMs % 250) / 18);
        }
      });
      if (s.state === "ready") {
        this.pool = [];
        this.burst = 0;
        this.ended = false;
        this.finishAge = 0;
      }
      if (s.nitroBursts > this.burst) {
        this.burst = s.nitroBursts;
        if (!reduced)
          this.emit(this.cars[0].x - 75, this.cars[0].y + 15, high ? 25 : 7);
      }
      const ended = ["finished", "timed-out", "abandoned"].includes(s.state);
      if (ended && !this.ended) {
        this.ended = true;
        this.finishAge = 0;
        const place = snapshot.results?.find((r) => r.id === "player")?.place;
        this.finishText.setText(
          s.state === "finished"
            ? `${place === 1 ? "VICTORY" : "LAP COMPLETE"}\nPLACE ${place} / 5`
            : s.state === "timed-out"
              ? "TIME TRIAL COMPLETE\nKEEP BUILDING"
              : "RUN ENDED",
        );
        if (!reduced && s.state === "finished")
          this.emit(500, 150, high ? 64 : 16, true);
      }
      if (ended) this.finishAge += step;
      this.finishCard
        .setVisible(ended)
        .setScale(reduced ? 1 : Math.min(1, 0.94 + this.finishAge / 3000));
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
        else this.particles.fillCircle(p.x, p.y, 2.2);
      }
      this.qualityAt += step;
      if (this.qualityAt >= 250) {
        this.qualityAt = 0;
        parent.dataset.particles = String(this.pool.length);
        parent.dataset.motion = reduced ? "reduced" : "full";
        parent.dataset.effects = options.effects();
      }
      this.stage = s.state;
    }
  }
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 1000,
    height: 450,
    backgroundColor: "#07121f",
    banner: false,
    audio: { noAudio: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: HarborCircuit,
  });
  const observer = new ResizeObserver(() => game.scale.refresh());
  observer.observe(parent);
  const lost = () => options.onError();
  parent.addEventListener("webglcontextlost", lost, true);
  return () => {
    parent.removeEventListener("webglcontextlost", lost, true);
    observer.disconnect();
    game.destroy(true);
  };
}
