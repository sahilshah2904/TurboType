import { expect, test } from "@playwright/test";
const tracks = [
  "neon-harbor",
  "coral-coast",
  "copper-canyon",
  "emerald-trail",
  "frostline-pass",
];
async function ready(page: import("@playwright/test").Page) {
  await expect(page.locator('#race-track[data-ready="true"]')).toBeVisible({
    timeout: 12000,
  });
}
test("five starter tracks share preview/race choice and keep a running race locked", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/race");
  await ready(page);
  const canvas = await page.locator("#race-track canvas").elementHandle();
  await page.getByText("Advanced / Replay", { exact: true }).click();
  await page.getByLabel("Race seed", { exact: true }).fill("42");
  await page.getByLabel("Race seed", { exact: true }).press("Tab");
  for (const id of tracks) {
    await page.getByLabel("Track", { exact: true }).selectOption(id);
    await expect(page.locator("#race-track")).toHaveAttribute("data-track", id);
    await expect(page.locator("#race-seed")).toHaveValue("42");
    expect(await canvas!.evaluate((el) => el.isConnected)).toBe(true);
  }
  await page.getByRole("button", { name: /^Start race/ }).click();
  await page.clock.fastForward(4000);
  await expect(page.locator("#race-track-select")).toBeDisabled();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.locator("#race-track-select").evaluate((el) => {
    (el as HTMLSelectElement).value = "coral-coast";
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-track",
    "frostline-pass",
  );
  await page.getByRole("link", { name: "The hub", exact: true }).click();
  await expect(page.locator('#track-preview[data-ready="true"]')).toBeVisible({
    timeout: 12000,
  });
  await expect(page.locator("#track-preview")).toHaveAttribute(
    "data-track",
    "frostline-pass",
  );
  await page.getByLabel("Track", { exact: true }).selectOption("coral-coast");
  await expect(
    page.locator('#track-preview[data-ready="true"]'),
  ).toHaveAttribute("data-track", "coral-coast", { timeout: 12000 });
  await page.getByRole("link", { name: "Quick Race", exact: true }).click();
  await ready(page);
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-track",
    "frostline-pass",
  );
  await page.getByRole("button", { name: "Retry same race" }).click();
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-track",
    "coral-coast",
  );
  await page.reload();
  await ready(page);
  await expect(page.getByLabel("Track", { exact: true })).toHaveValue(
    "coral-coast",
  );
  expect(await page.locator("canvas").count()).toBe(1);
});
test("blocked track storage applies an in-memory choice with clear feedback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.goto("./#/race");
  await ready(page);
  await page.getByLabel("Track", { exact: true }).selectOption("emerald-trail");
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-track",
    "emerald-trail",
  );
  await expect(page.locator("#track-choice-status")).toContainText(
    "storage is unavailable",
  );
});
