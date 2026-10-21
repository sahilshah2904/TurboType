import { expect, test } from "@playwright/test";

test("all existing routes use the open world shell and preserve mobile controls", async ({
  page,
}) => {
  for (const route of ["hub", "practice", "keyboard", "settings", "race"]) {
    await page.goto(`./#/${route}`);
    await expect(page.locator("html")).toHaveAttribute("data-route", route);
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      maxWidth: getComputedStyle(document.querySelector(".app-shell")!)
        .maxWidth,
    }));
    expect(layout).toEqual({ overflow: false, maxWidth: "none" });
    if (route === "race") {
      await expect(page.locator('#race-track[data-ready="true"]')).toBeVisible({
        timeout: 12000,
      });
      await page.getByRole("button", { name: /^Start race/ }).click();
      const geometry = await page.evaluate(() => {
        const track = document
            .querySelector(".race-visual")!
            .getBoundingClientRect(),
          dial = document
            .querySelector(".speedometer")!
            .getBoundingClientRect();
        return {
          fullWidth: track.width === innerWidth,
          noOverlap: dial.top >= track.bottom - 2,
        };
      });
      expect(geometry).toEqual({ fullWidth: true, noOverlap: true });
      await page.setViewportSize({ width: 390, height: 480 });
      await expect(page.locator("html")).toHaveAttribute(
        "data-compact-viewport",
        "true",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator("#race-input")).toBeInViewport();
    }
  }
});

test("live WPM dial rises, clamps only its needle, freezes on pause and decays during idle racing", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toBeVisible({
    timeout: 12000,
  });
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await page.getByRole("button", { name: /^Start race/ }).click();
  await page.clock.fastForward(4000);
  await page.locator("#race-input").evaluate((el) => {
    const input = el as HTMLTextAreaElement;
    for (const char of "Every great run star") {
      input.value += char;
      input.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          inputType: "insertText",
          data: char,
        }),
      );
    }
  });
  const dial = page.locator(".speedometer");
  await expect(dial.locator(".dial-value")).toHaveText("240");
  expect(
    await dial.evaluate((el) =>
      (el as HTMLElement).style.getPropertyValue("--needle"),
    ),
  ).toBe("140deg");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.clock.fastForward(10000);
  await expect(dial.locator(".dial-value")).toHaveText("240");
  await page.getByRole("button", { name: "Resume race" }).click();
  await page.clock.fastForward(6500);
  await expect(dial.locator(".dial-value")).toHaveText("0");
  await expect(page.locator("#race-wpm")).not.toHaveText("0.0");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.getByRole("button", { name: "Retry same race" }).click();
  await expect(dial.locator(".dial-value")).toHaveText("0");
});
