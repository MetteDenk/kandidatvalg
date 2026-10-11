// Fælles visning for de offentlige sider /<slug> og /<slug>/<underside>,
// og for kladden via et hemmeligt delelink: /kladde/<delelink>[/<underside>].
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { laes } from "@/lib/kandidat";
import { PAGES, lavOpslag, type PageKey } from "@/lib/indhold";
import { KandidatSide } from "@/components/KandidatSide";
import { ContactForm } from "@/components/ContactForm";

// Hvordan siden er nået: via sin adresse eller via et delelink.
export type Adgang = { slug: string } | { delelink: string };

// Via adressen: offentlig, eller ejeren selv (så siden kan ses, før den
// offentliggøres). Via delelinket: alle, der har linket, kan se siden.
async function hent(adgang: Adgang) {
  if ("delelink" in adgang) {
    if (!/^[A-Za-z0-9_-]{20,}$/.test(adgang.delelink)) return null;
    return db.kandidat.findUnique({ where: { delelink: adgang.delelink } });
  }
  const k = await db.kandidat.findUnique({ where: { slug: adgang.slug } });
  if (!k) return null;
  if (!k.published) {
    const user = await currentUser();
    if (user?.id !== k.ownerId) return null;
  }
  return k;
}

export async function metadataFor(adgang: Adgang): Promise<Metadata> {
  const k = await hent(adgang);
  if (!k) return {};
  const { data, tekster, rettelser } = laes(k);
  const post = data.grund.post === "forperson" ? "forpersonskandidat" : "bestyrelseskandidat";
  const kladde = "delelink" in adgang;
  return {
    title: `${kladde ? "Kladde: " : ""}${data.grund.navn} - ${post} i Dansk Psykolog Forening`,
    description: lavOpslag(data, tekster, rettelser)("om.retning") || undefined,
    robots: k.published && !kladde ? undefined : { index: false, follow: false },
    // Delelinket må ikke sive videre, når der klikkes på et link på siden.
    referrer: kladde ? "no-referrer" : undefined,
  };
}

export async function Visning({ adgang, side }: { adgang: Adgang; side?: string }) {
  const k = await hent(adgang);
  if (!k) notFound();
  const kladde = "delelink" in adgang;
  const { data, tekster, rettelser } = laes(k);
  const pg = side ? PAGES.find((p) => p.path === side) : PAGES[0];
  if (!pg) notFound();
  if (data.layout === "enside" && pg.key !== "forside") notFound();
  const rod = kladde ? `/kladde/${adgang.delelink}` : `/${k.slug}`;
  const href = (p: PageKey) => {
    const path = PAGES.find((x) => x.key === p)!.path;
    return path ? `${rod}/${path}` : rod;
  };
  return (
    <>
      {kladde
        ? <div className="notice" style={{ margin: 0, borderRadius: 0 }}>Kladde. Siden er ikke offentliggjort og kan stadig ændre sig. Del ikke linket videre.</div>
        : !k.published && <div className="notice" style={{ margin: 0, borderRadius: 0 }}>Kun du kan se siden. Den er ikke offentliggjort.</div>}
      <KandidatSide
        data={data}
        tekst={lavOpslag(data, tekster, rettelser)}
        page={pg.key}
        href={href}
        kontaktformular={kladde ? <KladdeFormular /> : <ContactForm slug={k.slug} />}
      />
    </>
  );
}

// I kladden vises formularen, men den sender ikke.
function KladdeFormular() {
  return (
    <form className="s-form">
      <input placeholder="Dit navn" disabled /><input placeholder="Din e-mail" disabled />
      <textarea rows={4} placeholder="Din besked" disabled />
      <button className="s-btn" type="button" disabled>Send</button>
      <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>Formularen virker først, når siden er offentliggjort.</p>
    </form>
  );
}
