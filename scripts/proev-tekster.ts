// Prøver tekstskrivningen på testsvarene, uden database og uden at røre
// noget i appen. Kræver MISTRAL_API_KEY i .env.
//   npm run proev
// Resultatet skrives til Kandidatvalg/Tekstproeve_<dato>.md, så det kan læses.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { testData } from "./testsvar-data";
import { tekstFelter } from "../lib/indhold";
import { findProfil, skrivTekster } from "../lib/ai/tekster";

try { process.loadEnvFile(".env"); } catch { /* .env findes ikke, brug miljøet */ }

async function main() {
  if (!process.env.MISTRAL_API_KEY) throw new Error("MISTRAL_API_KEY mangler i .env");

  const d = testData("test@kandidat.test");
  // Mettes eksempel (12/10-2026) på en opgave til AI'en, som eget emne 1.
  d.egne[0] = {
    titel: "Psykologer i psykiatrien",
    konkret:
      "Psykologer i psykiatrien. noget om at 10-årsplanen er vigtig netop for psykologer - AI: undersøg hvordan det er vigtigt. " +
      "Inddrag også Akutplanen som også for første gang nævner psykolgoer flere steder. Kom med en anbefaling af hvordan DP bør forholde sig her.",
    skridt: "",
    pris: "",
  };

  const felter = tekstFelter(d);
  console.log(`Finder profil og skriver ${felter.length} felter ...`);
  const t0 = Date.now();
  const profil = await findProfil(felter, d.grund.post, d.grund.navn);
  const tekster = await skrivTekster(felter, d.grund.post, felter, d.grund.navn, profil);
  const sek = Math.round((Date.now() - t0) / 1000);

  const dato = new Date().toISOString().slice(0, 10);
  const linjer: string[] = [];
  linjer.push(`**TEKSTPRØVE ${dato}**`);
  linjer.push(`*Testsvarene kørt gennem tekstskrivningen (version 2: profil + baggrundsnotat). Tog ${sek} sekunder. Ikke rettet af nogen.*`);
  linjer.push("");
  linjer.push("---");
  linjer.push("");
  linjer.push("**DET SKARPE (profil fundet af AI'en)**");
  linjer.push("");
  if (profil) {
    linjer.push(`*Kerne:* ${profil.kerne}`);
    linjer.push("");
    linjer.push("*Skarpeste holdninger:*");
    for (const s of profil.skarpe) linjer.push(`- ${s}`);
    linjer.push("");
    linjer.push(`*Tone:* ${profil.tone}`);
  } else {
    linjer.push("(Profilen kunne ikke findes.)");
  }
  linjer.push("");
  linjer.push("---");
  linjer.push("");
  linjer.push("**TEKSTERNE** (stikord først, derefter den skrevne tekst)");
  for (const f of felter) {
    const t = tekster[f.key]?.tekst ?? "";
    linjer.push("");
    linjer.push(`**${f.spoergsmaal}** *(${f.key})*`);
    linjer.push("");
    linjer.push(`> Stikord: ${f.raw.trim()}`);
    linjer.push("");
    linjer.push(f.key === "om.maales" ? t.split("|").map((x) => "- " + x).join("\n") : t);
  }
  linjer.push("");

  // Stien til resultatet kan gives som første argument (bruges, når scriptet
  // køres på serveren, hvor nøglen findes).
  const ud = process.argv[2] ?? join(process.cwd(), "..", `Tekstproeve_${dato}.md`);
  writeFileSync(ud, linjer.join("\n"), "utf8");
  console.log(`Skrevet til ${ud}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
