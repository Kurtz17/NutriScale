# NutriScale Playwright E2E

Dokumen ini berisi catatan khusus untuk test End-to-End NutriScale. Untuk
dokumentasi testing lengkap, lihat `../README.md`.

## Runner

Jalankan E2E dari root project:

```bash
npm run test:e2e
```

Script ini menjalankan:

```bash
node tests/e2e/run-e2e.mjs
```

Runner akan memuat env Next.js, menyalakan Next dev server, menjalankan
Playwright, lalu mematikan server setelah test selesai. Gunakan script ini
untuk local dan CI agar lifecycle server konsisten.

## Authenticated E2E

Authenticated flow tidak di-skip. Global setup login otomatis memakai user test
dari env, login admin, lalu menyimpan storage state ke:

```bash
tests/e2e/.auth/user.json
tests/e2e/.auth/admin.json
```

Env yang dibaca:

```bash
TEST_EMAIL=
TEST_PASSWORD=
TEST_ADMIN_EMAIL=
TEST_ADMIN_PASSWORD=
BETTER_AUTH_URL=
PLAYWRIGHT_BASE_URL=
```

`TEST_ADMIN_EMAIL` dan `TEST_ADMIN_PASSWORD` opsional. Jika tidak ada, global
setup memakai akun admin dari seed project:
`admin@nutriscale.com` / `adminpassword123`.

Resolusi base URL:

1. `PLAYWRIGHT_BASE_URL`
2. `BETTER_AUTH_URL`
3. `http://localhost:3000`

Jika `TEST_EMAIL` atau `TEST_PASSWORD` tidak tersedia, global setup akan gagal
secara eksplisit agar authenticated tests tidak terlihat pass palsu.

## Clean Auth Run

PowerShell:

```powershell
Remove-Item -Recurse -Force .auth, playwright\.auth, tests\e2e\.auth -ErrorAction SilentlyContinue
npm run test:e2e -- --reporter=list
```

Bash:

```bash
rm -rf .auth playwright/.auth tests/e2e/.auth
npm run test:e2e -- --reporter=list
```

Folder `.auth` berisi cookie/session lokal dan tidak boleh di-commit.

## Struktur File

| File | Auth | Cakupan |
| :--- | :--- | :--- |
| `auth.spec.ts` | Tidak | login/register render, validation, links, invalid credentials |
| `homepage.spec.ts` | Tidak | landing page, navigation, responsive mobile |
| `protected-routes.spec.ts` | Tidak | redirect unauthenticated user ke `/login` |
| `marketplace.spec.ts` | Ya | product list, search, filter, empty state, cart sidebar |
| `checkout.spec.ts` | Ya | form checkout, payment summary, default address, navigation |
| `order-history.spec.ts` | Ya | empty order history dan navigation |
| `health-assessment.spec.ts` | Ya | authenticated health assessment render dan navigation |
| `payment.spec.ts` | Ya | mocked Midtrans Snap success, Snap error, checkout API error |
| `admin.spec.ts` | Admin | dashboard, product CRUD UI, order status update, user ban |

## Menjalankan Test Spesifik

```bash
npm run test:e2e -- tests/e2e/marketplace.spec.ts --reporter=list
npm run test:e2e -- --project=authenticated --reporter=list
npm run test:e2e -- --project=unauthenticated --reporter=list
npm run test:e2e -- --project=admin --reporter=list
```

## Mocking

- Gunakan `page.route()` untuk endpoint yang perlu data deterministic.
- Jangan panggil API production untuk data marketplace, checkout, order, atau
  health assessment.
- Login global setup tetap memakai Better Auth dan user test dari env karena
  fitur utama aplikasi membutuhkan authenticated state yang realistis.

## Expected Result Terakhir

Run terakhir dari auth state bersih:

```text
45 passed, 0 skipped
```

Authenticated specs yang berjalan:

- `checkout.spec.ts`
- `health-assessment.spec.ts`
- `marketplace.spec.ts`
- `order-history.spec.ts`
- `payment.spec.ts`
- `admin.spec.ts`
