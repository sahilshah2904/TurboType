import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  // Isolate SwiftShader contexts after hosted and local browser pressure.
  // All cases, retry policy and timeouts stay intact.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173/TurboType/",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
        },
      },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:4173/TurboType/",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
