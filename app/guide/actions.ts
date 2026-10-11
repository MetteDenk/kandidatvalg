"use server";

import { redirect } from "next/navigation";
import { currentUser, logout } from "@/lib/auth";
import { db } from "@/lib/db";
import { ledigSlug, laes } from "@/lib/kandidat";
import { normaliser, tekstFelter, type TekstLager } from "@/lib/indhold";
import { skrivTekster, rens } from "@/lib/ai/tekster";

async function minKandidat() {
  const user = await currentUser();
  if (!user) throw new Error("Ikke logget ind.");
  const k = await db.kandidat.findUnique({ where: { ownerId: user.id } });
  if (!k) throw new Error("Ingen kandidatside.");
  return k;
}

// Autogemning fra guiden.
export async function gemData(input: unknown): Promise<{ ok: boolean }> {
  if (JSON.stringify(input ?? null).length > 200_000) return { ok: false };
  const k = await minKandidat();
  const data = normaliser(input);
  await db.kandidat.update({ where: { id: k.id }, data: { data } });
  return { ok: true };
}

// "Lav min side": skriver de felter om, hvis stikord er nye eller ændret,
// og giver siden en adresse ud fra navnet.
export async function lavSide(input: unknown): Promise<{ ok: boolean; fejl?: string; tekster?: TekstLager; slug?: string }> {
  const k = await minKandidat();
  const data = normaliser(input);
  const { tekster } = laes(k);
  const felter = tekstFelter(data);
  const mangler = felter.filter((f) => tekster[f.key]?.kilde !== f.raw.trim());

  let nye: TekstLager = {};
  try {
    nye = await skrivTekster(mangler, data.grund.post);
  } catch (e) {
    console.error("Tekstskrivning fejlede:", (e as Error).message);
    return { ok: false, fejl: "Teksterne kunne ikke skrives lige nu. Prøv igen om lidt." };
  }
  const samlet: TekstLager = {};
  for (const f of felter) samlet[f.key] = nye[f.key] ?? tekster[f.key];

  const slug = data.grund.navn.trim() ? await ledigSlug(data.grund.navn, k.id) : k.slug;
  await db.kandidat.update({ where: { id: k.id }, data: { data, tekster: samlet, slug, genereretAt: new Date() } });
  return { ok: true, tekster: samlet, slug };
}

// Kandidatens egen rettelse af en tekst på siden.
export async function gemRettelse(key: string, tekst: string): Promise<{ ok: boolean; rettelser?: TekstLager }> {
  const k = await minKandidat();
  const { data, rettelser } = laes(k);
  const felt = tekstFelter(data).find((f) => f.key === key);
  if (!felt) return { ok: false };
  const ny = { ...rettelser };
  const t = rens(tekst).slice(0, 6000);
  if (t) ny[key] = { tekst: t, kilde: felt.raw.trim() };
  else delete ny[key];
  await db.kandidat.update({ where: { id: k.id }, data: { rettelser: ny } });
  return { ok: true, rettelser: ny };
}

export async function fortrydRettelser(): Promise<void> {
  const k = await minKandidat();
  await db.kandidat.update({ where: { id: k.id }, data: { rettelser: {} } });
}

export async function saetOffentlig(offentlig: boolean): Promise<{ ok: boolean; slug: string }> {
  const k = await minKandidat();
  await db.kandidat.update({ where: { id: k.id }, data: { published: offentlig } });
  return { ok: true, slug: k.slug };
}

// "Fjern": sletter siden, svarene, teksterne og alle uploadede billeder (via
// cascade i databasen). Login-kontoen slettes også, så der intet ligger tilbage.
export async function sletAlt(): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");
  await logout();
  await db.user.delete({ where: { id: user.id } });
  redirect("/?slettet=1");
}

export async function logUd(): Promise<void> {
  await logout();
  redirect("/");
}
