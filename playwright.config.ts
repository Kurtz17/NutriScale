import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export const AUTH_STATE_FILE = path.join(
  __dirname,
  'tests',
  'e2e',
  '.auth',
  'user.json',
);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // Global setup: Login satu kali dan simpan sesi untuk test yang membutuhkan auth
  globalSetup: './tests/e2e/global-setup.ts',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    // PROJECT 1: Setup - hanya menjalankan global login satu kali
    {
      name: 'setup',
      testMatch: /global-setup\.ts/,
    },

    // PROJECT 2: Test TANPA login (Halaman Publik: homepage, login, register)
    {
      name: 'unauthenticated',
      testMatch: /[\\/](homepage|auth)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // PROJECT 3: Test DENGAN login (Halaman Protected: marketplace, checkout, dll)
    {
      name: 'authenticated',
      testMatch:
        /[\\/](marketplace|checkout|order-history|health-assessment)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        /* Gunakan sesi yang disimpan saat global setup */
        storageState: AUTH_STATE_FILE,
      },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
