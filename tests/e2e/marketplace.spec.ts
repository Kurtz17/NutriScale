import { expect, test } from '@playwright/test';

test.describe('Marketplace Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'X-Target-Calories': '2000' },
        body: JSON.stringify([
          {
            id: 'prod-1',
            name: 'Ayam Panggang',
            category: 'Protein',
            image: 'FOOD',
            price: 25000,
            stok: 5,
            badges: { healthSafe: true, aiRecommended: true },
            tags: ['Protein'],
            calories: 320,
            protein: 30,
          },
        ]),
      });
    });
    await page.route('**/api/cart', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ cart: [] }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
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
    await expect(searchInput).toHaveValue('ayam');
    await expect(page.getByText('Ayam Panggang')).toBeVisible();
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

  test('keranjang harus menampilkan empty cart state saat kosong', async ({
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
    await expect(page.getByText('Your cart is feeling lonely')).toBeVisible();
  });
});
