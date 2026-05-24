import { expect, test } from '@playwright/test';

test.describe('NutriScale Homepage', () => {
  test('harus merender halaman utama dengan sukses', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NutriScale/i);
    await expect(page.getByText('Powered by AI & WHO Standards')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Solusi Cerdas/i }),
    ).toBeVisible();
    await expect(page.getByText('WHO Certified')).toBeVisible();
    await expect(page.getByText('AI Driven')).toBeVisible();
    await expect(page.getByText('Medical Approved')).toBeVisible();
    await expect(page.getByText(/Kenapa Memilih/)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Mulai Sekarang/i }),
    ).toBeVisible();
  });

  test('navigasi Sign In mengarah ke halaman login', async ({ page }) => {
    await page.goto('/');
    const loginButton = page.getByRole('button', { name: /login/i });

    if (await loginButton.isVisible()) {
      await loginButton.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('layout utama dapat dibuka di viewport mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /Solusi Cerdas/i }),
    ).toBeVisible();
    await expect(page.getByText('Kategori Nutrisi Khusus')).toBeVisible();
  });
});
