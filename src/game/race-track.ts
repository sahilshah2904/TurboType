import { RaceAtmosphere } from "./race-atmosphere";
import { trackTheme, type TrackId } from "../content/track-catalog";
import { drawTrackScenery } from "./track-scenery";
import type { SoloRace } from "../core/solo-race";
import { kartLineup, type KartId } from "../content/kart-catalog";
import {
  addKart,
  animateKart,
  bakePlayerPalette,
  fleetReady,
  KART_FLEET,
  preloadFleet,
  setKartModel,
} from "./kart-fleet";
interface TrackOptions {
  read: () => ReturnType<SoloRace["snapshot"]>;
  reducedMotion: () => boolean;
  effects: () => "high" | "low";
  playerKart?: () => KartId;
  track?: () => TrackId;
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
    private labels: Phaser.GameObjects.Text[] = [];
    private markers: Phaser.GameObjects.Text[] = [];
    private previous = new Map<string, { progress: number; at: number }>();
    private backdrop!: Phaser.GameObjects.Graphics;
    private city!: Phaser.GameObjects.Graphics;
    private road!: Phaser.GameObjects.Graphics;
    private atmosphere!: RaceAtmosphere;
    private gate!: Phaser.GameObjects.Graphics;
    private particles!: Phaser.GameObjects.Graphics;
    private title!: Phaser.GameObjects.Text;
    private pool: Spark[] = [];
    private burst = 0;
    private ended = false;
    private qualityAt = 0;
    private models = kartLineup("volt-kart");
    private assemblies: ReturnType<typeof addKart>[] = [];
    private selectedKart: KartId = "volt-kart";
    private selectedTrack: TrackId = "neon-harbor";
    preload(): void {
      preloadFleet(this);
      this.load.on("loaderror", options.onError);
    }
    create(): void {
      if (!fleetReady(this)) return;
      bakePlayerPalette(this);
      this.backdrop = this.add.graphics();
      this.city = this.add.graphics();
      this.road = this.add.graphics();
      this.atmosphere = new RaceAtmosphere(this);
      this.gate = this.add.graphics();
      this.title = this.add
        .text(0, 0, "NEON HARBOR", {
          fontFamily: "monospace",
          fontSize: "24px",
          color: "#a8bcc6",
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
        const assembly = addKart(this, i);
        this.assemblies.push(assembly);
        const { root, flame } = assembly;
        const label = this.add
          .text(0, -53, name, {
            fontFamily: "monospace",
            fontSize: "10px",
            color: i ? "#d6e2e9" : "#63e7f2",
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
            color: "#d8cbd0",
            backgroundColor: "#21141b",
          }),
        );
      });
      this.particles = this.add.graphics().setDepth(5);
      this.layout();
      this.scale.on("resize", this.layout, this);
      parent.dataset.ready = "true";
      parent.dataset.fleet = KART_FLEET.map((kart) => kart.id).join(",");
      parent.dataset.parts = "independent-body-wheels";
      this.syncModels();
      options.onReady();
    }
    private syncModels(): void {
      const selected = options.playerKart?.() ?? "volt-kart";
      if (
        selected === this.selectedKart &&
        parent.dataset.playerKart === selected
      )
        return;
      if (selected !== this.selectedKart) {
        this.selectedKart = selected;
        this.models = kartLineup(selected);
        this.assemblies.forEach((assembly, i) =>
          setKartModel(this, assembly, this.models[i]),
        );
      }
      parent.dataset.playerKart = selected;
      parent.dataset.lineup = this.models
        .map((index) => KART_FLEET[index].id)
        .join(",");
    }
    private layout(): void {
      if (!this.backdrop) return;
      const w = this.scale.width,
        h = this.scale.height,
        horizon = h * 0.4;
      this.selectedTrack = options.track?.() ?? "neon-harbor";
      const theme = trackTheme(this.selectedTrack);
      drawTrackScenery(this.backdrop, this.city, w, horizon, theme);
      this.title.setText(theme.name.toUpperCase());
      parent.dataset.track = theme.id;
      parent.setAttribute(
        "aria-label",
        theme.name + ": five-lane race track; exact positions are listed below",
      );
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
          color: [0x63e7f2, 0xffa165, 0xf2dce0, 0xf6d46b][i % 4],
          confetti,
        });
      }
    }
    update(_time: number, delta: number): void {
      this.syncModels();
      if ((options.track?.() ?? "neon-harbor") !== this.selectedTrack)
        this.layout();
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
      const air = this.atmosphere.update({
        width: w,
        height: h,
        delta: step,
        racing: active,
        reduced,
        high,
        wpm: s.recentWpm,
        ready: s.state === "ready",
        tint: trackTheme(this.selectedTrack).detail,
      });
      this.city.x = reduced ? 0 : -(air.travel * 0.16) % (w * 0.5);
      this.road
        .clear()
        .fillStyle(trackTheme(this.selectedTrack).road)
        .fillRect(0, horizon, w, h - horizon);
      this.road
        .fillStyle(trackTheme(this.selectedTrack).edge)
        .fillRect(0, horizon, w, 3);
      this.road.lineStyle(1, 0xbcb0b7, 0.3);
      const offset = reduced ? 0 : air.travel % 100;
      for (let i = 1; i <= 5; i++)
        for (let x = -100; x < w + 100; x += 100)
          this.road.lineBetween(
            x - offset,
            horizon + laneHeight * i,
            x + 42 - offset,
            horizon + laneHeight * i,
          );
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
                  ? 0xf5eaee
                  : 0x120b10,
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
            horizon + laneHeight * (lanes[i] + 0.52),
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
        animateKart(this.assemblies[i], step, moving, s.elapsedMs + i * 190);
        flame.clear();
        if (moving) {
          const nitro = i === 0 && s.nitroActive,
            size =
              (nitro ? 100 : 48) *
              (0.83 + Math.sin(s.elapsedMs / 37 + i) * 0.17);
          const [exhaustX, exhaustY] = KART_FLEET[this.models[i]].exhaust;
          flame
            .fillStyle(nitro ? 0x53dcf5 : 0xff8d28, 0.9)
            .fillTriangle(
              exhaustX,
              exhaustY - 6,
              exhaustX,
              exhaustY + 7,
              exhaustX - size,
              exhaustY,
            )
            .fillStyle(0xfff2b0)
            .fillTriangle(
              exhaustX,
              exhaustY - 4,
              exhaustX,
              exhaustY + 5,
              exhaustX - size * 0.6,
              exhaustY,
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
        parent.dataset.wind = String(air.count);
        parent.dataset.windSky = String(air.sky);
        parent.dataset.windModel = "layered-atmosphere";
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
    backgroundColor: "#0a131b",
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
