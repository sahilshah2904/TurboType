// Reproducible export of committed wheel-free PNG bodies and editable SVG wheels.
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { KART_FLEET } from "../src/game/kart-fleet.ts";
const folder = "assets-source/karts/parts";
const output = "public/assets/karts/parts";
mkdirSync(folder, { recursive: true });
mkdirSync(output, { recursive: true });
const models = [
  ["volt-kart", "#d6dce2", "#ff7254", 7],
  ["neon-fox", "#ffae35", "#ffc354", 6],
  ["apex-nova", "#c9d9ef", "#628fff", 10],
  ["comet", "#e4dce3", "#ed539e", 9],
  ["volt-rival", "#af79ef", "#a58aff", 5],
];
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const [id, metal, accent, count] of models) {
    const spokes = Array.from(
      { length: count },
      (_, i) =>
        `<g transform="rotate(${(i * 360) / count} 64 64)"><path d="M59 57 L55 23 Q59 20 64 21 L68 56Z" fill="url(#alloy)" stroke="#171c25" stroke-width="1.4"/><circle cx="64" cy="54" r="1.5" fill="#f0f4fa"/></g>`,
    ).join("");
    const tread = Array.from(
      { length: 28 },
      (_, i) =>
        `<path transform="rotate(${(i * 360) / 28} 64 64)" d="M60 4 L55 12 M68 4 L73 12" stroke="#41454c" stroke-width="1.4"/>`,
    ).join("");
    const vents = Array.from(
      { length: 18 },
      (_, i) =>
        `<circle transform="rotate(${i * 20} 64 64)" cx="64" cy="32" r="1.3" fill="#171b21"/>`,
    ).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><radialGradient id="rubber"><stop offset=".64" stop-color="#12151b"/><stop offset=".83" stop-color="#373b43"/><stop offset=".94" stop-color="#1a1d24"/><stop offset="1" stop-color="#090c10"/></radialGradient><linearGradient id="alloy" x2=".8" y2="1"><stop stop-color="#f6f9fc"/><stop offset=".4" stop-color="${metal}"/><stop offset=".65" stop-color="#454b58"/><stop offset="1" stop-color="${metal}"/></linearGradient></defs><circle cx="64" cy="64" r="63" fill="url(#rubber)" stroke="#07090d"/>${tread}<circle cx="64" cy="64" r="47" fill="#0e131a" stroke="${metal}" stroke-width="3"/><circle cx="64" cy="64" r="39" fill="#73757c" stroke="#2b303a" stroke-width="2"/>${vents}<circle cx="64" cy="64" r="43" fill="none" stroke="${accent}" stroke-width="1.4"/>${spokes}<circle cx="64" cy="64" r="12" fill="url(#alloy)" stroke="#141922" stroke-width="2"/><circle cx="64" cy="64" r="6" fill="${accent}" stroke="#e1e6f0"/><circle cx="64" cy="64" r="52" fill="none" stroke="#535763" stroke-opacity=".45"/></svg>`;
    writeFileSync(`${folder}/${id}-wheel.svg`, svg);
    for (const part of ["body", "wheel"]) {
      const source =
        part === "body"
          ? readFileSync(`${folder}/${id}-body.png`).toString("base64")
          : Buffer.from(svg).toString("base64");
      const encoded = await page.evaluate(
        async ({ source, part }) => {
          const image = new Image();
          image.src = `data:${part === "body" ? "image/png" : "image/svg+xml"};base64,${source}`;
          await image.decode();
          const canvas = document.createElement("canvas");
          canvas.width = part === "body" ? 800 : 128;
          canvas.height = part === "body" ? 400 : 128;
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/webp", 0.9).split(",")[1];
        },
        { source, part },
      );
      const bytes = Buffer.from(encoded, "base64");
      writeFileSync(`${output}/${id}-${part}.webp`, bytes);
      console.log(`${id}-${part}: ${bytes.length} bytes`);
    }
    const kart = KART_FLEET.find((kart) => kart.id === id);
    const preview = await page.evaluate(
      async ({ body, wheel, kart }) => {
        const images = await Promise.all(
          [body, wheel].map(async (source) => {
            const image = new Image();
            image.src = `data:image/webp;base64,${source}`;
            await image.decode();
            return image;
          }),
        );
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        ctx.scale(4, 4);
        ctx.drawImage(images[0], 0, kart.bodyY, 200, 100);
        for (const [x, y, radius] of kart.wheels)
          ctx.drawImage(
            images[1],
            100 + x - radius * 0.93,
            50 + y - radius,
            radius * 2 * 0.93,
            radius * 2,
          );
        return canvas.toDataURL("image/webp", 0.9).split(",")[1];
      },
      {
        body: readFileSync(`${output}/${id}-body.webp`).toString("base64"),
        wheel: readFileSync(`${output}/${id}-wheel.webp`).toString("base64"),
        kart,
      },
    );
    writeFileSync(
      `${output}/${id}-preview.webp`,
      Buffer.from(preview, "base64"),
    );
  }
} finally {
  await browser.close();
}
