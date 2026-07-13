import { defineConfig, devices } from "@playwright/test";

/**
 * E2E smoke tests run against the production build.
 * `pnpm build` must have been executed; the config then starts `next start`
 * with the lead API forced into mock mode.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  timeout: 45_000,
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  webServer: {
    command: "pnpm start --port 3100",
    port: 3100,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      LEADS_MOCK_MODE: "true",
    },
  },
});
