import { expect, test } from "@playwright/test";
import { guestFixture } from "./guest-fixture";

test("earned reward vehicle and environment preview and race together across categories", async ({
  page,
}) => {
  const save = guestFixture();
  for (let n = 1; n <= 15; n++) {
    save.campaign.clears[`easy-${String(n).padStart(3, "0")}`] = {
      stars: 1,
      bestWpm: 20,
      bestAccuracy: 94,
      bestTimeMs: 10000,
      revision: 1,
    };
  }
  await page.addInitScript((raw) => {
    if (!localStorage.getItem("turbotype:guest:v1"))
      localStorage.setItem("turbotype:guest:v1", raw);
  }, JSON.stringify(save));
  await page.goto("./#/cars");
  await page.locator('[data-preview="reward-easy-015"]').click();
  await expect(page.locator(".collection-detail-car")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator('[data-equip="reward-easy-015"]').click();
  await expect(
    page.locator('[data-reward="reward-medium-015"] button'),
  ).toHaveCount(0);
  await page.goto("./#/tracks");
  await page.locator('[data-preview="track-easy-010"]').click();
  await expect(page.locator("#collection-track-preview")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await page.keyboard.press("Escape");
  await page.locator('[data-equip="track-easy-010"]').click();
  await page.goto("./#/level/medium/1");
  await expect(page.locator('#race-track[data-ready="true"]')).toHaveAttribute(
    "data-player-kart",
    "reward-easy-015",
    { timeout: 12000 },
  );
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-track",
    "track-easy-010",
  );
});

test("guest backup requires replacement confirmation and another tab cannot overwrite it", async ({
  page,
  context,
}) => {
  await page.goto("./#/progress");
  await expect(page.getByText("Race stats and awards")).toHaveCount(0);
  await expect(page.locator("#guest-export")).toBeHidden();
  await page.getByText("Save and backup tools", { exact: true }).click();
  await expect(page.locator("#guest-status")).toContainText("Progress saves");
  const save = guestFixture();
  save.raceXp = 225;
  await page.locator("#guest-import").setInputFiles({
    name: "test-save.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(save)),
  });
  await expect(page.getByRole("dialog")).toContainText("225 XP");
  await expect(page.locator(".page-heading")).toContainText("Rank 1");
  await page.getByRole("button", { name: "Replace save" }).click();
  await expect(page.locator(".page-heading")).toContainText("Rank 2");
  const other = await context.newPage();
  await other.goto("./#/progress");
  await other.getByText("Save and backup tools", { exact: true }).click();
  await expect(other.locator("#guest-status")).toContainText("Another tab");
  await other.getByRole("button", { name: "Retry save" }).click();
  await expect(other.locator("#guest-status")).toContainText("visit only");
  await other.close();
  await page.reload();
  await expect(page.locator(".page-heading")).toContainText("225 XP");
});
