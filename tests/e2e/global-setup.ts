import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = (
  process.env.PLAYWRIGHT_BASE_URL ||
  process.env.BETTER_AUTH_URL ||
  'http://localhost:3000'
).replace(/\/$/, '');
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@nutriscale.com';
const TEST_ADMIN_PASSWORD =
  process.env.TEST_ADMIN_PASSWORD || 'adminpassword123';
export const USER_AUTH_STATE_FILE = path.join(__dirname, '.auth', 'user.json');
export const ADMIN_AUTH_STATE_FILE = path.join(
  __dirname,
  '.auth',
  'admin.json',
);

type LoginStateOptions = {
  email: string;
  password: string;
  stateFile: string;
  expectedPath: string;
  label: string;
};

async function loginAndSaveState({
  email,
  password,
  stateFile,
  expectedPath,
  label,
}: LoginStateOptions) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/login`);

    await page.getByLabel('Email Address').fill(email);
    await page.getByLabel('Password').fill(password);
    await page
      .locator('main')
      .getByRole('button', { name: /Sign In/i })
      .click();

    await page.waitForURL(
      (url) => url.origin === BASE_URL && url.pathname === expectedPath,
      { timeout: 15000 },
    );

    await context.storageState({ path: stateFile });
  } catch (error) {
    throw new Error(
      `Failed to create ${label} E2E storageState. Check the ${label} credentials and seeded database. Original error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  } finally {
    await context.close();
    await browser.close();
  }
}

export default async function globalSetup() {
  fs.mkdirSync(path.dirname(USER_AUTH_STATE_FILE), { recursive: true });

  if (!TEST_EMAIL || !TEST_PASSWORD) {
    throw new Error(
      'TEST_EMAIL and TEST_PASSWORD must be set in .env, .env.local, or .env.test for authenticated E2E tests.',
    );
  }

  await loginAndSaveState({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    stateFile: USER_AUTH_STATE_FILE,
    expectedPath: '/',
    label: 'user',
  });

  await loginAndSaveState({
    email: TEST_ADMIN_EMAIL,
    password: TEST_ADMIN_PASSWORD,
    stateFile: ADMIN_AUTH_STATE_FILE,
    expectedPath: '/admin/dashboard',
    label: 'admin',
  });
}
