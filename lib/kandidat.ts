import { db } from "./db";
import { nyData, normaliser, RESERVEREDE, slugify, type TekstLager } from "./indhold";

export async function findEllerOpret(userId: string, email: string) {
  const fundet = await db.kandidat.findUnique({ where: { ownerId: userId } });
  if (fundet) return fundet;
  const data = nyData();
  data.grund.email = email;
  return db.kandidat.create({ data: { ownerId: userId, slug: "k-" + userId.slice(-10), data } });
}

// Finder en ledig adresse ud fra navnet: navn, navn-2, navn-3 ...
export async function ledigSlug(navn: string, kandidatId: string): Promise<string> {
  const base = slugify(navn);
  for (let n = 1; n < 100; n++) {
    const s = n === 1 ? base : `${base}-${n}`;
    if (RESERVEREDE.has(s)) continue;
    const optaget = await db.kandidat.findUnique({ where: { slug: s } });
    if (!optaget || optaget.id === kandidatId) return s;
  }
  return `${base}-${kandidatId.slice(-6)}`;
}

export function laes(k: { data: unknown; tekster: unknown; rettelser: unknown }) {
  return {
    data: normaliser(k.data),
    tekster: (k.tekster ?? {}) as TekstLager,
    rettelser: (k.rettelser ?? {}) as TekstLager,
  };
}
