"use client";

// ---------------------------------------------------------------------------
// Guiden: 13 trin i fast rækkefølge, som Fagspejlets Skitse. Indhold først
// (trin 1-7), derefter sidens opbygning og design (trin 8-13). Svarene
// gemmes automatisk. "Lav min side" skriver stikordene om og viser siden,
// hvor kandidaten kan rette, offentliggøre, lade ligge eller fjerne.
// ---------------------------------------------------------------------------
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { KandidatSide } from "./KandidatSide";
import { FONTS, LAYOUTS, PALETTES, fontById, layoutById, paletteById, type LayoutId } from "@/lib/design";
import {
  EMNER, OM_SPOERGSMAAL, PAGES, ROLLE_SPOERGSMAAL, SEKTIONER, alleEmneIds, emneInfo, emneOverskrift,
  lavOpslag, pointerIds, type KandidatData, type OmFelt, type PageKey, type TekstLager,
} from "@/lib/indhold";
import { delKladde, fortrydRettelser, gemData, gemRettelse, lavSide, logUd, lukDelelink, saetOffentlig, sletAlt } from "@/app/guide/actions";

type Props = {
  startData: KandidatData;
  startTekster: TekstLager;
  startRettelser: TekstLager;
  startSlug: string;
  startOffentlig: boolean;
  startDelelink: string | null;
  harTekster: boolean;
  appUrl: string;
};

type Step = { group: string; intro: string; body: ReactNode; preview?: boolean; valid?: () => boolean; msg?: string };

export function Guide(props: Props) {
  const [d, setD] = useState<KandidatData>(props.startData);
  const [tekster, setTekster] = useState<TekstLager>(props.startTekster);
  const [rettelser, setRettelser] = useState<TekstLager>(props.startRettelser);
  const [slug, setSlug] = useState(props.startSlug);
  const [offentlig, setOffentlig] = useState(props.startOffentlig);
  const [delelink, setDelelink] = useState(props.startDelelink);
  const [visDelelink, setVisDelelink] = useState(false);
  const [kopieret, setKopieret] = useState(false);
  const [view, setView] = useState<"guide" | "side">(props.harTekster ? "side" : "guide");
  const [page, setPage] = useState<PageKey>("forside");
  const [editing, setEditing] = useState(false);
  const [arbejder, setArbejder] = useState(false);
  const [fejl, setFejl] = useState("");
  const [besked, setBesked] = useState("");
  const [gemt, setGemt] = useState<"gemt" | "gemmer" | "fejl">("gemt");

  // Autogemning, et øjeblik efter sidste ændring.
  const foerste = useRef(true);
  useEffect(() => {
    if (foerste.current) { foerste.current = false; return; }
    setGemt("gemmer");
    const t = setTimeout(() => {
      gemData(d).then((r) => setGemt(r.ok ? "gemt" : "fejl")).catch(() => setGemt("fejl"));
    }, 700);
    return () => clearTimeout(t);
  }, [d]);

  const opdater = (fn: (x: KandidatData) => void) => setD((prev) => { const n = structuredClone(prev); fn(n); return n; });
  const tekst = useMemo(() => lavOpslag(d, tekster, rettelser), [d, tekster, rettelser]);
  const fp = d.grund.post === "forperson";

  // ----- Felter -----
  const tf = (label: ReactNode, get: (x: KandidatData) => string, put: (x: KandidatData, v: string) => void, hint?: string) => (
    <>
      <label className="l">{label}</label>
      {hint && <p className="hint">{hint}</p>}
      <textarea className="ui-textarea" value={get(d)} onChange={(e) => { const v = e.target.value; opdater((x) => put(x, v)); }} />
    </>
  );
  const inp = (label: ReactNode, get: (x: KandidatData) => string, put: (x: KandidatData, v: string) => void, ph = "", type = "text") => (
    <>
      <label className="l">{label}</label>
      <input className="ui-input" type={type} value={get(d)} placeholder={ph} onChange={(e) => { const v = e.target.value; opdater((x) => put(x, v)); }} />
    </>
  );
  const omFelt = (k: OmFelt, label?: string, hint?: string) =>
    tf(label ?? OM_SPOERGSMAAL[k], (x) => x.om[k], (x, v) => { x.om[k] = v; }, hint);

  // ----- Billeder -----
  async function upload(file: File, hvor: "foto" | "banner") {
    setFejl("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setFejl(json.error ?? "Billedet kunne ikke uploades."); return; }
    opdater((x) => { x[hvor] = json.url; });
  }

  // ----- Trinene -----
  const steps: Step[] = [
    {
      group: "1. Grundoplysninger",
      intro: "Velkommen. Guiden leder dig gennem spørgsmål om dig og dine mærkesager. Til sidst vælger du, hvordan siden skal se ud. Alle felter er frivillige, undtagen dit navn og én måde at kontakte dig på. Stikord er nok.",
      body: <>
        {inp("Dit navn", (x) => x.grund.navn, (x, v) => { x.grund.navn = v; }, "Fornavn og efternavn")}
        <label className="l">Hvilken post stiller du op til?</label>
        <div className="radio">{([["forperson", "Forperson"], ["bestyrelse", "Bestyrelsen"]] as const).map(([v, t]) => (
          <button key={v} className={"tile" + (d.grund.post === v ? " on" : "")} onClick={() => opdater((x) => { x.grund.post = v; })}>{t}</button>))}</div>
        {inp("E-mail, der vises på siden og modtager beskeder fra kontaktformularen", (x) => x.grund.email, (x, v) => { x.grund.email = v; }, "", "email")}
        {inp("Telefon (valgfrit)", (x) => x.grund.telefon, (x, v) => { x.grund.telefon = v; }, "", "tel")}
        {inp("Sociale medier (valgfrit)", (x) => x.grund.some, (x, v) => { x.grund.some = v; }, "Fx linkedin.com/in/...")}
        <label className="l">Kontaktformular</label>
        <div className="radio">{([[true, "Vis kontaktformular"], [false, "Ingen formular"]] as const).map(([v, t]) => (
          <button key={String(v)} className={"tile" + (d.grund.formular === v ? " on" : "")} onClick={() => opdater((x) => { x.grund.formular = v; })}>{t}</button>))}</div>
        <p className="hint" style={{ marginTop: 18 }}>
          Du er selv dataansvarlig for dine svar og din side. <a href="/privatliv" target="_blank" rel="noreferrer">Sådan behandles dine oplysninger</a>
        </p>
      </>,
      valid: () => !!d.grund.navn.trim() && (!!d.grund.email.trim() || !!d.grund.telefon.trim()),
      msg: "Skriv dit navn og mindst en e-mail eller et telefonnummer.",
    },
    {
      group: "2. Om dig",
      intro: "Spørgsmålene hjælper dig med at få dine tanker på plads. Svar på dem, du har lyst til. Stikord er nok, de bliver skrevet om til flydende tekst.",
      body: <>
        {omFelt("nu")}
        {omFelt("post", fp ? "Hvorfor til forpersonsposten?" : "Hvorfor til bestyrelsen?")}
        {omFelt("retning")}
        {omFelt("maales")}
        {omFelt("mindre")}
        {omFelt("erfaring", undefined, "Giv gerne et konkret eksempel.")}
        {omFelt("beslut")}
        {omFelt("mindretal")}
        {omFelt("godt")}
        {omFelt("aendre")}
        {omFelt("kender")}
        {omFelt("mindst")}
      </>,
    },
    {
      group: "3. Rollen",
      intro: fp ? "Forpersonen er frikøbt på fuld tid og leder den daglige drift sammen med direktøren." : "Bestyrelsen består af forpersonen, 8 kandidatmedlemmer og 2 studentermedlemmer.",
      body: fp ? <>
        {tf(ROLLE_SPOERGSMAAL.f1, (x) => x.rolle.f1, (x, v) => { x.rolle.f1 = v; })}
        {tf(ROLLE_SPOERGSMAAL.f2, (x) => x.rolle.f2, (x, v) => { x.rolle.f2 = v; })}
        {tf(ROLLE_SPOERGSMAAL.f3, (x) => x.rolle.f3, (x, v) => { x.rolle.f3 = v; })}
      </> : tf(ROLLE_SPOERGSMAAL.b1, (x) => x.rolle.b1, (x, v) => { x.rolle.b1 = v; }),
    },
    {
      group: "4. Vælg emner",
      intro: "Vælg de emner, du vil sige noget om. Dit valg bestemmer, hvilke spørgsmål du får i næste trin. Du kan også springe dem alle over og skrive dine egne emner senere.",
      body: <div className="tiles">{EMNER.map((e) => (
        <button key={e.id} className={"tile" + (d.valgte.includes(e.id) ? " on" : "")}
          onClick={() => opdater((x) => { x.valgte = x.valgte.includes(e.id) ? x.valgte.filter((y) => y !== e.id) : [...x.valgte, e.id]; })}>
          <strong>{e.id}.</strong> {e.titel}
        </button>))}</div>,
    },
    {
      group: "5. Dine emner",
      intro: "For hvert emne kan du bruge de tre spørgsmål. \"Mulige veje\" er kun til inspiration. Overskriften er valgfri og bruges på din side. Du kan også give AI'en en opgave i et felt. Begynd med \"AI:\", fx \"AI: undersøg, hvorfor 10-årsplanen er vigtig for psykologer, og kom med en anbefaling\". Så undersøger den sagen og skriver et forslag, der følger din linje fra de øvrige svar.",
      body: d.valgte.length ? <>{EMNER.filter((e) => d.valgte.includes(e.id)).map((e) => (
        <div className="emne" key={e.id}>
          <h4>{e.id}. {e.titel}</h4>
          {e.bg && <p className="bg">{e.bg}</p>}
          <p className="bg"><strong>{e.sp}</strong></p>
          {e.veje && <p className="veje">Mulige veje: {e.veje}</p>}
          {inp("Din overskrift (valgfri)", (x) => x.emner[e.id].overskrift, (x, v) => { x.emner[e.id].overskrift = v; }, e.titel)}
          {tf("Hvad vil du konkret gøre?", (x) => x.emner[e.id].konkret, (x, v) => { x.emner[e.id].konkret = v; })}
          {tf("Hvad er dit første skridt?", (x) => x.emner[e.id].skridt, (x, v) => { x.emner[e.id].skridt = v; })}
          {tf("Hvad koster det, og hvem mærker det?", (x) => x.emner[e.id].pris, (x, v) => { x.emner[e.id].pris = v; })}
        </div>))}</> : <p className="hint">Du har ikke valgt nogen emner. Gå videre, eller gå tilbage og vælg nogle.</p>,
    },
    {
      group: "6. Dine egne emner",
      intro: "Skriv det, du vil have med, og som ikke stod på listen. Brug gerne de samme tre spørgsmål. Stikord er nok, og du kan give AI'en en opgave, fx \"AI: undersøg ... og kom med en anbefaling\".",
      body: <>{d.egne.map((_, n) => (
        <div className="emne" key={n}>
          <h4>Eget emne {n + 1}</h4>
          {inp("Emne", (x) => x.egne[n].titel, (x, v) => { x.egne[n].titel = v; }, "Fx Psykologer i ældreplejen")}
          {tf("Hvad vil du konkret gøre?", (x) => x.egne[n].konkret, (x, v) => { x.egne[n].konkret = v; })}
          {tf("Hvad er dit første skridt?", (x) => x.egne[n].skridt, (x, v) => { x.egne[n].skridt = v; })}
          {tf("Hvad koster det, og hvem mærker det?", (x) => x.egne[n].pris, (x, v) => { x.egne[n].pris = v; })}
        </div>))}</>,
    },
    {
      group: "7. Dine vigtigste pointer",
      intro: "Vælg de 3-5 emner, der skal stå øverst på din side.",
      body: (() => {
        const ids = alleEmneIds(d); const valgt = pointerIds(d);
        if (!ids.length) return <p className="hint">Du har ikke svaret på nogen emner endnu.</p>;
        return <><p className="hint">{valgt.length} valgt.</p><div className="tiles">{ids.map((id) => {
          const on = valgt.includes(id);
          return (
            <button key={id} className={"tile" + (on ? " on" : "")} disabled={!on && valgt.length >= 5}
              onClick={() => opdater((x) => { const v = pointerIds(x); x.pointer = v.includes(id) ? v.filter((y) => y !== id) : [...v, id]; })}>
              {emneOverskrift(d, id)}<small>{emneInfo(d, id).titel}</small>
            </button>);
        })}</div></>;
      })(),
      valid: () => { const n = pointerIds(d).length; return n === 0 || (n >= 3 && n <= 5); },
      msg: "Vælg 3-5 pointer, eller ingen.",
    },
    {
      group: "8. Din side",
      intro: "Slå sektioner til og fra, og flyt dem op og ned inden for hver underside. Sektioner uden svar vises ikke. Undersider uden sektioner vises ikke i menuen.",
      preview: true,
      body: <>{PAGES.map((pg) => {
        const raekker = d.sektioner.map((s, idx) => ({ s, idx, def: SEKTIONER.find((x) => x.id === s.id)! })).filter((r) => r.def.page === pg.key);
        return (
          <div key={pg.key}>
            <div className="pagelabel">{pg.label}</div>
            {raekker.map((r, n) => (
              <div className="secrow" key={r.s.id}>
                <button className={"tile" + (r.s.on ? " on" : "")} disabled={r.def.fast}
                  onClick={() => opdater((x) => { x.sektioner[r.idx].on = !x.sektioner[r.idx].on; })}>
                  {r.def.label}{r.def.fast ? " (fast)" : ""}<small>{r.def.desc}</small>
                </button>
                <button className="btn small" disabled={n === 0} onClick={() => opdater((x) => flyt(x, r.idx, raekker[n - 1].idx))}>Op</button>
                <button className="btn small" disabled={n === raekker.length - 1} onClick={() => opdater((x) => flyt(x, r.idx, raekker[n + 1].idx))}>Ned</button>
              </div>))}
          </div>);
      })}</>,
    },
    {
      group: "Design - vælg layout",
      intro: "Vælg det layout, der passer bedst til dig. Du ser det med dine egne svar og kan altid skifte senere.",
      preview: true,
      body: <div className="tiles to">{LAYOUTS.map((l) => (
        <button key={l.id} className={"tile" + (d.layout === l.id ? " on" : "")} onClick={() => { opdater((x) => { x.layout = l.id; }); setPage("forside"); }}>
          <Skema id={l.id} /><strong>{l.name}</strong><small>{l.tag}</small>
        </button>))}</div>,
    },
    {
      group: "Design - vælg farve",
      intro: "Vælg den farvepalet, der passer bedst til dig.",
      preview: true,
      body: <div className="tiles to">{PALETTES.map((p) => (
        <button key={p.id} className={"tile" + (d.palette === p.id ? " on" : "")} onClick={() => opdater((x) => { x.palette = p.id; })}>
          <strong>{p.name}</strong><small>{p.desc}</small>
          <div className="swatches">{[p.bg, p.secondary, p.accent, p.text].map((c, i) => <i key={i} style={{ background: c }} />)}</div>
        </button>))}</div>,
    },
    {
      group: "Design - vælg typografi",
      intro: "Vælg skriften til overskrifterne.",
      preview: true,
      body: <div className="tiles to">{FONTS.map((f) => (
        <button key={f.id} className={"tile" + (d.font === f.id ? " on" : "")} onClick={() => opdater((x) => { x.font = f.id; })}>
          <span style={{ fontFamily: f.css, fontWeight: f.weight, fontSize: 24 }}>Aa Æø</span><small>{f.name}</small>
        </button>))}</div>,
    },
    {
      group: "Design - tilføj billeder",
      intro: "Upload et portræt. Et billede til toppen af siden er valgfrit. Uploader du intet, bruges en flade i dine farver.",
      preview: true,
      body: <>
        <label className="l">Portræt</label>
        <BilledValg url={d.foto} rund onFil={(f) => upload(f, "foto")} onFjern={() => opdater((x) => { x.foto = null; })} />
        <label className="l">Billede til toppen (valgfrit)</label>
        <p className="hint">Vises i layoutene Én side og Mærkesags-mosaik.</p>
        <BilledValg url={d.banner} onFil={(f) => upload(f, "banner")} onFjern={() => opdater((x) => { x.banner = null; })} />
        <p className="hint">JPEG, PNG eller WebP, højst 5 MB.</p>
      </>,
    },
    {
      group: "Design - sådan kunne det se ud",
      intro: "Her er din side med dine valg. Klik rundt i menuen. Når du er klar, bliver dine stikord skrevet om til tekst, og du kan rette dem bagefter.",
      preview: true,
      body: <p className="hint">Layout: <strong>{layoutById(d.layout).name}</strong> · Farve: <strong>{paletteById(d.palette).name}</strong> · Skrift: <strong>{fontById(d.font).name}</strong></p>,
    },
  ];

  const step = Math.min(d.step, steps.length - 1);
  const st = steps[step];
  const sidst = step === steps.length - 1;
  const gaaTil = (n: number) => { setFejl(""); opdater((x) => { x.step = n; }); window.scrollTo(0, 0); };

  const frem = () => {
    if (st.valid && !st.valid()) { setFejl(st.msg ?? ""); return; }
    if (sidst) lav(); else gaaTil(step + 1);
  };

  // Forrige og Næste står både øverst og nederst på hvert trin.
  const nav = (
    <div className="nav">
      <button className="btn" disabled={step === 0} onClick={() => gaaTil(step - 1)}>Forrige</button>
      {!sidst && <button className="btn link" onClick={() => gaaTil(steps.length - 1)}>Gå til sidste trin</button>}
      <button className="btn primary" onClick={frem}>{sidst ? "Lav min side" : "Næste"}</button>
    </div>
  );

  async function lav() {
    // Man kan hoppe direkte til sidste trin, så alle trin tjekkes, før siden laves.
    const ugyldig = steps.findIndex((s) => s.valid && !s.valid());
    if (ugyldig >= 0) { gaaTil(ugyldig); setFejl(steps[ugyldig].msg ?? ""); return; }
    setArbejder(true); setFejl("");
    try {
      const r = await lavSide(d);
      if (!r.ok) { setFejl(r.fejl ?? "Noget gik galt."); return; }
      setTekster(r.tekster ?? {}); if (r.slug) setSlug(r.slug);
      setView("side"); setPage("forside"); setBesked(""); window.scrollTo(0, 0);
    } catch {
      setFejl("Noget gik galt. Prøv igen.");
    } finally { setArbejder(false); }
  }

  const side = (editable: boolean) => (
    <KandidatSide
      data={d} tekst={tekst} page={page}
      onGoto={(p) => { setPage(p); document.querySelector(".preview")?.scrollTo(0, 0); window.scrollTo(0, 0); }}
      editable={editable}
      onEdit={async (key, ny) => { const r = await gemRettelse(key, ny); if (r.ok && r.rettelser) setRettelser(r.rettelser); }}
      kontaktformular={<form className="s-form" onSubmit={(e) => e.preventDefault()}>
        <input placeholder="Dit navn" disabled /><input placeholder="Din e-mail" disabled />
        <textarea rows={4} placeholder="Din besked" disabled />
        <button className="s-btn" type="button">Send</button>
        <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>Din besked går direkte til mig.</p>
      </form>}
    />
  );

  // ----- Den færdige side -----
  if (view === "side") {
    const url = `${props.appUrl}/${slug}`;
    const kladdeUrl = `${props.appUrl || (typeof window !== "undefined" ? window.location.origin : "")}/kladde/${delelink}`;
    return (
      <div>
        <div className="toolbar">
          <button className="btn small" onClick={() => { setView("guide"); setEditing(false); }}>Tilbage til guiden</button>
          <select value={d.layout} onChange={(e) => { const v = e.target.value as LayoutId; opdater((x) => { x.layout = v; }); setPage("forside"); }}>
            {LAYOUTS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
          <select value={d.palette} onChange={(e) => { const v = e.target.value; opdater((x) => { x.palette = v; }); }}>
            {PALETTES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select value={d.font} onChange={(e) => { const v = e.target.value; opdater((x) => { x.font = v; }); }}>
            {FONTS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
          <button className={"btn small" + (editing ? " primary" : "")} onClick={() => setEditing(!editing)}>{editing ? "Færdig med at rette" : "Ret tekster"}</button>
          <span className="sp" />
          {offentlig
            ? <button className="btn small" onClick={async () => { await saetOffentlig(false); setOffentlig(false); setBesked("Siden er trukket tilbage og er ikke længere offentlig. Den ligger her, så du kan vende tilbage til den."); }}>Træk tilbage</button>
            : <button className="btn small primary" onClick={async () => { await saetOffentlig(true); setOffentlig(true); setBesked(""); }}>Offentliggør</button>}
          <button className={"btn small" + (visDelelink ? " primary" : "")} onClick={async () => {
            if (visDelelink) { setVisDelelink(false); return; }
            const r = await delKladde(); setDelelink(r.delelink); setVisDelelink(true); setKopieret(false);
          }}>Del kladde</button>
          <button className="btn small" onClick={() => setBesked("Siden er gemt og ligger her, til du kommer tilbage. Den er ikke offentlig, før du vælger det.")} disabled={offentlig}>Lad ligge</button>
          <button className="btn small fare" onClick={async () => {
            if (confirm("Vil du fjerne din side? Siden, dine svar, teksterne og billederne slettes, og det kan ikke fortrydes.")) await sletAlt();
          }}>Fjern</button>
          <button className="btn small" onClick={() => logUd()}>Log ud</button>
        </div>
        {offentlig && <div className="notice">Din side er offentlig på <a href={url} target="_blank" rel="noreferrer">{url}</a>. Ændringer slår igennem med det samme.</div>}
        {besked && <div className="notice">{besked}</div>}
        {visDelelink && (delelink
          ? <div className="notice">
              Send dette link til dem, der skal se din kladde. De kan se hele siden uden at logge ind, men de kan ikke rette noget. Siden bliver ikke offentlig, og søgemaskiner viser den ikke.
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
                <input readOnly value={kladdeUrl} onFocus={(e) => e.target.select()} style={{ flex: "1 1 320px", minWidth: 0, font: "inherit", padding: "5px 8px" }} />
                <button className="btn small" onClick={async () => { try { await navigator.clipboard.writeText(kladdeUrl); setKopieret(true); } catch { setKopieret(false); } }}>{kopieret ? "Kopieret" : "Kopiér link"}</button>
                <a className="btn small" href={kladdeUrl} target="_blank" rel="noreferrer">Åbn</a>
                <button className="btn small fare" onClick={async () => {
                  if (confirm("Luk linket? Det holder op med at virke med det samme. Du kan lave et nyt link bagefter.")) {
                    await lukDelelink(); setDelelink(null); setVisDelelink(false); setBesked("Delelinket er lukket og virker ikke længere.");
                  }
                }}>Luk linket</button>
              </div>
            </div>
          : <div className="notice">Der er intet delelink. Tryk på <b>Del kladde</b> for at lave et nyt.</div>)}
        {editing && <div className="notice">
          Klik i en tekst med stiplet ramme, og ret den direkte. Rettelsen gemmes, når du klikker et andet sted.{" "}
          {Object.keys(rettelser).length > 0 && <button className="btn small" onClick={async () => {
            if (confirm("Fjerne alle dine rettelser og gå tilbage til de skrevne tekster?")) { await fortrydRettelser(); setRettelser({}); }
          }}>Fjern mine rettelser</button>}
        </div>}
        {side(editing)}
      </div>
    );
  }

  // ----- Guiden -----
  if (arbejder) {
    return (
      <main className="smal" style={{ textAlign: "center" }}>
        <div className="card">
          <div className="spinner" />
          <p style={{ fontWeight: 600 }}>Dine stikord bliver skrevet om til tekst …</p>
          <p className="hint">Det tager typisk 20-60 sekunder.</p>
        </div>
      </main>
    );
  }

  return (
    <div>
      <div className="topbar">
        <div><b>Psykologkompasset</b> <span className="small">{gemt === "gemmer" ? "Gemmer …" : gemt === "fejl" ? "Kunne ikke gemme" : "Alt er gemt"}</span></div>
        <div className="hoejre">
          {props.harTekster || Object.keys(tekster).length ? <button className="btn small" onClick={() => setView("side")}>Se min side</button> : null}
          <button className="btn small" onClick={() => logUd()}>Log ud</button>
        </div>
      </div>
      <div className={"shell" + (st.preview ? " with-preview" : "")}>
        <div className="card">
          <div className="group">{st.group}</div>
          <div className="bar"><div style={{ width: `${Math.round((step / steps.length) * 100)}%` }} /></div>
          <div className="dots">{steps.map((s, i) => (
            <button key={i} className={i < step ? "done" : i === step ? "cur" : ""} title={s.group} aria-label={s.group} onClick={() => gaaTil(i)} />))}</div>
          {nav}
          {fejl && <p className="err" style={{ marginTop: -10 }}>{fejl}</p>}
          <p className="saved">Dine svar gemmes automatisk, så du altid kan vende tilbage og fortsætte.</p>
          <p className="intro">{st.intro}</p>
          {st.body}
          {fejl && <p className="err">{fejl}</p>}
          {nav}
        </div>
        {st.preview && <div className="preview-wrap"><p className="preview-head">Forhåndsvisning</p><div className="preview">{side(false)}</div></div>}
      </div>
    </div>
  );
}

function flyt(x: KandidatData, a: number, b: number) {
  const s = x.sektioner;
  [s[a], s[b]] = [s[b], s[a]];
}

function BilledValg({ url, rund, onFil, onFjern }: { url: string | null; rund?: boolean; onFil: (f: File) => void; onFjern: () => void }) {
  return (
    <div className="imgrow">
      <div className={"thumb" + (rund ? " round" : " bred")} style={url ? { backgroundImage: `url(${url})` } : undefined} />
      <div>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFil(f); e.target.value = ""; }} />
        {url && <div><button className="btn small" style={{ marginTop: 6 }} onClick={onFjern}>Fjern</button></div>}
      </div>
    </div>
  );
}

function Skema({ id }: { id: LayoutId }) {
  const b = (x: number, y: number, w: number, h: number, k: number) => <b key={k} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />;
  const m: Record<LayoutId, [number, number, number, number][]> = {
    enside: [[0, 0, 100, 30], [10, 38, 80, 10], [10, 54, 80, 10], [10, 70, 80, 10], [10, 86, 80, 10]],
    anker: [[0, 0, 26, 100], [32, 12, 60, 14], [32, 34, 60, 10], [32, 52, 60, 10], [32, 70, 60, 10]],
    mosaik: [[0, 0, 100, 12], [6, 20, 27, 36], [37, 20, 27, 36], [68, 20, 27, 36], [6, 64, 89, 10]],
    hub: [[0, 0, 100, 12], [8, 20, 3, 26], [14, 22, 60, 8], [14, 34, 78, 8], [8, 56, 3, 26], [14, 58, 60, 8], [14, 70, 78, 8]],
  };
  return <div className="schema">{m[id].map((r, k) => b(...r, k))}</div>;
}
