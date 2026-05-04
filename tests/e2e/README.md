# 🧪 E2E Testing NutriScale 

Dokumen ini menjelaskan seluruh skenario pengujian *End-to-End* (E2E) menggunakan **Playwright** untuk proyek NutriScale. Pengujian ini membuka browser asli dan mengklik aplikasi seperti pengguna nyata.

---

## 📂 Struktur File Test

```
e2e/
├── global-setup.ts           # Login otomatis sebelum test protected pages
├── .auth/                    # [AUTO-GENERATED] Menyimpan session cookies
├── homepage.spec.ts          # Landing Page (tidak butuh login)
├── auth.spec.ts              # Login & Register (tidak butuh login)
├── marketplace.spec.ts       # Halaman Marketplace (butuh login)
├── checkout.spec.ts          # Halaman Checkout (butuh login)
├── order-history.spec.ts     # Riwayat Pesanan (butuh login)
├── health-assessment.spec.ts # Health Assessment (butuh login)
└── README.md                 # Dokumen ini
```

---


## 🚀 Cara Menjalankan Test

> **Prasyarat:** Pastikan sudah menjalankan `npm install`.

### Mode 1 — UI Interaktif 
Membuka jendela Playwright UI. Kamu bisa melihat simulasi browser langkah demi langkah dan menekan test satu per satu.
```bash
npx playwright test --ui
```

### Mode 2 — Headless / Background (Untuk CI/CD)
Test berjalan di memori tanpa membuka browser. Hasilnya langsung muncul di terminal.
```bash
npx playwright test
```

### Mode 3 — Headed (Melihat Browser Bekerja)
Browser Chrome terbuka dan Playwright mengklik secara nyata di depanmu.
```bash
npx playwright test --headed
```

### Mode 4 — Jalankan File Test Spesifik
Hanya jalankan test untuk halaman tertentu, tanpa menunggu yang lain.
```bash
npx playwright test homepage        # Hanya homepage
npx playwright test auth            # Hanya Login & Register
npx playwright test marketplace     # Hanya Marketplace
npx playwright test checkout        # Hanya Checkout
npx playwright test order-history   # Hanya Riwayat Pesanan
```

### Melihat Laporan (Jika Ada yang Gagal)
```bash
npx playwright show-report
```

---

## 📋 Skenario Pengujian (Test Cases)

### 1. Homepage — `homepage.spec.ts`
Pengujian terhadap Landing Page (`/`) yang menjadi pintu masuk utama pengguna.

| Skenario | Kondisi | Hasil yang Diharapkan |
| :--- | :--- | :--- |
| Render heading utama | Buka `/` | Teks "Solusi Cerdas Kelola" dan badge "Powered by AI & WHO Standards" muncul |
| Render 4 kategori nutrisi | Buka `/` | Kartu Anak Balita, Ibu Hamil, Pasien Pasca-Operasi, dan Umum muncul |
| Tombol "Mulai Analisis Gratis" | Klik saat belum login | Browser diarahkan ke `/register` |
| Tombol "Sign In" | Klik | Browser diarahkan ke `/login` |
| Trust indicators | Buka `/` | Teks "WHO Certified", "AI Driven", "Medical Approved" terlihat |
| Section benefit | Buka `/` | Heading "Kenapa Memilih NutriScale?" dan poin-poin keunggulan terlihat |
| CTA Section bawah | Buka `/` | Tombol "Mulai Sekarang" terlihat |

### 2. Autentikasi — `auth.spec.ts`
Pengujian pada halaman Login (`/login`) dan Register (`/register`).

| Skenario | Kondisi / Input | Hasil yang Diharapkan |
| :--- | :--- | :--- |
| Render form login | Buka `/login` | Label email, password, tombol "Sign In", link "Forgot Password?", dan "Sign up" terlihat |
| Submit form kosong | Klik "Sign In" tanpa isi apapun | Pesan error "Mohon isi email dan password." muncul |
| Kredensial salah | Email: salah@email.com / Password: salah | Pesan error merah muncul dari API |
| Link "Forgot Password?" | Klik | Diarahkan ke `/recovery` |
| Link "Sign up" | Klik | Diarahkan ke `/register` |
| Render form register | Buka `/register` | Field Full Name, Email, Password, Confirm Password, tombol "Sign Up" terlihat |
| Submit form register kosong | Klik "Sign Up" tanpa isi | Pesan "Mohon isi semua data akun." muncul |
| Password tidak cocok | Password: `abc123` / Confirm: `xyz999` | Pesan "Password dan Konfirmasi Password tidak cocok!" muncul |
| Link "Sign in" dari register | Klik | Diarahkan ke `/login` |

### 3. Marketplace — `marketplace.spec.ts`
Pengujian pada halaman katalog produk (`/marketplace`).

| Skenario | Kondisi | Hasil yang Diharapkan |
| :--- | :--- | :--- |
| Render heading | Buka `/marketplace` | Heading "Health Marketplace" dan subtitle muncul |
| Render produk | Buka `/marketplace` (produk dari DB) | Teks "Rp" (harga) dan tombol "+ Add" terlihat |
| Fitur pencarian | Ketik di kotak "Search products..." | UI bereaksi dan menyaring produk tanpa crash |
| Pencarian tidak ditemukan | Ketik `xxxxxxxxxnotexist` | Teks "No products found" muncul |
| Tombol Filter | Klik tombol "Filter" | Dropdown kategori muncul dengan opsi "All" |
| Keranjang kosong | Saat baru buka halaman | Teks "Your cart is empty" muncul di sidebar |

### 4. Checkout — `checkout.spec.ts`
Pengujian pada halaman konfirmasi pembayaran (`/checkout`).

| Skenario | Kondisi | Hasil yang Diharapkan |
| :--- | :--- | :--- |
| Render form alamat | Buka `/checkout` | Field "Nama Penerima", "Nomor Telepon", "Alamat Lengkap" muncul |
| Render ringkasan tagihan | Buka `/checkout` | Teks "Ringkasan Tagihan", "Total Pembayaran", "Ongkos Kirim" muncul |
| Tombol "Bayar Sekarang" disabled | Keranjang kosong | Tombol "Bayar Sekarang" dalam status `disabled` |
| Isi otomatis Alamat Default | Centang "Gunakan Alamat Default" | Field terisi "John Doe" dan "081234567890" |
| Field disabled setelah centang | Centang "Gunakan Alamat Default" | Semua field form menjadi `disabled` |
| Tombol "Kembali ke Marketplace" | Klik | Diarahkan ke `/marketplace` |

### 5. Riwayat Pesanan — `order-history.spec.ts`
Pengujian pada halaman daftar pesanan (`/order-history`).

| Skenario | Kondisi | Hasil yang Diharapkan |
| :--- | :--- | :--- |
| Render heading | Buka `/order-history` | Heading "Riwayat Pesanan" dan subtitle muncul |
| State pesanan kosong | User belum punya pesanan | Teks "Belum Ada Pesanan" dan tombol "Mulai Belanja" muncul |
| Link "Mulai Belanja" | Klik di state kosong | Diarahkan ke `/marketplace` |
| Link "Kembali ke Marketplace" | Klik | Diarahkan ke `/marketplace` |
| Footer branding | Buka halaman | Teks "NutriScale • Your Healthy Life Companion" terlihat |

### 6. Health Assessment — `health-assessment.spec.ts`
Pengujian pada multi-step form kesehatan (`/health-assessment`).

| Skenario | Kondisi | Hasil yang Diharapkan |
| :--- | :--- | :--- |
| Render Step 1 | Buka `/health-assessment` | Halaman berhasil dirender di Step 1 tanpa crash/redirect |
| Tombol Back (←) | Klik tombol `←` di Step 1 | Diarahkan kembali ke homepage `/` |

---
