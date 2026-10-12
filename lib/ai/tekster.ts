// ---------------------------------------------------------------------------
// Fra stikord til tekst, i to trin:
//  1. Profil: Mistral finder det skarpe i alle kandidatens svar (kerne,
//     skarpeste holdninger, tone).
//  2. Tekster: de felter, der er nye eller ændret, skrives om med profilen
//     og et baggrundsnotat om DP's situation som kontekst.
// Skriver kandidaten en opgave til AI'en i et felt ("AI: undersøg ...",
// "kom med en anbefaling"), løses opgaven ud fra notatet og de øvrige svar.
// Uden MISTRAL_API_KEY bruges stikordene uændret.
// ---------------------------------------------------------------------------
import { callMistral, asText } from "./mistral";
import { BAGGRUND } from "./baggrund";
import type { TekstFelt, TekstLager } from "../indhold";

// Sættes én op, når måden at skrive på ændres. Så skrives alle tekster om
// næste gang kandidaten trykker "Lav min side", også dem med uændrede stikord.
export const TEKST_VERSION = 2;

export type Profil = { kerne: string; skarpe: string[]; tone: string };

const PROFIL_SYSTEM = `Du hjælper en kandidat ved personvalget i Dansk Psykolog Forening (DP) med at finde det skarpe i sine egne svar.
Du får kandidatens stikord til en række spørgsmål og et baggrundsnotat om, hvad DP står midt i.

Find:
- "kerne": Hvad vil kandidaten med DP? 1-2 sætninger, som kandidaten selv ville sige det, i 1. person.
- "skarpe": De 3-5 skarpeste holdninger. Det er dem, der tager stilling til noget, DP står midt i, og som adskiller kandidaten fra andre. Hver som én sætning i 1. person.
- "tone": Kandidatens tone i få ord (fx direkte, forsonende, analytisk, nøgtern).

Regler:
- Byg kun på det, kandidaten faktisk siger. Opgaver, som kandidaten stiller til AI'en i stikordene (fx "AI: undersøg ..."), er ikke holdninger.
- Dansk. Ingen lange tankestreger.

Svar med JSON: { "kerne": "...", "skarpe": ["...", "..."], "tone": "..." }`;

const TEKST_SYSTEM = `Du er taleskriver for en kandidat ved personvalget i Dansk Psykolog Forening (DP). Kandidaten har givet stikord til en række spørgsmål. Du får et baggrundsnotat om, hvad DP står midt i, og en profil af kandidaten (kerne, skarpeste holdninger, tone). Du skriver den færdige tekst til kandidatens hjemmeside.

Det vigtigste: Stikordene er råmateriale, ikke facit. En tekst, der bare er stikordene sat i hele sætninger, er for lidt. Din opgave er at finde det skarpe i det, kandidaten mener, og skrive det, så en læser forstår, hvad kandidaten vil, hvorfor det er vigtigt lige nu, og hvad det betyder for medlemmerne. Holdningerne er kandidatens. Ordene er dine.

Eksempel på niveauet (et andet emne end kandidatens, brug ikke formuleringerne). Stikord til "Studerende og nyuddannede": "Flere praktikpladser. DP skal være synlig på universiteterne. Mentorordning for nyuddannede."
For lidt: "Jeg vil arbejde for flere praktikpladser, at DP bliver synlig på universiteterne, og en mentorordning for nyuddannede."
Rigtigt: "De studerende skal møde DP, før de møder deres første arbejdsgiver. Der blev optaget 879 nye på psykologistudiet i 2026, og mange af dem ser først foreningen, når de står med en kontrakt i hånden. Jeg vil have DP ud på universiteterne, og jeg vil arbejde for flere praktikpladser, så praksis bliver en del af studiet.

Nyuddannede skal ikke stå alene det første år. En mentorordning koster frivillige kræfter, og dem er der pres på i forvejen. Men det er den billigste måde at holde på de medlemmer, vi lige har fået."

Regler:
- Kandidatens 1. person ("jeg"). DP omtales som "DP" eller "foreningen". Kandidatens holdninger og tone bevares. Du må ikke give kandidaten holdninger, løfter eller tal, som hverken står i stikordene, i kandidatens øvrige svar, i profilen eller i baggrundsnotatet.
- Begynd med pointen. Hvert felt starter med kandidatens valg eller holdning, ikke med baggrund.
- Sæt pointen ind i DP's situation. Brug baggrundsnotatet til at vise, hvad valget er et svar på, og hvad det vil betyde. Hent konkrete tal, datoer og begivenheder derfra, når de skærper pointen. Læs ikke fakta på for at fylde.
- Træk konsekvensen. Hvor kandidaten har valgt noget, så sig, hvad det koster, og hvem der mærker det, når det følger af valget og af notatet.
- Brug kandidatens øvrige svar. Teksterne skal hænge sammen. Et emne må gerne pege på kandidatens linje fra andre svar (fx "som på alle andre områder vil jeg ...").
- Indeholder stikordene en instruktion til dig (fx "AI: undersøg ..."), så løs den kort ud fra baggrundsnotatet, og gengiv ikke selve instruktionen.

Længde og form, efter feltets nøgle:
- "om.retning": præcis én sætning.
- "om.maales": en JSON-liste med de punkter, kandidaten nævner, hvert som én konkret sætning om, hvad medlemmerne kan se efter tre år.
- Øvrige "om.*" og "rolle.*": 2-4 sætninger. Skarpt, personligt, konkret.
- "<emne>.konkret": 2-3 korte afsnit, adskilt med en tom linje: valget, hvorfor nu (DP's situation), hvad det betyder for medlemmerne.
- "<emne>.skridt": 1-2 sætninger. KUN disse felter, hvor nøglen slutter på ".skridt", begynder med "Mit første skridt er" eller "Mit første skridt bliver". Ingen andre felter må begynde sådan.
- "<emne>.pris": 1-3 sætninger om, hvad det koster, og hvem der mærker det.
- Spørgsmålet må ikke gentages i teksten. Hvert felt skal kunne stå alene.
- Dansk. Ingen lange tankestreger (brug komma eller punktum). Ingen floskler, ingen opremsninger med semikolon og ingen engelske ord, hvor der findes et dansk.

Svar med et JSON-objekt med præcis de samme nøgler som i input. Værdien er den færdige tekst (for "om.maales" en liste).`;

// Når kandidaten i stedet for et svar skriver en opgave til AI'en ("AI: undersøg
// ...", "kom med en anbefaling"), løses den i sit eget kald med fast opbygning,
// så den bliver grundig og bygger på kandidatens øvrige svar.
const OPGAVE_SYSTEM = `Du er taleskriver og udreder for en kandidat ved personvalget i Dansk Psykolog Forening (DP). I ét af sine felter har kandidaten skrevet en opgave til dig i stedet for et svar: undersøg noget, og kom med en anbefaling. Du får feltet, kandidatens øvrige svar, en profil af kandidaten og et baggrundsnotat om DP's situation.

Løs opgaven fuldt ud, og skriv resultatet som kandidatens egen tekst til hjemmesiden, i 1. person.

Opbygning, 3-5 afsnit adskilt med en tom linje:
1. Sagen. Hvad handler det om, og hvorfor er det vigtigt for psykologer lige nu? Nævn mindst tre konkrete punkter fra de planer, aftaler eller begivenheder, opgaven handler om. Brug baggrundsnotatet og din egen viden. Nævn planer og aftaler ved navn.
2. Kandidatens anbefaling. Hvad bør DP gøre? Konkret, med 2-4 handlinger. Anbefalingen skal følge kandidatens linje fra de øvrige svar og profilen, fx kandidatens syn på kommunikation, juridiske skridt, evaluering, dokumentation og inddragelse. Henvis gerne til den linje ("som jeg også vil på ...").
3. Hvad det kræver, og hvem der mærker det.

Regler:
- Kandidatens holdninger og tone. Opfind ikke holdninger, der strider mod kandidatens øvrige svar.
- Selve opgaveteksten ("AI: ...") må ikke gengives, og teksten må ikke omtale, at den er skrevet af en AI.
- Fakta, du ikke er sikker på, formuleres, så kandidaten let kan tjekke dem (nævn plan eller aftale ved navn). Opfind ikke tal.
- Hold dig til emnet i feltet. Træk ikke andre emner ind, medmindre kandidatens øvrige svar gør det naturligt.
- Dansk. Ingen lange tankestreger (brug komma eller punktum). Ingen floskler.

Svar med JSON: { "tekst": "..." }`;

const OPGAVE = /(^|[\s(])AI\s*:|kom med (en|et|nogle|et par)?\s*(anbefaling|forslag|bud)/i;
export const erOpgave = (raw: string) => OPGAVE.test(raw);

// Lange tankestreger og typografisk minus byttes til kort bindestreg.
// Afsnit (tom linje) bevares, andet mellemrum samles.
export function rens(t: string): string {
  return t
    .replace(/\s*[—–−]\s*/g, " - ")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const postNavn = (post: string) => (post === "forperson" ? "forpersonsposten" : "bestyrelsen");

// Først den største model. Svarer den ikke, bruges den mellemste.
async function kald(system: string, user: string, temperature: number): Promise<Record<string, unknown>> {
  try {
    return await callMistral<Record<string, unknown>>("mistral-large-latest", system, user, temperature);
  } catch (e) {
    console.error("mistral-large fejlede, prøver medium:", (e as Error).message);
    return callMistral<Record<string, unknown>>("mistral-medium-latest", system, user, temperature);
  }
}

const svarSomTekst = (felter: TekstFelt[]) =>
  felter.map((f) => `[${f.key}] ${f.spoergsmaal}\n${f.raw.trim()}`).join("\n\n");

// Trin 1: det skarpe i alle svarene.
export async function findProfil(alle: TekstFelt[], post: string, navn: string): Promise<Profil | null> {
  if (!process.env.MISTRAL_API_KEY || !alle.length) return null;
  try {
    const svar = await kald(
      PROFIL_SYSTEM,
      `Kandidaten ${navn.trim() || "(uden navn)"} stiller op til ${postNavn(post)}.\n\n` +
        `KANDIDATENS SVAR:\n${svarSomTekst(alle)}\n\n${BAGGRUND}`,
      0.4
    );
    const skarpe = Array.isArray(svar.skarpe) ? svar.skarpe.map((x) => rens(asText(x))).filter(Boolean) : [];
    return { kerne: rens(asText(svar.kerne)), skarpe, tone: rens(asText(svar.tone)) };
  } catch (e) {
    console.error("Profil kunne ikke findes:", (e as Error).message);
    return null;
  }
}

// Trin 2: felterne skrives om. `alle` er samtlige svar (til sammenhæng),
// `felter` dem, der skal skrives nu. `profil` kan gives, hvis den er fundet
// i forvejen; ellers findes den her.
export async function skrivTekster(
  felter: TekstFelt[], post: string, alle: TekstFelt[] = felter, navn = "", profil?: Profil | null
): Promise<TekstLager> {
  const ud: TekstLager = {};
  if (!felter.length) return ud;

  if (!process.env.MISTRAL_API_KEY) {
    for (const f of felter) {
      const raw = f.raw.trim();
      ud[f.key] = { tekst: f.key.endsWith(".skridt") ? "Mit første skridt: " + raw : raw, kilde: raw, v: TEKST_VERSION };
    }
    return ud;
  }

  const p = profil === undefined ? await findProfil(alle, post, navn) : profil;
  const profilTekst = p
    ? `PROFIL (fundet ud fra alle kandidatens svar):\nKerne: ${p.kerne}\nSkarpeste holdninger:\n${p.skarpe.map((s) => "- " + s).join("\n")}\nTone: ${p.tone}`
    : "PROFIL: (kunne ikke findes, skriv ud fra svarene alene)";

  const hoved =
    `Kandidaten ${navn.trim() || "(uden navn)"} stiller op til ${postNavn(post)}.\n\n` +
    `${profilTekst}\n\n${BAGGRUND}\n\n` +
    `ALLE KANDIDATENS SVAR (til sammenhæng):\n${svarSomTekst(alle)}`;

  const opgaver = felter.filter((f) => erOpgave(f.raw));
  const almindelige = felter.filter((f) => !erOpgave(f.raw));

  // De almindelige felter skrives i ét kald.
  if (almindelige.length) {
    const input = Object.fromEntries(almindelige.map((f) => [f.key, { spoergsmaal: f.spoergsmaal, stikord: f.raw.trim() }]));
    const svar = await kald(
      TEKST_SYSTEM,
      `${hoved}\n\nFELTER, DER SKAL SKRIVES NU (svar med de samme nøgler):\n${JSON.stringify(input, null, 2)}`,
      0.5
    );
    for (const f of almindelige) {
      const v = svar[f.key];
      const raw = f.raw.trim();
      let tekst: string;
      if (f.key === "om.maales" && Array.isArray(v)) tekst = v.map((x) => rens(asText(x))).filter(Boolean).join("|");
      else tekst = rens(asText(v));
      ud[f.key] = { tekst: tekst || raw, kilde: raw, v: TEKST_VERSION };
    }
  }

  // Hver opgave til AI'en løses for sig. Fejler det, bliver stikordene stående,
  // så kandidaten kan se det og prøve igen.
  for (const f of opgaver) {
    const raw = f.raw.trim();
    let tekst = "";
    try {
      const svar = await kald(
        OPGAVE_SYSTEM,
        `${hoved}\n\nFELTET MED OPGAVEN:\nNøgle: ${f.key}\nSpørgsmål: ${f.spoergsmaal}\nKandidatens tekst: ${raw}`,
        0.5
      );
      tekst = rens(asText(svar.tekst ?? svar));
    } catch (e) {
      console.error("Opgave til AI'en fejlede:", (e as Error).message);
    }
    ud[f.key] = { tekst: tekst || raw, kilde: raw, v: TEKST_VERSION };
  }
  return ud;
}
