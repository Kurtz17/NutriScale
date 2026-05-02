import { expect, test } from '@playwright/test';

test.describe('Marketplace Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace');
  });

  test('harus merender heading "Health Marketplace"', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Health Marketplace' }),
    ).toBeVisible();
    await expect(
      page.getByText('Curated healthy foods & ingredients for your needs'),
    ).toBeVisible();
  });

  test('harus merender produk dengan tombol "+ Add"', async ({ page }) => {
    await expect(page.locator('text=/Rp/').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByRole('button', { name: /\+ Add/i }).first(),
    ).toBeVisible();
  });

  test('harus merender input pencarian produk', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search products...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('ayam');
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('jika tidak ada produk yang cocok, harus muncul pesan "No products found"', async ({
    page,
  }) => {
    const searchInput = page.getByPlaceholder('Search products...');
    await searchInput.fill('xxxxxxxxxnotexist');
    await expect(page.getByText('No products found')).toBeVisible({
      timeout: 3000,
    });
  });

  test('tombol Filter harus muncul dan bisa diklik', async ({ page }) => {
    const filterBtn = page.getByRole('button', { name: /Filter/i });
    await expect(filterBtn).toBeVisible();
    await filterBtn.click();
    await expect(page.getByText('All')).toBeVisible();
  });

  test('keranjang harus menampilkan "Your cart is empty" saat kosong', async ({
    page,
  }) => {
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });
});
