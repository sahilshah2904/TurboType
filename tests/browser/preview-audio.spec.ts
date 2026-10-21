import { expect, test } from "@playwright/test";

function wave(): Buffer {
  const frames = 8000,
    data = Buffer.alloc(44 + frames * 2);
  data.write("RIFF");
  data.writeUInt32LE(data.length - 8, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(8000, 24);
  data.writeUInt32LE(16000, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(frames * 2, 40);
  for (let i = 0; i < frames; i++)
    data.writeInt16LE(
      Math.round(Math.sin((i * 2 * Math.PI * 220) / 8000) * 1500),
      44 + i * 2,
    );
  return data;
}

test("preview fills wide and phone widths after resize without side gutters", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto("./#/hub");
  const preview = page.locator("#track-preview");
  await expect(preview).toHaveAttribute("data-ready", "true", {
    timeout: 12000,
  });
  for (const width of [1920, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(async () =>
        preview.evaluate((el) => {
          const bounds = el.getBoundingClientRect(),
            canvas = el.querySelector("canvas")!.getBoundingClientRect();
          return (
            Math.abs(bounds.width - canvas.width) < 2 &&
            Math.abs(bounds.left - canvas.left) < 2 &&
            Math.abs(bounds.height - canvas.height) < 2
          );
        }),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("personal music follows routes, mute and countdown and never persists the file", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Native = window.Audio;
    (window as unknown as { personalMedia: HTMLAudioElement[] }).personalMedia =
      [];
    window.Audio = class extends Native {
      constructor() {
        super();
        (
          window as unknown as { personalMedia: HTMLAudioElement[] }
        ).personalMedia.push(this);
      }
    };
  });
  await page.goto("./#/hub");
  await page.getByText("Sound & music", { exact: true }).click();
  await page.getByRole("button", { name: "Enable sound", exact: true }).click();
  await page.getByLabel("Personal music file", { exact: true }).setInputFiles({
    name: "test-track.wav",
    mimeType: "audio/wav",
    buffer: wave(),
  });
  await expect(page.locator("#personal-music-status")).toContainText(
    "test-track.wav — selected",
  );
  const paused = () =>
    page.evaluate(
      () =>
        (
          window as unknown as { personalMedia: HTMLAudioElement[] }
        ).personalMedia.at(-1)!.paused,
    );
  await expect.poll(paused).toBe(false);
  await page.getByRole("button", { name: "Mute sound", exact: true }).click();
  await expect.poll(paused).toBe(true);
  await page.getByRole("button", { name: "Enable sound", exact: true }).click();
  await expect.poll(paused).toBe(false);
  await page.getByRole("link", { name: "Race", exact: true }).click();
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await page.getByRole("button", { name: /^Start race/ }).click();
  await expect(page.locator("#race-countdown")).toHaveText("3");
  await expect.poll(paused).toBe(true);
  await expect(page.locator("#race-countdown")).toHaveText("2");
  await expect(page.locator("#race-countdown")).toHaveText("1");
  await expect(page.locator("#race-state")).toHaveText("Racing");
  await expect.poll(paused).toBe(false);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect.poll(paused).toBe(true);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByText("Sound & music", { exact: true }).click();
  await expect(page.locator("#personal-music-status")).toContainText(
    "test-track.wav",
  );
  await expect.poll(paused).toBe(false);
  await page.getByLabel("Personal music file", { exact: true }).setInputFiles({
    name: "invalid.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("invalid"),
  });
  await expect(page.locator("#personal-music-status")).toContainText(
    "previous track is unchanged",
  );
  await page
    .getByRole("button", { name: "Use original music", exact: true })
    .click();
  await expect.poll(paused).toBe(true);
  await expect(page.locator("#personal-music-status")).toContainText(
    "Original Harbor Circuit",
  );
  await page.reload();
  await page.getByText("Sound & music", { exact: true }).click();
  await expect(page.locator("#personal-music-status")).toContainText(
    "Original Harbor Circuit",
  );
  expect(
    await page.evaluate(() =>
      Object.values(localStorage).some(
        (value) => value.includes("test-track.wav") || value.includes("blob:"),
      ),
    ),
  ).toBe(false);
});
