// Run sequentially after browser suites, using isolated storage.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://192.168.0.31:5173/TurboType/";
const output = "docs/images/alpha23";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(`${base}#/keyboard`);
  await page.locator("#keyboard-input").pressSequentially("the quick xrown");
  if ((await page.locator("#keyboard-input").inputValue()) !== "the quick x")
    throw new Error("Keyboard check advanced beyond an unresolved error.");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `${output}/keyboard-correction-1024.png`,
    fullPage: true,
  });
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("Keyboard correction capture complete; zero page errors.");
} finally {
  await browser.close();
}
