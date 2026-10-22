import type Phaser from "phaser";

/** Local units in the 200×100 sprite frame; same manifest in race and preview. */
export const KART_FLEET = [
  {
    id: "volt-kart",
    file: "volt-kart.png",
    bodyY: 0,
    wheels: [
      [-71, 19, 24],
      [44, 20, 22],
    ],
    exhaust: [-91, -7],
  },
  {
    id: "neon-fox",
    file: "neon-fox.webp",
    bodyY: 0,
    wheels: [
      [-67, 19, 23],
      [58, 22, 20],
    ],
    exhaust: [-91, -10],
  },
  {
    id: "apex-nova",
    file: "apex-nova.webp",
    bodyY: 8,
    wheels: [
      [-77, 23, 19],
      [47, 26, 18],
    ],
    exhaust: [-91, 3],
  },
  {
    id: "comet",
    file: "comet.webp",
    bodyY: 1,
    wheels: [
      [-68, 18, 24],
      [67, 21, 19],
    ],
    exhaust: [-92, -11],
  },
  {
    id: "volt-rival",
    file: "volt-rival.webp",
    bodyY: 8,
    wheels: [
      [-77, 20, 23],
      [57, 27, 18],
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
      `${import.meta.env.BASE_URL}assets/karts/parts/${kart.id}-body.webp`,
    );
    scene.load.image(
      `${kart.id}-wheel`,
      `${import.meta.env.BASE_URL}assets/karts/parts/${kart.id}-wheel.webp`,
    );
  }
}

export function fleetReady(
  scene: Phaser.Scene,
  indices = [0, 1, 2, 3, 4],
): boolean {
  return indices.every(
    (index) =>
      scene.textures.exists(KART_FLEET[index].id) &&
      scene.textures.exists(`${KART_FLEET[index].id}-wheel`),
  );
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
  const chassis = scene.add.container(0, 0);
  const flame = scene.add.graphics();
  const shadow = scene.add.ellipse(0, 43, 175, 12, 0x000000, 0.4);
  const key =
    index === 0 && scene.textures.exists("player-kart")
      ? "player-kart"
      : kart.id;
  const body = scene.add.image(0, kart.bodyY, key).setDisplaySize(200, 100);
  chassis.add([flame, body]);
  root.add([shadow, chassis]);
  // Elliptical carriers stay fixed while circular tire/rim images rotate inside.
  const wheels = kart.wheels.map(() => {
    const carrier = scene.add.container(0, 0).setScale(0.93, 1);
    const image = scene.add.image(0, 0, `${kart.id}-wheel`);
    carrier.add(image);
    root.add(carrier);
    return { carrier, image, angle: 0 };
  });
  const assembly = { root, chassis, flame, wheels, body };
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
    const wheel = assembly.wheels[i];
    wheel.carrier.setPosition(x, y);
    wheel.image
      .setTexture(`${kart.id}-wheel`)
      .setDisplaySize(radius * 2, radius * 2)
      .setRotation(0);
    wheel.angle = 0;
  });
  assembly.chassis.y = 0;
}

/** Visual time only: no wheel animation can change simulation progress. */
export function animateKart(
  assembly: {
    chassis: { y: number };
    wheels: { angle: number; image: { rotation: number } }[];
  },
  deltaMs: number,
  moving: boolean,
  phase: number,
): void {
  if (!moving) return;
  assembly.chassis.y = Math.sin(phase / 190) * 0.65;
  for (const wheel of assembly.wheels) {
    wheel.angle =
      (wheel.angle + Math.max(0, Math.min(deltaMs, 50)) / 65) % (Math.PI * 2);
    wheel.image.rotation = wheel.angle;
  }
}
