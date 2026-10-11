// Fælles visning for de offentlige sider /<slug> og /<slug>/<underside>.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { laes } from "@/lib/kandidat";
import { PAGES, lavOpslag, type PageKey } from "@/lib/indhold";
import { KandidatSide } from "@/components/KandidatSide";
import { ContactForm } from "@/components/ContactForm";

// Offentlig, eller ejeren selv (så siden kan ses, før den offentliggøres).
async function hent(slug: string) {
  const k = await db.kandidat.findUnique({ where: { slug } });
  if (!k) return null;
  if (!k.published) {
    const user = await currentUser();
    if (user?.id !== k.ownerId) return null;
  }
  return k;
}

export async function metadataFor(slug: string): Promise<Metadata> {
  const k = await hent(slug);
  if (!k) return {};
  const { data, tekster, rettelser } = laes(k);
  const post = data.grund.post === "forperson" ? "forpersonskandidat" : "bestyrelseskandidat";
  return {
    title: `${data.grund.navn} - ${post} i Dansk Psykolog Forening`,
    description: lavOpslag(data, tekster, rettelser)("om.retning") || undefined,
    robots: k.published ? undefined : { index: false },
  };
}

export async function Visning({ slug, side }: { slug: string; side?: string }) {
  const k = await hent(slug);
  if (!k) notFound();
  const { data, tekster, rettelser } = laes(k);
  const pg = side ? PAGES.find((p) => p.path === side) : PAGES[0];
  if (!pg) notFound();
  if (data.layout === "enside" && pg.key !== "forside") notFound();
  const href = (p: PageKey) => {
    const path = PAGES.find((x) => x.key === p)!.path;
    return path ? `/${slug}/${path}` : `/${slug}`;
  };
  return (
    <>
      {!k.published && <div className="notice" style={{ margin: 0, borderRadius: 0 }}>Kun du kan se siden. Den er ikke offentliggjort.</div>}
      <KandidatSide
        data={data}
        tekst={lavOpslag(data, tekster, rettelser)}
        page={pg.key}
        href={href}
        kontaktformular={<ContactForm slug={slug} />}
      />
    </>
  );
}
