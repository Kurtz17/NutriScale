-- AlterTable: hasil parser alergi/pantangan (Groq) dari AI engine, dipakai ulang selama teks tidak berubah
ALTER TABLE "profil_kesehatan" ADD COLUMN IF NOT EXISTS "parser_alergi" JSONB;
