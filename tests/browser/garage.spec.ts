import { expect, test } from "@playwright/test";

test("five starters are selectable and enlarge; eighteen locked silhouettes stay milestone ordered", async ({
  page,
}) => {
  await page.goto("./#/cars");
  await expect(page.locator("[data-equip]")).toHaveCount(5);
  await expect(page.locator("[data-reward]")).toHaveCount(18);
  expect(
    await page
      .locator("[data-reward]")
      .evaluateAll((cards) =>
        cards.slice(0, 6).map((card) => (card as HTMLElement).dataset.reward),
      ),
  ).toEqual([
    "reward-easy-015",
    "reward-medium-015",
    "reward-hard-015",
    "reward-easy-030",
    "reward-medium-030",
    "reward-hard-030",
  ]);
  await expect(
    page.locator("[data-reward] button, [data-reward] img"),
  ).toHaveCount(0);
  await expect(page.locator('[data-reward="reward-hard-015"]')).toContainText(
    "Hard level 15",
  );
  for (const id of [
    "neon-fox",
    "apex-nova",
    "volt-rival",
    "volt-kart",
    "comet",
  ]) {
    await page.locator(`[data-equip="${id}"]`).click();
    await expect(page.locator(`[data-equip="${id}"]`)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  }
  await page.locator('[data-preview="comet"]').click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".collection-detail-car")).toHaveAttribute(
    "src",
    /comet-preview.webp$/,
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator('[data-preview="comet"]')).toBeFocused();
  await page.getByRole("link", { name: "The hub", exact: true }).click();
  await expect(page.locator(".garage-kart")).toHaveAttribute(
    "src",
    /comet-preview.webp$/,
  );
  await page.reload();
  await expect(page.locator(".garage-kart")).toHaveAttribute(
    "src",
    /comet-preview.webp$/,
  );
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-player-kart",
    "comet",
    { timeout: 12000 },
  );
  await expect(page.locator("#kart-picker")).toHaveCount(0);
});

test("paused races block cosmetic selection and explicit ending releases it without changing the old run", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toBeVisible({
    timeout: 12000,
  });
  await page.locator("#start-race").click();
  await page.clock.fastForward(3000);
  await page.locator("#race-input").pressSequentially("Every");
  await page.getByRole("link", { name: "Cars", exact: true }).click();
  await expect(page.locator(".collection-lock")).toBeVisible();
  await expect(page.locator('[data-equip="comet"]')).toBeDisabled();
  await page.locator('[data-equip="comet"]').dispatchEvent("click");
  await expect(page.locator("#collection-status")).toContainText("locked");
  await page.locator('[data-preview="comet"]').click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.locator("#collection-close").click();
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-player-kart",
    "volt-kart",
    { timeout: 12000 },
  );
  await expect(page.locator("#race-input")).toHaveValue("Every");
  await page.locator("#retry-race").click();
  await page.goto("./#/cars");
  await page.locator('[data-equip="comet"]').click();
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-player-kart",
    "comet",
    { timeout: 12000 },
  );
});

test("sound controls stay in Settings and denied cosmetic storage stays usable for this visit", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw Error("Denied");
    };
  });
  for (const route of [
    "hub",
    "race",
    "cars",
    "tracks",
    "practice",
    "keyboard",
    "settings",
  ]) {
    await page.goto(`./#/${route}`);
    await expect(page.locator(".audio-controls")).toHaveCount(
      route === "settings" ? 1 : 0,
    );
  }
  await page.goto("./#/cars");
  await page.locator('[data-equip="comet"]').click();
  await expect(page.locator("#collection-status")).toContainText(
    "Applied for this visit",
  );
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-player-kart",
    "comet",
    { timeout: 12000 },
  );
  await page.reload();
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-player-kart",
    "volt-kart",
    { timeout: 12000 },
  );
});

for (const width of [1024, 1366, 1440, 1920])
  test(`collection grid and enlarged car fit ${width}px desktop windows`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./#/cars");
    const cards = await page.locator("[data-item]").evaluateAll((items) =>
      items.map((item) => {
        const box = item.getBoundingClientRect();
        return { x: box.x, y: box.y };
      }),
    );
    expect(cards[0].y).toBe(cards[2].y);
    expect(cards[3].y).toBeGreaterThan(cards[0].y);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator('[data-preview="volt-rival"]').click();
    const image = await page.locator(".collection-detail-car").boundingBox();
    expect(image!.x).toBeGreaterThanOrEqual(0);
    expect(image!.x + image!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await page.goto("./#/tracks");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
