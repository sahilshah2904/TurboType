import { expect, test, type Page } from "@playwright/test";
const KEY = "turbotype:campaign-map:v2";
async function fixture(
  page: Page,
  category: string,
  through: number,
  legacy = false,
) {
  await page.addInitScript(
    ({ category, through, legacy, key }) => {
      const target = legacy ? "turbotype:campaign-map:v1" : key;
      if (localStorage.getItem(target)) return;
      const clears: Record<string, unknown> = {};
      for (let n = 1; n <= through; n++)
        clears[`${category}-${String(n).padStart(3, "0")}`] = {
          stars: 1,
          bestWpm: 20,
          bestAccuracy: 90,
          bestTimeMs: 60000,
          revision: 1,
        };
      localStorage.setItem(
        target,
        JSON.stringify({
          schemaVersion: legacy ? 1 : 2,
          rulesVersion: 3,
          clears,
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
    },
    { category, through, legacy, key: KEY },
  );
}
async function start(page: Page) {
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  if ((await page.locator("#race-state").textContent()) == "Ready")
    await page.locator("#start-race").click();
  await page.clock.fastForward(63000);
  await expect(page.locator("#race-state")).toHaveText("Racing");
}

for (const category of ["easy", "medium", "hard"]) {
  for (let chapter = 1; chapter <= 10; chapter++) {
    const number = chapter === 1 ? 7 : (chapter - 1) * 10 + 1;
    test(`${category} chapter ${chapter} accepts native typing for its introduced skill`, async ({
      page,
    }) => {
      await fixture(page, category, number - 1);
      await page.clock.install();
      await page.goto(`./#/level/${category}/${number}`);
      await start(page);
      const text = (await page.locator("#race-passage").textContent())!.slice(
        0,
        650,
      );
      await page.locator("#race-input").pressSequentially(text);
      await expect(page.locator("#race-input")).toHaveValue(text);
      await expect(page.locator("#race-eligibility")).not.toContainText(
        "practice-only",
      );
      await page.locator("#pause-race").click();
      await expect(page.locator("#race-state")).toHaveText("Paused");
      expect(
        await page.evaluate(
          (key) =>
            Object.keys(JSON.parse(localStorage.getItem(key)!).clears).length,
          KEY,
        ),
      ).toBe(number - 1);
    });
  }
  test(`${category} finale completes real long prose without a level 101`, async ({
    page,
  }) => {
    await fixture(page, category, 99);
    await page.clock.install();
    await page.goto(`./#/level/${category}/100`);
    await start(page);
    const text = (await page.locator("#race-passage").textContent())!;
    expect(text.length).toBeGreaterThan(
      { easy: 1300, medium: 2100, hard: 2900 }[category]!,
    );
    await page.locator("#race-input").pressSequentially(text.slice(0, 150));
    // Replay the tail as individual DOM edits to avoid thousands of transport
    // round trips. The real input adapter/engine still process every character.
    // This is integration coverage, not a physical keyboard latency measurement.
    await page.locator("#race-input").evaluate((element, tail) => {
      const input = element as HTMLTextAreaElement;
      for (const character of tail) {
        input.setSelectionRange(input.value.length, input.value.length);
        const edit = new InputEvent("beforeinput", {
          bubbles: true,
          cancelable: true,
          inputType: "insertText",
          data: character,
        });
        if (!input.dispatchEvent(edit))
          throw new Error("Unexpected blocked finale edit");
        input.value += character;
        input.dispatchEvent(
          new InputEvent("input", {
            bubbles: true,
            inputType: "insertText",
            data: character,
          }),
        );
      }
    }, text.slice(150));
    await expect(page.locator("#race-state")).toHaveText("Finished");
    await expect(page.locator("#campaign-result-status")).toContainText(
      "Category complete!",
    );
    await expect(page.locator("#campaign-next")).toHaveCount(0);
    await page.locator(".campaign-race-back").click();
    await expect(page.locator(".campaign-heading")).toContainText(
      "100/100 cleared",
    );
    await page.reload();
    await expect(page.locator(".campaign-heading")).toContainText(
      "100/100 cleared",
    );
    await page.goto(`./#/level/${category}/101`);
    await expect(page.locator("#race-input")).toHaveCount(0);
  });
}

test("chapter bonuses stay locked before the showcase clear", async ({
  page,
}) => {
  await page.goto("./#/bonus/easy/1");
  await expect(
    page.getByRole("heading", { name: "Road not open yet." }),
  ).toBeVisible();
});

test("chapter bonuses save separately, replay and never open main levels", async ({
  page,
}) => {
  await fixture(page, "easy", 10);
  await page.clock.install();
  await page.goto("./#/campaign/easy");
  await page.locator('[data-bonus="1"]').click();
  await expect(page.locator("#level-briefing")).toContainText(
    "Optional chapter challenge",
  );
  await page.locator("#briefing-start").click();
  await expect(page).toHaveURL(/#\/bonus\/easy\/1$/);
  await start(page);
  const text = (await page.locator("#race-passage").textContent())!;
  await page.locator("#race-input").pressSequentially(text);
  await expect(page.locator("#campaign-result-status")).toContainText(
    "Bonus cleared.",
  );
  await expect(page.locator("#campaign-next")).toHaveCount(0);
  await page.reload();
  await start(page);
  await page.locator("#race-input").pressSequentially(text);
  await expect(page.locator("#campaign-result-status")).toContainText(
    "Replay complete.",
  );
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    KEY,
  );
  expect(Object.keys(saved.clears)).toHaveLength(10);
  expect(Object.keys(saved.bonuses)).toEqual(["easy-bonus-01"]);
  await page.locator(".campaign-race-back").click();
  await expect(page.locator('[data-bonus="1"]')).toContainText("✓");
  await expect(page.locator(".map-node--current")).toHaveAttribute(
    "data-level",
    "11",
  );
});

test("existing Phase 7 saves migrate intact and level 6 continues into the full route", async ({
  page,
}) => {
  await fixture(page, "easy", 5, true);
  await page.clock.install();
  await page.goto("./#/level/easy/6");
  const legacy = await page.evaluate(() =>
    localStorage.getItem("turbotype:campaign-map:v1"),
  );
  await start(page);
  await page
    .locator("#race-input")
    .pressSequentially((await page.locator("#race-passage").textContent())!);
  await expect(page.locator("#campaign-next")).toBeVisible();
  await page.locator("#campaign-next").click();
  await expect(page.locator(".race-deck-title")).toHaveText("EASY · LEVEL 7");
  await page.reload();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("turbotype:campaign-map:v1"),
    ),
  ).toBe(legacy);
  expect(
    await page.evaluate(
      (key) =>
        Object.keys(JSON.parse(localStorage.getItem(key)!).clears).length,
      KEY,
    ),
  ).toBe(6);
});
