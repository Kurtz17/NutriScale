-- AlterTable: Add kalori, karbohidrat, protein, and lemak columns to riwayat_analisis
ALTER TABLE "riwayat_analisis" ADD COLUMN IF NOT EXISTS "kalori" DECIMAL(7,2);
ALTER TABLE "riwayat_analisis" ADD COLUMN IF NOT EXISTS "karbohidrat" DECIMAL(6,2);
ALTER TABLE "riwayat_analisis" ADD COLUMN IF NOT EXISTS "protein" DECIMAL(6,2);
ALTER TABLE "riwayat_analisis" ADD COLUMN IF NOT EXISTS "lemak" DECIMAL(6,2);
