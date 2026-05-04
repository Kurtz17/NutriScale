import { expect, test } from '@playwright/test';

test.describe('Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkout');
  });

  test('harus merender form alamat pengiriman', async ({ page }) => {
    // Kolom form pengiriman dari checkout/page.tsx
    await expect(page.getByPlaceholder('Nama Penerima')).toBeVisible();
    await expect(page.getByPlaceholder('Nomor Telepon')).toBeVisible();
    await expect(page.getByPlaceholder('Alamat Lengkap')).toBeVisible();
  });

  test('harus merender ringkasan tagihan', async ({ page }) => {
    await expect(page.getByText('Ringkasan Tagihan')).toBeVisible();
    await expect(page.getByText('Total Pembayaran')).toBeVisible();
    await expect(page.getByText('Ongkos Kirim')).toBeVisible();
  });

  test('tombol "Bayar Sekarang" harus disabled jika keranjang kosong', async ({
    page,
  }) => {
    const payBtn = page.getByRole('button', { name: /Bayar Sekarang/i });
    await expect(payBtn).toBeVisible();
    await expect(payBtn).toBeDisabled();
  });

  test('checkbox "Gunakan Alamat Default" harus mengisi form otomatis', async ({
    page,
  }) => {
    const checkboxBtn = page.getByText('Gunakan Alamat Default');
    await expect(checkboxBtn).toBeVisible();
    await checkboxBtn.click();
    // Setelah klik, field form harus terisi dengan nilai default
    await expect(page.getByPlaceholder('Nama Penerima')).toHaveValue(
      'John Doe',
    );
    await expect(page.getByPlaceholder('Nomor Telepon')).toHaveValue(
      '081234567890',
    );
  });

  test('field form harus disabled setelah alamat default dipilih', async ({
    page,
  }) => {
    await page.getByText('Gunakan Alamat Default').click();
    await expect(page.getByPlaceholder('Nama Penerima')).toBeDisabled();
    await expect(page.getByPlaceholder('Nomor Telepon')).toBeDisabled();
    await expect(page.getByPlaceholder('Alamat Lengkap')).toBeDisabled();
  });

  test('tombol "Kembali ke Marketplace" harus berfungsi', async ({ page }) => {
    // Navigasi via marketplace dulu agar router.back() punya history
    await page.goto('/marketplace');
    await page.goto('/checkout');
    await page.getByRole('button', { name: /Kembali ke Marketplace/i }).click();
    await expect(page).toHaveURL(/.*marketplace/);
  });
});
