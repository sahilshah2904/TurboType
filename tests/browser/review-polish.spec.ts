import { expect, test } from "@playwright/test";

for (const width of [1024, 1920])
  test(`wrapped race lines advance to the top with three readable rows at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 1080 });
    await page.addInitScript(() => {
      localStorage.setItem(
        "turbotype:settings:v1",
        JSON.stringify({
          schemaVersion: 1,
          settings: { motion: "reduced", effects: "low", largeText: true },
        }),
      );
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
        "turbotype:campaign-map:v1",
        JSON.stringify({
          schemaVersion: 1,
          rulesVersion: 3,
          positions: { easy: null, medium: null, hard: null },
          clears,
        }),
      );
    });
    await page.clock.install();
    await page.goto("./#/level/easy/6");
    await expect(page.locator("#race-track")).toHaveAttribute(
      "data-ready",
      "true",
      { timeout: 12000 },
    );
    await page.locator("#start-race").click();
    await page.clock.fastForward(4000);
    const lines = await page.locator("#race-passage").evaluate((el) => {
      const spans = Array.from(el.children) as HTMLElement[];
      const tops = [...new Set(spans.map((s) => s.offsetTop))];
      return tops
        .slice(0, 3)
        .map((top) => spans.findIndex((s) => s.offsetTop === top));
    });
    const passage = (await page.locator("#race-passage").textContent())!;
    let typed = 0;
    for (const next of lines.slice(1)) {
      await page
        .locator("#race-input")
        .pressSequentially(passage.slice(typed, next));
      typed = next;
      const layout = await page.locator("#race-passage").evaluate((el) => {
        const current = el.querySelector<HTMLElement>(".character--current")!;
        const p = el.getBoundingClientRect();
        const line = parseFloat(getComputedStyle(el).lineHeight);
        return {
          top: current.getBoundingClientRect().top - p.top,
          height: el.clientHeight,
          line,
          scroll: el.scrollTop,
        };
      });
      expect(layout.top).toBeGreaterThanOrEqual(-1);
      expect(layout.top).toBeLessThan(12);
      expect(layout.height).toBeGreaterThanOrEqual(layout.line * 3);
      expect(layout.scroll).toBeGreaterThan(0);
    }
    await page.locator("#race-input").press("Backspace");
    const oldLine = await page.locator("#race-passage").evaluate((el) => {
      const c = el.querySelector<HTMLElement>(".character--current")!;
      return c.getBoundingClientRect().top - el.getBoundingClientRect().top;
    });
    expect(oldLine).toBeLessThan(12);
  });

test("keyboard sample covers letters, cases, numbers and symbols and blocks bulk input without certifying physical keys", async ({
  page,
}) => {
  await page.goto("./#/keyboard");
  const input = page.locator("#keyboard-input");
  const sample = (await page.locator("#sample").textContent())!;
  for (let code = 32; code <= 126; code++)
    expect(sample).toContain(String.fromCharCode(code));
  await input.fill(sample);
  await expect(input).toHaveValue("");
  await input.dispatchEvent("paste");
  await expect(input).toHaveValue("");
  await expect(page.locator(".key--tested")).toHaveCount(0);
  await page.locator("#reset-input").click();
  await input.pressSequentially("aA1!");
  await input.press("ArrowLeft");
  await input.press("Backspace");
  await expect(page.locator('[data-code="KeyA"]')).toHaveClass(/key--tested/);
  await expect(page.locator('[data-code="Digit1"]')).toHaveClass(/key--tested/);
  await expect(page.locator('[data-code="ArrowLeft"]')).toHaveClass(
    /key--tested/,
  );
  await expect(page.locator('[data-code="Backspace"]')).toHaveClass(
    /key--tested/,
  );
  await page.locator("#reset-keys").click();
  await expect(page.locator(".key--tested")).toHaveCount(0);
  await expect(input).toHaveValue("");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

for (const width of [1024, 1920])
  test(`opening trail stays behind the moving car and disappears before the title at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./#/intro");
    await expect(page.locator(".entrance-screen")).toHaveAttribute(
      "data-cinema",
      "playing",
    );
    const sample = (time: number) =>
      page.locator(".entrance-screen").evaluate((el, t) => {
        for (const a of el.getAnimations({ subtree: true })) {
          a.pause();
          a.currentTime = t;
        }
        const car = el.querySelector(".intro-car")!.getBoundingClientRect();
        const trail = el
          .querySelector(".intro-track-fire")!
          .getBoundingClientRect();
        return {
          car: { left: car.left, width: car.width },
          trail: { left: trail.left, right: trail.right, width: trail.width },
          opacity: Number(
            getComputedStyle(el.querySelector(".intro-track-fire")!).opacity,
          ),
          title: Number(getComputedStyle(el.querySelector("h1")!).opacity),
        };
      }, time);
    const before = await sample(0);
    expect(before.opacity).toBe(0);
    expect(before.trail.right).toBeLessThan(0);
    for (const time of [1000, 1300, 3500]) {
      const frame = await sample(time);
      expect(frame.trail.right).toBeLessThan(frame.car.left);
      expect(frame.trail.width).toBeLessThanOrEqual(421);
      expect(frame.title).toBe(0);
    }
    expect((await sample(2100)).opacity).toBe(0);
    expect((await sample(4500)).opacity).toBe(0);
    expect((await sample(5600)).title).toBe(1);
    await expect(page.locator(".intro-logo-fire--crown")).toHaveCount(0);
  });

test("Quick Race clearly identifies its standalone role", async ({ page }) => {
  await page.goto("./#/race");
  await expect(
    page.getByRole("link", { name: "Quick Race", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".race-deck-title")).toHaveText("Quick Race.");
  await expect(page.getByText(/A standalone race for warm-ups/)).toBeVisible();
});

test("keyboard mistakes block further typing until Backspace and cannot be replaced", async ({
  page,
}) => {
  await page.goto("./#/keyboard");
  const input = page.locator("#keyboard-input");
  await input.pressSequentially("txhe");
  await expect(input).toHaveValue("tx");
  await expect(page.locator("#input-status")).toContainText("Press Backspace");
  await expect(page.locator(".keyboard-character--error")).toHaveText("h");
  await expect(page.locator('[data-code="KeyH"]')).toHaveClass(/key--next/);
  await input.fill("the");
  await expect(input).toHaveValue("tx");
  await input.press("Backspace");
  await input.pressSequentially("he");
  await expect(input).toHaveValue("the");
  await expect(page.locator(".keyboard-character--error")).toHaveCount(0);
  await expect(page.locator(".keyboard-character--correct")).toHaveCount(3);
  await input.press("Backspace");
  await expect(input).toHaveValue("th");
  await page.locator("#reset-input").click();
  await expect(input).toHaveValue("");
  await input.pressSequentially("the ");
  await expect(input).toHaveValue("the ");
  await expect(page.locator('[data-code="KeyX"]')).toHaveClass(/key--tested/);
});
