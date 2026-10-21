import type { UserSettings } from "../storage/settings";

export interface PreviewOptions {
  reducedMotion: boolean;
  effects: UserSettings["effects"];
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

  class TrackPreview extends Phaser.Scene {
    private cars: Phaser.GameObjects.Container[] = [];
    private wheelPairs: Phaser.GameObjects.Container[][] = [];
    private marks!: Phaser.GameObjects.Graphics;
    private flame!: Phaser.GameObjects.Particles.ParticleEmitter;
    private elapsedMs = 0;
    private world!: Phaser.GameObjects.Container;
    private art!: Phaser.GameObjects.Graphics;
    private label!: Phaser.GameObjects.Text;
    private courseWidth = 1200;

    preload(): void {
      this.load.image(
        "coupe",
        `${import.meta.env.BASE_URL}assets/karts/volt-kart.png`,
      );
      this.load.on("loaderror", () =>
        options.onError(
          "Track artwork could not load. Check your connection and retry.",
        ),
      );
    }

    create(): void {
      if (!this.textures.exists("coupe")) return;
      // Reuse the original artwork; bake the red player palette once, not per frame.
      const source = this.textures
        .get("coupe")
        .getSourceImage() as HTMLImageElement;
      const redKart = this.textures.createCanvas("red-kart", 640, 320);
      if (redKart) {
        const context = redKart.getContext();
        context.filter = "hue-rotate(285deg)";
        context.drawImage(source, 0, 0, 640, 320);
        redKart.refresh();
      }
      this.art = this.add.graphics();
      this.marks = this.add.graphics();
      for (let i = 0; i < 3; i++) {
        const car = this.add.container([540, 330, 160][i], 166 + i * 89);
        const shadow = this.add.ellipse(8, 32, 236, 16, 0x000000, 0.3);
        const body = this.add
          .image(0, 0, i === 0 && redKart ? "red-kart" : "coupe")
          .setDisplaySize(200, 100);
        if (i === 1) body.setTint(0xffa590);
        if (i === 2) body.setTint(0x8abfe8);
        const wheels = [-71, 42].map((x) => {
          const wheel = this.add
            .circle(0, 0, 15, 0x11161d, 0)
            .setStrokeStyle(0, 0x5b6872, 0);
          const spokes = this.add.graphics().lineStyle(2, 0xb9c8d0);
          spokes.lineBetween(-9, 0, 9, 0).lineBetween(0, -9, 0, 9);
          const assembly = this.add.container(x, 20, [wheel, spokes]);
          car.add(assembly);
          return assembly;
        });
        car.addAt([shadow, body], 0);
        this.cars.push(car);
        this.wheelPairs.push(wheels);
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
        car.y =
          166 +
          i * 89 +
          (options.reducedMotion
            ? 0
            : Math.sin(this.elapsedMs / 240 + i) * 1.5);
        this.wheelPairs[i].forEach(
          (wheel) => (wheel.rotation = this.elapsedMs / 85),
        );
      });
      this.flame?.setPosition(this.cars[0].x - 118, this.cars[0].y + 21);
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
