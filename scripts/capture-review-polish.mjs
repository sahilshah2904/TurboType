// Sequential headless captures; do not run with suites/profiling.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://192.168.0.31:5173/TurboType/";
const output = "docs/images/alpha22";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const shot = async (name) => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
};
try {
  await page.goto(`${base}#/keyboard`);
  await page.locator("#keyboard-input").pressSequentially("the quick ");
  await page.locator("#keyboard-input").press("ArrowLeft");
  await shot("keyboard-check-1024");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}#/race`);
  await page
    .locator('#race-track[data-ready="true"]')
    .waitFor({ timeout: 15000 });
  await shot("quick-race-1440");
  await page.evaluate(() => {
    localStorage.setItem(
      "turbotype:settings:v1",
      JSON.stringify({
        schemaVersion: 1,
        settings: { motion: "reduced", effects: "low", largeText: true },
      }),
    );
    const clears = {};
    for (let i = 1; i <= 5; i++)
      clears[`easy-${String(i).padStart(3, "0")}`] = {
        stars: 7,
        bestWpm: 30,
        bestAccuracy: 100,
        bestTimeMs: 60000,
        revision: 1,
      };
    localStorage.setItem(
      "turbotype:campaign-map:v1",
      JSON.stringify({
        schemaVersion: 1,
        rulesVersion: 3,
        positions: { easy: null, medium: null, hard: null },
        clears,
      }),
    );
  });
  await page.reload();
  await page.clock.install();
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(`${base}#/level/easy/6`);
  await page.locator(".campaign-race").waitFor();
  await page
    .locator('#race-track[data-ready="true"]')
    .waitFor({ timeout: 15000 });
  await page.locator("#start-race").click();
  await page.clock.fastForward(4000);
  const third = await page.locator("#race-passage").evaluate((el) => {
    const spans = Array.from(el.children);
    const tops = [...new Set(spans.map((s) => s.offsetTop))];
    return spans.findIndex((s) => s.offsetTop === tops[2]);
  });
  const passage = await page.locator("#race-passage").textContent();
  await page.locator("#race-input").pressSequentially(passage.slice(0, third));
  await shot("paragraph-third-line-top-fixture-1024");
  const intro = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  intro.on("pageerror", (e) => errors.push(e.message));
  const time = new Date("2026-10-23T00:00:00Z");
  await intro.clock.install({ time });
  await intro.clock.pauseAt(new Date(time.getTime() + 1000));
  await intro.goto(`${base}#/intro`);
  await intro.locator('.entrance-screen[data-cinema="playing"]').waitFor();
  for (const [ms, name] of [
    [1000, "arrival-trail-1440"],
    [2100, "burnout-clear-road-1440"],
    [3500, "launch-trail-1440"],
    [5600, "clear-title-1440"],
  ]) {
    await intro.locator(".entrance-screen").evaluate((el, t) => {
      for (const a of el.getAnimations({ subtree: true })) {
        a.pause();
        a.currentTime = t;
      }
    }, ms);
    await intro.screenshot({ path: `${output}/${name}.png` });
  }
  await intro.close();
  console.log(
    JSON.stringify({
      captures: 7,
      errors,
      fixture:
        "Paragraph screenshot uses seeded prior clears in an isolated browser context.",
    }),
  );
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
