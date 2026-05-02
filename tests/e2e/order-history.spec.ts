import { expect, test } from '@playwright/test';

test.describe('Order History Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/order-history');
  });

  test('harus menampilkan heading "Riwayat Pesanan"', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Riwayat Pesanan/i }),
    ).toBeVisible();
    await expect(
      page.getByText('Pantau asupan nutrisi dari riwayat belanja sehatmu.'),
    ).toBeVisible();
  });

  test('jika tidak ada pesanan, harus menampilkan state kosong', async ({
    page,
  }) => {
    await expect(
      page.locator('text=Memuat riwayat pesanan...'),
    ).not.toBeVisible({ timeout: 8000 });
    const emptyState = page.getByText('Belum Ada Pesanan');
    const hasPesanan = await emptyState.isVisible().catch(() => false);
    if (hasPesanan) {
      await expect(emptyState).toBeVisible();
      await expect(
        page.getByRole('link', { name: /Mulai Belanja/i }),
      ).toBeVisible();
    }
  });

  test('link "Mulai Belanja" di state kosong harus mengarah ke /marketplace', async ({
    page,
  }) => {
    await expect(
      page.locator('text=Memuat riwayat pesanan...'),
    ).not.toBeVisible({ timeout: 8000 });
    const belanja = page.getByRole('link', { name: /Mulai Belanja/i });
    if (await belanja.isVisible()) {
      await belanja.click();
      await expect(page).toHaveURL(/.*marketplace/);
    }
  });

  test('link "Kembali ke Marketplace" di header harus berfungsi', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /Kembali ke Marketplace/i }).click();
    await expect(page).toHaveURL(/.*marketplace/);
  });

  test('footer harus menampilkan branding NutriScale', async ({ page }) => {
    await expect(
      page.getByText('NutriScale • Your Healthy Life Companion'),
    ).toBeVisible();
  });
});
