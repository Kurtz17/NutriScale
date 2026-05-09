import { expect, test } from '@playwright/test';

test.describe('Health Assessment Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/health-assessment');
  });

  test('harus merender Step 1 saat pertama kali dibuka', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/.*health-assessment/);
  });

  test('tombol "←" (Back) harus muncul di Step 1 dan mengarah ke homepage', async ({
    page,
  }) => {
    const backBtn = page.getByRole('button', { name: '←' });
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await expect(page).toHaveURL('/');
  });
});
