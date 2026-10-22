import { test, expect, type Page } from "@playwright/test";
async function lessonGo(page: Page) {
  await page
    .getByRole("button", { name: /^(Start lesson|Start sample)$/ })
    .click();
  await page.clock.fastForward(3000);
  await expect(page.locator("#lesson-state")).toHaveText(
    "GO · type the passage",
  );
}
test("first entry loads real essentials, welcomes once and remembers the returning shortcut", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-route", "intro");
  await page.getByRole("button", { name: "Enter TurboType" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-route", "welcome", {
    timeout: 12000,
  });
  await page.getByLabel("Go straight to the hub next time").check();
  await page.getByRole("link", { name: "Show me how to play" }).click();
  await expect(
    page.getByRole("heading", { name: "Correct the latest mistake" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to hub", exact: true }).click();
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-route", "hub");
});

test("returning visitors can replay the opening without repeating welcome", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "turbotype:onboarding:v1",
      JSON.stringify({
        schemaVersion: 1,
        welcomeSeen: true,
        tutorialComplete: false,
        skipIntro: true,
        preferredPace: "easy",
        calibration: null,
      }),
    ),
  );
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-route", "hub");
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByLabel("Skip opening next time")).toBeChecked();
  await page.getByRole("link", { name: "Replay opening" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-route", "intro");
  await page.getByRole("button", { name: "Enter TurboType" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-route", "hub", {
    timeout: 12000,
  });
});

test("skipping optional panels still waits for required assets", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(
    "**/assets/karts/parts/volt-kart-wheel.webp",
    async (route) => {
      await gate;
      await route.continue();
    },
  );
  await page.goto("./");
  await page.getByRole("button", { name: "Skip opening" }).click();
  await expect(page.locator("#entrance-loading")).toBeVisible();
  await expect(page.locator(".entrance-art")).toBeHidden();
  await expect(page.locator("html")).toHaveAttribute("data-route", "intro");
  expect(
    Number(await page.locator("#entrance-progress").getAttribute("value")),
  ).toBeLessThan(5);
  release();
  await expect(page.locator("html")).toHaveAttribute("data-route", "hub", {
    timeout: 12000,
  });
});
test("failed entrance artwork supports retry and text help recovery", async ({
  page,
}) => {
  await page.route("**/assets/karts/parts/volt-kart-body.webp", (route) =>
    route.abort(),
  );
  await page.goto("./");
  await page.getByRole("button", { name: "Enter TurboType" }).click();
  await expect(page.locator("#entrance-error")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Retry loading" }),
  ).toBeFocused();
  await page.unroute("**/assets/karts/parts/volt-kart-body.webp");
  await page.getByRole("button", { name: "Retry loading" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-route", "welcome", {
    timeout: 12000,
  });
  await page.goto("./#/intro");
  await page.route("**/assets/karts/parts/volt-kart-body.webp", (route) =>
    route.abort(),
  );
  await page.getByRole("button", { name: "Enter TurboType" }).click();
  await expect(page.locator("#entrance-error")).toBeVisible();
  await page.getByRole("link", { name: "Read the rules", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-route", "rules");
});
test("tutorial teaches native correction and real clean streaks before recording completion", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/tutorial");
  let input = page.getByRole("textbox", { name: "Your typing" });
  await page.getByRole("button", { name: "Start lesson" }).click();
  await input.pressSequentially("early");
  await expect(input).toHaveValue("");
  await page.clock.fastForward(3000);
  await input.pressSequentially("Go");
  await page.getByRole("button", { name: "Next lesson" }).click();
  await lessonGo(page);
  await input.pressSequentially("cat");
  await expect(page.locator("#lesson-result-copy")).toContainText(
    "one deliberate wrong character",
  );
  await expect(page.getByRole("button", { name: "Next lesson" })).toBeHidden();
  await page.getByRole("button", { name: "Retry lesson" }).click();
  await lessonGo(page);
  await input.pressSequentially("cx");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await input.press("Backspace");
  await input.pressSequentially("at");
  await expect(page.locator("#lesson-result-copy")).toContainText("75.0%");
  await page.getByRole("button", { name: "Next lesson" }).click();
  await lessonGo(page);
  await input.pressSequentially("Keep a steady clean rhythm.");
  await expect(page.locator("#tutorial-finish")).toBeVisible();
  await expect(page.locator("#lesson-streak")).toContainText("1 burst");
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("turbotype:onboarding:v1")!)
          .tutorialComplete,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Finish & open hub" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-route", "hub");
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.locator("#opening-save-status")).toContainText(
    "Tutorial completed",
  );
});
test("calibration uses measured active time, supports manual choice and opens ready setup", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/calibration");
  await lessonGo(page);
  const prefix = (await page.locator("#race-passage").innerText()).slice(0, 90);
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially(prefix);
  await page.clock.fastForward(30000);
  await expect(page.locator("#lesson-result-copy")).toContainText(
    "36.0 average WPM",
  );
  await expect(page.locator("#calibration-pace")).toHaveValue("medium");
  await page.getByRole("button", { name: "Use this pace" }).click();
  await page.getByRole("link", { name: "Skip & open Quick Race" }).click();
  await expect(page.getByLabel("Opponent pace")).toHaveValue("medium");
  await expect(page.locator(".race-advanced")).not.toHaveAttribute("open");
  await page.getByText("Advanced / Replay", { exact: true }).click();
  await expect(page.getByLabel("Race seed", { exact: true })).toBeVisible();
});
test("manual pace does not alter a paused race and is applied on retry", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("./#/race");
  await expect(page.locator('#race-track[data-ready="true"]')).toBeVisible({
    timeout: 12000,
  });
  await page.getByRole("button", { name: /^Start race/ }).click();
  await page.clock.fastForward(4000);
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially("Every");
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("link", { name: "Recalibrate pace" }).click();
  await page.getByLabel("Choose opponent pace").selectOption("hard");
  await page.getByRole("button", { name: "Use this pace" }).click();
  await expect(page.locator("#learning-save-status")).toContainText(
    "existing race is unchanged",
  );
  await page.getByRole("link", { name: "Race", exact: true }).click();
  await expect(page.locator("#race-state")).toHaveText("Paused");
  await expect(page.getByRole("textbox", { name: "Your typing" })).toHaveValue(
    "Every",
  );
  await expect(page.getByLabel("Opponent pace")).toHaveValue("easy");
  await page.getByRole("button", { name: "Retry same race" }).click();
  await expect(page.getByLabel("Opponent pace")).toHaveValue("hard");
});
test("new learning routes preserve readable layouts, reduced motion and optional storage", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  for (const width of [1024, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "intro",
      "welcome",
      "rules",
      "tutorial",
      "calibration",
    ]) {
      await page.goto(`./#/${route}`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator("#app-fullscreen")).toBeInViewport();
      expect(
        await page
          .locator("h1")
          .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      ).toBeGreaterThanOrEqual(36);
      if (route === "intro")
        expect(
          await page
            .locator(".intro-emblem")
            .first()
            .evaluate((el) => getComputedStyle(el).animationName),
        ).toBe("none");
    }
  }
  await page.goto("./#/welcome");
  await page.getByLabel("Go straight to the hub next time").check();
  await expect(page.locator("#welcome-save-status")).toContainText(
    "storage is unavailable",
  );
});

test("a failed application download keeps a real reload action available", async ({
  page,
}) => {
  await page.route("**/assets/index-*.js", (route) => route.abort());
  await page.goto("./");
  await expect(page.locator("#boot-status")).toContainText(
    "could not download",
  );
  await expect(
    page.getByRole("button", { name: "Reload TurboType" }),
  ).toBeVisible();
  await page.unroute("**/assets/index-*.js");
  await page.getByRole("button", { name: "Reload TurboType" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-route", "intro");
});

test("leaving a loading entrance cancels stale navigation", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(
    "**/assets/karts/parts/volt-kart-wheel.webp",
    async (route) => {
      await gate;
      await route.continue();
    },
  );
  await page.goto("./");
  await page.getByRole("button", { name: "Enter TurboType" }).click();
  await expect(page.locator("#entrance-loading")).toBeVisible();
  await page.evaluate(() => {
    location.hash = "#/keyboard";
  });
  release();
  await expect(page.locator("html")).toHaveAttribute("data-route", "keyboard");
  await page.getByRole("textbox", { name: "Your text" }).fill("Still here");
  await expect(page.getByRole("textbox", { name: "Your text" })).toHaveValue(
    "Still here",
  );
});

test("active lessons keep typing and pause controls in view on a small laptop with larger text", async ({
  page,
}) => {
  await page.clock.install();
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("./#/settings");
  await page.getByLabel("Larger typing text", { exact: true }).check();
  await page.getByRole("link", { name: "Replay tutorial" }).click();
  await lessonGo(page);
  await expect(
    page.getByRole("textbox", { name: "Your typing" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Pause lesson" }),
  ).toBeInViewport();
  await page.getByRole("textbox", { name: "Your typing" }).press("Escape");
  await expect(page.locator("#lesson-state")).toContainText("Paused");
  await page.getByRole("link", { name: "The hub", exact: true }).click();
  await expect(page.locator("main")).not.toHaveClass(/learning-active/);
});

test("opening plays a full-window 5.6-second title reveal and reduced motion skips the wait", async ({
  page,
}) => {
  const start = new Date("2026-10-22T12:00:00Z");
  await page.clock.install({ time: start });
  await page.clock.pauseAt(new Date(start.getTime() + 1000));
  await page.goto("./#/intro");
  await expect(page.locator(".entrance-screen")).toHaveAttribute(
    "data-cinema",
    "playing",
  );
  await expect(
    page.getByRole("heading", { name: "TurboType", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".topbar")).toBeHidden();
  await expect(page.locator("#enter-turbotype")).toBeHidden();
  const bounds = await page.locator(".entrance-screen").boundingBox();
  const viewport = page.viewportSize()!;
  expect(bounds?.width).toBe(viewport.width);
  expect(bounds?.height).toBe(viewport.height);
  await page.clock.runFor(5000);
  await expect(page.locator("#enter-turbotype")).toBeHidden();
  await page.clock.runFor(700);
  await expect(
    page.getByRole("button", { name: "Enter TurboType" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Skip opening" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-route", "hub", {
    timeout: 12000,
  });
  await expect(page.locator("#track-preview")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 12000 },
  );
  await expect(page.locator("#track-status")).toBeEmpty();
  await expect(page.getByText("TRACK PREVIEW", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  for (const name of ["How to play", "Replay tutorial", "Recalibrate pace"]) {
    await expect(
      page
        .locator(".opening-settings .setting-row")
        .filter({ has: page.getByRole("link", { name, exact: true }) }),
    ).toBeVisible();
  }
  await page.getByLabel("Motion", { exact: true }).selectOption("reduced");
  await page.getByRole("link", { name: "Replay opening", exact: true }).click();
  await expect(page.locator("#enter-turbotype")).toBeVisible();
  const animations = await page
    .locator(".entrance-screen")
    .evaluate((el) => el.getAnimations({ subtree: true }).length);
  expect(animations).toBe(0);
});

test("purple opening car brakes, burns out, rolls back and reveals the flaming title on launch", async ({
  page,
}) => {
  await page.goto("./#/intro");
  await expect(page.locator(".entrance-screen")).toHaveAttribute(
    "data-cinema",
    "playing",
  );
  const sample = (ms: number) =>
    page.locator(".entrance-screen").evaluate((screen, time) => {
      for (const animation of screen.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = time;
      }
      const car = screen.querySelector<HTMLElement>(".intro-car")!;
      const bounds = car.getBoundingClientRect();
      return {
        x: bounds.x + bounds.width / 2,
        wheel: getComputedStyle(screen.querySelector(".intro-wheel img")!)
          .transform,
        title: Number(getComputedStyle(screen.querySelector("h1")!).opacity),
        trail: Number(
          getComputedStyle(screen.querySelector(".intro-track-fire")!).opacity,
        ),
        fire: Number(
          getComputedStyle(screen.querySelector(".intro-logo-fire")!).opacity,
        ),
      };
    }, ms);
  const width = page.viewportSize()!.width;
  expect((await sample(0)).x).toBeLessThan(0);
  const halt = await sample(1600),
    rev = await sample(2100);
  expect(halt.x).toBeCloseTo(width / 2, 0);
  expect(rev.x).toBeCloseTo(halt.x, 0);
  expect(rev.wheel).not.toBe(halt.wheel);
  expect(rev.trail).toBeGreaterThan(0.9);
  expect(rev.title).toBe(0);
  expect((await sample(3100)).x).toBeLessThan(halt.x - width * 0.05);
  expect((await sample(4300)).x).toBeGreaterThan(width);
  const reveal = await sample(5100);
  expect(reveal.title).toBe(1);
  expect(reveal.fire).toBeGreaterThan(0.8);
  await expect(page.locator(".intro-car-body")).toHaveAttribute(
    "src",
    /volt-rival-body/,
  );
});

test("missing purple opening artwork offers a static title without blocking the game", async ({
  page,
}) => {
  await page.route("**/assets/karts/parts/volt-rival-body.webp", (route) =>
    route.abort(),
  );
  await page.goto("./#/intro");
  await expect(page.locator(".entrance-screen")).toHaveAttribute(
    "data-cinema",
    "still",
  );
  await expect(page.locator("#intro-cinema-status")).toContainText(
    "could not load",
  );
  await expect(page.locator(".intro-driving-scene")).toBeHidden();
  await expect(page.locator("#enter-turbotype")).toBeVisible();
  await page.getByRole("button", { name: "Enter TurboType" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-route", "welcome", {
    timeout: 12000,
  });
});
