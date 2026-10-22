// Full app measurements, intentionally sequential. No physical-GPU/typing-latency claim.
import { chromium } from "@playwright/test";
import {
  mkdirSync,
  writeFileSync,
  statSync,
  readFileSync,
  readdirSync,
  openSync,
  writeSync,
  closeSync,
} from "node:fs";
import { summarizeTrace } from "./trace-summary.mjs";
import { createHash } from "node:crypto";
import { hostname, platform, release, totalmem, cpus } from "node:os";
const hardware = process.env.TT_HARDWARE === "1";
const cycleCount = Number(process.env.TT_CYCLES ?? (hardware ? 12 : 4));
const sampleMs = Number(process.env.TT_SAMPLE_MS ?? (hardware ? 20000 : 8000));
const base = process.argv[2] ?? "http://127.0.0.1:5173/TurboType/";
const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const captureTag = version.includes("-alpha.")
  ? "alpha" + version.split("alpha.")[1]
  : "v" + version;
const output = `Reference_Images/analysis/${captureTag}/${process.env.TT_PROFILE_LABEL ?? (hardware ? "hardware" : "software")}`;
mkdirSync(output, { recursive: true });
mkdirSync(`docs/images/${captureTag}`, { recursive: true });
const browser = await chromium.launch({
  headless: !hardware,
  args: hardware
    ? []
    : ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const browserCdp = await browser.newBrowserCDPSession();
const gpuInfo = await browserCdp.send("SystemInfo.getInfo");
if (
  hardware &&
  (gpuInfo.gpu.featureStatus.gpu_compositing !== "enabled" ||
    /swiftshader|basic render/i.test(
      gpuInfo.gpu.auxAttributes.glRenderer ?? "",
    ))
) {
  await browser.close();
  throw new Error(
    "Hardware profile requires confirmed accelerated compositing and a hardware renderer",
  );
}
const profiles = [
  { name: "high", effects: "high", motion: "full", throttle: 1 },
  { name: "low", effects: "low", motion: "full", throttle: 1 },
  { name: "low-4x-cpu", effects: "low", motion: "full", throttle: 4 },
  { name: "reduced", effects: "low", motion: "reduced", throttle: 1 },
].filter(
  (p) =>
    (!hardware || p.throttle === 1) &&
    (!process.env.TT_PROFILES ||
      process.env.TT_PROFILES.split(",").includes(p.name)),
);
const results = [];
try {
  for (const profile of profiles) {
    console.log(`Profile ${profile.name}: loading app`);
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
    page.setDefaultTimeout(20000);
    page.on("close", () => console.log(`Profile ${profile.name}: page closed`));
    page.on("crash", () =>
      console.log(`Profile ${profile.name}: page crashed`),
    );
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", {
      rate: profile.throttle,
    });
    const start = Date.now();
    await page.goto(`${base}#/race`);
    try {
      await page
        .locator('#race-track[data-ready="true"]')
        .waitFor({ timeout: 20000 });
    } catch (error) {
      const diagnostic = {
        errors,
        state: await page
          .locator("body")
          .innerText()
          .catch(() => "Page unavailable"),
      };
      writeFileSync(
        `${output}/${profile.name}-readiness-failure.json`,
        JSON.stringify(diagnostic, null, 2),
      );
      await page
        .screenshot({ path: `${output}/${profile.name}-readiness-failure.png` })
        .catch(() => {});
      throw error;
    }
    const trackReadyMs = Date.now() - start;
    await page.getByRole("link", { name: "Settings", exact: true }).click();
    await page.getByText("Sound & music", { exact: true }).click();
    await page
      .getByRole("button", { name: "Enable sound", exact: true })
      .click();
    await page.waitForFunction(() => window.audioProbe.decodes.length === 2);
    console.log(`Profile ${profile.name}: audio decoded`);
    await page.getByRole("link", { name: "Race", exact: true }).click();
    await page.locator('#race-track[data-ready="true"]').waitFor();
    await cdp.send("HeapProfiler.collectGarbage");
    const heapBefore = await cdp.send("Runtime.getHeapUsage");
    await page.locator("#race-passage-select").selectOption("1");
    await page.locator("#start-race").click();
    await page.waitForFunction(
      () => document.querySelector("#race-state").textContent === "Racing",
      undefined,
      { timeout: 15000 },
    );
    console.log(`Profile ${profile.name}: sampling ${sampleMs}ms`);
    if (hardware)
      await cdp.send("Tracing.start", {
        categories:
          "toplevel,devtools.timeline,disabled-by-default-devtools.timeline.frame,benchmark,cc,gpu,input,latencyInfo",
        transferMode: "ReturnAsStream",
      });
    const frames = await page.evaluate(async (sampleMs) => {
      const intervals = [];
      const activeBeforeMs =
        parseFloat(document.querySelector("#race-time").textContent) * 1000;
      let previous = performance.now(),
        maxParticles = 0,
        count = 0;
      const started = previous;
      const input = document.querySelector("#race-input");
      const passage = document.querySelector("#race-passage").textContent;
      const timer = setInterval(
        () => {
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
        },
        Math.max(160, sampleMs / Math.max(1, passage.length - 4)),
      );
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
          if (now - started < sampleMs) requestAnimationFrame(sample);
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
        sampledWallMs: performance.now() - started,
        activeElapsedMs:
          parseFloat(document.querySelector("#race-time").textContent) * 1000 -
          activeBeforeMs,
        endedState: document.querySelector("#race-state").textContent,
        samples: sorted.length,
        medianMs: p(0.5),
        p95Ms: p(0.95),
        p99Ms: p(0.99),
        over33ms: sorted.filter((x) => x > 33.4).length,
        maxParticles,
        characters: count,
      };
    }, sampleMs);
    let traceSummary;
    if (hardware) {
      const completed = new Promise((resolve) =>
        cdp.once("Tracing.tracingComplete", resolve),
      );
      await cdp.send("Tracing.end");
      const { stream } = await completed;
      const tracePath = `${output}/${profile.name}-trace.json`;
      const file = openSync(tracePath, "w");
      try {
        for (;;) {
          const chunk = await cdp.send("IO.read", {
            handle: stream,
            size: 1048576,
          });
          writeSync(
            file,
            chunk.data,
            null,
            chunk.base64Encoded ? "base64" : "utf8",
          );
          if (chunk.eof) break;
        }
      } finally {
        closeSync(file);
        await cdp.send("IO.close", { handle: stream });
      }
      traceSummary = {
        ...(await summarizeTrace(tracePath)),
        traceFile: `${profile.name}-trace.json`,
        input:
          "Synthetic DOM InputEvents, not physical keys or trusted OS key-to-paint latency",
      };
    }
    if (profile.name === "high")
      await page.screenshot({
        path: `docs/images/${captureTag}/laptop-race.png`,
      });
    await page.locator("#pause-race").click();
    await page.locator("#retry-race").click();
    const cycles = [];
    for (let i = 0; i < cycleCount; i++) {
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
      traceSummary,
    };
    results.push(result);
    if (
      frames.endedState !== "Racing" ||
      frames.activeElapsedMs < sampleMs - 500
    ) {
      writeFileSync(
        `${output}/invalid-workload.json`,
        JSON.stringify({ version, results }, null, 2),
      );
      throw new Error(
        `Profile ${profile.name}: sampling did not remain actively racing; keep browser foreground and inspect invalid-workload.json`,
      );
    }
    writeFileSync(
      `${output}/partial-results.json`,
      JSON.stringify({ version, results }, null, 2),
    );
    console.log(
      JSON.stringify({
        profile: profile.name,
        trackReadyMs,
        frames,
        heapDelta: heapAfter.usedSize - heapBefore.usedSize,
        errors,
        traceSummary,
      }),
    );
    if (profile.name === "high") {
      await page.evaluate(() => {
        location.hash = "/hub";
      });
      await page.locator('#track-preview[data-ready="true"]').waitFor();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: `docs/images/${captureTag}/laptop-hub.png`,
        fullPage: true,
      });
    }
    await context.close();
  }
  const assetFiles = readdirSync("public/assets/karts/parts")
    .filter((file) => file.endsWith(".webp"))
    .map((file) => `parts/${file}`);
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
        version,
        hardware,
        gpuInfo,
        host: {
          hostname: hostname(),
          platform: platform(),
          release: release(),
          memoryBytes: totalmem(),
          cpu: cpus()[0]?.model,
        },
        renderer: hardware
          ? "Headed Chromium / confirmed hardware GPU; local Vite HTTP; 1440×900"
          : "Headless Chromium / SwiftShader; local Vite HTTP; 1440×900",
        scope: `Full app HUD, synthetic DOM input, renderer and decoded music; rAF callback cadence, hardware trace when requested, and CDP JS heap. No physical-key latency or total GPU-memory claim. ${cycleCount} route cycles, ${sampleMs}ms sample; one sample per quality.`,
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
