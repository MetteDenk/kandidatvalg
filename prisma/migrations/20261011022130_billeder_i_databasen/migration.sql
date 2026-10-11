-- CreateTable
CREATE TABLE "Billede" (
    "id" TEXT NOT NULL,
    "kandidatId" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Billede_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Billede" ADD CONSTRAINT "Billede_kandidatId_fkey" FOREIGN KEY ("kandidatId") REFERENCES "Kandidat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
