import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
const KEY = "turbotype:campaign-map:v2";
async function ready(page: Page) {
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
}
async function start(page: Page) {
  if (
    ["Ready", "Paused"].includes(
      (await page.locator("#race-state").textContent())!,
    )
  )
    await page.locator("#start-race").click();
  await page.clock.fastForward(3000);
  await expect(page.locator("#race-state")).toHaveText("Racing");
  await page.clock.fastForward(30000);
}
async function finish(page: Page) {
  const passage = await page.locator("#race-passage").textContent();
  await page.locator("#race-input").pressSequentially(passage!);
  await expect(page.locator("#race-state")).toHaveText("Finished");
}
async function sampleProgress(page: Page) {
  await page.addInitScript(() => {
    if (localStorage.getItem("turbotype:campaign-map:v2")) return;
    const clears: Record<string, unknown> = {};
    for (let i = 1; i <= 5; i++)
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
        positions: { easy: null, medium: null, hard: null },
        clears,
      }),
    );
  });
}

test("three 100-stop maps, chapter navigation, semantic locks and accessible list never bypass prerequisites", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./#/hub");
  await expect(page.getByRole("link", { name: "Continue Easy" })).toBeVisible();
  await page.getByRole("link", { name: "Continue Easy" }).click();
  await expect(page.locator("#campaign-road [data-level]")).toHaveCount(100);
  await expect(page.locator(".map-bonus")).toHaveCount(10);
  await expect(page.locator('.map-district[data-loaded="true"]')).toHaveCount(
    2,
  );
  expect(await page.locator("canvas").count()).toBe(0);
  await page.locator('#campaign-road [data-level="2"]').click();
  await expect(page.locator("#level-briefing")).toContainText(
    "Clear Easy level 1",
  );
  await expect(page.locator("#briefing-start")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.locator('#campaign-road [data-level="1"]').focus();
  await page.keyboard.press("End");
  await expect(page.locator('#campaign-road [data-level="100"]')).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#level-briefing")).toContainText(
    "Clear Easy level 99",
  );
  await page.keyboard.press("Escape");
  await page.locator("#map-jump-current").click();
  await expect(page.locator('#campaign-road [data-level="1"]')).toBeFocused();
  await page.locator("#map-chapter").selectOption("5");
  await expect(page.locator("#map-chapter")).toHaveValue("5");
  expect(
    await page.locator("#campaign-road").evaluate((el) => el.scrollLeft),
  ).toBeGreaterThan(5000);
  await page.locator("#map-view").click();
  await expect(page.locator("#campaign-list button")).toHaveCount(100);
  await page
    .getByRole("button", { name: "Level 50 · Locked", exact: false })
    .click();
  await expect(page.locator("#level-briefing")).toContainText("level 49");
  await page.keyboard.press("Escape");
  await page.locator("#map-jump-current").click();
  await expect(page.locator('#campaign-list [data-level="1"]')).toBeFocused();
  await page.goto("./#/level/hard/2");
  await expect(
    page.getByRole("heading", { name: "Road not open yet." }),
  ).toBeVisible();
  await expect(page.locator("#race-input")).toHaveCount(0);
  await page.goto("./#/campaign/medium");
  await expect(page.locator(".map-node--current")).toHaveAttribute(
    "data-level",
    "1",
  );
  expect(errors).toEqual([]);
});

test("a real eligible finish saves stars, unlocks only its category and replays without duplicate clears", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/level/easy/1");
  await ready(page);
  await expect(page.locator("#race-passage-select")).toBeHidden();
  await start(page);
  await finish(page);
  await expect(page.locator("#campaign-result-status")).toContainText(
    "Level cleared",
  );
  await expect(page.locator("#campaign-next")).toBeVisible();
  await page.locator(".campaign-race-back").click();
  await expect(page.locator(".map-node--current")).toHaveAttribute(
    "data-level",
    "2",
  );
  await expect(page.locator(".map-node--unlock")).toHaveAttribute(
    "data-level",
    "2",
  );
  await page.reload();
  await expect(page.locator(".map-node--current")).toHaveAttribute(
    "data-level",
    "2",
  );
  await page.locator('#campaign-road [data-level="1"]').click();
  await expect(page.locator("#level-briefing")).toContainText("Personal best");
  await page.locator("#briefing-start").click();
  await ready(page);
  await expect(page.locator("#race-state")).toHaveText("Countdown");
  await start(page);
  await finish(page);
  await expect(page.locator("#campaign-result-status")).toContainText(
    "Replay complete",
  );
  expect(
    await page.evaluate(
      (key) =>
        Object.keys(JSON.parse(localStorage.getItem(key)!).clears).length,
      KEY,
    ),
  ).toBe(1);
  await page.goto("./#/campaign/hard");
  await expect(page.locator(".map-node--current")).toHaveAttribute(
    "data-level",
    "1",
  );
});

test("pause/navigation cannot clear, and retry starts a fresh eligible campaign run", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/level/medium/1");
  await ready(page);
  await start(page);
  await page.locator("#pause-race").click();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.evaluate(() => (location.hash = "#/level/medium/1"));
  await ready(page);
  await expect(page.locator("#race-state")).toHaveText("Paused");
  await start(page);
  await finish(page);
  await expect(page.locator("#campaign-result-status")).toContainText(
    "Practice finish",
  );
  await expect(page.locator("#campaign-next")).toBeHidden();
  await page.locator("#retry-race").click();
  await start(page);
  await finish(page);
  await expect(page.locator("#campaign-result-status")).toContainText(
    "Level cleared",
  );
});

test("denied campaign writes preserve navigation progress for this visit with honest feedback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw Error("denied");
    };
  });
  await page.clock.install();
  await page.goto("./#/level/easy/1");
  await ready(page);
  await start(page);
  await finish(page);
  await expect(page.locator("#campaign-result-status")).toContainText(
    "visit only",
  );
  await page.locator(".campaign-race-back").click();
  await expect(page.locator(".map-node--current")).toHaveAttribute(
    "data-level",
    "2",
  );
  await expect(page.locator("#campaign-storage-status")).toContainText(
    "visit only",
  );
});

test("malformed campaign data remains untouched and can be exported", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("turbotype:campaign-map:v2", "{future-broken"),
  );
  await page.goto("./#/campaign/easy");
  await expect(page.locator("#campaign-storage-status")).toContainText(
    "preserved",
  );
  await page.locator("#map-chapter").selectOption("4");
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(
    "{future-broken",
  );
  await page.goto("./#/campaign/easy");
  const downloadEvent = page.waitForEvent("download");
  await page.locator("#campaign-export").click();
  const download = await downloadEvent;
  expect(await readFile((await download.path())!, "utf8")).toBe(
    "{future-broken",
  );
});

test("collection choices reach a campaign through a single briefing and automatic countdown", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/cars");
  await page.locator('[data-equip="comet"]').click();
  await page.goto("./#/tracks");
  await page.locator('[data-equip="frostline-pass"]').click();
  await page.goto("./#/campaign/hard");
  await page.locator("#map-current").click();
  await expect(page.locator("#briefing-car, #briefing-track")).toHaveCount(0);
  await expect(page.locator(".briefing-equipment")).toHaveText(
    "Comet · Frostline Pass",
  );
  await page.locator("#briefing-start").click();
  await ready(page);
  await expect(page.locator("#race-state")).toHaveText("Countdown");
  await expect(page.locator("#kart-picker, #race-track-select")).toHaveCount(0);
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-player-kart",
    "comet",
  );
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-track",
    "frostline-pass",
  );
  await page.clock.fastForward(3000);
  await page.locator("#pause-race").click();
  await page.goto("./#/cars");
  await expect(page.locator('[data-equip="apex-nova"]')).toBeDisabled();
  await page.goto("./#/campaign/easy");
  await page.locator("#map-current").click();
  await expect(page.locator(".briefing-equipment")).toHaveText(
    "Comet · Frostline Pass",
  );
});

for (const width of [1024, 1366, 1440, 1920])
  test(`map and briefing fit ${width}px laptop windows with Reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./#/campaign/easy");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("#map-current").click();
    await expect(page.locator("#briefing-start")).toBeVisible();
    const dialog = await page.locator("#level-briefing").boundingBox();
    expect(dialog!.x).toBeGreaterThanOrEqual(0);
    expect(dialog!.x + dialog!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await page.locator("#map-chapter").selectOption("10");
    await page.getByRole("link", { name: "Settings", exact: true }).click();
    await page.evaluate(() => (location.hash = "#/campaign/easy"));
    expect(
      await page.locator("#campaign-road").evaluate((el) => el.scrollLeft),
    ).toBeGreaterThan(12000);
    await page.locator("#map-jump-current").click();
    await expect(page.locator('#campaign-road [data-level="1"]')).toBeFocused();
  });

for (const large of [false, true])
  test(`long paragraph tracks its caret in ${large ? "larger" : "standard"} typing text`, async ({
    page,
  }) => {
    await sampleProgress(page);
    if (large)
      await page.addInitScript(() =>
        localStorage.setItem(
          "turbotype:settings:v1",
          JSON.stringify({
            schemaVersion: 1,
            settings: { motion: "reduced", effects: "low", largeText: true },
          }),
        ),
      );
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.clock.install();
    await page.goto("./#/level/easy/6");
    await ready(page);
    const passage = (await page.locator("#race-passage").textContent())!;
    expect(passage.length).toBeGreaterThan(750);
    await start(page);
    await page.locator("#race-input").pressSequentially(passage.slice(0, 350));
    await page.clock.fastForward(100);
    const scroll = await page
      .locator("#race-passage")
      .evaluate((el) => ({ x: el.scrollLeft, y: el.scrollTop }));
    expect(large ? scroll.y : scroll.x).toBeGreaterThan(0);
    await expect(page.locator("#race-state")).toHaveText("Racing");
    await expect(page.locator("#race-passage .character--correct")).toHaveCount(
      350,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

test("drag moves the road without opening a level, and category positions restore independently", async ({
  page,
}) => {
  await page.goto("./#/campaign/easy");
  const road = page.locator("#campaign-road");
  const box = (await road.boundingBox())!;
  await page.mouse.move(box.x + 600, box.y + 70);
  await page.mouse.down();
  await page.mouse.move(box.x + 200, box.y + 70, { steps: 8 });
  await page.mouse.up();
  expect(await road.evaluate((el) => el.scrollLeft)).toBeGreaterThan(300);
  await expect(page.locator("#level-briefing")).not.toBeVisible();
  const easyX = await road.evaluate((el) => el.scrollLeft);
  await page.getByRole("link", { name: "Hard", exact: true }).click();
  await page.locator("#map-chapter").selectOption("9");
  await page.getByRole("link", { name: "Easy", exact: true }).click();
  expect(await road.evaluate((el) => el.scrollLeft)).toBeCloseTo(easyX, 0);
});

test("a remote tab clear refreshes the map without creating an update loop", async ({
  page,
  context,
}) => {
  await page.goto("./#/campaign/easy");
  const other = await context.newPage();
  await other.goto("./#/campaign/medium");
  await other.evaluate(() =>
    localStorage.setItem(
      "turbotype:campaign-map:v2",
      JSON.stringify({
        schemaVersion: 2,
        rulesVersion: 3,
        clears: {
          "easy-001": {
            stars: 3,
            bestWpm: 10,
            bestAccuracy: 100,
            bestTimeMs: 60000,
            revision: 1,
          },
        },
        positions: { easy: 0, medium: 0, hard: 0 },
      }),
    ),
  );
  await expect(page.locator(".map-node--current")).toHaveAttribute(
    "data-level",
    "2",
  );
  await expect(other.locator(".map-node--current")).toHaveAttribute(
    "data-level",
    "1",
  );
  await other.close();
});

test("a complete multi-sentence paragraph saves a real campaign clear", async ({
  page,
}) => {
  await sampleProgress(page);
  await page.clock.install();
  await page.goto("./#/level/easy/4");
  await ready(page);
  await start(page);
  await finish(page);
  await expect(page.locator("#campaign-result-status")).toContainText(
    "Replay complete",
  );
  await expect(page.locator("#race-passage .character--correct")).toHaveCount(
    308,
  );
});

for (const first of ["race", "level/easy/1"]) {
  test(`${first} pins its car even when a second race session and collections are opened`, async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto("./#/cars");
    await page.locator('[data-equip="neon-fox"]').click();
    await page.goto(`./#/${first}`);
    await ready(page);
    await start(page);
    await page.locator("#pause-race").click();
    await page.goto("./#/cars");
    await expect(page.locator('[data-equip="comet"]')).toBeDisabled();
    await page.locator('[data-equip="comet"]').dispatchEvent("click");
    const other = first === "race" ? "level/hard/1" : "race";
    await page.goto(`./#/${other}`);
    await ready(page);
    await start(page);
    await page.goto(`./#/${first}`);
    await ready(page);
    await expect(page.locator("#race-state")).toHaveText("Paused");
    await expect(page.locator("#race-track")).toHaveAttribute(
      "data-player-kart",
      "neon-fox",
    );
    await page.goto("./#/cars");
    await page.locator("#collection-end-race").click();
    await page.locator('[data-equip="comet"]').click();
    await page.goto(`./#/${first}`);
    await ready(page);
    await expect(page.locator("#race-state")).toHaveText("Abandoned");
    await expect(page.locator("#race-track")).toHaveAttribute(
      "data-player-kart",
      "neon-fox",
    );
    await page.locator("#retry-race").click();
    await expect(page.locator("#race-track")).toHaveAttribute(
      "data-player-kart",
      "comet",
    );
  });
}

for (const interruption of ["Escape", "blur"])
  test(`${interruption} during campaign artwork loading cancels automatic start`, async ({
    page,
  }) => {
    await page.clock.install();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let blocked = false;
    await page.route(
      "**/assets/karts/parts/volt-kart-body.webp",
      async (route) => {
        blocked = true;
        await gate;
        await route.continue();
      },
    );
    await page.goto("./#/campaign/easy");
    await page.locator("#map-current").click();
    await page.locator("#briefing-start").click();
    await expect.poll(() => blocked).toBe(true);
    if (interruption === "Escape") await page.keyboard.press("Escape");
    else await page.evaluate(() => window.dispatchEvent(new Event("blur")));
    release();
    await ready(page);
    await page.clock.fastForward(4000);
    await expect(page.locator("#race-state")).toHaveText("Ready");
    await expect(page.locator("#start-race")).toBeVisible();
    await page.locator("#start-race").click();
    await page.clock.fastForward(3000);
    await expect(page.locator("#race-state")).toHaveText("Racing");
  });
