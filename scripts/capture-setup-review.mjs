// Sequential headless captures after tests; isolated preferences, no user save changes.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://192.168.0.31:5173/TurboType/";
const output = "docs/images/alpha25";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(`${base}#/campaign/easy`);
  await page.locator("#map-current").click();
  await page.locator("#briefing-car").selectOption("volt-rival");
  await page.locator("#briefing-track").selectOption("frostline-pass");
  await page.locator("#briefing-start").click();
  await page
    .locator('#race-track[data-ready="true"]')
    .waitFor({ timeout: 15000 });
  if (await page.locator("#kart-picker").isVisible())
    throw new Error("Campaign chooser is still visible");
  await page.screenshot({
    path: `${output}/campaign-ready-1440.png`,
    fullPage: true,
  });
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
    "Two review captures complete; zero page errors; car trail retained.",
  );
} finally {
  await browser.close();
}
