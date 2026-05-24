import { expect, test } from '@playwright/test';

import { mockAdminApis } from './fixtures/admin';

test.describe('Admin E2E', () => {
  test('dashboard admin menampilkan statistik dan navigasi sidebar', async ({
    page,
  }) => {
    await mockAdminApis(page);
    await page.goto('/admin/dashboard');

    await expect(
      page.getByRole('heading', { name: /Ringkasan Dashboard/i }),
    ).toBeVisible();
    await expect(page.getByText('Total Pengguna')).toBeVisible();
    await expect(page.getByText('Total Pesanan')).toBeVisible();
    await expect(page.getByText('Rp 1.250.000')).toBeVisible();
    await expect(page.getByText('Tren Pesanan & Pendapatan')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Katalog Produk/i }),
    ).toBeVisible();

    await page.goto('/admin/products');
    await expect(
      page.getByRole('heading', { name: /Katalog Produk/i }),
    ).toBeVisible();
  });

  test('produk admin bisa dicari, difilter, ditambah, diedit, dan dihapus dengan API mock', async ({
    page,
  }) => {
    const state = await mockAdminApis(page);
    await page.goto('/admin/products');

    await expect(page.getByText('E2E Granola Bowl')).toBeVisible();
    await expect(page.getByText('E2E Recovery Yogurt')).toBeVisible();

    await page.getByPlaceholder('Cari nama produk...').fill('yogurt');
    await expect(page.getByText('E2E Recovery Yogurt')).toBeVisible();
    await expect(page.getByText('E2E Granola Bowl')).not.toBeVisible();

    await page.getByPlaceholder('Cari nama produk...').fill('');
    await page.locator('select').first().selectOption('Grains');
    await expect(page.getByText('E2E Granola Bowl')).toBeVisible();
    await expect(page.getByText('E2E Recovery Yogurt')).not.toBeVisible();

    await page.locator('select').first().selectOption('');
    await page.getByRole('button', { name: /Tambah Produk/i }).click();
    await expect(
      page.getByRole('heading', { name: /Tambah Produk Baru/i }),
    ).toBeVisible();

    await page.locator('input[name="name"]').fill('E2E Trail Mix');
    await page.locator('select[name="category"]').selectOption('Snacks');
    await page.locator('input[name="calories"]').fill('410');
    await page.locator('input[name="protein"]').fill('11');
    await page.locator('input[name="harga"]').fill('45000');
    await page.locator('input[name="stok"]').fill('9');
    await page.locator('input[name="label_risiko"]').fill('Aman');
    await page.locator('input[name="image"]').fill('T');
    await page.getByRole('button', { name: 'Tambah Produk' }).last().click();

    await expect.poll(() => state.productRequests.at(-1)?.method).toBe('POST');
    await expect(page.getByText('E2E Trail Mix')).toBeVisible();

    await page.getByTitle('Edit Produk').first().click();
    await expect(
      page.getByRole('heading', { name: /Edit Produk/i }),
    ).toBeVisible();
    await page.locator('input[name="harga"]').fill('47000');
    await page.getByRole('button', { name: /Simpan Perubahan/i }).click();

    await expect.poll(() => state.productRequests.at(-1)?.method).toBe('PATCH');
    expect(state.productRequests.at(-1)).toMatchObject({
      method: 'PATCH',
      body: expect.objectContaining({ harga: 47000 }),
    });

    await page.getByTitle('Hapus Produk').first().click();
    await expect(
      page.getByRole('heading', { name: /Hapus Produk/i }),
    ).toBeVisible();
    await page.getByRole('button', { name: /Ya, Hapus/i }).click();

    await expect
      .poll(() => state.productRequests.at(-1)?.method)
      .toBe('DELETE');
  });

  test('orders admin bisa dicari, difilter, dibuka detailnya, dan statusnya diubah', async ({
    page,
  }) => {
    const state = await mockAdminApis(page);
    await page.goto('/admin/orders');

    await expect(
      page.getByRole('heading', { name: /Manajemen Pesanan/i }),
    ).toBeVisible();
    await expect(page.getByText('ORD-E2E-001')).toBeVisible();
    await expect(page.getByText('Nadia E2E')).toBeVisible();

    await page
      .getByPlaceholder('Cari ID pesanan atau nama pengguna...')
      .fill('Rafi');
    await expect(page.getByText('Rafi E2E')).toBeVisible();
    await expect(page.getByText('Nadia E2E')).not.toBeVisible();

    await page
      .getByPlaceholder('Cari ID pesanan atau nama pengguna...')
      .fill('');
    await page.locator('select').selectOption('DIPROSES');
    await expect(page.getByText('ORD-E2E-001')).toBeVisible();
    await expect(page.getByText('ORD-E2E-002')).not.toBeVisible();

    await page.locator('select').selectOption('ALL');
    const statusDropdown = page
      .locator('button[role="combobox"]')
      .filter({ hasText: 'Diproses' })
      .first();
    await statusDropdown.click();
    await page.getByRole('option', { name: 'Dikirim' }).click();

    await expect
      .poll(() => {
        const last = state.orderRequests.at(-1)?.body as
          | { orderId?: string; status?: string }
          | undefined;
        return last;
      })
      .toMatchObject({ orderId: 'ORD-E2E-001', status: 'DIKIRIM' });

    await page.getByRole('button', { name: 'Detail' }).first().click();
    await expect(
      page.getByRole('heading', { name: /Detail Pesanan/i }),
    ).toBeVisible();
    await expect(page.getByText('Informasi Pelanggan')).toBeVisible();
    await expect(page.getByText('Jl. Testing No. 1')).toBeVisible();
  });

  test('user management bisa mencari, filter status, dan blokir user lewat mock API', async ({
    page,
  }) => {
    const state = await mockAdminApis(page);
    await page.goto('/admin/user-management');

    await expect(
      page.getByRole('heading', { name: /Manajemen Pengguna/i }),
    ).toBeVisible();
    await expect(page.getByText('Nadia E2E')).toBeVisible();

    await page.getByPlaceholder('Cari nama atau email...').fill('Rafi');
    await expect(page.getByText('Rafi Banned')).toBeVisible();
    await expect(page.getByText('Nadia E2E')).not.toBeVisible();

    await page.getByPlaceholder('Cari nama atau email...').fill('');
    await page.locator('select').selectOption('Banned');
    await expect(page.getByText('Rafi Banned')).toBeVisible();
    await expect(page.getByText('Nadia E2E')).not.toBeVisible();

    await page.locator('select').selectOption('Semua');
    await page.getByPlaceholder('Cari nama atau email...').fill('Nadia');
    await page.getByRole('button', { name: 'Detail' }).first().click();

    await expect(
      page.getByRole('heading', { name: 'Nadia E2E' }),
    ).toBeVisible();
    await page.getByRole('button', { name: /Blokir Pengguna/i }).click();
    await page
      .getByPlaceholder('Contoh: Pelanggaran syarat & ketentuan...')
      .fill('E2E moderation check');
    await page.getByRole('button', { name: /Konfirmasi Blokir/i }).click();

    await expect
      .poll(() => {
        const last = state.userRequests.at(-1)?.body as
          | { userId?: string; banned?: boolean; reason?: string }
          | undefined;
        return last;
      })
      .toMatchObject({
        userId: 'user-e2e-1',
        banned: true,
        reason: 'E2E moderation check',
      });
  });
});
