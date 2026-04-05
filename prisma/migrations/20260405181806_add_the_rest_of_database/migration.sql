-- CreateEnum
CREATE TYPE "StatusPesanan" AS ENUM ('DIPROSES', 'DIKIRIM', 'SELESAI');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('BERHASIL', 'GAGAL', 'TERTUNDA');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "KategoriKondisi" AS ENUM ('UMUM', 'ANAK_BALITA', 'IBU_HAMIL', 'PASCA_OPERASI');

-- CreateTable
CREATE TABLE "profil_kesehatan" (
    "profil_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama_profil" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "umur" INTEGER,
    "berat_badan" DECIMAL(5,2),
    "tinggi_badan" DECIMAL(5,2),
    "kategori_kondisi" "KategoriKondisi" NOT NULL DEFAULT 'UMUM',
    "usia_kehamilan_minggu" INTEGER,
    "anjuran_kalori_dokter" INTEGER,
    "pantangan_medis" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profil_kesehatan_pkey" PRIMARY KEY ("profil_id")
);

-- CreateTable
CREATE TABLE "riwayat_analisis" (
    "analisis_id" TEXT NOT NULL,
    "profil_id" TEXT NOT NULL,
    "haz" DECIMAL(5,2) NOT NULL,
    "whz" DECIMAL(5,2) NOT NULL,
    "bmi" DECIMAL(5,2) NOT NULL,
    "lila" DECIMAL(5,2),
    "status_nutrisi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riwayat_analisis_pkey" PRIMARY KEY ("analisis_id")
);

-- CreateTable
CREATE TABLE "produk_makanan" (
    "produk_id" TEXT NOT NULL,
    "nama_produk" TEXT,
    "harga" DECIMAL(10,2),
    "deskripsi" TEXT,
    "nilai_gizi" JSONB,
    "stok" INTEGER,
    "label_risiko" TEXT,

    CONSTRAINT "produk_makanan_pkey" PRIMARY KEY ("produk_id")
);

-- CreateTable
CREATE TABLE "cart" (
    "cart_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "cart_item_id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "produk_id" TEXT NOT NULL,
    "kuantitas" INTEGER NOT NULL,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("cart_item_id")
);

-- CreateTable
CREATE TABLE "pesanan" (
    "pesanan_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_harga" DECIMAL(12,2) NOT NULL,
    "status_pesanan" "StatusPesanan" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pesanan_pkey" PRIMARY KEY ("pesanan_id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "order_item_id" TEXT NOT NULL,
    "pesanan_id" TEXT NOT NULL,
    "produk_id" TEXT NOT NULL,
    "kuantitas" INTEGER NOT NULL,
    "harga" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "transaksi_pembayaran" (
    "transaksi_id" TEXT NOT NULL,
    "pesanan_id" TEXT NOT NULL,
    "status_pembayaran" "StatusPembayaran" NOT NULL,
    "metode_pembayaran" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaksi_pembayaran_pkey" PRIMARY KEY ("transaksi_id")
);

-- CreateTable
CREATE TABLE "meal_plan" (
    "mealplan_id" TEXT NOT NULL,
    "analisis_id" TEXT NOT NULL,
    "detail_rencana_makan" JSONB,

    CONSTRAINT "meal_plan_pkey" PRIMARY KEY ("mealplan_id")
);

-- CreateTable
CREATE TABLE "meal_plan_produk" (
    "id" TEXT NOT NULL,
    "mealplan_id" TEXT NOT NULL,
    "produk_id" TEXT NOT NULL,

    CONSTRAINT "meal_plan_produk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_user_id_key" ON "cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaksi_pembayaran_pesanan_id_key" ON "transaksi_pembayaran"("pesanan_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_plan_analisis_id_key" ON "meal_plan"("analisis_id");

-- AddForeignKey
ALTER TABLE "profil_kesehatan" ADD CONSTRAINT "profil_kesehatan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_analisis" ADD CONSTRAINT "riwayat_analisis_profil_id_fkey" FOREIGN KEY ("profil_id") REFERENCES "profil_kesehatan"("profil_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "produk_makanan"("produk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_pesanan_id_fkey" FOREIGN KEY ("pesanan_id") REFERENCES "pesanan"("pesanan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "produk_makanan"("produk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_pembayaran" ADD CONSTRAINT "transaksi_pembayaran_pesanan_id_fkey" FOREIGN KEY ("pesanan_id") REFERENCES "pesanan"("pesanan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan" ADD CONSTRAINT "meal_plan_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "riwayat_analisis"("analisis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_produk" ADD CONSTRAINT "meal_plan_produk_mealplan_id_fkey" FOREIGN KEY ("mealplan_id") REFERENCES "meal_plan"("mealplan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_produk" ADD CONSTRAINT "meal_plan_produk_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "produk_makanan"("produk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
