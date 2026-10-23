// Sequential headless captures after tests; isolated preferences, no user save changes.
import { chromium, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://192.168.0.31:5173/TurboType/";
const output = "docs/images/alpha26";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(`${base}#/cars`);
  await page.locator('[data-equip="volt-rival"]').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${output}/cars-1440.png`, fullPage: true });
  await page.locator('[data-preview="volt-rival"]').click();
  await page.screenshot({ path: `${output}/car-detail-1440.png` });
  await page.keyboard.press("Escape");
  await page.goto(`${base}#/tracks`);
  await page.locator('[data-equip="frostline-pass"]').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${output}/tracks-1440.png`, fullPage: true });
  await page.locator('[data-preview="frostline-pass"]').click();
  await page
    .locator('#collection-track-preview[data-ready="true"]')
    .waitFor({ timeout: 15000 });
  // Settle the shared scene's authored 250ms camera fade before capture.
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/track-detail-1440.png` });
  await page.keyboard.press("Escape");
  await page.goto(`${base}#/campaign/easy`);
  await page.locator("#map-current").click();
  await page.screenshot({ path: `${output}/level-briefing-1440.png` });
  if (await page.locator("#briefing-car, #briefing-track").count())
    throw Error("Briefing still has cosmetic selection");
  await page.locator("#briefing-start").click();
  await page
    .locator('#race-track[data-ready="true"]')
    .waitFor({ timeout: 15000 });
  await expect(page.locator("#race-state")).toHaveText(/Countdown|Racing/);
  await page.goto(`${base}#/intro`);
  await page
    .locator('.entrance-screen[data-ended="true"]')
    .waitFor({ timeout: 15000 });
  if (await page.locator(".intro-logo-fire").count())
    throw new Error("Title flame remains");
  await page.screenshot({
    path: `${output}/clean-title-1440.png`,
    fullPage: true,
  });
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    "Six collection/briefing/title captures complete; zero page errors; automatic campaign countdown verified.",
  );
} finally {
  await browser.close();
}
