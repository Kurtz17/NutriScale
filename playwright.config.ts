import { loadEnvConfig } from '@next/env';
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

loadEnvConfig(process.cwd());

const BASE_URL = (
  process.env.PLAYWRIGHT_BASE_URL ||
  process.env.BETTER_AUTH_URL ||
  'http://localhost:3000'
).replace(/\/$/, '');

export const USER_AUTH_STATE_FILE = path.join(
  __dirname,
  'tests',
  'e2e',
  '.auth',
  'user.json',
);

export const ADMIN_AUTH_STATE_FILE = path.join(
  __dirname,
  'tests',
  'e2e',
  '.auth',
  'admin.json',
);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  globalSetup: './tests/e2e/global-setup.ts',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    // PROJECT 2: Test TANPA login (Halaman Publik: homepage, login, register)
    {
      name: 'unauthenticated',
      testMatch: /[\\/](homepage|auth|protected-routes)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // PROJECT 3: Test DENGAN login (Halaman Protected: marketplace, checkout, dll)
    {
      name: 'authenticated',
      testMatch:
        /[\\/](marketplace|checkout|order-history|health-assessment|payment)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: USER_AUTH_STATE_FILE,
      },
    },

    {
      name: 'admin',
      testMatch: /[\\/]admin\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: ADMIN_AUTH_STATE_FILE,
      },
    },
  ],

  webServer: process.env.PLAYWRIGHT_SKIP_WEB_SERVER
    ? undefined
    : {
        command:
          'node node_modules/next/dist/bin/next dev --hostname 127.0.0.1',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
      },
});
