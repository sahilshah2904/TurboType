// Rebuild the committed, reviewable catalog from curated original prose. Never runs in the game.
import { writeFileSync, readFileSync } from "node:fs";
import { format } from "prettier";
import { authorPassage } from "../src/content/curriculum/authoring.ts";
const entries = [];
for (const category of ["easy", "medium", "hard"]) {
  for (let number = 7; number <= 100; number++)
    entries.push(authorPassage(category, number));
  for (let chapter = 1; chapter <= 10; chapter++)
    entries.push(authorPassage(category, chapter * 10, true));
}
const path = "src/content/curriculum/catalog.json";
const text = await format(JSON.stringify(entries), { parser: "json" });
if (process.argv.includes("--check")) {
  if (readFileSync(path, "utf8") !== text)
    throw new Error(
      "Curriculum catalog differs from its original source. Rebuild it deliberately.",
    );
} else writeFileSync(path, text);
console.log(
  `${entries.length} authored entries: 282 main passages and 30 optional challenges.`,
);
