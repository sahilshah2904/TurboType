import type Phaser from "phaser";

/** Local units in the 200×100 sprite frame; same manifest in race and preview. */
export const KART_FLEET = [
  {
    id: "volt-kart",
    file: "volt-kart.png",
    bodyY: 0,
    wheels: [
      [-71, 20, 16],
      [42, 20, 16],
    ],
    exhaust: [-91, -7],
  },
  {
    id: "neon-fox",
    file: "neon-fox.webp",
    bodyY: 0,
    wheels: [
      [-68, 20, 15],
      [58, 22, 13],
    ],
    exhaust: [-91, -10],
  },
  {
    id: "apex-nova",
    file: "apex-nova.webp",
    bodyY: 8,
    wheels: [
      [-77, 24, 12],
      [47, 26, 12],
    ],
    exhaust: [-91, 3],
  },
  {
    id: "comet",
    file: "comet.webp",
    bodyY: 1,
    wheels: [
      [-68, 19, 15],
      [67, 22, 12],
    ],
    exhaust: [-92, -11],
  },
  {
    id: "volt-rival",
    file: "volt-rival.webp",
    bodyY: 8,
    wheels: [
      [-77, 20, 14],
      [57, 27, 12],
    ],
    exhaust: [-91, 3],
  },
] as const;

export function preloadFleet(
  scene: Phaser.Scene,
  indices = [0, 1, 2, 3, 4],
): void {
  for (const index of indices) {
    const kart = KART_FLEET[index];
    scene.load.image(
      kart.id,
      `${import.meta.env.BASE_URL}assets/karts/${kart.file}`,
    );
  }
}

export function fleetReady(
  scene: Phaser.Scene,
  indices = [0, 1, 2, 3, 4],
): boolean {
  return indices.every((index) => scene.textures.exists(KART_FLEET[index].id));
}

/** Preserve the accepted player palette; rivals are authored models, never hue copies. */
export function bakePlayerPalette(scene: Phaser.Scene): void {
  const source = scene.textures
    .get("volt-kart")
    .getSourceImage() as HTMLImageElement;
  const texture = scene.textures.createCanvas("player-kart", 640, 320);
  if (!texture) return;
  const context = texture.getContext();
  context.filter = "hue-rotate(285deg)";
  context.drawImage(source, 0, 0, 640, 320);
  texture.refresh();
}

export function addKart(scene: Phaser.Scene, index: number) {
  const kart = KART_FLEET[index];
  const root = scene.add.container(0, 0);
  const flame = scene.add.graphics();
  const shadow = scene.add.ellipse(0, 43, 175, 12, 0x000000, 0.4);
  const key =
    index === 0 && scene.textures.exists("player-kart")
      ? "player-kart"
      : kart.id;
  const body = scene.add.image(0, kart.bodyY, key).setDisplaySize(200, 100);
  root.add([shadow, flame, body]);
  // These are rotating highlights over baked wheel art, not separate wheel sprites.
  const spokes = kart.wheels.map(() => scene.add.graphics());
  root.add(spokes);
  const assembly = { root, flame, spokes, body };
  setKartModel(scene, assembly, index);
  return assembly;
}

/** Change appearance in place; never replace the scene or reset a paused race. */
export function setKartModel(
  scene: Phaser.Scene,
  assembly: ReturnType<typeof addKart>,
  index: number,
): void {
  const kart = KART_FLEET[index];
  const key =
    index === 0 && scene.textures.exists("player-kart")
      ? "player-kart"
      : kart.id;
  assembly.body
    .setTexture(key)
    .setPosition(0, kart.bodyY)
    .setDisplaySize(200, 100);
  kart.wheels.forEach(([x, y, radius], i) => {
    const wheel = assembly.spokes[i].clear().lineStyle(1, 0xe6f2f5, 0.42);
    for (let n = 0; n < 5; n++) {
      const a = (n * Math.PI) / 2.5;
      wheel.lineBetween(
        Math.cos(a) * 6,
        Math.sin(a) * 6,
        Math.cos(a) * radius,
        Math.sin(a) * radius,
      );
    }
    wheel.setPosition(x, y);
    wheel.rotation = 0;
  });
}
