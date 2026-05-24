import { expect, test } from '@playwright/test';

const protectedRoutes = [
  '/marketplace',
  '/checkout',
  '/order-history',
  '/health-assessment',
  '/health-dashboard',
  '/profile',
];

test.describe('Protected routes', () => {
  for (const route of protectedRoutes) {
    test(`redirects unauthenticated users from ${route} to login`, async ({
      page,
    }) => {
      await page.context().clearCookies();
      await page.goto(route);

      await expect(page).toHaveURL(/\/login$/);
    });
  }
});
