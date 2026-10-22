import { expect, test, type Page } from "@playwright/test";
const SAMPLE = "Every great run starts with a single keystroke.";
async function openRace(page: Page) {
  await page.clock.install();
  await page.goto("./#/race");
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
}
async function go(page: Page) {
  await page.getByRole("button", { name: "Start race" }).click();
  await page.clock.fastForward(3000);
  await expect(page.locator("#race-state")).toHaveText("Racing");
}
async function typePrefix(page: Page, text: string) {
  await page
    .getByRole("textbox", { name: "Your typing" })
    .evaluate((element, chars) => {
      const input = element as HTMLTextAreaElement;
      for (const char of chars) {
        input.value += char;
        input.dispatchEvent(
          new InputEvent("input", {
            bubbles: true,
            inputType: "insertText",
            data: char,
          }),
        );
      }
    }, text);
}
test("loads modern artwork, keeps the active caret readable and fills the viewport with an integrated typing surface", async ({
  page,
}) => {
  const assets: string[] = [],
    errors: string[] = [];
  page.on("response", (r) => {
    if (r.url().includes("/assets/karts/")) assets.push(r.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await openRace(page);
  expect(assets.some((u) => u.endsWith("volt-kart-body.webp"))).toBe(true);
  for (const model of [
    "volt-kart",
    "neon-fox",
    "apex-nova",
    "comet",
    "volt-rival",
  ]) {
    for (const part of ["body", "wheel", "preview"])
      expect(assets.some((u) => u.endsWith(`${model}-${part}.webp`))).toBe(
        true,
      );
  }
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-parts",
    "independent-body-wheels",
  );
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-fleet",
    "volt-kart,neon-fox,apex-nova,comet,volt-rival",
  );
  const standingsRow = await page
    .locator('#race-standings [data-racer="player"]')
    .elementHandle();
  await go(page);
  await typePrefix(page, SAMPLE.slice(0, 30));
  expect(await standingsRow!.evaluate((row) => row.isConnected)).toBe(true);
  const layout = await page.evaluate(() => {
    const selectors = [
      ".race-hud",
      ".race-visual",
      "#race-passage",
      "#race-input",
    ];
    const rects = selectors.map((s) =>
      document.querySelector(s)!.getBoundingClientRect(),
    );
    const strip = document.querySelector("#race-passage")!,
      caret = strip.querySelector(".character--current")!;
    const a = strip.getBoundingClientRect(),
      b = caret.getBoundingClientRect();
    return {
      integrated: Math.abs(rects[2].top - rects[3].top) < 6,
      fullWidth: rects[1].width === innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      caret: b.left >= a.left && b.right <= a.right,
    };
  });
  expect(layout).toEqual({
    integrated: true,
    fullWidth: true,
    overflow: false,
    caret: true,
  });
  expect(errors).toEqual([]);
});
test("fleet course and typing survive all supported laptop window checks", async ({
  page,
}) => {
  await openRace(page);
  await go(page);
  await typePrefix(page, "Every");
  for (const [width, height] of [
    [1024, 768],
    [1366, 768],
    [1440, 900],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await page.clock.runFor(120);
    await expect
      .poll(() =>
        page.locator("#race-track").evaluate((track) => {
          const canvas = track.querySelector("canvas")!;
          return (
            Math.abs(canvas.width - track.clientWidth) < 2 &&
            Math.abs(canvas.height - track.clientHeight) < 2 &&
            document.documentElement.scrollWidth <= innerWidth
          );
        }),
      )
      .toBe(true);
    await expect(page.locator("#race-input")).toHaveValue("Every");
    await expect(page.locator("#race-input")).toBeInViewport();
    await expect(page.locator("#race-state")).toHaveText("Racing");
  }
});
test("audio is opt-in, persists controls and reuses one context without race effects during browsing", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    const probe = { contexts: 0, starts: 0, stops: 0 };
    (window as unknown as { audioProbe: typeof probe }).audioProbe = probe;
    window.AudioContext = class extends Native {
      constructor(options?: AudioContextOptions) {
        super(options);
        probe.contexts++;
      }
      override createOscillator() {
        const source = super.createOscillator();
        const start = source.start.bind(source),
          stop = source.stop.bind(source);
        source.start = (...args: Parameters<typeof source.start>) => {
          probe.starts++;
          start(...args);
        };
        source.stop = (...args: Parameters<typeof source.stop>) => {
          probe.stops++;
          stop(...args);
        };
        return source;
      }
    };
  });
  await openRace(page);
  const probe = () =>
    page.evaluate(
      () =>
        (
          window as unknown as {
            audioProbe: { contexts: number; starts: number; stops: number };
          }
        ).audioProbe,
    );
  expect((await probe()).contexts).toBe(0);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByText("Sound & music", { exact: true }).click();
  await page.getByRole("button", { name: "Enable sound", exact: true }).click();
  await expect(page.locator("#audio-status")).toHaveAttribute(
    "data-state",
    "running",
  );
  await page.getByLabel("Music volume", { exact: true }).evaluate((el) => {
    (el as HTMLInputElement).value = "0.2";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-route", "settings");
  expect((await probe()).contexts).toBe(0);
  await page.getByText("Sound & music", { exact: true }).click();
  await expect(page.getByLabel("Music volume", { exact: true })).toHaveValue(
    "0.2",
  );
  await page.getByRole("button", { name: "Enable sound", exact: true }).click();
  await expect(page.locator("#audio-status")).toHaveAttribute(
    "data-state",
    "running",
  );
  await page.getByRole("link", { name: "Race", exact: true }).click();
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await go(page);
  await typePrefix(page, "Every");
  await page.clock.runFor(250);
  expect((await probe()).contexts).toBe(1);
  expect((await probe()).starts).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  expect((await probe()).stops).toBeGreaterThan(0);
  await page.getByRole("link", { name: "Practice", exact: true }).click();
  await page.clock.runFor(100);
  const stopped = await probe();
  await page.clock.runFor(500);
  expect((await probe()).starts).toBe(stopped.starts);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByText("Sound & music", { exact: true }).click();
  await page.getByRole("button", { name: "Mute sound", exact: true }).click();
  await expect(page.locator("#audio-status")).toHaveAttribute(
    "data-state",
    "muted",
  );
  expect((await probe()).contexts).toBe(1);
});
test("unsupported audio cannot prevent a complete race or retry", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: class {
        constructor() {
          throw Error("Audio unavailable for test");
        }
      },
    });
  });
  await openRace(page);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByText("Sound & music", { exact: true }).click();
  await page.getByRole("button", { name: "Enable sound", exact: true }).click();
  await expect(page.locator("#audio-status")).toHaveAttribute(
    "data-state",
    "unavailable",
  );
  await page.getByRole("link", { name: "Race", exact: true }).click();
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await go(page);
  await typePrefix(page, SAMPLE);
  await expect(page.locator("#race-state")).toHaveText("Finished");
  await page
    .getByRole("button", { name: "Retry same race", exact: true })
    .click();
  await expect(page.locator("#race-state")).toHaveText("Ready");
});
test("bounds high effects and disables particles in reduced/low mode without altering results", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "turbotype:settings:v1",
      JSON.stringify({
        schemaVersion: 1,
        settings: { motion: "full", effects: "high", largeText: false },
      }),
    ),
  );
  await openRace(page);
  await go(page);
  await typePrefix(page, SAMPLE.slice(0, 20));
  await page.clock.runFor(100);
  await expect(page.locator("#race-streak")).toContainText("1 nitro bursts");
  await typePrefix(page, SAMPLE.slice(20));
  await page.clock.runFor(350);
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-effects",
    "high",
  );
  const particles = Number(
    await page.locator("#race-track").getAttribute("data-particles"),
  );
  expect(particles).toBeGreaterThan(0);
  expect(particles).toBeLessThanOrEqual(104);
  const results = await page.locator("#race-results").textContent();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByLabel("Motion", { exact: true }).selectOption("reduced");
  await page.getByLabel("Track effects", { exact: true }).selectOption("low");
  await page.getByLabel("Larger typing text", { exact: true }).check();
  await page.getByRole("link", { name: "Race", exact: true }).click();
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await page.clock.runFor(350);
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-motion",
    "reduced",
  );
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-effects",
    "low",
  );
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-particles",
    "0",
  );
  await expect(page.locator("#race-results")).toHaveText(results!);
  expect(
    await page
      .locator("#race-passage")
      .evaluate((el) => getComputedStyle(el).whiteSpace),
  ).toBe("pre-wrap");
});
