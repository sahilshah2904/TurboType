import type Phaser from "phaser";
import type { TrackTheme } from "../content/track-catalog";

/** Original bounded geometric scenery shared by the hub and real race. No rules/RNG. */
export function drawTrackScenery(
  sky: Phaser.GameObjects.Graphics,
  scenery: Phaser.GameObjects.Graphics,
  width: number,
  horizon: number,
  theme: TrackTheme,
): void {
  sky.clear().fillStyle(theme.sky).fillRect(0, 0, width, horizon);
  sky
    .fillStyle(theme.glow, 0.65)
    .fillCircle(width * 0.81, horizon * 0.26, Math.min(width * 0.045, 55));
  scenery.clear();
  const extent = width * 2;
  if (theme.id === "neon-harbor") {
    sky
      .fillStyle(0x12222b)
      .fillTriangle(
        -100,
        horizon,
        width * 0.28,
        horizon * 0.4,
        width * 0.65,
        horizon,
      );
    for (let i = 0; i < Math.ceil(extent / 58); i++) {
      const x = i * 58,
        height = 24 + ((i * 37) % Math.max(25, Math.floor(horizon * 0.48)));
      scenery
        .fillStyle(i % 2 ? theme.land : 0x1d353f)
        .fillRect(x, horizon - height, 45, height);
      for (let y = 10; y < height; y += 18)
        for (let k = 0; k < 3; k++)
          if ((i + y + k) % 3)
            scenery
              .fillStyle(theme.detail, 0.19)
              .fillRect(x + 7 + k * 12, horizon - height + y, 3, 5);
    }
  } else if (theme.id === "coral-coast") {
    sky
      .fillStyle(theme.land)
      .fillRect(0, horizon * 0.55, width, horizon * 0.45);
    sky.lineStyle(2, theme.detail, 0.35);
    for (let i = 0; i < 7; i++)
      sky.lineBetween(
        width * 0.65 - i * 13,
        horizon * 0.57 + i * 8,
        width * 0.95 + i * 13,
        horizon * 0.57 + i * 8,
      );
    for (let x = 20; x < extent; x += 170) {
      const y = horizon * 0.62;
      scenery.fillStyle(0x162f35).fillRect(x, y, 6, horizon - y);
      scenery.fillEllipse(x + 3, y, 70, 12);
      scenery.fillEllipse(x - 18, y + 10, 40, 12);
      scenery.fillEllipse(x + 24, y + 10, 40, 12);
      scenery.fillTriangle(x + 3, y - 20, x - 6, y + 2, x + 12, y + 2);
      scenery
        .lineStyle(3, theme.detail, 0.6)
        .lineBetween(x + 70, horizon - 12, x + 115, horizon - 12);
    }
  } else if (theme.id === "copper-canyon") {
    for (let x = -80; x < extent; x += 190) {
      const top = horizon * (0.28 + ((x + 80) % 3) * 0.06);
      scenery.fillStyle(theme.land).fillRect(x + 25, top, 105, horizon - top);
      scenery.fillTriangle(x - 15, horizon, x + 25, top, x + 25, horizon);
      scenery.fillTriangle(x + 130, top, x + 175, horizon, x + 130, horizon);
      scenery
        .lineStyle(3, theme.detail, 0.5)
        .lineBetween(x + 25, top + 14, x + 130, top + 14);
      scenery
        .fillStyle(0x263a32)
        .fillRect(x + 150, horizon - 40, 6, 40)
        .fillRect(x + 140, horizon - 30, 24, 5)
        .fillRect(x + 140, horizon - 42, 5, 14);
    }
  } else if (theme.id === "emerald-trail") {
    sky
      .fillStyle(0x17413d)
      .fillTriangle(0, horizon, width * 0.4, horizon * 0.3, width, horizon);
    for (let i = 0; i < Math.ceil(extent / 70); i++) {
      const x = i * 70,
        height = horizon * (0.3 + (i % 3) * 0.15);
      scenery
        .fillStyle(0x263d35)
        .fillRect(x + 22, horizon - height / 2, 8, height / 2);
      scenery
        .fillStyle(i % 2 ? theme.land : theme.detail)
        .fillTriangle(
          x - 10,
          horizon - 12,
          x + 26,
          horizon - height,
          x + 62,
          horizon - 12,
        );
    }
  } else {
    for (let i = 0; i < Math.ceil(extent / 240); i++) {
      const x = i * 240,
        peak = horizon * (0.15 + (i % 2) * 0.15);
      scenery
        .fillStyle(theme.land)
        .fillTriangle(x - 80, horizon, x + 110, peak, x + 280, horizon);
      scenery
        .fillStyle(theme.detail)
        .fillTriangle(x + 63, peak + 45, x + 110, peak, x + 154, peak + 45);
      scenery
        .fillStyle(0x2d4457)
        .fillTriangle(
          x + 40,
          horizon,
          x + 180,
          horizon * 0.56,
          x + 300,
          horizon,
        );
    }
  }
}
