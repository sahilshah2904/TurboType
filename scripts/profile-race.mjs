// Isolated renderer/core profile against the local Vite dev server, not a device certification.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const base = process.argv[2] ?? "http://127.0.0.1:5173/TurboType/";
const html = await fetch(base).then((response) => response.text());
const entry = html.match(/src="([^"]*\/src\/main\.ts[^"]*)"/);
if (!entry)
  throw Error(
    "This profiler requires the Vite dev server, not a production preview.",
  );
const moduleBase = new URL("./", new URL(entry[1], base)).href;
const output = "Reference_Images/analysis/phase5";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const profiles = [
  { name: "high-1x", quality: "high", reduced: false, throttle: 1 },
  { name: "low-1x", quality: "low", reduced: false, throttle: 1 },
  { name: "low-4x-cpu", quality: "low", reduced: false, throttle: 4 },
  { name: "reduced-1x", quality: "low", reduced: true, throttle: 1 },
];
const results = [];
try {
  for (const profile of profiles) {
    const page = await browser.newPage({
      viewport: { width: 1100, height: 700 },
    });
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setCPUThrottlingRate", {
      rate: profile.throttle,
    });
    await page.route("**/profile-harness", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><html><head><style>body{margin:0;background:#07121f}#track{position:relative;width:1000px;aspect-ratio:1000/450}canvas{position:absolute;inset:0}</style></head><body><div id='track'></div></body></html>",
      }),
    );
    await page.goto(new URL("profile-harness", base).href);
    const result = await page.evaluate(
      async ({ moduleBase, profile }) => {
        // Vite compiles these original TypeScript modules; no second app/canvas is running.
        const { SoloRace } = await import(
          new URL("core/solo-race.ts", moduleBase).href
        );
        const { mountRaceTrack } = await import(
          new URL("game/race-track.ts", moduleBase).href
        );
        let elapsed = 0;
        const race = new SoloRace({
          passage: "a".repeat(1000),
          tier: "hard",
          seed: 42,
          now: () => elapsed,
        });
        const parent = document.querySelector("#track");
        let resolveReady, rejectReady;
        const ready = new Promise((resolve, reject) => {
          resolveReady = resolve;
          rejectReady = reject;
        });
        let started = 0;
        let typed = 0;
        const dispose = await mountRaceTrack(parent, {
          read: () => {
            if (started) {
              elapsed = 3000 + performance.now() - started;
              const count = Math.min(999, Math.floor((elapsed - 3000) / 120));
              if (count > typed) {
                race.typing.insert("a".repeat(count - typed));
                typed = count;
              }
            }
            return race.snapshot();
          },
          effects: () => profile.quality,
          reducedMotion: () => profile.reduced,
          onReady: () => resolveReady(),
          onError: () => rejectReady(Error("Renderer failed during profile")),
        });
        await Promise.race([
          ready,
          new Promise((_, reject) =>
            setTimeout(() => reject(Error("Profile artwork timeout")), 12000),
          ),
        ]);
        race.start();
        elapsed = 3000;
        started = performance.now();
        const intervals = [];
        let previous = performance.now();
        let maxParticles = 0;
        await new Promise((resolve) => {
          function frame(now) {
            intervals.push(now - previous);
            previous = now;
            maxParticles = Math.max(
              maxParticles,
              Number(parent.dataset.particles ?? 0),
            );
            if (now - started < 8000) requestAnimationFrame(frame);
            else resolve();
          }
          requestAnimationFrame(frame);
        });
        const sorted = intervals.slice(1).sort((a, b) => a - b);
        const percentile = (p) =>
          sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
        const result = {
          name: profile.name,
          samples: sorted.length,
          medianMs: percentile(0.5),
          p95Ms: percentile(0.95),
          p99Ms: percentile(0.99),
          maxParticles,
          nitroBursts: race.snapshot().player.nitroBursts,
        };
        dispose();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        result.canvasesAfterDispose =
          document.querySelectorAll("canvas").length;
        return result;
      },
      { moduleBase, profile },
    );
    results.push(result);
    console.log(JSON.stringify(result));
    await page.close();
  }
  writeFileSync(
    `${output}/renderer-profile.json`,
    JSON.stringify(
      {
        browser: browser.version(),
        renderer: "Headless Chromium / SwiftShader",
        viewport: "1100x700; 1000x450 scene",
        scope:
          "Isolated scene and core; no app HUD, DOM typing latency, audio or physical GPU certification",
        results,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
