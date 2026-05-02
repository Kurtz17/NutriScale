# Dokumentasi Pengujian (Testing Documentation)

Dokumen ini berisi rincian skenario pengujian (*test cases*) yang telah diimplementasikan dalam proyek NutriScale menggunakan **Vitest** dan **React Testing Library**. Pengujian ini memastikan fungsionalitas backend (API, Middleware, Server Actions) serta komponen antarmuka (*Frontend Components*) berjalan sesuai spesifikasi.

---

## 1. API Testing
Pengujian yang dilakukan dengan mengirim request langsung ke API *endpoints* dari sistem yang diuji untuk memastikan balasan (*response code* dan data) sesuai ekspektasi, termasuk pengujian isolasi data antar pengguna.

### Autentikasi & Sesi (Middleware & User Me)
| Scenario | Request / Condition | Expected Result |
| :--- | :--- | :--- |
| Akses halaman *protected* tanpa sesi | Middleware: Akses *route* tanpa *session cookie* | Redirect ke `/login` |
| Akses halaman *protected* dengan sesi | Middleware: Akses *route* dengan *session cookie* valid | Request diteruskan (*next*) |
| Pengecekan sesi *error* | Middleware: *Exception* saat verifikasi | Redirect ke `/login` |
| Ambil profil tanpa login | GET `/api/user-me` (tanpa otorisasi) | `401 Unauthorized` |
| Ambil profil sukses | GET `/api/user-me` (sesi valid) | `200 OK`, data profil dikembalikan |
| Profil terhapus di DB | GET `/api/user-me` (user dihapus manual di DB) | `404 Not Found` |

### Keranjang Belanja (Cart API)
| Scenario | Request / Condition | Expected Result |
| :--- | :--- | :--- |
| Akses API tanpa login | GET / POST / DELETE `/api/cart` (tanpa sesi) | `401 Unauthorized` |
| Ambil keranjang kosong | GET `/api/cart` (user belum punya item) | `200 OK`, mengembalikan *array* kosong `[]` |
| Ambil isi keranjang | GET `/api/cart` (sesi valid) | `200 OK`, mengembalikan data produk & kuantitas |
| Tambah produk baru | POST `/api/cart` (berisi `productId` & `quantity`) | `200 OK`, keranjang & item baru dibuat |
| Tambah kuantitas produk | POST `/api/cart` (produk sudah ada di keranjang) | `200 OK`, kuantitas produk ditambahkan |
| *Payload* tidak lengkap | POST `/api/cart` (tanpa ID/kuantitas) | `400 Bad Request` |
| Hapus item keranjang | DELETE `/api/cart` (mengirim `cartItemId`) | `200 OK`, item terhapus dari DB |

### Checkout & Pesanan (Checkout & Orders API)
| Scenario | Request / Condition | Expected Result |
| :--- | :--- | :--- |
| *Checkout* tanpa login | POST `/api/checkout` (tanpa sesi) | `401 Unauthorized` |
| *Checkout* keranjang kosong | POST `/api/checkout` | `400 Bad Request` ("Keranjang belanja kosong") |
| *Checkout* stok habis | POST `/api/checkout` (Kuantitas dibeli > Stok DB) | `400 Bad Request` ("Stok tidak mencukupi") |
| *Checkout* Sukses | POST `/api/checkout` (Stok cukup, data valid) | `200 OK`, mengembalikan `Snap Token` Midtrans |
| Ambil riwayat pesanan | GET `/api/orders` | `200 OK`, format benar & kalkulasi total kalori akurat |
| Keamanan / *Data Isolation* | GET `/api/orders` | *Query* difilter berdasarkan `userId`, aman dari akses silang |
| Database gagal | GET `/api/orders` (Simulasi DB *down*) | `500 Internal Server Error` |

### Midtrans Webhook
| Scenario | Request / Condition | Expected Result |
| :--- | :--- | :--- |
| Signature palsu / *Invalid* | POST `/api/webhook-midtrans` dengan *Signature Key* salah | `400 Bad Request` (Akses ditolak) |
| Pembayaran Sukses | POST status transaksi `settlement` / `capture` | `200 OK`, pesanan `SELESAI`, stok dikurangi, keranjang dikosongkan |
| Pembayaran Gagal/Batal | POST status transaksi `cancel` / `expire` / `deny` | `200 OK`, status pesanan menjadi `GAGAL` |

### Katalog Produk (Products API)
| Scenario | Request / Condition | Expected Result |
| :--- | :--- | :--- |
| Ambil daftar produk | GET `/api/products` | `200 OK`, format produk & *mapping* nilai gizi (kalori) benar |
| Katalog kosong | GET `/api/products` (Belum ada produk di DB) | `200 OK`, mengembalikan *array* kosong `[]` |

---

## 2. Server Actions Testing
Pengujian yang dilakukan terhadap fungsionalitas fungsi *backend* (Next.js Server Actions) yang biasanya dipanggil secara langsung oleh komponen klien (Form).

### Health Assessment (`saveHealthAssessment`)
| Scenario | Request / Condition | Expected Result |
| :--- | :--- | :--- |
| *Submit* tanpa `userId` | Parameter `userId` dikosongkan pada aksi | Mengembalikan objek *error* "User ID is required" |
| Buat profil baru | Data lengkap, user belum memiliki riwayat profil | Profil kesehatan baru terbuat dan tersimpan di database |
| *Update* profil lama | Data lengkap, profil user sudah ada di database | Baris data profil lama diperbarui (*update*) |

---

## 3. UI Components & Utility Testing
Pengujian fungsionalitas komponen *frontend* (menggunakan JSDOM) untuk memastikan tampilan dasar dan logika visual (seperti manipulasi CSS *class*) bekerja dengan semestinya.

### Komponen Dasar & Utilitas
| Scenario | Request / Condition | Expected Result |
| :--- | :--- | :--- |
| Penggabungan *class* dasar | Menjalankan `cn('bg-red', 'text-white')` | Mengembalikan teks `'bg-red text-white'` |
| Resolusi konflik Tailwind | Menjalankan `cn('p-2 text-sm', 'text-lg')` | Mengembalikan `'p-2 text-lg'` (*class* saling tumpuk teratasi) |
| *Render* komponen Button | me-render `<Button>Click Me</Button>` | Tombol muncul di *Virtual DOM* dengan teks "Click Me" |
| Simulasi *Click Event* | Menekan komponen *Button* dengan parameter `onClick` | *Function handler* (*spy*) dipanggil tepat 1 kali |
| Perubahan *Variant Button* | me-render `<Button variant="destructive">` | Atribut CSS merah (`bg-destructive`) berhasil disematkan |
| *Render* komponen Badge | me-render `<Badge>New</Badge>` | *Badge* muncul di *Virtual DOM* dengan teks "New" |
| Kustomisasi *Class Badge* | me-render `<Badge className="custom">` | *Class* `custom` berhasil ditambahkan di samping *class* bawaan |
