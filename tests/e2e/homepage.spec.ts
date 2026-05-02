import { expect, test } from '@playwright/test';

test.describe('NutriScale Homepage', () => {
  test('harus merender halaman utama dengan sukses', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/NutriScale/i);
    const loginButton = page.getByRole('button', { name: /login/i });

    if (await loginButton.isVisible()) {
      await loginButton.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });
});
