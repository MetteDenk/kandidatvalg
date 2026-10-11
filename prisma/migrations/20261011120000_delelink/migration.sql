-- Hemmeligt delelink til kladden.
ALTER TABLE "Kandidat" ADD COLUMN "delelink" TEXT;
CREATE UNIQUE INDEX "Kandidat_delelink_key" ON "Kandidat"("delelink");
