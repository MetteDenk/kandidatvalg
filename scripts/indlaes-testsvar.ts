// Lægger testsvarene fra 11/10-2026 (Kandidatvalg/Svar_testperson_Mette_v1.md)
// ind på en bruger, så guiden kan prøves uden at skrive alt igen.
//   npm run testsvar -- din@email.dk
// Brugeren oprettes, hvis den ikke findes. Eksisterende svar overskrives.
import { PrismaClient } from "@prisma/client";
import { testData } from "./testsvar-data";

const db = new PrismaClient();

async function main() {
  const email = (process.argv[2] ?? "").trim().toLowerCase();
  if (!email.includes("@")) throw new Error("Brug: npm run testsvar -- din@email.dk");

  const d = testData(email);
  const user = await db.user.upsert({ where: { email }, update: {}, create: { email } });
  await db.kandidat.upsert({
    where: { ownerId: user.id },
    update: { data: d, tekster: {}, rettelser: {}, genereretAt: null, published: false },
    create: { ownerId: user.id, slug: "k-" + user.id.slice(-10), data: d },
  });
  console.log(`Testsvarene er lagt ind for ${email}. Log ind og gå til /guide.`);
}

main().finally(() => db.$disconnect());
