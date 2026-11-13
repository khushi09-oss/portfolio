import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:5178",
    trace: "retain-on-failure",
    launchOptions: {
      args: [
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
      ],
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PORTFOLIO_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --port 5178 --strictPort",
        url: "http://127.0.0.1:5178",
        reuseExistingServer: !process.env.CI,
      },
});
