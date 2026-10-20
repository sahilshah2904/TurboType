import type { SoloRace } from "../core/solo-race";

interface TrackOptions {
  read: () => ReturnType<SoloRace["snapshot"]>;
  reducedMotion: () => boolean;
  onReady: () => void;
  onError: () => void;
}

/** Displays authoritative progress. Rendering can fail without fabricating race results. */
export async function mountRaceTrack(
  parent: HTMLElement,
  options: TrackOptions,
): Promise<() => void> {
  const { default: Phaser } = await import("phaser");
  if (!parent.isConnected) return () => {};
  class RaceTrack extends Phaser.Scene {
    private cars: Phaser.GameObjects.Container[] = [];
    private wheels: Phaser.GameObjects.Container[][] = [];
    private marks!: Phaser.GameObjects.Graphics;
    preload(): void {
      this.load.svg(
        "race-coupe",
        `${import.meta.env.BASE_URL}assets/starter-coupe.svg`,
        { width: 680, height: 220 },
      );
      this.load.on("loaderror", options.onError);
    }
    create(): void {
      if (!this.textures.exists("race-coupe")) return;
      const art = this.add.graphics();
      art.fillStyle(0x142731).fillRect(0, 0, 1000, 78);
      for (let i = 0; i < 30; i++) {
        const h = 16 + ((i * 17) % 45);
        art.fillStyle(0x28434a).fillRect(i * 38, 78 - h, 25, h);
      }
      art.fillStyle(0xb7f36b).fillRect(0, 78, 1000, 3);
      art.fillStyle(0x1a222c).fillRect(0, 81, 1000, 379);
      for (let y = 85; y < 455; y += 14)
        for (let x = 888; x < 912; x += 12)
          art
            .fillStyle(
              ((y - 85) / 14 + (x - 888) / 12) % 2 ? 0xe4e8e9 : 0x111820,
            )
            .fillRect(x, y, 12, 14);
      this.add.text(876, 18, "FINISH", {
        fontFamily: "monospace",
        fontSize: "17px",
        color: "#b7f36b",
      });
      this.marks = this.add.graphics();
      [
        "YOU",
        "NEON FOX · CPU",
        "APEX NOVA · CPU",
        "COMET · CPU",
        "VOLT · CPU",
      ].forEach((name, index) => {
        const car = this.add.container(100, 113 + index * 73);
        const body = this.add.image(0, 0, "race-coupe").setDisplaySize(110, 36);
        if (index)
          body.setTint([0, 0xffb36a, 0x80c9ff, 0xd5a7ff, 0xff8c9b][index]);
        car.add([this.add.ellipse(0, 16, 112, 9, 0x000000, 0.35), body]);
        this.wheels.push(
          [-30, 37].map((x) => {
            const spokes = this.add.graphics().lineStyle(1.5, 0xb9c8d0);
            spokes.lineBetween(-4, 0, 4, 0).lineBetween(0, -4, 0, 4);
            const wheel = this.add.container(x, 10, [
              this.add.circle(0, 0, 7, 0x11161d).setStrokeStyle(2, 0x65727d),
              spokes,
            ]);
            car.add(wheel);
            return wheel;
          }),
        );
        car.add(
          this.add
            .text(0, -31, name, {
              fontFamily: "monospace",
              fontSize: "13px",
              color: index ? "#c1cdd2" : "#b7f36b",
            })
            .setOrigin(0.5),
        );
        this.cars.push(car);
      });
      parent.dataset.ready = "true";
      options.onReady();
    }
    update(): void {
      if (!this.marks) return;
      const { player, standings } = options.read();
      const moving = player.state === "racing" && !options.reducedMotion();
      const offset = options.reducedMotion()
        ? 0
        : (player.elapsedMs * 0.08) % 70;
      this.marks.clear().lineStyle(2, 0x62717b, 0.4);
      for (let y = 151; y < 450; y += 73)
        for (let x = -70; x < 1000; x += 70)
          this.marks.lineBetween(x - offset, y, x + 28 - offset, y);
      ["player", "cpu-1", "cpu-2", "cpu-3", "cpu-4"].forEach((id, index) => {
        const row = standings.find((entry) => entry.id === id)!;
        this.cars[index].x = 100 + row.progress * 800;
        this.wheels[index].forEach((wheel) => {
          wheel.rotation = moving ? player.elapsedMs / 100 : wheel.rotation;
        });
      });
    }
  }
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 1000,
    height: 460,
    backgroundColor: "#142731",
    banner: false,
    audio: { noAudio: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: RaceTrack,
  });
  const observer = new ResizeObserver(() => game.scale.refresh());
  observer.observe(parent);
  const contextLost = () => options.onError();
  parent.addEventListener("webglcontextlost", contextLost, true);
  return () => {
    parent.removeEventListener("webglcontextlost", contextLost, true);
    observer.disconnect();
    game.destroy(true);
  };
}
