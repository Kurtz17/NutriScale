import { chromium } from '@playwright/test';
import path from 'path';

const TEST_EMAIL = process.env.TEST_EMAIL || 'muhammadzahran1777@gmail.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '12345678';
export const AUTH_STATE_FILE = path.join(__dirname, '.auth', 'user.json');

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/login');

  await page.getByLabel('Email Address').fill(TEST_EMAIL);
  await page.getByLabel('Password').fill(TEST_PASSWORD);
  await page
    .locator('main')
    .getByRole('button', { name: /Sign In/i })
    .click();

  // Tunggu redirect ke homepage setelah login berhasil
  await page.waitForURL('http://localhost:3000/', { timeout: 15000 });

  // Simpan cookies/session ke file
  await page.context().storageState({ path: AUTH_STATE_FILE });
  await browser.close();
}
