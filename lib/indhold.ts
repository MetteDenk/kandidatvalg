// ---------------------------------------------------------------------------
// Indholdet: emnerne, sektionerne, undersiderne og kandidatens data.
// Spørgsmålene svarer til Kandidatvalg/Spoergsmaal_v0.3.md.
// Ren TypeScript uden server- eller klientafhængigheder, så både guiden og
// den offentlige side kan bruge det.
// ---------------------------------------------------------------------------
import { FONTS, LAYOUTS, PALETTES, type LayoutId } from "./design";

export type Emne = { id: string; titel: string; bg: string; sp: string; veje: string };

export const EMNER: Emne[] = [
  { id: "A", titel: "Regionernes tilbud til 18-24-årige", bg: "Regionerne overtog behandlingen 1/10-2026. To regioner valgte laveste pris med højst 950 kr. i timen. De øvrige gav 1.050 kr. med kvalitetskrav. Der er et loft på 8 konsultationer. DP har kritiseret udbuddene.", sp: "Hvad skal DP gøre nu, hvor ordningen er i drift?", veje: "dokumentere konsekvenserne, stille krav til næste udbud, tage den juridiske vej, kritisere offentligt, samarbejde med regionerne, støtte de medlemmer der leverer, arbejde for at opgaven føres tilbage til psykologordningen" },
  { id: "B", titel: "Psykologordningen og ydernumre", bg: "Ca. 900 psykologer har ydernummer. Ved forhandlingerne i 2026 (POK26) kom der tre nye ydelser til fra 1/10-2026.", sp: "Hvad skal DP prioritere ved de næste forhandlinger, og i hvilken rækkefølge?", veje: "flere ydernumre, et højere grundhonorar, flere nye ydelser, henvisning efter funktionsniveau, skærpede krav til at få ydernummer, mindre administration" },
  { id: "C", titel: "Selvstændige, forsikring og netværksvirksomheder", bg: "Mange selvstændige arbejder gennem netværks- og forsikringsvirksomheder. De styrer honorar og timer stramt og er ikke gennemsigtige. EU har udstedt retningslinjer for, hvornår selvstændige uden ansatte må forhandle kollektivt.", sp: "Hvordan skal DP styrke de selvstændige over for mellemhandlerne?", veje: "kollektive forhandlinger, et juridisk spor med afsæt i EU-retten, faglige standarder, en brancheorganisation for selvstændige i DP, at bygge psykologeridanmark.dk ud, samarbejde med mellemhandlerne" },
  { id: "D", titel: "Ansatte: løn, arbejdsmiljø og nye opgaver", bg: "Akutplanen giver kommunerne nye opgaver for børn og unge. PPR er under pres.", sp: "Hvordan skal DP sikre de ansattes løn og arbejdsmiljø, når opgaverne flytter?", veje: "lønkrav ved overenskomsten, normer for antallet af sager, stærkere tillidsvalgte, faglige krav til screening og udredning, psykologernes rolle i PPR ud over test og rapporter, onboarding og mentorer for nyuddannede" },
  { id: "E", titel: "Praksisuddannelse og specialisering", bg: "Praksisuddannelsen (PPU) ventes at starte i ny form i 2027. Overgangsordningen løber til udgangen af 2028. Ved GF24 var der flertal, men ikke 2/3, for at specialpsykologuddannelsen ikke skal sidestilles med DP's specialistgodkendelse.", sp: "Hvordan skal DP arbejde med PPU og specialisering?", veje: "påvirke indholdet, gøre det lettere for selvstændige og deltidsansatte at komme ind, koble uddannelsen til løn, gøre titlerne mere synlige, sidestille eller adskille specialpsykolog og specialist" },
  { id: "F", titel: "Fagets bredde", bg: "Psykologer hører nu under sundhedsområdet. DP har udgivet den første fælles faglige norm.", sp: "Hvordan sikrer DP plads til hele faget?", veje: "flere fælles normer, normer som ramme for det faglige skøn, at værne om de ikke-kliniske dele af faget, plads til at arbejde uden diagnoser, case-formuleringer på lige fod med diagnoser" },
  { id: "G", titel: "Indflydelse og kommunikation", bg: "", sp: "Hvordan skal DP få indflydelse, og hvem skal DP først og fremmest tale til?", veje: "relationer og pladser ved bordet, offentligt pres, mere synlighed i medierne, en egen dagsorden, at tale mest til medlemmerne, til politikerne eller til offentligheden" },
  { id: "H", titel: "Prioritering af foreningens kræfter", bg: "Sekretariatet har ca. 50 ansatte. Langt de fleste årsværk går til løn og arbejdsliv. GF kan kun stemme et mål ind eller ud som helhed.", sp: "Skal kræfterne fordeles anderledes, og hvordan?", veje: "flytte årsværk, prioritere inden for hvert mål, lade GF prioritere delmål, skære noget fra, skaffe flere indtægter" },
  { id: "I", titel: "Foreningens opbygning", bg: "Ansatte og selvstændige har ikke altid samme interesser. Selvstændige Psykologers Sektion har ca. 2.550 medlemmer.", sp: "Hvordan skal DP håndtere, at medlemsgrupperne vil forskellige ting? Skal opbygningen laves om?", veje: "som i dag, en fast model for prioritering, en brancheorganisation for selvstændige, gentænke kredse og sektioner, give dem stærkere mandater" },
  { id: "J", titel: "Medlemsdemokrati og åbenhed", bg: "", sp: "Hvordan får medlemmerne reel indflydelse mellem generalforsamlingerne?", veje: "digitale høringer, åbne bestyrelsesreferater, åben økonomi, nye måder at engagere sig på, der kræver mindre tid, løbende eftersyn af strukturen" },
  { id: "K", titel: "Medlemsservice", bg: "", sp: "Hvad skal medlemmerne kunne få hjælp til, som de ikke får i dag?", veje: "" },
  { id: "L", titel: "Studerende og nyuddannede", bg: "", sp: "Hvordan bliver DP relevant for de studerende, og hvad skal de nyuddannede have?", veje: "" },
  { id: "M", titel: "Teknologi og AI", bg: "", sp: "Skal DP gå forrest, regulere eller holde igen?", veje: "" },
];

export type PageKey = "forside" | "maerkesager" | "ommig" | "kontakt";

export const PAGES: { key: PageKey; path: string; label: string }[] = [
  { key: "forside", path: "", label: "Forside" },
  { key: "maerkesager", path: "mine-maerkesager", label: "Mine mærkesager" },
  { key: "ommig", path: "om-mig", label: "Om mig" },
  { key: "kontakt", path: "kontakt", label: "Kontakt" },
];

export type SektionId =
  | "velkomst" | "hvorfor" | "pointer" | "maales" | "emner" | "ogsaa"
  | "erfaring" | "arbejde" | "rolle" | "blive" | "kontakt";

export const SEKTIONER: { id: SektionId; page: PageKey; label: string; desc: string; fast?: boolean }[] = [
  { id: "velkomst", page: "forside", label: "Velkomst", desc: "Navn, post, foto og retningen i én sætning", fast: true },
  { id: "hvorfor", page: "forside", label: "Hvorfor jeg stiller op", desc: "Dine svar om hvorfor nu og hvorfor denne post" },
  { id: "pointer", page: "forside", label: "Mine vigtigste pointer", desc: "De 3-5 emner, du valgte i trin 7" },
  { id: "maales", page: "forside", label: "Det vil jeg måles på", desc: "Tre ting efter tre år" },
  { id: "emner", page: "maerkesager", label: "Mine mærkesager", desc: "Dine vigtigste pointer med hele teksten" },
  { id: "ogsaa", page: "maerkesager", label: "Jeg vil også arbejde for", desc: "De øvrige emner, du har svaret på, i kort form" },
  { id: "erfaring", page: "ommig", label: "Erfaring", desc: "Din erfaring og de medlemsgrupper, du kender" },
  { id: "arbejde", page: "ommig", label: "Sådan arbejder jeg", desc: "Beslutninger, inddragelse og mindretal" },
  { id: "rolle", page: "ommig", label: "Rollen", desc: "Forpersonsrollen eller dit bidrag til bestyrelsen" },
  { id: "blive", page: "ommig", label: "Det, der skal blive, og det, der skal ændres", desc: "Kontinuitet og fornyelse" },
  { id: "kontakt", page: "kontakt", label: "Kontakt", desc: "Kontaktformular, mail, telefon og sociale medier", fast: true },
];

export type EmneSvar = { overskrift: string; konkret: string; skridt: string; pris: string };
export type EgetEmne = { titel: string; konkret: string; skridt: string; pris: string };

export type KandidatData = {
  step: number;
  grund: { navn: string; post: "forperson" | "bestyrelse"; email: string; telefon: string; formular: boolean; some: string };
  om: Record<OmFelt, string>;
  rolle: { f1: string; f2: string; f3: string; b1: string };
  valgte: string[];
  emner: Record<string, EmneSvar>;
  egne: EgetEmne[];
  pointer: string[];
  sektioner: { id: SektionId; on: boolean }[];
  layout: LayoutId;
  palette: string;
  font: string;
  foto: string | null;
  banner: string | null;
};

export const OM_FELTER = ["nu", "post", "retning", "maales", "mindre", "erfaring", "beslut", "mindretal", "godt", "aendre", "kender", "mindst"] as const;
export type OmFelt = (typeof OM_FELTER)[number];

// Spørgsmålene bag hvert tekstfelt. Bruges i guiden og som kontekst, når stikordene skrives om.
export const OM_SPOERGSMAAL: Record<OmFelt, string> = {
  nu: "Hvorfor stiller du op nu?",
  post: "Hvorfor til denne post?",
  retning: "Hvor skal DP være i 2030? Sig det i én sætning.",
  maales: "Hvilke tre ting skal medlemmerne kunne se, at du har nået efter tre år?",
  mindre: "Hvad skal DP så lave mindre af?",
  erfaring: "Hvad har du gjort, der viser, at du kan det, du lover?",
  beslut: "Hvordan træffer du beslutninger, og hvordan inddrager du andre?",
  mindretal: "Hvad gør du, når du er i mindretal?",
  godt: "Hvad i DP fungerer godt i dag?",
  aendre: "Hvad vil du ændre?",
  kender: "Hvilke grupper af medlemmer kender du indefra?",
  mindst: "Hvilke kender du mindst, og hvordan vil du lære dem at kende?",
};

export const ROLLE_SPOERGSMAAL = {
  f1: "Hvordan vil du dele den politiske og den administrative ledelse mellem dig og direktøren?",
  f2: "Hvordan vil du lede bestyrelsen, når den er uenig?",
  f3: "Hvordan vil du være DP's ansigt udadtil?",
  b1: "Hvilke områder vil du tage ansvar for i bestyrelsen, og hvad vil du bidrage med?",
};

const tomtEmne = (): EmneSvar => ({ overskrift: "", konkret: "", skridt: "", pris: "" });
const tomtEget = (): EgetEmne => ({ titel: "", konkret: "", skridt: "", pris: "" });

export function nyData(): KandidatData {
  return {
    step: 0,
    grund: { navn: "", post: "forperson", email: "", telefon: "", formular: true, some: "" },
    om: Object.fromEntries(OM_FELTER.map((k) => [k, ""])) as Record<OmFelt, string>,
    rolle: { f1: "", f2: "", f3: "", b1: "" },
    valgte: [],
    emner: Object.fromEntries(EMNER.map((e) => [e.id, tomtEmne()])),
    egne: [tomtEget(), tomtEget(), tomtEget()],
    pointer: [],
    sektioner: SEKTIONER.map((s) => ({ id: s.id, on: true })),
    layout: "enside",
    palette: PALETTES[0].id,
    font: FONTS[0].id,
    foto: null,
    banner: null,
  };
}

const str = (v: unknown, max = 4000) => (typeof v === "string" ? v.slice(0, max) : "");
const BILLED_URL = /^\/api\/uploads\/[a-z0-9]+$/;

// Lægger gemte eller indsendte data oven på en tom struktur, så manglende
// eller ukendte felter aldrig vælter siden. Alt ukendt smides væk.
export function normaliser(input: unknown): KandidatData {
  const d = nyData();
  const i = (input && typeof input === "object" ? input : {}) as Record<string, any>;
  d.step = Number.isInteger(i.step) ? Math.max(0, Math.min(40, i.step)) : 0;
  const g = i.grund ?? {};
  d.grund = {
    navn: str(g.navn, 120), post: g.post === "bestyrelse" ? "bestyrelse" : "forperson",
    email: str(g.email, 200), telefon: str(g.telefon, 40), formular: g.formular !== false, some: str(g.some, 300),
  };
  for (const k of OM_FELTER) d.om[k] = str(i.om?.[k]);
  for (const k of ["f1", "f2", "f3", "b1"] as const) d.rolle[k] = str(i.rolle?.[k]);
  const ids = EMNER.map((e) => e.id);
  d.valgte = Array.isArray(i.valgte) ? i.valgte.filter((x: unknown) => typeof x === "string" && ids.includes(x)) : [];
  for (const id of ids) {
    const e = i.emner?.[id] ?? {};
    d.emner[id] = { overskrift: str(e.overskrift, 160), konkret: str(e.konkret), skridt: str(e.skridt), pris: str(e.pris) };
  }
  d.egne = d.egne.map((_, n) => {
    const e = i.egne?.[n] ?? {};
    return { titel: str(e.titel, 160), konkret: str(e.konkret), skridt: str(e.skridt), pris: str(e.pris) };
  });
  const gyldigePointer = [...ids, "E0", "E1", "E2"];
  d.pointer = Array.isArray(i.pointer) ? i.pointer.filter((x: unknown) => typeof x === "string" && gyldigePointer.includes(x)).slice(0, 5) : [];
  if (Array.isArray(i.sektioner)) {
    const kendte = SEKTIONER.map((s) => s.id) as string[];
    const valgt = i.sektioner.filter((s: any) => s && kendte.includes(s.id)).map((s: any) => ({ id: s.id as SektionId, on: s.on !== false }));
    const mangler = SEKTIONER.filter((s) => !valgt.find((v: any) => v.id === s.id)).map((s) => ({ id: s.id, on: true }));
    d.sektioner = [...valgt, ...mangler].map((s) => (SEKTIONER.find((x) => x.id === s.id)?.fast ? { ...s, on: true } : s));
  }
  if (LAYOUTS.find((l) => l.id === i.layout)) d.layout = i.layout;
  if (PALETTES.find((p) => p.id === i.palette)) d.palette = i.palette;
  if (FONTS.find((f) => f.id === i.font)) d.font = i.font;
  d.foto = typeof i.foto === "string" && BILLED_URL.test(i.foto) ? i.foto : null;
  d.banner = typeof i.banner === "string" && BILLED_URL.test(i.banner) ? i.banner : null;
  return d;
}

// ---------------------------------------------------------------------------
// Tekstfelterne: hvert felt har en nøgle, kandidatens stikord og spørgsmålet.
// ---------------------------------------------------------------------------
export type TekstFelt = { key: string; raw: string; spoergsmaal: string };
export type TekstLager = Record<string, { tekst: string; kilde: string }>;

export function emneInfo(d: KandidatData, id: string): { titel: string; sp: string; svar: { overskrift?: string; konkret: string; skridt: string; pris: string } } {
  if (id.startsWith("E")) {
    const e = d.egne[Number(id.slice(1))] ?? { titel: "", konkret: "", skridt: "", pris: "" };
    return { titel: e.titel.trim() || "Eget emne", sp: "", svar: e };
  }
  const def = EMNER.find((e) => e.id === id)!;
  return { titel: def.titel, sp: def.sp, svar: d.emner[id] };
}

export function harSvar(d: KandidatData, id: string): boolean {
  const s = emneInfo(d, id).svar;
  return !!(s.konkret.trim() || s.skridt.trim() || s.pris.trim());
}

export function alleEmneIds(d: KandidatData): string[] {
  const ids = d.valgte.filter((id) => harSvar(d, id));
  d.egne.forEach((e, n) => { if (e.titel.trim() && harSvar(d, "E" + n)) ids.push("E" + n); });
  return ids;
}

export const pointerIds = (d: KandidatData) => d.pointer.filter((id) => alleEmneIds(d).includes(id));

export function emneOverskrift(d: KandidatData, id: string): string {
  const i = emneInfo(d, id);
  return (i.svar.overskrift ?? "").trim() || i.titel;
}

export function tekstFelter(d: KandidatData): TekstFelt[] {
  const ud: TekstFelt[] = [];
  for (const k of OM_FELTER) {
    const sp = k === "post" ? (d.grund.post === "forperson" ? "Hvorfor til forpersonsposten?" : "Hvorfor til bestyrelsen?") : OM_SPOERGSMAAL[k];
    ud.push({ key: "om." + k, raw: d.om[k], spoergsmaal: sp });
  }
  const rk = d.grund.post === "forperson" ? (["f1", "f2", "f3"] as const) : (["b1"] as const);
  for (const k of rk) ud.push({ key: "rolle." + k, raw: d.rolle[k], spoergsmaal: ROLLE_SPOERGSMAAL[k] });
  for (const id of alleEmneIds(d)) {
    const i = emneInfo(d, id);
    const emne = i.titel + (i.sp ? ` (${i.sp})` : "");
    ud.push({ key: id + ".konkret", raw: i.svar.konkret, spoergsmaal: `${emne}: Hvad vil du konkret gøre?` });
    ud.push({ key: id + ".skridt", raw: i.svar.skridt, spoergsmaal: `${emne}: Hvad er dit første skridt?` });
    ud.push({ key: id + ".pris", raw: i.svar.pris, spoergsmaal: `${emne}: Hvad koster det, og hvem mærker det?` });
  }
  return ud.filter((f) => f.raw.trim());
}

// Teksten til et felt: kandidatens rettelse, ellers den skrevne tekst, ellers
// stikordene. En rettelse eller tekst gælder kun, så længe stikordene er de
// samme, som den blev lavet ud fra.
export function lavOpslag(d: KandidatData, tekster: TekstLager, rettelser: TekstLager) {
  const rawFor = new Map(tekstFelter(d).map((f) => [f.key, f.raw.trim()]));
  return (key: string): string => {
    const raw = rawFor.get(key);
    if (!raw) return "";
    const r = rettelser[key];
    if (r && r.kilde === raw) return r.tekst;
    const t = tekster[key];
    if (t && t.kilde === raw) return t.tekst;
    return key.endsWith(".skridt") ? "Mit første skridt: " + raw : raw;
  };
}

export const RESERVEREDE = new Set(["login", "guide", "api", "privatliv", "logout", "_next", "favicon.ico", "robots.txt"]);

export function slugify(navn: string): string {
  const s = navn.toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return s || "kandidat";
}
