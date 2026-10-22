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
  await page.getByLabel("Race seed", { exact: true }).fill("42");
  await page.getByLabel("Race seed", { exact: true }).press("Tab");
}
async function go(page: Page) {
  await page.getByRole("button", { name: "Start race" }).click();
  await page.clock.fastForward(3000);
  await expect(page.locator("#race-state")).toHaveText("Racing");
}
test("plays a five-lane race, blocks mistakes, freezes real results and retries the same seed", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await openRace(page);
  await expect(page.locator("#race-track canvas")).toBeVisible();
  const input = page.getByRole("textbox", { name: "Your typing" });
  await page.getByRole("button", { name: "Start race" }).click();
  await input.pressSequentially("early");
  await expect(input).toHaveValue("");
  await page.clock.fastForward(3000);
  await page.clock.fastForward(1000);
  await input.pressSequentially("Exz");
  await expect(input).toHaveValue("Ex");
  await expect(
    page.locator('#race-standings [data-racer="player"]'),
  ).toContainText("2%");
  await input.press("Backspace");
  await input.pressSequentially(SAMPLE.slice(1));
  await expect(page.locator("#race-state")).toHaveText("Finished");
  await expect(page.locator("#race-result-rows tr")).toHaveCount(5);
  await expect(page.locator("#race-result-rows")).toContainText(
    "Simulated after your finish",
  );
  const result = await page.locator("#race-results").textContent();
  const positions = await page.locator("#race-standings").textContent();
  await page.clock.fastForward(120000);
  await expect(page.locator("#race-results")).toHaveText(result!);
  await expect(page.locator("#race-standings")).toHaveText(positions!);
  await page.getByRole("button", { name: "Retry same race" }).click();
  await expect(page.locator("#race-state")).toHaveText("Ready");
  await expect(input).toHaveValue("");
  await expect(page.locator("#race-seed")).toHaveValue("42");
  await expect(page.locator("#race-errors")).toHaveText(
    "0 errors · 0 corrected",
  );
  await go(page);
  await input.pressSequentially(SAMPLE);
  await expect(page.locator("#race-state")).toHaveText("Finished");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("pauses CPUs, preserves the race through navigation and resumes the same clock", async ({
  page,
}) => {
  await openRace(page);
  await go(page);
  await page.clock.fastForward(4000);
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially("Every");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const positions = await page.locator("#race-standings").textContent();
  const elapsed = await page.locator("#race-time").textContent();
  await page.clock.fastForward(20000);
  await expect(page.locator("#race-standings")).toHaveText(positions!);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("link", { name: "Race", exact: true }).click();
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await expect(page.locator("#race-state")).toHaveText("Paused");
  await expect(page.getByRole("textbox", { name: "Your typing" })).toHaveValue(
    "Every",
  );
  await expect(page.locator("#race-standings")).toHaveText(positions!);
  await page.getByRole("button", { name: "Resume race" }).click();
  await page.clock.fastForward(2000);
  await expect(page.locator("#race-time")).toHaveText(elapsed!);
  await page.clock.fastForward(2000);
  await expect(page.locator("#race-state")).toHaveText("Racing");
  await expect(page.locator("#race-eligibility")).toContainText("paused");
  await page.locator("#race-track canvas").dispatchEvent("webglcontextlost");
  await expect(page.locator("#race-state")).toHaveText("Paused");
  await expect(
    page.getByRole("button", { name: "Race with text standings" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Race with text standings" }).click();
  await page.getByRole("button", { name: "Resume race" }).click();
  await page.clock.fastForward(3000);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.locator("#race-state")).toHaveText("Paused");
});
test("CPUs finishing first do not stop learning, while time trials produce honest DNFs", async ({
  page,
}) => {
  await openRace(page);
  await page.getByLabel("Opponent pace").selectOption("hard");
  await go(page);
  await page.clock.fastForward(90000);
  await expect(page.locator("#race-state")).toHaveText("Racing");
  await expect(
    page.locator('#race-standings [data-racer="cpu-4"]'),
  ).toContainText("finished");
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially(SAMPLE);
  await expect(page.locator("#race-result-title")).toHaveText("Race complete");
  await expect(page.locator("#race-result-place")).toHaveAttribute(
    "aria-label",
    "Place 5 of 5",
  );
  await page.getByRole("button", { name: "Retry same race" }).click();
  await page.getByLabel("Mode", { exact: true }).selectOption("timed");
  await go(page);
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially("E");
  await page.clock.fastForward(60000);
  await expect(page.locator("#race-state")).toHaveText("Time limit reached");
  await expect(
    page.locator('#race-result-rows [data-racer="player"]'),
  ).toContainText("DNF · time limit");
  await expect(page.locator("#race-time")).toHaveText("60.0s");
  await expect(page.getByRole("textbox", { name: "Your typing" })).toHaveValue(
    "E",
  );
});
for (const asset of [
  "parts/volt-kart-body.webp",
  "parts/comet-body.webp",
  "parts/comet-wheel.webp",
])
  test(`art failure for ${asset} allows text racing, retry recovery and cleanup`, async ({
    page,
  }) => {
    await page.clock.install();
    await page.route(`**/assets/karts/${asset}`, (route) => route.abort());
    await page.goto("./#/race");
    await expect(
      page.getByRole("button", { name: "Race with text standings" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Start race" }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Race with text standings" })
      .click();
    await go(page);
    await page
      .getByRole("textbox", { name: "Your typing" })
      .pressSequentially(SAMPLE);
    await expect(page.locator("#race-state")).toHaveText("Finished");
    await page.unroute(`**/assets/karts/${asset}`);
    await page.getByRole("button", { name: "Retry artwork" }).click();
    await expect(page.locator("#race-track")).toHaveAttribute(
      "data-ready",
      "true",
      { timeout: 12000 },
    );
    await page.getByRole("link", { name: "Practice", exact: true }).click();
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.getByRole("link", { name: "Race", exact: true }).click();
    await expect(page.locator("#race-track canvas")).toHaveCount(1);
    await expect(page.locator("#race-state")).toHaveText("Finished");
  });
test("validates seeds and supports new opponents, reduced motion and laptop resize", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openRace(page);
  await page.getByLabel("Race seed", { exact: true }).fill("-1");
  await page.getByRole("button", { name: "Start race" }).click();
  await expect(page.locator("#race-state")).toHaveText("Ready");
  await page.getByLabel("Race seed", { exact: true }).fill("42");
  await page.getByLabel("Race seed", { exact: true }).press("Tab");
  await page.getByRole("button", { name: "New seed", exact: true }).click();
  await expect(page.locator("#race-seed")).toHaveValue("43");
  await go(page);
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially("Every");
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator("#race-state")).toHaveText("Racing");
  await expect(page.getByRole("textbox", { name: "Your typing" })).toHaveValue(
    "Every",
  );
  await page.setViewportSize({ width: 1366, height: 768 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("compact results show standings by default and retain honest CPU details", async ({
  page,
}) => {
  await openRace(page);
  await go(page);
  await page.clock.fastForward(12000);
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially(SAMPLE);
  await expect(page.locator("#race-result-place")).toHaveAttribute(
    "aria-label",
    "Place 1 of 5",
  );
  await expect(page.locator("#race-result-accuracy")).toHaveText("100.0%");
  await expect(page.locator("#race-result-details")).toHaveAttribute("open");
  await expect(page.locator("#race-result-rows")).toBeVisible();
  for (const width of [1024, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: 768 });
    await expect(
      page.getByRole("button", { name: "Retry same race" }),
    ).toBeInViewport();
    await expect(page.locator("#race-result-wpm")).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("#race-result-wpm")
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(32);
  }
  await page.getByText("Final standings", { exact: true }).click();
  await expect(page.locator("#race-result-rows")).not.toBeVisible();
  await page.getByText("Final standings", { exact: true }).click();
  await expect(page.locator("#race-result-rows")).toBeVisible();
  await expect(page.locator("#race-result-rows")).toContainText(
    "Simulated after your finish",
  );
  await page.getByRole("button", { name: "Retry same race" }).click();
  await page.getByLabel("Mode", { exact: true }).selectOption("timed");
  await go(page);
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially("Every");
  await page.clock.fastForward(60000);
  await expect(page.locator("#race-result-place")).toHaveText("DNF");
  await expect(page.locator("#race-result-progress")).toBeVisible();
  await expect(page.locator("#race-result-progress")).toContainText(
    `${Math.floor((5 / SAMPLE.length) * 100)}% of passage completed`,
  );
  await expect(page.locator("#race-result-details")).toHaveAttribute("open");
});
