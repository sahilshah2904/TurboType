import { mkdir, writeFile } from "node:fs/promises";
import { rewardVehicleArt } from "../src/content/reward-vehicle-art.ts";

const directory = new URL("../public/assets/karts/rewards/", import.meta.url);
await mkdir(directory, { recursive: true });
for (const { id, preview, body, wheel } of rewardVehicleArt) {
  for (const [part, markup] of Object.entries({ preview, body, wheel })) {
    await writeFile(new URL(`${id}-${part}.svg`, directory), markup + "\n");
  }
}
