// Run after suites, never concurrently. Progress fixtures live only in this isolated browser context.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://192.168.0.31:5173/TurboType/";
const output = "docs/images/alpha24";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const shot = async (name) => {
  await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
};
try {
  await page.goto(`${base}#/keyboard`);
  await page.evaluate(() => {
    const clears = {};
    for (const [category, through] of [
      ["easy", 10],
      ["medium", 49],
      ["hard", 99],
    ])
      for (let n = 1; n <= through; n++)
        clears[`${category}-${String(n).padStart(3, "0")}`] = {
          stars: 1,
          bestWpm: 20,
          bestAccuracy: 90,
          bestTimeMs: 60000,
          revision: 1,
        };
    localStorage.setItem(
      "turbotype:campaign-map:v2",
      JSON.stringify({
        schemaVersion: 2,
        rulesVersion: 3,
        clears,
        bonuses: {},
        positions: { easy: null, medium: null, hard: null },
      }),
    );
    localStorage.setItem(
      "turbotype:settings:v1",
      JSON.stringify({
        schemaVersion: 1,
        settings: { motion: "reduced", effects: "low", largeText: true },
      }),
    );
  });
  await page.reload();
  await page.goto(`${base}#/campaign/easy`);
  await page.locator('[data-bonus="1"]').scrollIntoViewIfNeeded();
  await shot("chapter-bonus-map-fixture-1440");
  await page.locator('[data-bonus="1"]').click();
  await page.locator(".passage-preview summary").click();
  await shot("bonus-briefing-fixture-1440");
  await page.keyboard.press("Escape");
  await page.goto(`${base}#/campaign/medium`);
  await page.locator('#campaign-road [data-level="50"]').click();
  await page.locator(".passage-preview summary").click();
  await shot("medium-paragraph-briefing-fixture-1440");
  await page.keyboard.press("Escape");
  await page.clock.install();
  await page.goto(`${base}#/level/hard/100`);
  await page
    .locator('#race-track[data-ready="true"]')
    .waitFor({ timeout: 15000 });
  await page.locator("#start-race").click();
  await page.clock.fastForward(63000);
  const text = await page.locator("#race-passage").textContent();
  await page.locator("#race-input").pressSequentially(text.slice(0, 220));
  await shot("hard-finale-typing-fixture-1440");
  await page.locator("#race-input").evaluate((element, tail) => {
    for (const character of tail) {
      element.setSelectionRange(element.value.length, element.value.length);
      const edit = new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: character,
      });
      if (!element.dispatchEvent(edit))
        throw new Error("Unexpected blocked finale edit");
      element.value += character;
      element.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          inputType: "insertText",
          data: character,
        }),
      );
    }
  }, text.slice(220));
  await page
    .locator("#campaign-result-status")
    .filter({ hasText: /Category complete!/ })
    .waitFor();
  await shot("category-complete-fixture-1440");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(`${base}#/campaign/hard`);
  await shot("completed-map-fixture-1024");
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    "Six sequential curriculum captures complete; zero page errors. All progress is an isolated fixture.",
  );
} finally {
  await browser.close();
}
