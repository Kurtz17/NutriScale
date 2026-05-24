# NutriScale Testing Documentation

Dokumen ini menjelaskan struktur, cara menjalankan, dan cakupan pengujian
NutriScale. Test suite menggunakan Vitest, React Testing Library, dan
Playwright.

## Ringkasan

| Area | Tool | Lokasi |
| :--- | :--- | :--- |
| Unit test | Vitest | `tests/lib`, `tests/hooks`, `tests/actions` |
| API test | Vitest | `tests/api` |
| Component test | React Testing Library | `tests/components` |
| Integration test | React Testing Library | `tests/integration` |
| E2E test | Playwright | `tests/e2e` |
| Test setup global | Vitest setup | `tests/setup.ts` |
| Test fixture | Mock data | `tests/fixtures` |

## Script

Jalankan dari root project.

```bash
npm run test
npm run test:e2e
npm run lint
npm run build
```

Script yang relevan:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "node tests/e2e/run-e2e.mjs"
}
```

`npm run test:e2e` tetap menjalankan Playwright. Runner
`tests/e2e/run-e2e.mjs` hanya bertugas menyiapkan Next.js dev server,
memuat `.env`, menjalankan `@playwright/test`, lalu mematikan server yang
dibuatnya.

## Environment Untuk E2E Auth

Authenticated E2E wajib menggunakan kredensial test yang tersedia di env.
Project ini membaca env melalui `@next/env`, sehingga `.env`, `.env.local`,
dan `.env.test` dapat digunakan.

Env yang dibaca:

```bash
TEST_EMAIL=
TEST_PASSWORD=
TEST_ADMIN_EMAIL=
TEST_ADMIN_PASSWORD=
BETTER_AUTH_URL=
PLAYWRIGHT_BASE_URL=
```

`TEST_ADMIN_EMAIL` dan `TEST_ADMIN_PASSWORD` bersifat opsional. Jika tidak
diisi, E2E admin memakai akun admin seed project:
`admin@nutriscale.com` / `adminpassword123`.

Aturan base URL:

1. Jika `PLAYWRIGHT_BASE_URL` ada, Playwright memakai nilai itu.
2. Jika tidak ada, Playwright memakai `BETTER_AUTH_URL`.
3. Jika keduanya tidak ada, fallback ke `http://localhost:3000`.

`BETTER_AUTH_URL` penting karena Better Auth memvalidasi origin. Jika base URL
Playwright berbeda dari origin auth, login global setup akan gagal.

## Storage State Playwright

Global setup E2E berada di:

```bash
tests/e2e/global-setup.ts
```

Saat `npm run test:e2e` dijalankan:

1. Playwright membuka `/login`.
2. Login user menggunakan `TEST_EMAIL` dan `TEST_PASSWORD`.
3. Login admin menggunakan `TEST_ADMIN_EMAIL` dan `TEST_ADMIN_PASSWORD`, atau
   fallback akun admin seed.
4. Session browser disimpan otomatis ke:

```bash
tests/e2e/.auth/user.json
tests/e2e/.auth/admin.json
```

File `.auth` adalah artifact lokal berisi session cookie dan tidak boleh ikut
commit. Path ini sudah di-ignore oleh `.gitignore`.

Jika `TEST_EMAIL` atau `TEST_PASSWORD` tidak ada, global setup akan gagal
secara eksplisit. Authenticated tests tidak di-skip.

## Menjalankan Dari Kondisi Auth Bersih

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

Jika database/auth memakai service eksternal dan sandbox membatasi network,
jalankan dengan akses network yang diperlukan. Tanpa akses DB, login global
setup dapat gagal saat Better Auth membaca user.

## Vitest Setup

Setup global ada di `tests/setup.ts`.

Mock dan polyfill utama:

- Prisma client mock untuk route/action test.
- `next/headers` mock.
- `matchMedia`.
- `ResizeObserver`.
- `IntersectionObserver`.
- `scrollIntoView`.
- `window.snap.pay` untuk flow Midtrans.
- Auto cleanup React Testing Library setelah setiap test.

## Cakupan Unit Dan API Test

### Utilities

| File | Cakupan |
| :--- | :--- |
| `tests/lib/utils.test.ts` | `cn`, `formatHarga` |
| `tests/lib/address-utils.test.ts` | format alamat user |
| `tests/lib/health-assessment-utils.test.ts` | mapper gender/category, pantangan medis, usia kehamilan |
| `tests/hooks/useRegionData.test.ts` | `toTitleCase` |

### Store dan hooks

| File | Cakupan |
| :--- | :--- |
| `tests/lib/store/useCartStore.test.ts` | fetch cart, optimistic add, stok clamp, update, remove, clear, error path |
| `tests/hooks/auth-hooks.test.tsx` | login, register, recovery, reset password |
| `tests/hooks/marketplace-checkout-hooks.test.tsx` | marketplace load/filter/totals, checkout address/payment |
| `tests/hooks/useOrders.test.tsx` | admin order load/filter/update/error |
| `tests/hooks/useHealthDashboard.test.tsx` | dashboard loading, success, error |

### API dan server actions

| File | Cakupan |
| :--- | :--- |
| `tests/api/cart.test.ts` | cart GET/POST/DELETE |
| `tests/api/checkout.test.ts` | checkout validation, stock, Midtrans token |
| `tests/api/orders.test.ts` | user order history |
| `tests/api/orders-cancel.test.ts` | cancel order rules |
| `tests/api/products.test.ts` | product mapping |
| `tests/api/user-me.test.ts` | current user profile |
| `tests/api/webhook-midtrans.test.ts` | Midtrans signature and status mapping |
| `tests/api/admin-dashboard.test.ts` | admin summary and chart range |
| `tests/api/admin-products.test.ts` | admin create/update/delete product |
| `tests/api/admin-orders.test.ts` | admin order list and status update |
| `tests/api/admin-users.test.ts` | admin user list/delete/ban |
| `tests/api/auth-touch.test.ts` | lastOnline touch endpoint |
| `tests/api/health-dashboard.test.ts` | health stats and meal recommendations |
| `tests/actions/health-assessment.test.ts` | save/update health assessment |

## Cakupan Component Test

| File | Cakupan |
| :--- | :--- |
| `tests/components/ui/button.test.tsx` | button render, click, disabled, variant |
| `tests/components/ui/badge.test.tsx` | badge render, variant, custom class |
| `tests/components/auth/forms.test.tsx` | login/register form state and submit |
| `tests/components/marketplace/marketplace-components.test.tsx` | product card/grid, filter, cart item/sidebar |
| `tests/components/checkout/checkout-components.test.tsx` | shipping form, payment summary, modals, order list |
| `tests/components/orders/order-components.test.tsx` | status badge, cancel modal/button |
| `tests/components/admin/admin-filters.test.tsx` | product/user/order filters and product table actions |
| `tests/components/health-assessment/steps.test.tsx` | step validation and navigation |

## Cakupan Integration Test

| File | Cakupan |
| :--- | :--- |
| `tests/integration/marketplace-flow.test.tsx` | search, empty state, add to cart, checkout enable |
| `tests/integration/checkout-flow.test.tsx` | required shipping validation, notification, confirmation modal |

Integration test memakai mock dan harness lokal agar deterministic dan tidak
memanggil API production.

## Cakupan Playwright E2E

E2E berada di `tests/e2e`.

| File | Auth | Cakupan |
| :--- | :--- | :--- |
| `auth.spec.ts` | Tidak | login/register render, validation, links, invalid credentials |
| `homepage.spec.ts` | Tidak | homepage content, navigation, mobile viewport |
| `protected-routes.spec.ts` | Tidak | protected routes redirect ke `/login` |
| `marketplace.spec.ts` | Ya | marketplace render, products, search, empty state, filter, empty cart |
| `checkout.spec.ts` | Ya | shipping form, billing summary, disabled payment, default address, back navigation |
| `order-history.spec.ts` | Ya | heading, empty state, navigation links, footer |
| `health-assessment.spec.ts` | Ya | Step 1 render dan back navigation |
| `payment.spec.ts` | Ya | mocked Midtrans Snap success, Snap error, checkout API error |
| `admin.spec.ts` | Admin | dashboard, product CRUD UI, order filter/status update, user ban |

Authenticated E2E memakai `storageState` dari `tests/e2e/.auth/user.json`.
Admin E2E memakai `storageState` dari `tests/e2e/.auth/admin.json`. Test API di
Playwright menggunakan `page.route()` untuk response yang perlu stabil, tetapi
login tetap memakai Better Auth dan user test dari env.

## Menjalankan Test Spesifik

Vitest:

```bash
npm run test -- tests/lib/utils.test.ts
npm run test -- tests/api/admin-products.test.ts
```

Playwright:

```bash
npm run test:e2e -- --reporter=list
npm run test:e2e -- tests/e2e/marketplace.spec.ts --reporter=list
npm run test:e2e -- --project=authenticated --reporter=list
npm run test:e2e -- --project=admin --reporter=list
```

Mode UI Playwright:

```bash
npx playwright test --ui
```

## Expected Result Terbaru

Hasil terakhir yang diverifikasi:

```text
npm run test       -> 34 files, 132 tests passed
npm run test:e2e   -> 45 passed, 0 skipped
npm run lint       -> 0 errors, existing warnings only
npm run build      -> passed with network access for next/font Google Fonts
```

Catatan build:

- `next/font` membutuhkan akses ke Google Fonts saat production build.
- Jika network dibatasi, build dapat gagal saat fetch font `Inter`.

## Troubleshooting

### Authenticated E2E gagal login

Cek:

1. `TEST_EMAIL` dan `TEST_PASSWORD` ada di env.
2. User test sudah ada, password benar, dan email sudah verified bila auth
   mewajibkan verifikasi.
3. `BETTER_AUTH_URL` sama dengan origin Playwright.
4. Database dari `DATABASE_URL` bisa diakses oleh proses test.

### Admin E2E gagal login

Cek:

1. Akun admin seed `admin@nutriscale.com` tersedia, atau isi
   `TEST_ADMIN_EMAIL` dan `TEST_ADMIN_PASSWORD`.
2. User admin punya `role: admin`.
3. Email admin sudah verified jika auth mewajibkan verifikasi.

### `storageState` tidak dibuat

Hapus auth state lama lalu run ulang:

```bash
rm -rf .auth playwright/.auth tests/e2e/.auth
npm run test:e2e -- --reporter=list
```

Jika login gagal, `tests/e2e/.auth/user.json` tidak akan dibuat.

### E2E hang setelah semua test selesai

Gunakan script `npm run test:e2e`, bukan menjalankan dev server manual.
Runner akan membuat dan mematikan Next.js dev server sendiri.

### Playwright test protected route tidak redirect

Pastikan context unauthenticated bersih. Test `protected-routes.spec.ts`
memanggil `page.context().clearCookies()` sebelum membuka route protected.

## Best Practices Untuk Menambah Test Baru

- Pakai selector berbasis role, label, dan text terlebih dahulu.
- Tambahkan `data-testid` hanya jika selector accessible tidak stabil.
- Jangan bergantung pada API production.
- Mock request dengan `page.route()` untuk E2E yang membutuhkan data stabil.
- Gunakan fixture dari `tests/fixtures` untuk data yang dipakai berulang.
- Jangan memakai `waitForTimeout` kecuali benar-benar tidak ada sinyal UI atau
  network yang lebih stabil.
- Setiap test harus punya assertion behavior nyata, bukan hanya memastikan page
  tidak crash.
