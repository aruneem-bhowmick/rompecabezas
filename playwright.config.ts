import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright end-to-end test configuration.
 *
 * Runs tests from the tests/e2e/ directory against the Vite dev
 * server on localhost:5173.  In CI the server is started fresh per
 * run; locally an already-running server is reused.
 *
 * Only the Chromium project is enabled for now; additional browsers
 * can be added when cross-browser coverage is needed.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
