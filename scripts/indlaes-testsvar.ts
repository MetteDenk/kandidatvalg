// Lægger testsvarene fra 11/10-2026 (Kandidatvalg/Svar_testperson_Mette_v1.md)
// ind på en bruger, så guiden kan prøves uden at skrive alt igen.
//   npm run testsvar -- din@email.dk
// Brugeren oprettes, hvis den ikke findes. Eksisterende svar overskrives.
import { PrismaClient } from "@prisma/client";
import { nyData } from "../lib/indhold";

const db = new PrismaClient();

async function main() {
  const email = (process.argv[2] ?? "").trim().toLowerCase();
  if (!email.includes("@")) throw new Error("Brug: npm run testsvar -- din@email.dk");

  const d = nyData();
  d.grund.email = email;
  d.om = {
    nu: "Fordi jeg har den nødvendige erfaring fra bestyrelsen, som TR, som regionsrådsmedlem og gerne vil føre DP videre.",
    post: "Indflydelsen, muligheden for at arbejde koncentreret med alle dele af DP, komme ud til medlemmerne, det politiske arbejde",
    retning: "Være en effektiv organisation, som opleves af medlemmerne som værende vedkommende, relevant og nødvendigt og af samfundet som slagkraftig, troværdig og uomgængelig",
    maales: "Langt bedre kommunikation om også de indre processer i DP og en imødekommende kultur overfor medlemmers henvendelse, en kraftig stemme i samfundet for de svage og for psykologers kompetence, effektiv økonomistyring på de indre planer.",
    mindre: "Mindre defensiv kommunikation overfor medlemmerne",
    erfaring: "Mange års engagement i DP - decentrale enheder, komiteen for Etik, bestyrelsen.",
    beslut: "Kommunikation, kommunikation. Ved at lytte først. Og når jeg først har beslutningsgrundlaget i orden med de forskellige vinkler, forklarer jeg baggrund og overvejelser - og tager så beslutningen, og står på mål for den. Inddrager andre gennem FB, surveys - og webinarer samt fysiske møder",
    mindretal: "Forsøger at finde et kompromis, der er respektfuldt - dette gælder også, når jeg er en del af et flertal.",
    godt: "God intern organisation, dygtige medarbejdere. God kontakt til politikere og embedsmandsværket. Opnår gode resultater ift faglige normer, troværdighed etc.",
    aendre: "Mere tydelig udadtil og indadtil. Det skal stå tindrende klart hvad DP's holdninger er.",
    kender: "Selvstændige",
    mindst: "Psykiatrien. Gennem deltagelse på fagkonferencer og ved at besøge arbejdspladser. Tæt kontakt med TR",
  };
  d.rolle = {
    f1: "Det vil altid være mig, der har den overordnede ansvar. Administrationen laver oplæg og forslag. Vi drøfter - og så tages en beslutning.",
    f2: "Kompromissøgende - det fælles mindste enige bud. Det er vigtigt, at vi har ikke kun bestyrelsen men også opbakning i formandskollegiet.",
    f3: "Gennem SOME samt møder",
    b1: "",
  };
  const konkret: Record<string, string> = {
    A: "Undersøge den juridiske vej! Hvis der er noget at komme efter ift udbudene skal det forfølges. Kontakt til politikerne ift. at få iværksat en evaluering efter ordningen har kørt et års tid til halvandet. Kommunikere dette tydeligt til medlemmerne.",
    B: "Jeg vil arbejde for at samtlige kvalificerede psykologer (dvs. med PPU) har mulighed for at få et ydernummer. Dette vil betyde, at ydernummerpsyk måske bliver nødt til at supplere denne del af deres forretning med andre aktiviteter. Men det vil også samlet betyde en mere samlet gruppe - og at der er mindre afhængighed for den enkelte af denne aktivitet - og dermed kan vi stå stærkere i forhandlinger med regionerne.",
    C: "Juridisk spor og så en meget tydelig information ift. borgere: de skal vide, hvad de bliver snydt for ift. deres forsikring, som ofte lover dem 10-12 samtaler.",
    D: "Videnscenter skal undersøge kvaliteten ift. opgavetyngde og udbytte - evt. i samarbejde med phd-studerende. Og bruge dette som løftestang. Derudover selvfølgelig lønkrav ved ansættelse og mentorer.",
    G: "Klart mere tydelig og offensiv i kommunikation til medlemmer og til omverden. Mere kant.",
    H: "Anvendelsen af årsværk skal indgå i budgetterne på en langt tydeligere måde. F.eks. skal det også kunne vises, hvor meget hver sektion og mål fra arbejdsprogrammet trækker af ressourcen.",
    I: "Der bør igangsættes et arbejde med henblik på at sikre repræsentation af sektioners interesser i bestyrelsen, samt overvejelser om organisering af de decentrale enheder. Dette skal foregå i løbet af de næste 3 år, så GF i 2030 kan tage stilling til det.",
    J: "Digitale høringer, webinarer, besøg ude i landet.",
    M: "DP skal engagere sig i AI, både i forhold til der hvor det giver mening at bruge det - og der hvor der kan være betænkeligheder ift psykisk udvikling og sammenhængskraft og socialitet i samfundet.",
  };
  d.valgte = Object.keys(konkret);
  for (const [id, t] of Object.entries(konkret)) d.emner[id].konkret = t;

  const user = await db.user.upsert({ where: { email }, update: {}, create: { email } });
  await db.kandidat.upsert({
    where: { ownerId: user.id },
    update: { data: d, tekster: {}, rettelser: {}, genereretAt: null, published: false },
    create: { ownerId: user.id, slug: "k-" + user.id.slice(-10), data: d },
  });
  console.log(`Testsvarene er lagt ind for ${email}. Log ind og gå til /guide.`);
}

main().finally(() => db.$disconnect());
