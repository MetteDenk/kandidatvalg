// ---------------------------------------------------------------------------
// Kandidatsiden. Bruges både som forhåndsvisning i guiden (klient) og som den
// offentlige side (server). Ingen hooks, så den kan køre begge steder.
// ---------------------------------------------------------------------------
import type { CSSProperties, ReactNode } from "react";
import { fontById, paletteById } from "@/lib/design";
import {
  PAGES, SEKTIONER, alleEmneIds, emneInfo, emneOverskrift, pointerIds,
  type KandidatData, type PageKey, type SektionId,
} from "@/lib/indhold";

export type SideProps = {
  data: KandidatData;
  tekst: (key: string) => string;
  page: PageKey;
  href?: (page: PageKey) => string;
  onGoto?: (page: PageKey) => void;
  editable?: boolean;
  onEdit?: (key: string, tekst: string) => void;
  kontaktformular?: ReactNode;
  byggetMed?: string;
};

export function KandidatSide(props: SideProps) {
  const { data: d, page } = props;
  const p = paletteById(d.palette);
  const f = fontById(d.font);
  const style = {
    "--bg": p.bg, "--bgcss": p.bgCss, "--text": p.text, "--accent": p.accent,
    "--secondary": p.secondary, "--hfont": f.css, "--hweight": f.weight,
  } as CSSProperties;
  const navn = d.grund.navn.trim() || "[Dit navn]";
  const foot = <div className="s-foot">Siden er bygget med {props.byggetMed ?? "Psykologkompasset"}.</div>;
  const sider = sidenesIndhold(d, props);
  const iBrug = PAGES.filter((pg) => sider[pg.key].length > 0);
  const aktiv: PageKey = iBrug.find((x) => x.key === page) ? page : "forside";

  if (d.layout === "enside") {
    return <div className="site" style={style}>{PAGES.flatMap((pg) => sider[pg.key])}{foot}</div>;
  }

  const links = iBrug.map((pg) => (
    <Lnk key={pg.key} to={pg.key} {...props} className={pg.key === aktiv ? "on" : ""}>{pg.label}</Lnk>
  ));
  const body = sider[aktiv];

  if (d.layout === "anker") {
    return (
      <div className="site" style={style}>
        <div className="s-anker">
          <aside className="s-side">
            <div className="s-portrait" style={d.foto ? { backgroundImage: `url(${d.foto})` } : undefined} />
            <div className="s-side-navn">{navn}</div>
            <div className="post">{postTekst(d)} · GF27</div>
            <nav>{links}</nav>
          </aside>
          <main>{body}{foot}</main>
        </div>
      </div>
    );
  }
  return (
    <div className="site" style={style}>
      <nav className="s-nav"><span className="brand">{navn}</span>{links}</nav>
      {body}{foot}
    </div>
  );
}

const postTekst = (d: KandidatData) => (d.grund.post === "forperson" ? "Forpersonskandidat" : "Bestyrelseskandidat");

function Lnk(props: SideProps & { to: PageKey; className?: string; children: ReactNode }) {
  if (props.href) return <a href={props.href(props.to)} className={props.className}>{props.children}</a>;
  return (
    <a className={props.className} role="button" onClick={() => props.onGoto?.(props.to)} style={{ cursor: "pointer" }}>
      {props.children}
    </a>
  );
}

// Redigérbar tekst. Rettelsen gemmes, når feltet forlades.
function T({ k, props, as = "p", className }: { k: string; props: SideProps; as?: "p" | "span"; className?: string }) {
  const tekst = props.tekst(k);
  if (!tekst) return null;
  const Tag = as;
  if (!props.editable) return <Tag className={className}>{tekst}</Tag>;
  return (
    <Tag
      className={(className ? className + " " : "") + "redigerbar"}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const ny = e.currentTarget.innerText.trim();
        if (ny !== tekst) props.onEdit?.(k, ny);
      }}
    >
      {tekst}
    </Tag>
  );
}

const EMNE_DELE = ["konkret", "skridt", "pris"] as const;

function sidenesIndhold(d: KandidatData, props: SideProps): Record<PageKey, ReactNode[]> {
  const tekst = props.tekst;
  const L = d.layout;
  const pIds = pointerIds(d);
  const on = (id: SektionId) => !!d.sektioner.find((s) => s.id === id)?.on;
  const sek = (key: string, inner: ReactNode) => (
    <section className="s-sec" key={key}><div className="s-inner">{inner}</div></section>
  );
  const emneTekster = (id: string) => EMNE_DELE.map((del) => <T key={del} k={`${id}.${del}`} props={props} />);
  const foersteSaetning = (id: string) => {
    const t = tekst(id + ".konkret") || tekst(id + ".skridt") || tekst(id + ".pris");
    return t.split(/(?<=[.!?])\s/)[0];
  };

  const render = (id: SektionId): ReactNode => {
    switch (id) {
      case "velkomst": {
        const banner = L === "enside" || L === "mosaik"
          ? <div className="s-banner" style={d.banner ? { backgroundImage: `url(${d.banner})` } : undefined} />
          : null;
        return (
          <div key="velkomst">
            {banner}
            <div className="s-inner">
              <div className={"s-hero" + (L === "anker" ? " uden-foto" : "")}>
                {L !== "anker" && <div className="s-portrait" style={d.foto ? { backgroundImage: `url(${d.foto})` } : undefined} />}
                <div>
                  <div className="s-kicker">{postTekst(d)} · Dansk Psykolog Forening · GF27</div>
                  <h1>{d.grund.navn.trim() || "[Dit navn]"}</h1>
                  <T k="om.retning" props={props} className="s-direction" />
                </div>
              </div>
            </div>
          </div>
        );
      }
      case "hvorfor":
        if (!tekst("om.nu") && !tekst("om.post")) return null;
        return sek(id, <><h2>Hvorfor jeg stiller op</h2><T k="om.nu" props={props} /><T k="om.post" props={props} /></>);
      case "pointer": {
        if (!pIds.length) return null;
        if (L === "mosaik") {
          return sek(id, <><h2>Mine vigtigste pointer</h2><div className="s-grid">{pIds.map((eid) => (
            <Lnk key={eid} to="maerkesager" {...props} className="s-tile">
              <h3>{emneOverskrift(d, eid)}</h3><p>{foersteSaetning(eid)}</p><span className="more">Læs mere</span>
            </Lnk>))}</div></>);
        }
        if (L === "hub") {
          return sek(id, <><h2>Mine vigtigste pointer</h2>{pIds.map((eid) => (
            <div className="s-q" key={eid}>
              <h3>{emneInfo(d, eid).sp || emneOverskrift(d, eid)}</h3>
              <p>{tekst(eid + ".konkret") || foersteSaetning(eid)}</p>
              {on("emner") && <Lnk to="maerkesager" {...props}>Læs mere</Lnk>}
            </div>))}</>);
        }
        if (L === "enside") {
          return sek(id, <><h2>Mine vigtigste pointer</h2>{pIds.map((eid, n) => (
            <div className="s-card" key={eid}><div className="s-num">{n + 1}</div><h3>{emneOverskrift(d, eid)}</h3>{emneTekster(eid)}</div>))}</>);
        }
        return sek(id, <><h2>Mine vigtigste pointer</h2><ol className="s-list">{pIds.map((eid) => (
          <li key={eid}><Lnk to="maerkesager" {...props}><strong>{emneOverskrift(d, eid)}</strong></Lnk></li>))}</ol></>);
      }
      case "maales": {
        const m = tekst("om.maales");
        if (!m) return null;
        const punkter = m.includes("|") ? m.split("|") : [m];
        return sek(id, <>
          <h2>Det vil jeg måles på</h2>
          <ol className="s-list">{punkter.map((x, n) => (
            <li key={n}
              className={props.editable ? "redigerbar" : undefined}
              contentEditable={props.editable || undefined}
              suppressContentEditableWarning
              onBlur={props.editable ? (e) => {
                const ny = [...punkter]; ny[n] = e.currentTarget.innerText.trim();
                const samlet = ny.filter(Boolean).join("|");
                if (samlet !== m) props.onEdit?.("om.maales", samlet);
              } : undefined}
            >{x}</li>))}</ol>
          <T k="om.mindre" props={props} />
        </>);
      }
      case "emner": {
        if (L === "enside" && on("pointer") && pIds.length) return null;
        const ids = pIds.length ? pIds : alleEmneIds(d);
        if (!ids.length) return null;
        return sek(id, <><h2>Mine mærkesager</h2>{ids.map((eid) => (
          <div className={L === "hub" ? "s-q" : "s-card"} key={eid}>
            <h3>{L === "hub" ? emneInfo(d, eid).sp || emneOverskrift(d, eid) : emneOverskrift(d, eid)}</h3>
            {emneTekster(eid)}
          </div>))}</>);
      }
      case "ogsaa": {
        if (!pIds.length) return null;
        const ids = alleEmneIds(d).filter((x) => !pIds.includes(x));
        if (!ids.length) return null;
        return sek(id, <><h2>Jeg vil også arbejde for</h2>{ids.map((eid) => (
          <p key={eid}><strong>{emneOverskrift(d, eid)}.</strong>{" "}
            {tekst(eid + ".konkret") ? <T k={eid + ".konkret"} props={props} as="span" /> : <span>{foersteSaetning(eid)}</span>}
          </p>))}</>);
      }
      case "erfaring":
        if (!tekst("om.erfaring") && !tekst("om.kender") && !tekst("om.mindst")) return null;
        return sek(id, <><h2>Erfaring</h2><T k="om.erfaring" props={props} /><T k="om.kender" props={props} /><T k="om.mindst" props={props} /></>);
      case "arbejde":
        if (!tekst("om.beslut") && !tekst("om.mindretal")) return null;
        return sek(id, <><h2>Sådan arbejder jeg</h2><T k="om.beslut" props={props} /><T k="om.mindretal" props={props} /></>);
      case "rolle": {
        const keys = d.grund.post === "forperson" ? ["f1", "f2", "f3"] : ["b1"];
        if (!keys.some((k) => tekst("rolle." + k))) return null;
        return sek(id, <><h2>{d.grund.post === "forperson" ? "Som forperson" : "I bestyrelsen"}</h2>{keys.map((k) => <T key={k} k={"rolle." + k} props={props} />)}</>);
      }
      case "blive":
        if (!tekst("om.godt") && !tekst("om.aendre")) return null;
        return sek(id, <><h2>Det, der skal blive, og det, der skal ændres</h2><T k="om.godt" props={props} /><T k="om.aendre" props={props} /></>);
      case "kontakt": {
        const g = d.grund;
        return sek(id, <>
          <h2>Kontakt</h2>
          {g.email.trim() && <p>Mail: <a href={`mailto:${g.email.trim()}`}>{g.email.trim()}</a></p>}
          {g.telefon.trim() && <p>Telefon: {g.telefon.trim()}</p>}
          {g.some.trim() && <p>Sociale medier: {g.some.trim()}</p>}
          {g.formular && props.kontaktformular}
        </>);
      }
    }
  };

  const ud = { forside: [], maerkesager: [], ommig: [], kontakt: [] } as Record<PageKey, ReactNode[]>;
  for (const s of d.sektioner) {
    if (!s.on) continue;
    const def = SEKTIONER.find((x) => x.id === s.id)!;
    const node = render(s.id);
    if (node) ud[def.page].push(node);
  }
  return ud;
}
