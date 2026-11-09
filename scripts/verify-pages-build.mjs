import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const dist = "dist";
const index = await readFile(join(dist, "index.html"), "utf8");
const assets = [...index.matchAll(/(?:src|href)="([^"]+)"/g)].map(
  ([, href]) => href,
);
if (
  !index.includes('http-equiv="Content-Security-Policy"') ||
  !assets.some((href) => href.endsWith(".js")) ||
  !assets.some((href) => href.endsWith(".css"))
) {
  throw new Error("Pages build is missing its content policy or entry assets.");
}
for (const href of assets.filter((href) => href.startsWith("/"))) {
  if (!href.startsWith("/TurboType/")) {
    throw new Error("Pages entry asset does not use the project base path.");
  }
  await readFile(join(dist, href.slice("/TurboType/".length)));
}
await readFile(join(dist, "privacy.html"));

const files = await readdir(dist, { recursive: true });
for (const file of files) {
  if (
    /(?:^|[\\/])(?:\.env(?:\.[^\\/]+)?|client_secret[^\\/]*\.json)$/i.test(
      file,
    ) ||
    extname(file) === ".map"
  ) {
    throw new Error("Pages output contains a credential file or source map.");
  }
  if (![".html", ".css", ".js", ".json", ".svg"].includes(extname(file)))
    continue;
  const content = await readFile(join(dist, file), "utf8");
  if (
    /sb_secret_[\w-]{20,}|GOCSPX-[\w-]{20,}|-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/.test(
      content,
    )
  ) {
    throw new Error("Pages output contains a credential signature.");
  }
}
console.log(
  "Pages entry assets, content policy and output passed verification.",
);
