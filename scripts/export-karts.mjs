// Export only: preserves composition/alpha; Chromium downsamples the committed PNG masters.
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const id of ["neon-fox", "apex-nova", "comet", "volt-rival"]) {
    const source = readFileSync(`assets-source/karts/${id}.png`).toString(
      "base64",
    );
    const data = await page.evaluate(async (source) => {
      const image = new Image();
      image.src = `data:image/png;base64,${source}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(image, 0, 0, 800, 400);
      return canvas.toDataURL("image/webp", 0.88).split(",")[1];
    }, source);
    const output = Buffer.from(data, "base64");
    writeFileSync(`public/assets/karts/${id}.webp`, output);
    console.log(`${id}: ${output.length} bytes`);
  }
} finally {
  await browser.close();
}
