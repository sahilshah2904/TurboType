// Sequential visual evidence; do not run alongside suites/profiling.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { KART_FLEET } from "../src/game/kart-fleet.ts";
const base = process.argv[2] ?? "http://127.0.0.1:5173/TurboType/";
const output = "docs/images/alpha14";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}#/race`);
  await page
    .locator('#race-track[data-ready="true"]')
    .waitFor({ timeout: 20000 });
  await page.screenshot({
    path: `${output}/race-setup-1440.png`,
    fullPage: true,
  });
  for (const kart of KART_FLEET) {
    await page.locator(`input[value="${kart.id}"]`).check();
    await page.locator("#start-race").click();
    await page.waitForFunction(
      () => document.querySelector("#race-state").textContent === "Racing",
      undefined,
      { timeout: 15000 },
    );
    await page.waitForTimeout(150);
    await page
      .locator("#race-track")
      .screenshot({ path: `${output}/${kart.id}-fleet.png` });
    await page.locator("#pause-race").click();
    await page.locator("#retry-race").click();
  }
  await page.locator("#start-race").click();
  await page.waitForFunction(
    () => document.querySelector("#race-state").textContent === "Racing",
  );
  await page
    .locator("#race-input")
    .pressSequentially("Every great run ", { delay: 100 });
  await page.screenshot({ path: `${output}/active-race-1440.png` });
  await page.locator("#pause-race").click();
  for (const width of [1024, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 900 });
    await page.waitForTimeout(150);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    if (overflow) throw new Error(`Overflow at ${width}`);
    await page.screenshot({ path: `${output}/paused-race-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("link", { name: "The hub", exact: true }).click();
  await page
    .locator('#track-preview[data-ready="true"]')
    .waitFor({ timeout: 20000 });
  await page.screenshot({ path: `${output}/hub-1440.png`, fullPage: true });
  console.log(
    JSON.stringify({
      errors,
      widths: [1024, 1366, 1440, 1920],
      parts: KART_FLEET.map((k) => k.id),
    }),
  );
  if (errors.length) throw new Error("Page errors during capture");
} finally {
  await browser.close();
}
