import { expect, test } from "@playwright/test";
const tracks = [
  "neon-harbor",
  "coral-coast",
  "copper-canyon",
  "emerald-trail",
  "frostline-pass",
];
test("starter tracks preview individually, persist globally and remain locked during a paused race", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/tracks");
  await expect(page.locator("[data-equip]")).toHaveCount(5);
  await expect(page.locator("[data-reward]")).toHaveCount(21);
  await expect(page.locator('[data-reward="track-easy-010"]')).toContainText(
    "Easy level 10",
  );
  expect(
    await page
      .locator("[data-reward]")
      .evaluateAll((cards) =>
        cards.slice(0, 6).map((card) => (card as HTMLElement).dataset.reward),
      ),
  ).toEqual([
    "track-easy-010",
    "track-medium-010",
    "track-hard-010",
    "track-easy-025",
    "track-medium-025",
    "track-hard-025",
  ]);
  await expect(page.locator("canvas")).toHaveCount(0);
  for (const id of tracks) {
    await page.locator(`[data-preview="${id}"]`).click();
    await expect(
      page.locator('#collection-track-preview[data-ready="true"]'),
    ).toHaveAttribute("data-track", id, { timeout: 12000 });
    await expect(page.locator("canvas")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.locator(`[data-equip="${id}"]`).click();
  }
  await page.goto("./#/hub");
  await expect(
    page.locator('#track-preview[data-ready="true"]'),
  ).toHaveAttribute("data-track", "frostline-pass", { timeout: 12000 });
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-track",
    "frostline-pass",
    { timeout: 12000 },
  );
  await page.locator("#start-race").click();
  await page.clock.fastForward(4000);
  await page.goto("./#/tracks");
  await expect(page.locator('[data-equip="coral-coast"]')).toBeDisabled();
  await page.locator('[data-equip="coral-coast"]').dispatchEvent("click");
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-track",
    "frostline-pass",
    { timeout: 12000 },
  );
  await page.locator("#retry-race").click();
  await page.goto("./#/tracks");
  await page.locator('[data-equip="coral-coast"]').click();
  await page.reload();
  await expect(page.locator('[data-equip="coral-coast"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-track",
    "coral-coast",
    { timeout: 12000 },
  );
});
test("blocked track storage applies an in-memory collection choice with clear feedback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw Error("blocked");
    };
  });
  await page.goto("./#/tracks");
  await page.locator('[data-equip="emerald-trail"]').click();
  await expect(page.locator("#collection-status")).toContainText(
    "storage is unavailable",
  );
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-track",
    "emerald-trail",
    { timeout: 12000 },
  );
});
