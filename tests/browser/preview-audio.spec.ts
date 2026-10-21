import { expect, test } from "@playwright/test";

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

test("distinct original scores follow menu, countdown and race without file controls", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    const events: { duration: number; stopped: boolean }[] = [];
    (window as unknown as { musicEvents: typeof events }).musicEvents = events;
    window.AudioContext = class extends Native {
      override createBufferSource() {
        const source = super.createBufferSource(),
          start = source.start.bind(source),
          stop = source.stop.bind(source);
        let entry: (typeof events)[number] | undefined;
        source.start = (...args: Parameters<typeof source.start>) => {
          if (source.loop) {
            entry = { duration: source.buffer!.duration, stopped: false };
            events.push(entry);
          }
          start(...args);
        };
        source.stop = (...args: Parameters<typeof source.stop>) => {
          if (entry) entry.stopped = true;
          stop(...args);
        };
        return source;
      }
    };
  });
  await page.goto("./#/hub");
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  await page.getByText("Sound & music", { exact: true }).click();
  await page.getByRole("button", { name: "Enable sound", exact: true }).click();
  const music = () =>
    page.evaluate(() =>
      (
        window as unknown as {
          musicEvents: { duration: number; stopped: boolean }[];
        }
      ).musicEvents
        .filter((e) => !e.stopped)
        .map((e) => Math.round(e.duration * 10) / 10),
    );
  await expect.poll(music).toEqual([20]);
  await expect(page.locator("#audio-status")).toContainText("Nightforge");
  for (const tab of ["Practice", "Keyboard check", "Settings"]) {
    await page.getByRole("link", { name: tab, exact: true }).click();
    await expect.poll(music).toEqual([20]);
  }
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  await page.getByRole("link", { name: "Race", exact: true }).click();
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await page.getByRole("button", { name: /^Start race/ }).click();
  await expect(page.locator("#race-countdown")).toHaveText("3");
  await expect.poll(music).toEqual([]);
  await expect(page.locator("#race-state")).toHaveText("Racing");
  await expect.poll(music).toEqual([25.6]);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect.poll(music).toEqual([]);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByText("Sound & music", { exact: true }).click();
  await expect.poll(music).toEqual([20]);
  await page.getByRole("button", { name: "Mute sound", exact: true }).click();
  await expect.poll(music).toEqual([]);
});
