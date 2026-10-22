// Interactive physical-keyboard follow-up. No automated typing or key contents recorded.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { platform, release, cpus } from "node:os";
const durationMs = Number(process.env.TT_MANUAL_MS ?? 120000);
const base = process.argv[2] ?? "http://127.0.0.1:5173/TurboType/";
const output =
  process.env.TT_MANUAL_OUTPUT ?? "Reference_Images/analysis/alpha14/manual";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: false });
try {
  const cdp = await browser.newBrowserCDPSession();
  const gpu = await cdp.send("SystemInfo.getInfo");
  if (
    gpu.gpu.featureStatus.gpu_compositing !== "enabled" ||
    /swiftshader|basic render/i.test(gpu.gpu.auxAttributes.glRenderer ?? "")
  )
    throw new Error("Hardware acceleration is required; no fallback pass");
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await context.addInitScript(() => {
    window.manualTypingProbe = {
      keys: 0,
      inputs: 0,
      frameWaitMs: [],
      route: "",
      state: "",
    };
    addEventListener(
      "keydown",
      (event) => {
        if (
          !event.isTrusted ||
          !(event.target instanceof HTMLTextAreaElement) ||
          document.querySelector("#race-state")?.textContent !== "Racing"
        )
          return;
        const now = performance.now();
        window.manualTypingProbe.keys++;
        requestAnimationFrame(() =>
          window.manualTypingProbe.frameWaitMs.push(performance.now() - now),
        );
      },
      true,
    );
    addEventListener(
      "input",
      (event) => {
        if (event.isTrusted && event.target instanceof HTMLTextAreaElement)
          window.manualTypingProbe.inputs++;
      },
      true,
    );
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}#/race`);
  await page
    .locator('#race-track[data-ready="true"]')
    .waitFor({ timeout: 20000 });
  console.log(
    `Type normally in this test browser for ${durationMs / 1000} seconds. Start races yourself. Try a mistake/Backspace, pause/resume and retry; use Settings for Low/Reduced and audio. Keep the browser open. No typed characters are recorded. A separate test profile is used.`,
  );
  const end = Date.now() + durationMs;
  const samples = [];
  while (Date.now() < end) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (page.isClosed())
      throw new Error("Session closed early; no completed evidence recorded");
    samples.push(
      await page.evaluate(() => {
        const probe = structuredClone(window.manualTypingProbe);
        window.manualTypingProbe.keys = 0;
        window.manualTypingProbe.inputs = 0;
        window.manualTypingProbe.frameWaitMs = [];
        return {
          ...probe,
          route: location.hash,
          state: document.querySelector("#race-state")?.textContent ?? "",
          canvases: document.querySelectorAll("canvas").length,
        };
      }),
    );
  }
  const keys = samples.reduce((sum, s) => sum + s.keys, 0);
  const intervals = samples.flatMap((s) => s.frameWaitMs).sort((a, b) => a - b);
  const percentile = (fraction) =>
    intervals[
      Math.min(intervals.length - 1, Math.floor(intervals.length * fraction))
    ] ?? null;
  const result = {
    recordedAt: new Date().toISOString(),
    browser: browser.version(),
    platform: platform(),
    osRelease: release(),
    cpu: cpus()[0]?.model,
    gpu,
    durationMs,
    trustedRaceKeys: keys,
    trustedInputs: samples.reduce((sum, s) => sum + s.inputs, 0),
    keyHandlerToNextRafMs: {
      median: percentile(0.5),
      p95: percentile(0.95),
      max: intervals.at(-1) ?? null,
    },
    errors,
    samples,
    sufficientInput: keys >= 20,
    scope:
      "Interactive human session with no typing automation. Handler-to-next-rAF timing is not OS-to-photon latency or GPU presentation certification. User smoothness/audio report remains separate.",
  };
  writeFileSync(`${output}/session.json`, JSON.stringify(result, null, 2));
  console.log(
    JSON.stringify({
      output: `${output}/session.json`,
      trustedRaceKeys: keys,
      sufficientInput: result.sufficientInput,
      errors,
    }),
  );
  if (keys < 20) process.exitCode = 1;
} finally {
  await browser.close();
}
