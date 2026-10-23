import { expect, test } from "@playwright/test";
async function ready(page: import("@playwright/test").Page) {
  await page.goto("./#/race");
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
}

test("all starter choices update the existing pre-race fleet", async ({
  page,
}) => {
  await ready(page);
  const track = page.locator("#race-track");
  const canvas = await track.locator("canvas").elementHandle();
  for (const id of [
    "neon-fox",
    "apex-nova",
    "volt-rival",
    "volt-kart",
    "comet",
  ]) {
    await page.locator(`input[name="player-kart"][value="${id}"]`).check();
    await expect(track).toHaveAttribute("data-player-kart", id);
    const models = (await track.getAttribute("data-lineup"))!.split(",");
    expect(models[0]).toBe(id);
    expect(new Set(models).size).toBe(5);
    expect(await canvas!.evaluate((el) => el.isConnected)).toBe(true);
  }
});

test("one car stays locked through countdown, pause and resume until a new race", async ({
  page,
}) => {
  await page.clock.install();
  await ready(page);
  const track = page.locator("#race-track");
  await page.getByRole("radio", { name: /^Comet/ }).check();
  await expect(track).toHaveAttribute("data-player-kart", "comet");
  await page.locator("#start-race").click();
  await expect(page.locator("#kart-picker")).toHaveAttribute("disabled", "");
  await page.clock.fastForward(3000);
  await page.locator("#race-input").pressSequentially("Every");
  await page.locator("#pause-race").click();
  const time = await page.locator("#race-time").textContent();
  const standings = await page.locator("#race-standings").textContent();
  await expect(page.locator("#kart-picker")).toHaveAttribute("disabled", "");
  await expect(page.locator("#kart-picker")).toBeHidden();
  // Even a synthetic change event must not bypass the session-state guard.
  await page.locator('input[value="apex-nova"]').dispatchEvent("change");
  await page.clock.runFor(100);
  await expect(track).toHaveAttribute("data-player-kart", "comet");
  await expect(page.locator("#race-input")).toHaveValue("Every");
  await expect(page.locator("#race-time")).toHaveText(time!);
  await expect(page.locator("#race-standings")).toHaveText(standings!);
  await page.locator("#start-race").click();
  await page.clock.fastForward(3000);
  await expect(track).toHaveAttribute("data-player-kart", "comet");
  await page.locator("#pause-race").click();
  await page.locator("#retry-race").click();
  await expect(page.locator("#kart-picker")).not.toHaveAttribute(
    "disabled",
    "",
  );
  await page.getByRole("radio", { name: /^Apex Nova/ }).check();
  await expect(track).toHaveAttribute("data-player-kart", "apex-nova");
});

test("car choice survives hub navigation and browser reload", async ({
  page,
}) => {
  await ready(page);
  await page.getByRole("radio", { name: /^Apex Nova/ }).check();
  await page.getByRole("link", { name: "The hub", exact: true }).click();
  await expect(page.locator(".garage-kart")).toHaveAttribute(
    "src",
    /apex-nova-preview.webp$/,
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".garage-kart")).toHaveAttribute(
    "src",
    /apex-nova-preview.webp$/,
  );
  await page.getByRole("link", { name: "Quick Race", exact: true }).click();
  await expect(page.getByRole("radio", { name: /^Apex Nova/ })).toBeChecked();
});

test("sound controls exist only in Settings and denied car storage stays playable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw Error("Denied");
    };
  });
  for (const route of ["hub", "race", "practice", "keyboard", "settings"]) {
    await page.goto(`./#/${route}`);
    await expect(page.locator(".audio-controls")).toHaveCount(
      route === "settings" ? 1 : 0,
    );
  }
  await page.getByRole("link", { name: "Quick Race", exact: true }).click();
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await page.getByRole("radio", { name: /^Comet/ }).check();
  await expect(page.locator("#kart-save-status")).toContainText(
    "Applied for this visit",
  );
  await expect(page.locator("#race-track")).toHaveAttribute(
    "data-player-kart",
    "comet",
  );
  await expect(page.locator("#start-race")).toBeEnabled();
  await page.reload();
  await expect(page.getByRole("radio", { name: /^Volt Kart/ })).toBeChecked();
});
