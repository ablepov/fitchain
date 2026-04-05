import { defineConfig, devices } from "@playwright/test";

process.loadEnvFile?.(".env.local");

const playwrightPort = process.env.PLAYWRIGHT_LIVE_PORT ?? "3101";
const playwrightBaseUrl = process.env.PLAYWRIGHT_LIVE_BASE_URL ?? `http://127.0.0.1:${playwrightPort}`;
const playwrightWebServerCommand =
  process.env.PLAYWRIGHT_LIVE_WEB_SERVER_COMMAND ??
  `npm run dev -- --hostname 127.0.0.1 --port ${playwrightPort}`;

export default defineConfig({
  testDir: "./tests-live",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: playwrightBaseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: playwrightWebServerCommand,
    url: playwrightBaseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      ...process.env,
      E2E_MOCK_MODE: "0",
    },
  },
});
