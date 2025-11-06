import { defineConfig, devices } from '@playwright/test';

process.env.TEST_ENV = 'e2e';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // PR 직렬 처리
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm run dev:e2e',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    env: {
      TEST_ENV: 'e2e',
    },
  },
});
