import { expect, test } from "@playwright/test";

test("loads the real track asset at the project path without overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./#/hub");
  await expect(
    page.getByRole("heading", { name: "YOUR WORDS. FULL THROTTLE." }),
  ).toBeVisible();
  await expect(page.locator("#track-preview")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await expect(page.locator("#track-preview canvas")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("keyboard check supports editing, composition diagnostics and reset", async ({
  page,
}) => {
  await page.goto("./#/keyboard");
  const input = page.getByRole("textbox", { name: "Your text" });
  await input.pressSequentially("the q");
  await expect(page.locator("#input-status")).toContainText("5 characters");
  await input.press("Backspace");
  await expect(input).toHaveValue("the ");
  await input.dispatchEvent("compositionstart");
  await expect(page.locator("#composition")).toHaveText("Composing");
  await input.dispatchEvent("compositionend");
  await expect(page.locator("#composition")).toHaveText("Committed");
  await page.getByRole("button", { name: "Clear text" }).click();
  await input.pressSequentially((await page.locator("#sample").textContent())!);
  await expect(page.locator("#input-status")).toContainText("Sample matches");
  await page.getByRole("button", { name: "Clear text" }).click();
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("saved motion/text preferences survive reload and scene navigation cleans up", async ({
  page,
}) => {
  await page.goto("./#/settings");
  await page.getByLabel("Motion", { exact: true }).selectOption("reduced");
  await page.getByLabel("Track effects").selectOption("low");
  await page.getByLabel("Larger typing text").check();
  await page.reload();
  await expect(page.getByLabel("Motion", { exact: true })).toHaveValue(
    "reduced",
  );
  await expect(page.locator("html")).toHaveAttribute("data-text-size", "large");
  for (let i = 0; i < 3; i++) {
    await page.getByRole("link", { name: "The hub", exact: true }).click();
    await expect(page.locator("#track-preview")).toHaveAttribute(
      "data-ready",
      "true",
    );
    await expect(page.locator("canvas")).toHaveCount(1);
    await page
      .getByRole("link", { name: "Keyboard check", exact: true })
      .click();
    await expect(page.locator("canvas")).toHaveCount(0);
  }
});

test("unknown hash recovers and laptop window resize preserves text", async ({
  page,
}) => {
  await page.goto("./#/unknown");
  await expect(
    page.getByRole("heading", { name: "YOUR WORDS. FULL THROTTLE." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Keyboard check", exact: true }).click();
  await page.getByRole("textbox").pressSequentially("the");
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.getByRole("textbox")).toHaveValue("the");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("failed artwork offers retry while other screens remain usable", async ({
  page,
}) => {
  await page.route("**/assets/karts/parts/volt-kart-body.webp", (route) =>
    route.abort(),
  );
  await page.goto("./#/hub");
  await expect(page.locator("#track-status")).toContainText(
    "artwork could not load",
  );
  await expect(
    page.getByRole("button", { name: "Retry preview" }),
  ).toBeVisible();
  await page.unroute("**/assets/karts/parts/volt-kart-body.webp");
  await page.getByRole("button", { name: "Retry preview" }).click();
  await expect(page.locator("#track-preview")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await expect(page.locator("canvas")).toHaveCount(1);
});

test("denied local storage applies preferences without claiming they were saved", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage denied");
      },
    });
  });
  await page.goto("./#/settings");
  await page.getByLabel("Motion", { exact: true }).selectOption("reduced");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("#save-status")).toContainText(
    "Browser storage is unavailable",
  );
});
