import { type Page, expect, test } from '@playwright/test';

const SNAP_CALLS_KEY = 'e2e-snap-calls';

const snapMockScript = `
  window.__snapMode = window.__snapMode || 'success';
  window.snap = {
    pay: function(token, callbacks) {
      var currentCalls = JSON.parse(localStorage.getItem('${SNAP_CALLS_KEY}') || '[]');
      currentCalls.push({ token: token });
      localStorage.setItem('${SNAP_CALLS_KEY}', JSON.stringify(currentCalls));
      setTimeout(function() {
        if (window.__snapMode === 'error') {
          callbacks && callbacks.onError && callbacks.onError({ status_message: 'mock payment error' });
          return;
        }
        if (window.__snapMode === 'pending') {
          callbacks && callbacks.onPending && callbacks.onPending({ transaction_status: 'pending' });
          return;
        }
        callbacks && callbacks.onSuccess && callbacks.onSuccess({ transaction_status: 'settlement' });
      }, 0);
    }
  };
`;

async function mockCheckoutFlow(
  page: Page,
  options: {
    checkoutStatus?: number;
    checkoutBody?: Record<string, unknown>;
  } = {},
) {
  const checkoutRequests: unknown[] = [];

  await page.addInitScript({ content: snapMockScript });
  await page.route(
    'https://app.sandbox.midtrans.com/snap/snap.js',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: snapMockScript,
      });
    },
  );

  await page.route('**/api/cart', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        cart: [
          {
            id: 'payment-prod-1',
            name: 'E2E Protein Box',
            category: 'Protein',
            image: 'P',
            badges: { healthSafe: true, aiRecommended: true },
            tags: ['Tinggi Protein'],
            calories: 320,
            protein: 28,
            price: 35000,
            stok: 5,
            quantity: 2,
          },
        ],
      }),
    });
  });

  await page.route('**/api/user/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'payment-user',
        name: 'Nadia Payment',
        email: 'payment@example.com',
        phone: '081234567890',
        address: {
          detailAlamat: 'Jl. Payment',
          jalan: 'No. 7',
          kota: 'Jakarta',
        },
      }),
    });
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ orders: [] }),
    });
  });

  await page.route('**/api/checkout', async (route) => {
    checkoutRequests.push(route.request().postDataJSON());
    await route.fulfill({
      status: options.checkoutStatus ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(
        options.checkoutBody ?? { snapToken: 'snap-e2e-token' },
      ),
    });
  });

  return { checkoutRequests };
}

async function fillShippingAddress(page: Page) {
  await page.getByPlaceholder('Nama Penerima').fill('Nadia Payment');
  await page.getByPlaceholder('Nomor Telepon').fill('081234567890');
  await page.getByPlaceholder('Alamat Lengkap').fill('Jl. Payment No. 7');
}

test.describe('Mocked Midtrans Payment E2E', () => {
  test('checkout sukses memanggil Snap dan redirect ke riwayat pesanan', async ({
    page,
  }) => {
    const state = await mockCheckoutFlow(page);

    await page.goto('/checkout');
    await page.evaluate((key) => localStorage.removeItem(key), SNAP_CALLS_KEY);
    await expect(page.getByText('E2E Protein Box')).toBeVisible();
    await expect(page.getByText('Subtotal (1 item)')).toBeVisible();

    await fillShippingAddress(page);
    await page.getByRole('button', { name: /Bayar Sekarang/i }).click();
    await expect(
      page.getByRole('heading', { name: /Konfirmasi Pesanan/i }),
    ).toBeVisible();
    await page.getByRole('button', { name: /Ya, Proses/i }).click();

    await expect(page).toHaveURL(/.*\/order-history/);
    await expect(
      page.getByRole('heading', { name: /Riwayat Pesanan/i }),
    ).toBeVisible();

    expect(state.checkoutRequests).toHaveLength(1);
    expect(state.checkoutRequests[0]).toMatchObject({
      alamatKirim: {
        name: 'Nadia Payment',
        phone: '081234567890',
        address: 'Jl. Payment No. 7',
      },
    });

    const snapCalls = await page.evaluate((key) => {
      return JSON.parse(localStorage.getItem(key) || '[]') as Array<{
        token: string;
      }>;
    }, SNAP_CALLS_KEY);
    expect(snapCalls).toEqual([{ token: 'snap-e2e-token' }]);
  });

  test('Snap error menampilkan notifikasi pembayaran gagal', async ({
    page,
  }) => {
    await mockCheckoutFlow(page);

    await page.goto('/checkout');
    await page.evaluate((key) => {
      localStorage.removeItem(key);
      (window as Window & { __snapMode?: string }).__snapMode = 'error';
    }, SNAP_CALLS_KEY);

    await fillShippingAddress(page);
    await page.getByRole('button', { name: /Bayar Sekarang/i }).click();
    await page.getByRole('button', { name: /Ya, Proses/i }).click();

    await expect(
      page.getByText('Pembayaran gagal. Silakan coba lagi.'),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Oops! Terjadi Kesalahan/i }),
    ).toBeVisible();
  });

  test('checkout API error menampilkan pesan error dari server', async ({
    page,
  }) => {
    await mockCheckoutFlow(page, {
      checkoutStatus: 400,
      checkoutBody: {
        error: 'Stok tidak mencukupi untuk produk E2E Protein Box',
      },
    });

    await page.goto('/checkout');
    await fillShippingAddress(page);
    await page.getByRole('button', { name: /Bayar Sekarang/i }).click();
    await page.getByRole('button', { name: /Ya, Proses/i }).click();

    await expect(
      page
        .getByRole('main')
        .getByText('Stok tidak mencukupi untuk produk E2E Protein Box'),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Oops! Terjadi Kesalahan/i }),
    ).toBeVisible();
  });
});
