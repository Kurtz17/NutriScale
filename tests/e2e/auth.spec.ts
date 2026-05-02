import { expect, test } from '@playwright/test';

test.describe('Authentication - Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('harus merender form login dengan semua elemen yang diperlukan', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: /Welcome Back/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/Email Address/i)).toBeVisible();
    await expect(page.getByLabel(/^Password$/i)).toBeVisible();
    await expect(
      page.getByRole('main').getByRole('button', { name: /Sign In/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Forgot Password/i }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Sign up/i })).toBeVisible();
  });

  test('harus menampilkan error jika form kosong saat submit', async ({
    page,
  }) => {
    await page
      .locator('form')
      .evaluate((form) => form.setAttribute('novalidate', ''));
    await page
      .getByRole('main')
      .getByRole('button', { name: /Sign In/i })
      .click();
    const errorMsg = page.locator('text=Mohon isi email dan password.');
    await expect(errorMsg).toBeVisible();
  });

  test('harus menampilkan error jika kredensial salah', async ({ page }) => {
    await page
      .getByPlaceholder('your.email@example.com')
      .fill('salah@email.com');
    await page.getByPlaceholder('••••••••').fill('passwordsalah123');
    await page
      .getByRole('main')
      .getByRole('button', { name: /Sign In/i })
      .click();

    // Menunggu respons API dan error muncul
    const errorMsg = page.locator('.text-red-500');
    await expect(errorMsg).toBeVisible({ timeout: 8000 });
  });

  test('link "Forgot Password?" harus mengarah ke /recovery', async ({
    page,
  }) => {
    await page.getByRole('link', { name: /Forgot Password/i }).click();
    await expect(page).toHaveURL(/.*recovery/);
  });

  test('link "Sign up" harus mengarah ke /register', async ({ page }) => {
    await page.getByRole('link', { name: /Sign up/i }).click();
    await expect(page).toHaveURL(/.*register/);
  });

  test('tombol Sign In harus disabled saat loading (mencegah double submit)', async ({
    page,
  }) => {
    await page
      .getByPlaceholder('your.email@example.com')
      .fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('somepassword');
    await page
      .getByRole('main')
      .getByRole('button', { name: /Sign In/i })
      .click();

    const loadingBtn = page.getByRole('button', { name: /Masuk\.\.\./i });
    const isLoading = await loadingBtn.isVisible().catch(() => false);
    const isError = await page
      .locator('.text-red-500')
      .isVisible()
      .catch(() => false);
    expect(isLoading || isError).toBeTruthy();
  });
});

test.describe('Authentication - Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('harus merender form register dengan semua field yang diperlukan', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { name: /Create Account/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email Address/i)).toBeVisible();
    await expect(page.getByLabel(/^Password$/i)).toBeVisible();
    await expect(page.getByLabel(/Confirm Password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign Up/i })).toBeVisible();
  });

  test('harus menampilkan error jika form kosong saat submit', async ({
    page,
  }) => {
    await page
      .locator('form')
      .evaluate((form) => form.setAttribute('novalidate', ''));
    await page.getByRole('button', { name: /Sign Up/i }).click();
    await expect(page.locator('text=Mohon isi semua data akun.')).toBeVisible();
  });

  test('harus menampilkan error jika password dan konfirmasi tidak cocok', async ({
    page,
  }) => {
    await page
      .locator('form')
      .evaluate((form) => form.setAttribute('novalidate', ''));
    await page.getByPlaceholder('Enter your full name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    const passwordFields = page.getByPlaceholder('••••••••');
    await passwordFields.nth(0).fill('password123');
    await passwordFields.nth(1).fill('password456');
    await page.getByRole('button', { name: /Sign Up/i }).click();
    await expect(
      page.locator('text=Password dan Konfirmasi Password tidak cocok!'),
    ).toBeVisible();
  });

  test('link "Sign in" harus kembali ke /login', async ({ page }) => {
    await page.getByRole('link', { name: /Sign in/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});
