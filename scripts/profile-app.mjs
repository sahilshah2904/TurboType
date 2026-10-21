// Full app measurements, intentionally sequential. No physical-GPU/typing-latency claim.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync, statSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const base = process.argv[2] ?? "http://127.0.0.1:5173/TurboType/";
const output = "Reference_Images/analysis/alpha11";
mkdirSync(output, { recursive: true });
mkdirSync("docs/images/alpha11", { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const profiles = [
  { name: "high", effects: "high", motion: "full", throttle: 1 },
  { name: "low", effects: "low", motion: "full", throttle: 1 },
  { name: "low-4x-cpu", effects: "low", motion: "full", throttle: 4 },
  { name: "reduced", effects: "low", motion: "reduced", throttle: 1 },
];
const results = [];
try {
  for (const profile of profiles) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await context.addInitScript((profile) => {
      localStorage.setItem(
        "turbotype:settings:v1",
        JSON.stringify({
          schemaVersion: 1,
          settings: { ...profile, largeText: false },
        }),
      );
      const Native = window.AudioContext;
      window.audioProbe = { contexts: 0, decodes: [], liveLoops: 0 };
      window.AudioContext = class extends Native {
        constructor(...args) {
          super(...args);
          window.audioProbe.contexts++;
        }
        async decodeAudioData(buffer) {
          const start = performance.now();
          const decoded = await super.decodeAudioData(buffer);
          window.audioProbe.decodes.push({
            duration: decoded.duration,
            elapsedMs: performance.now() - start,
          });
          return decoded;
        }
        createBufferSource() {
          const source = super.createBufferSource(),
            start = source.start.bind(source),
            stop = source.stop.bind(source);
          let playing = false;
          source.start = (...args) => {
            if (source.loop) {
              playing = true;
              window.audioProbe.liveLoops++;
            }
            start(...args);
          };
          source.stop = (...args) => {
            if (playing) {
              playing = false;
              window.audioProbe.liveLoops--;
            }
            stop(...args);
          };
          return source;
        }
      };
    }, profile);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", {
      rate: profile.throttle,
    });
    const start = Date.now();
    await page.goto(`${base}#/race`);
    await page
      .locator('#race-track[data-ready="true"]')
      .waitFor({ timeout: 20000 });
    const trackReadyMs = Date.now() - start;
    await page.getByText("Sound & music", { exact: true }).click();
    await page
      .getByRole("button", { name: "Enable sound", exact: true })
      .click();
    await page.waitForFunction(() => window.audioProbe.decodes.length === 2);
    await cdp.send("HeapProfiler.collectGarbage");
    const heapBefore = await cdp.send("Runtime.getHeapUsage");
    await page.locator("#race-passage-select").selectOption("1");
    await page.locator("#start-race").click();
    await page.waitForFunction(
      () => document.querySelector("#race-state").textContent === "Racing",
    );
    const frames = await page.evaluate(async () => {
      const intervals = [];
      let previous = performance.now(),
        maxParticles = 0,
        count = 0;
      const started = previous;
      const input = document.querySelector("#race-input");
      const passage = document.querySelector("#race-passage").textContent;
      const timer = setInterval(() => {
        if (count >= passage.length - 1) return;
        const char = passage[count++];
        input.value += char;
        input.dispatchEvent(
          new InputEvent("input", {
            bubbles: true,
            inputType: "insertText",
            data: char,
          }),
        );
      }, 160);
      await new Promise((resolve) => {
        function sample(now) {
          intervals.push(now - previous);
          previous = now;
          maxParticles = Math.max(
            maxParticles,
            Number(
              document.querySelector("#race-track").dataset.particles ?? 0,
            ),
          );
          if (now - started < 8000) requestAnimationFrame(sample);
          else resolve();
        }
        requestAnimationFrame(sample);
      });
      clearInterval(timer);
      const sorted = intervals.slice(1).sort((a, b) => a - b);
      const p = (fraction) =>
        sorted[
          Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))
        ];
      return {
        samples: sorted.length,
        medianMs: p(0.5),
        p95Ms: p(0.95),
        p99Ms: p(0.99),
        over33ms: sorted.filter((x) => x > 33.4).length,
        maxParticles,
        characters: count,
      };
    });
    if (profile.name === "high")
      await page.screenshot({ path: "docs/images/alpha11/laptop-race.png" });
    await page.locator("#pause-race").click();
    await page.locator("#retry-race").click();
    const cycles = [];
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => {
        location.hash = "/settings";
      });
      await page.locator('html[data-route="settings"]').waitFor();
      cycles.push(await page.locator("canvas").count());
      await page.evaluate(() => {
        location.hash = "/race";
      });
      await page.locator('#race-track[data-ready="true"]').waitFor();
      if ((await page.locator("canvas").count()) !== 1)
        throw Error("Duplicate race canvas");
    }
    await page.evaluate(() => {
      location.hash = "/settings";
    });
    await page.locator('html[data-route="settings"]').waitFor();
    await cdp.send("HeapProfiler.collectGarbage");
    const heapAfter = await cdp.send("Runtime.getHeapUsage");
    const audio = await page.evaluate(() => window.audioProbe);
    const textures = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .filter((r) => r.name.includes("/assets/karts/"))
        .map((r) => ({
          file: r.name.split("/").at(-1),
          durationMs: r.duration,
          decodedBodyBytes: r.decodedBodySize,
          transferBytes: r.transferSize,
        })),
    );
    const result = {
      profile,
      trackReadyMs,
      frames,
      heapBefore,
      heapAfter,
      canvasesAfterLeaving: cycles,
      audio,
      textures,
      errors,
    };
    results.push(result);
    console.log(
      JSON.stringify({
        profile: profile.name,
        trackReadyMs,
        frames,
        heapDelta: heapAfter.usedSize - heapBefore.usedSize,
        errors,
      }),
    );
    if (profile.name === "high") {
      await page.evaluate(() => {
        location.hash = "/hub";
      });
      await page.locator('#track-preview[data-ready="true"]').waitFor();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: "docs/images/alpha11/laptop-hub.png",
        fullPage: true,
      });
    }
    await context.close();
  }
  const assetFiles = [
    "volt-kart.png",
    "neon-fox.webp",
    "apex-nova.webp",
    "comet.webp",
    "volt-rival.webp",
  ];
  const assets = assetFiles.map((file) => ({
    file,
    bytes: statSync(`public/assets/karts/${file}`).size,
    sha256: createHash("sha256")
      .update(readFileSync(`public/assets/karts/${file}`))
      .digest("hex"),
  }));
  writeFileSync(
    `${output}/app-profile.json`,
    JSON.stringify(
      {
        browser: browser.version(),
        version: "0.1.0-alpha.11",
        renderer: "Headless Chromium / SwiftShader; local Vite HTTP; 1440×900",
        scope:
          "Full app HUD, synthetic DOM input, renderer and decoded music; requestAnimationFrame callback cadence and CDP JS heap, not physical presentation fps, GPU memory or physical-key latency. Four route cycles; one sample per quality.",
        assets,
        results,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
