-- AlterTable: Add missing columns to produk_makanan
ALTER TABLE "produk_makanan" ADD COLUMN IF NOT EXISTS "kategori" TEXT;
ALTER TABLE "produk_makanan" ADD COLUMN IF NOT EXISTS "gambar" TEXT;

-- AlterTable: Add missing columns to user
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "username" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "tanggalLahir" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "address" JSONB;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "notification" BOOLEAN DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "user_username_key" ON "user"("username");
