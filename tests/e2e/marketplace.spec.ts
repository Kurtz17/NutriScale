import { expect, test } from '@playwright/test';

test.describe('Marketplace Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace');
    await page.evaluate(() => localStorage.removeItem('nutriscale-cart'));
    await page.reload();
  });

  test('harus merender heading "Health Marketplace"', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Health Marketplace' }),
    ).toBeVisible();
    await expect(
      page.getByText(
        'Curated healthy foods & ingredients tailored for your needs',
      ),
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
    const searchInput = page.getByPlaceholder('Search healthy products...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('ayam');
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('jika tidak ada produk yang cocok, harus muncul pesan "No products found"', async ({
    page,
  }) => {
    const searchInput = page.getByPlaceholder('Search healthy products...');
    await searchInput.fill('xxxxxxxxxnotexist');
    await expect(page.getByText('No products found')).toBeVisible({
      timeout: 3000,
    });
  });

  test('tombol Filter harus muncul dan bisa diklik', async ({ page }) => {
    const filterBtn = page.getByRole('button', { name: /All Categories/i });
    await expect(filterBtn).toBeVisible();
    await filterBtn.click();
    await expect(
      page.getByRole('menuitemradio', { name: 'All' }),
    ).toBeVisible();
  });

  test('keranjang harus menampilkan "Your cart is empty" saat kosong', async ({
    page,
  }) => {
    await page.route('**/api/cart', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ cart: [] }),
        });
      } else {
        await route.continue();
      }
    });
    await page.reload();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });
});
