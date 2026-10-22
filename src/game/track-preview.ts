import type { UserSettings } from "../storage/settings";
import { kartLineup, type KartId } from "../content/kart-catalog";
import {
  addKart,
  animateKart,
  bakePlayerPalette,
  fleetReady,
  KART_FLEET,
  preloadFleet,
} from "./kart-fleet";

export interface PreviewOptions {
  reducedMotion: boolean;
  effects: UserSettings["effects"];
  playerKart?: KartId;
  onReady: (message: string) => void;
  onError: (message: string) => void;
}

/** Phaser owns only this canvas. HTML navigation and text are controlled by the UI. */
export async function mountTrackPreview(
  parent: HTMLElement,
  options: PreviewOptions,
): Promise<() => void> {
  const { default: Phaser } = await import("phaser");
  if (!parent.isConnected) return () => {};
  const lineup = kartLineup(options.playerKart ?? "volt-kart").slice(0, 3);

  class TrackPreview extends Phaser.Scene {
    private cars: Phaser.GameObjects.Container[] = [];
    private assemblies: ReturnType<typeof addKart>[] = [];
    private marks!: Phaser.GameObjects.Graphics;
    private flame!: Phaser.GameObjects.Particles.ParticleEmitter;
    private elapsedMs = 0;
    private world!: Phaser.GameObjects.Container;
    private art!: Phaser.GameObjects.Graphics;
    private label!: Phaser.GameObjects.Text;
    private courseWidth = 1200;

    preload(): void {
      preloadFleet(this, [...new Set([0, ...lineup])]);
      this.load.on("loaderror", () =>
        options.onError(
          "Track artwork could not load. Check your connection and retry.",
        ),
      );
    }

    create(): void {
      if (!fleetReady(this, [...new Set([0, ...lineup])])) return;
      bakePlayerPalette(this);
      this.art = this.add.graphics();
      this.marks = this.add.graphics();
      for (let i = 0; i < 3; i++) {
        const assembly = addKart(this, lineup[i]);
        const { root } = assembly;
        root.setPosition([540, 330, 160][i], 166 + i * 89);
        this.cars.push(root);
        this.assemblies.push(assembly);
      }
      const dot = this.make.graphics({ x: 0, y: 0 });
      dot
        .fillStyle(0xffffff)
        .fillCircle(4, 4, 4)
        .generateTexture("spark", 8, 8)
        .destroy();
      this.flame = this.add.particles(420, 185, "spark", {
        speedX: { min: -190, max: -70 },
        speedY: { min: -18, max: 18 },
        lifespan: 420,
        scale: { start: 1.1, end: 0 },
        alpha: { start: 0.8, end: 0 },
        tint: [0xffb767, 0xff8356, 0xffe0d4],
        frequency: options.effects === "low" ? 85 : 30,
        emitting: !options.reducedMotion,
      });
      if (this.renderer.type === Phaser.WEBGL && options.effects === "high") {
        Phaser.Actions.AddEffectBloom(this.flame, {
          threshold: 0.35,
          blurRadius: 2,
          blurSteps: 2,
          blendAmount: 0.2,
        });
      }
      this.add.text(36, 22, "NIGHT RUN / CITY CIRCUIT", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#bfb1b8",
        letterSpacing: 2,
      });
      this.add.text(300, 22, "01", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#d9cdd3",
      });
      const label = this.add.text(505, 111, "YOUR RIDE", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#63e7f2",
        backgroundColor: "#2b141c",
        padding: { x: 12, y: 6 },
      });
      label.setDepth(2);
      this.label = label;
      if (!options.reducedMotion) {
        this.tweens.add({
          targets: label,
          alpha: { from: 0.65, to: 1 },
          duration: 1200,
          yoyo: true,
          repeat: -1,
        });
        this.cameras.main.fadeIn(250);
      }
      const children = [...this.children.list];
      this.world = this.add.container(0, 0, children);
      this.layout();
      this.scale.on("resize", this.layout, this);
      parent.dataset.ready = "true";
      parent.dataset.parts = "independent-body-wheels";
      options.onReady("Track preview ready");
    }

    private layout(): void {
      const scale = Math.max(1, this.scale.height) / 420;
      this.courseWidth = Math.max(1, this.scale.width) / scale;
      this.world.setScale(scale);
      const w = this.courseWidth;
      this.art.clear().fillStyle(0x0a1219).fillRect(0, 0, w, 130);
      this.art.fillStyle(0x184657).fillCircle(w * 0.8, 30, 100);
      for (let i = 0; i < Math.ceil(w / 49); i++) {
        const height = 25 + ((i * 37) % 73);
        this.art
          .fillStyle(i % 2 ? 0x192b35 : 0x13232c)
          .fillRect(i * 49, 130 - height, 36, height);
        for (let j = 0; j < 4; j++)
          this.art
            .fillStyle(0xd995a1, 0.35)
            .fillRect(i * 49 + 8, 139 - height + j * 13, 3, 4);
      }
      this.art.fillStyle(0x63e7f2).fillRect(0, 128, w, 3);
      this.art.fillStyle(0x18232c).fillRect(0, 132, w, 288);
      this.cars.forEach((car, i) => (car.x = w * [0.56, 0.4, 0.24][i]));
      this.label.x = this.cars[0].x - 35;
    }

    update(_time: number, delta: number): void {
      if (!this.marks) return;
      if (!options.reducedMotion) this.elapsedMs += Math.min(delta, 50);
      const offset = (this.elapsedMs * 0.17) % 100;
      this.marks.clear().lineStyle(2, 0x6a5b63, 0.45);
      for (const y of [220, 309, 398])
        for (let x = -100; x < this.courseWidth + 100; x += 100)
          this.marks.lineBetween(x - offset, y, x + 38 - offset, y);
      this.cars.forEach((car, i) => {
        car.y = 166 + i * 89;
        animateKart(
          this.assemblies[i],
          delta,
          !options.reducedMotion,
          this.elapsedMs + i * 190,
        );
      });
      const [exhaustX, exhaustY] = KART_FLEET[lineup[0]].exhaust;
      this.flame?.setPosition(
        this.cars[0].x + exhaustX,
        this.cars[0].y + this.assemblies[0].chassis.y + exhaustY,
      );
    }
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: Math.max(1, parent.clientWidth),
    height: Math.max(1, parent.clientHeight),
    backgroundColor: "#0a1219",
    banner: false,
    audio: { noAudio: true },
    scale: { mode: Phaser.Scale.RESIZE },
    scene: TrackPreview,
  });
  const observer = new ResizeObserver(() =>
    game.scale.resize(
      Math.max(1, parent.clientWidth),
      Math.max(1, parent.clientHeight),
    ),
  );
  observer.observe(parent);
  return () => {
    observer.disconnect();
    game.destroy(true);
  };
}
