-- AlterTable: kolom alergi & pantangan (teks dari form health assessment)
ALTER TABLE "profil_kesehatan" ADD COLUMN IF NOT EXISTS "alergi" TEXT;
ALTER TABLE "profil_kesehatan" ADD COLUMN IF NOT EXISTS "pantangan" TEXT;
