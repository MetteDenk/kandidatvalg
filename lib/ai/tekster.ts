// ---------------------------------------------------------------------------
// Fra stikord til tekst. Ét kald til Mistral med alle felter, der er ændret
// siden sidst. Uden MISTRAL_API_KEY bruges stikordene uændret.
// ---------------------------------------------------------------------------
import { callMistral, asText } from "./mistral";
import type { TekstFelt, TekstLager } from "../indhold";

const SYSTEM = `Du skriver tekst til en kandidats egen hjemmeside ved personvalget i Dansk Psykolog Forening (DP).
Du får kandidatens stikord til en række spørgsmål. Skriv hvert felt om til færdig tekst.

Regler:
- Skriv i kandidatens 1. person ("jeg"). DP omtales som "DP" eller "foreningen".
- Bevar kandidatens egne ord, vendinger og holdninger så tæt som muligt. Er kandidaten skarp, skal teksten også være det.
- Tilføj ingen nye påstande, tal, eksempler, holdninger eller løfter. Udelad intet væsentligt.
- Gør stikord til hele sætninger, ret stavning og sætningsbygning. Kort og konkret.
- Spørgsmålet må ikke gentages i teksten. Hvert felt skal kunne stå alene.
- Felter, der slutter på ".skridt", begynder med "Mit første skridt er" eller "Mit første skridt bliver".
- Feltet "om.retning" er én sætning.
- Feltet "om.maales" er en JSON-liste med de punkter, kandidaten nævner, hvert som en kort sætning.
- Dansk. Ingen lange tankestreger (brug komma eller punktum). Ingen floskler og ingen engelske ord, hvor der findes et dansk.

Svar med et JSON-objekt med præcis de samme nøgler som i input. Værdien er den færdige tekst.`;

// Lange tankestreger og typografisk minus byttes til kort bindestreg.
export function rens(t: string): string {
  return t.replace(/\s*[—–−]\s*/g, " - ").replace(/[ \t]+/g, " ").trim();
}

export async function skrivTekster(felter: TekstFelt[], post: string): Promise<TekstLager> {
  const ud: TekstLager = {};
  if (!felter.length) return ud;

  if (!process.env.MISTRAL_API_KEY) {
    for (const f of felter) {
      const raw = f.raw.trim();
      ud[f.key] = { tekst: f.key.endsWith(".skridt") ? "Mit første skridt: " + raw : raw, kilde: raw };
    }
    return ud;
  }

  const input = Object.fromEntries(felter.map((f) => [f.key, { spoergsmaal: f.spoergsmaal, stikord: f.raw.trim() }]));
  const svar = await callMistral<Record<string, unknown>>(
    "mistral-medium-latest",
    SYSTEM,
    `Kandidaten stiller op til ${post === "forperson" ? "forpersonsposten" : "bestyrelsen"}.\n\n` + JSON.stringify(input, null, 2),
    0.3
  );

  for (const f of felter) {
    const v = svar[f.key];
    const raw = f.raw.trim();
    let tekst: string;
    if (f.key === "om.maales" && Array.isArray(v)) tekst = v.map((x) => rens(asText(x))).filter(Boolean).join("|");
    else tekst = rens(asText(v));
    ud[f.key] = { tekst: tekst || raw, kilde: raw };
  }
  return ud;
}
