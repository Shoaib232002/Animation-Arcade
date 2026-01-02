import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./__tests__/visual",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    launchOptions: {
      args: [
        "--disable-font-subpixel-positioning",
        "--disable-lcd-text",
        "--force-device-scale-factor=1",
      ],
    },
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.03,
      timeout: 10000,
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
  webServer: {
    command: "node server.js",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});