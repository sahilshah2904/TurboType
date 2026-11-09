// Sequential headless evidence; never run concurrently with suites/profiling.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://192.168.0.31:5173/TurboType/";
const output = "docs/images/alpha21";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const shot = async (name) => {
  await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
};
try {
  await page.goto(`${base}#/hub`);
  await page
    .locator('#track-preview[data-ready="true"]')
    .waitFor({ timeout: 15000 });
  await shot("hub-1440");
  await page.goto(`${base}#/campaign/easy`);
  await page.locator('.map-district[data-loaded="true"]').first().waitFor();
  await shot("easy-map-1440");
  await page.locator("#map-current").click();
  await shot("level-briefing-1440");
  await page.locator("#briefing-close").click();
  await page.locator("#map-chapter").selectOption("10");
  await shot("chapter-ten-1440");
  await page.locator("#map-view").click();
  await shot("accessible-list-1440");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(`${base}#/campaign/hard`);
  await shot("hard-map-1024");
  await page.locator("#map-current").click();
  await shot("level-briefing-1024");
  await page.locator("#briefing-close").click();
  await page.clock.install();
  await page.goto(`${base}#/level/easy/1`);
  await page
    .locator('#race-track[data-ready="true"]')
    .waitFor({ timeout: 15000 });
  await page.locator("#start-race").click();
  await page.clock.fastForward(33000);
  const text = await page.locator("#race-passage").textContent();
  await page.locator("#race-input").pressSequentially(text);
  await shot("campaign-result-1024");
  await page.locator(".campaign-race-back").click();
  await page.clock.fastForward(1000);
  await shot("easy-unlocked-1024");
  // Isolated capture fixture opens the level4 sample without claiming three real clears.
  await page.evaluate(() => {
    const clears = {};
    for (let i = 1; i <= 3; i++)
      clears[`easy-${String(i).padStart(3, "0")}`] = {
        stars: 7,
        bestWpm: 30,
        bestAccuracy: 100,
        bestTimeMs: 60000,
        revision: 1,
      };
    localStorage.setItem(
      "turbotype:campaign-map:v2",
      JSON.stringify({
        schemaVersion: 2,
        rulesVersion: 3,
        positions: { easy: 0, medium: null, hard: null },
        clears,
      }),
    );
  });
  await page.reload();
  await page.goto(`${base}#/level/easy/4`);
  await page
    .locator('#race-track[data-ready="true"]')
    .waitFor({ timeout: 15000 });
  await page.locator("#start-race").click();
  await page.clock.fastForward(13000);
  await page
    .locator("#race-input")
    .pressSequentially("the early light falls across the road ");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.fastForward(100);
  await shot("paragraph-race-fixture-1440");
  console.log(
    JSON.stringify({
      screenshots: 10,
      errors,
      progressFixture:
        "Only paragraph-race-fixture uses preloaded clears; result/unlock captures come from actual typed level1.",
    }),
  );
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
