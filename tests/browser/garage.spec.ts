import { expect, test } from "@playwright/test";

test("selects each starter, switches appearance in a paused race and remembers it", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/race");
  const track = page.locator("#race-track");
  await expect(track).toHaveAttribute("data-ready", "true", { timeout: 12000 });
  const canvas = await track.locator("canvas").elementHandle();
  for (const id of [
    "neon-fox",
    "apex-nova",
    "volt-rival",
    "volt-kart",
    "comet",
  ]) {
    await page.locator(`input[name="player-kart"][value="${id}"]`).check();
    await page.clock.runFor(50);
    await expect(track).toHaveAttribute("data-player-kart", id);
    const models = (await track.getAttribute("data-lineup"))!.split(",");
    expect(models[0]).toBe(id);
    expect(new Set(models).size).toBe(5);
    expect(await canvas!.evaluate((el) => el.isConnected)).toBe(true);
  }
  await page.locator("#start-race").click();
  await page.clock.fastForward(3000);
  await expect(page.locator("#race-state")).toHaveText("Racing");
  await expect(
    page.locator('input[name="player-kart"]').first(),
  ).toBeDisabled();
  await page.locator("#race-input").pressSequentially("Every");
  await page.locator("#pause-race").click();
  const time = await page.locator("#race-time").textContent();
  const standings = await page.locator("#race-standings").textContent();
  await page.getByRole("radio", { name: /^Apex Nova/ }).check();
  await page.clock.runFor(200);
  await expect(track).toHaveAttribute("data-player-kart", "apex-nova");
  await expect(page.locator("#race-input")).toHaveValue("Every");
  await expect(page.locator("#race-time")).toHaveText(time!);
  await expect(page.locator("#race-standings")).toHaveText(standings!);
  await expect(page.locator("#race-state")).toHaveText("Paused");
  await page.locator("#start-race").click();
  await page.clock.fastForward(3000);
  await expect(page.locator("#race-input")).toHaveValue("Every");
  await page.locator("#pause-race").click();
  await page.locator("#retry-race").click();
  await expect(page.locator("#race-input")).toHaveValue("");
  await expect(track).toHaveAttribute("data-player-kart", "apex-nova");
  await page.getByRole("link", { name: "The hub", exact: true }).click();
  await expect(page.locator(".garage-kart")).toHaveAttribute(
    "src",
    /apex-nova.webp$/,
  );
  await expect(page.locator(".audio-controls")).toHaveCount(0);
  await page.reload();
  await page.getByRole("link", { name: "Race", exact: true }).click();
  await expect(track).toHaveAttribute("data-player-kart", "apex-nova", {
    timeout: 12000,
  });
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
  await page.getByRole("link", { name: "Race", exact: true }).click();
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
