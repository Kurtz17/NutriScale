import { type Page, expect, test } from '@playwright/test';

async function gotoHomepage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
}

test.describe('NutriScale Homepage', () => {
  test.describe.configure({ mode: 'serial' });

  test('harus merender halaman utama dengan sukses', async ({ page }) => {
    await gotoHomepage(page);

    const hero = page.locator('#beranda');

    await expect(page).toHaveTitle(/NutriScale/i);
    await expect(hero.getByText('AI Powered Nutrition')).toBeVisible();
    await expect(
      hero.getByRole('heading', {
        name: 'Kelola Gizi & Kesehatan Lebih Cerdas, Hasil Nyata',
      }),
    ).toBeVisible();
    await expect(hero.getByText('WHO Aligned')).toBeVisible();
    await expect(hero.getByText('AI Driven')).toBeVisible();
    await expect(hero.getByText('Medically Reviewed')).toBeVisible();
    await expect(page.getByText('Kategori Nutrisi Khusus')).toBeVisible();
    await expect(page.getByText(/Kenapa Memilih/)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Cara Kerja NutriScale' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Dipercaya oleh pengguna NutriScale',
      }),
    ).toBeVisible();
    await expect(
      hero.getByRole('button', { name: /Mulai Analisis Gratis/i }),
    ).toBeVisible();
  });

  test('navigasi Masuk mengarah ke halaman login', async ({ page }) => {
    await gotoHomepage(page);
    await page.waitForLoadState('networkidle');

    const loginButton = page.locator('header').getByRole('button', {
      name: 'Masuk',
    });

    await expect(loginButton).toBeVisible();
    await loginButton.click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('CTA utama mengarah ke registrasi untuk pengguna baru', async ({
    page,
  }) => {
    await gotoHomepage(page);
    await page.waitForLoadState('networkidle');

    await page
      .locator('#beranda')
      .getByRole('button', { name: /Mulai Analisis Gratis/i })
      .click();

    await expect(page).toHaveURL(/.*register/);
  });

  test('layout utama dapat dibuka di viewport mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHomepage(page);

    const hero = page.locator('#beranda');
    const overflowWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const viewportWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );

    await expect(
      hero.getByRole('heading', {
        name: 'Kelola Gizi & Kesehatan Lebih Cerdas, Hasil Nyata',
      }),
    ).toBeVisible();
    await expect(page.getByText('Kategori Nutrisi Khusus')).toBeVisible();
    expect(overflowWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('menu mobile menampilkan navigasi landing page', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHomepage(page);
    await page.waitForLoadState('networkidle');

    const menuButton = page.getByRole('button', { name: 'Buka menu' });

    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(
      page.getByRole('button', { name: 'Tutup menu' }),
    ).toBeVisible();

    const mobileNav = page.getByRole('navigation', {
      name: 'Navigasi mobile',
    });

    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Fitur' })).toBeVisible();
    await expect(
      mobileNav.getByRole('link', { name: 'Kategori' }),
    ).toBeVisible();
    await expect(
      mobileNav.getByRole('link', { name: 'Cara Kerja' }),
    ).toBeVisible();
  });
});
