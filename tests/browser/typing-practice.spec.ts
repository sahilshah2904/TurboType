import { expect, test, type Page } from "@playwright/test";

const SAMPLE = "Every great run starts with a single keystroke.";
async function openPractice(page: Page): Promise<void> {
  await page.clock.install();
  await page.goto("./#/practice");
}
async function go(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Start run" }).click();
  await page.clock.fastForward(3000);
  await expect(page.locator("#run-state")).toHaveText("Racing");
}

test("countdown ignores early keys, errors block progress and corrected completion freezes results", async ({
  page,
}) => {
  await openPractice(page);
  const input = page.getByRole("textbox", { name: "Your typing" });
  await page.getByRole("button", { name: "Start run" }).click();
  await input.pressSequentially("Early");
  await expect(input).toHaveValue("");
  await page.clock.fastForward(3000);
  await input.pressSequentially("Exz");
  await expect(input).toHaveValue("Ex");
  await expect(page.locator("#error-summary")).toHaveText(
    "2 errors · 0 corrected",
  );
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await input.press("Backspace");
  await input.pressSequentially("very");
  await expect(input).toHaveValue("Every");
  await page.clock.fastForward(6000);
  await input.pressSequentially(SAMPLE.slice(5));
  await expect(page.locator("#run-state")).toHaveText("Finished");
  await expect(page.locator("#progress-label")).toHaveText("100%");
  await expect(page.locator("#error-summary")).toHaveText(
    "2 errors · 1 corrected",
  );
  const elapsed = await page.locator("#metric-elapsed").textContent();
  await page.clock.fastForward(10000);
  await expect(page.locator("#metric-elapsed")).toHaveText(elapsed!);
  await expect(page.locator("#run-results")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("pause, screen navigation and resume preserve text but exclude paused duration", async ({
  page,
}) => {
  await openPractice(page);
  await go(page);
  const input = page.getByRole("textbox", { name: "Your typing" });
  await page.clock.fastForward(1000);
  await input.pressSequentially("Every");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.locator("#run-state")).toHaveText("Paused");
  const elapsed = await page.locator("#metric-elapsed").textContent();
  await page.clock.fastForward(30000);
  await expect(page.locator("#metric-elapsed")).toHaveText(elapsed!);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("link", { name: "Practice", exact: true }).click();
  await expect(input).toHaveValue("Every");
  await expect(page.locator("#run-state")).toHaveText("Paused");
  await page.getByRole("button", { name: "Resume run" }).click();
  await page.clock.fastForward(3000);
  await input.pressSequentially(" great");
  await expect(input).toHaveValue("Every great");
  await expect(page.locator("#run-eligibility")).toContainText("paused");
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(input).toHaveValue("");
  await expect(page.locator("#run-state")).toHaveText("Ready");
});

test("replacement and bulk insertion cannot advance the run even without cancelable beforeinput", async ({
  page,
}) => {
  await openPractice(page);
  await go(page);
  const input = page.getByRole("textbox", { name: "Your typing" });
  await input.evaluate((element) => {
    const field = element as HTMLTextAreaElement;
    field.value = "Every";
    field.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertReplacementText",
        data: "Every",
      }),
    );
  });
  await expect(input).toHaveValue("");
  await expect(page.locator("#run-eligibility")).toContainText("Practice only");
  await expect(page.locator("#error-summary")).toHaveText(
    "0 errors · 0 corrected",
  );
  await input.pressSequentially("E");
  await input.evaluate((element) => {
    const field = element as HTMLTextAreaElement;
    field.value += "very";
    field.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: "very",
      }),
    );
  });
  await expect(input).toHaveValue("E");
  await input.dispatchEvent("paste");
  await expect(input).toHaveValue("E");
  await expect(page.locator("#race-notice")).toContainText(
    "Paste and drop are blocked",
  );
});

test("composition commits once and does not count a trailing final input twice", async ({
  page,
}) => {
  await openPractice(page);
  await go(page);
  const input = page.getByRole("textbox", { name: "Your typing" });
  await input.evaluate((element) => {
    const field = element as HTMLTextAreaElement;
    field.dispatchEvent(
      new CompositionEvent("compositionstart", { bubbles: true }),
    );
    field.value = "Every";
    field.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertCompositionText",
        data: "Every",
        isComposing: true,
      }),
    );
    field.dispatchEvent(
      new CompositionEvent("compositionend", { bubbles: true, data: "Every" }),
    );
    field.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: "Every",
      }),
    );
  });
  await expect(input).toHaveValue("Every");
  await expect(page.locator("#metric-accuracy")).toHaveText("100.0%");
  await expect(page.locator("#run-eligibility")).toContainText(
    "composed input",
  );
  await input.pressSequentially(SAMPLE.slice(5));
  await expect(page.locator("#run-state")).toHaveText("Finished");
  await expect(page.locator("#error-summary")).toHaveText(
    "0 errors · 0 corrected",
  );
});

test("a declared time trial expires at 60 seconds while normal practice is untimed", async ({
  page,
}) => {
  await openPractice(page);
  await page.getByLabel("Mode", { exact: true }).selectOption("time-trial");
  await go(page);
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially("E");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.locator("#race-notice")).toContainText("Paused.");
  await page.getByRole("button", { name: "Resume run" }).click();
  await expect(page.locator("#race-notice")).toHaveText(
    "Get ready. Type after GO.",
  );
  await page.clock.fastForward(3000);
  await expect(page.locator("#race-notice")).toContainText("GO.");
  await page.clock.fastForward(60000);
  await expect(page.locator("#run-state")).toHaveText("Time limit reached");
  await expect(page.locator("#race-notice")).toContainText(
    "Time limit reached. Your result is frozen",
  );
  await expect(page.locator("#metric-elapsed")).toHaveText("60.0s");
  await expect(page.getByRole("textbox")).toHaveValue("E");
});

test("window focus loss pauses the run and resize alone preserves it", async ({
  page,
}) => {
  await openPractice(page);
  await go(page);
  await page
    .getByRole("textbox", { name: "Your typing" })
    .pressSequentially("Every");
  await page.setViewportSize({ width: 640, height: 320 });
  await expect(page.locator("#run-state")).toHaveText("Racing");
  await expect(page.getByRole("textbox")).toHaveValue("Every");
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.locator("#run-state")).toHaveText("Paused");
  await expect(page.getByRole("textbox")).toHaveValue("Every");
});

test("selection edits cannot bypass append-only correction and composition canceled by pause cannot commit later", async ({
  page,
}) => {
  await openPractice(page);
  await go(page);
  const input = page.getByRole("textbox", { name: "Your typing" });
  await input.pressSequentially("E");
  await input.selectText();
  await input.pressSequentially("x");
  await expect(input).toHaveValue("E");
  await input.evaluate((element) => {
    const field = element as HTMLTextAreaElement;
    field.dispatchEvent(
      new CompositionEvent("compositionstart", { bubbles: true }),
    );
    field.value = "Every";
    field.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertCompositionText",
        isComposing: true,
      }),
    );
  });
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await input.dispatchEvent("compositionend", { data: "very" });
  await expect(input).toHaveValue("E");
  await expect(page.locator("#run-state")).toHaveText("Paused");
});
