import { expect, test } from "@playwright/test";

test("shared corner fullscreen control enters, follows navigation and exits", async ({
  page,
}) => {
  await page.goto("./#/hub");
  const button = page.locator("#app-fullscreen");
  await button.click();
  await expect(button).toHaveAccessibleName("Exit fullscreen");
  for (const route of ["practice", "keyboard", "settings", "race", "hub"]) {
    await page.evaluate((route) => {
      location.hash = `/${route}`;
    }, route);
    await expect(page.locator("html")).toHaveAttribute("data-route", route);
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-pressed", "true");
  }
  await button.click();
  await expect(button).toHaveAccessibleName("Enter fullscreen");
});

test("fullscreen refusal gives feedback without blocking normal pages", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Element.prototype.requestFullscreen = async () => {
      throw Error("Refused");
    };
  });
  await page.goto("./#/settings");
  await page
    .getByRole("button", { name: "Enter fullscreen", exact: true })
    .click();
  await expect(page.locator("#fullscreen-feedback")).toBeVisible();
  await expect(page.getByLabel("Motion", { exact: true })).toBeEnabled();
});

test("important copy and the corner control stay readable on laptop layouts", async ({
  page,
}) => {
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["hub", "practice", "keyboard", "settings", "race"]) {
      await page.goto(`./#/${route}`);
      const result = await page.evaluate(() => {
        const text = [
          ...document.querySelectorAll<HTMLElement>(
            ".help,.hero-copy,.card-copy,.setting-row p,.development-note p,#race-controls-help,#setup-help",
          ),
        ].filter((el) => el.getBoundingClientRect().height > 0);
        const button = document
          .querySelector("#app-fullscreen")!
          .getBoundingClientRect();
        const nav = document.querySelector("nav")!.getBoundingClientRect();
        return {
          small: text
            .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
            .map((el) => el.className || el.id),
          overflow: document.documentElement.scrollWidth > innerWidth,
          target:
            button.width >= 44 &&
            button.height >= 44 &&
            button.right <= innerWidth &&
            button.top >= 0,
          navClear: nav.right <= button.left - 8,
        };
      });
      expect(result).toEqual({
        small: [],
        overflow: false,
        target: true,
        navClear: true,
      });
    }
  }
});
