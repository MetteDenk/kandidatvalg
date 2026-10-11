import Link from "next/link";

export const metadata = { title: "Sådan behandles dine oplysninger - Psykologkompasset" };

export default function Privatliv() {
  return (
    <main className="bred">
      <Link href="/" className="hint">Psykologkompasset</Link>
      <h1 style={{ fontSize: 28, margin: "16px 0" }}>Sådan behandles dine oplysninger</h1>

      <h2 style={{ fontSize: 18 }}>Hvem er ansvarlig</h2>
      <p>
        Kandidaten er dataansvarlig for sine svar, sine tekster og sin side. Psykologkompasset stiller værktøjet til
        rådighed og behandler oplysningerne på kandidatens vegne og efter kandidatens anvisninger: til at gemme svarene,
        skrive teksterne og vise siden. Oplysningerne bruges ikke til andet.
      </p>
      <p>
        Har du som besøgende spørgsmål til en kandidats side, eller vil du have oplysninger slettet, så kontakt kandidaten
        direkte. Kontaktoplysningerne står på kandidatens side.
      </p>

      <h2 style={{ fontSize: 18 }}>Hvad gemmes</h2>
      <p>
        Kandidatens e-mail til login, svarene i guiden, de tekster, der laves ud fra dem, rettelser, designvalg og de
        billeder, kandidaten uploader. Svarene kan indeholde politiske holdninger og oplyse, at kandidaten er medlem af en
        fagforening. Det er følsomme oplysninger, og de behandles kun, fordi kandidaten selv lægger dem ind og selv
        vælger, om de skal offentliggøres.
      </p>

      <h2 style={{ fontSize: 18 }}>Hvem ser hvad</h2>
      <p>
        Kun kandidaten kan se sine svar og sin side, indtil kandidaten selv offentliggør den. Platformen rangerer ikke
        kandidater og sammenligner dem ikke.
      </p>

      <h2 style={{ fontSize: 18 }}>Hvor ligger det</h2>
      <p>
        Alt ligger i EU: server og database hos Hetzner i Tyskland. Teksterne skrives af Mistral AI i Frankrig, som ikke
        bruger oplysningerne til træning.
      </p>

      <h2 style={{ fontSize: 18 }}>Kontaktformularen</h2>
      <p>Beskeder fra besøgende sendes direkte til kandidatens e-mail og gemmes ikke på platformen.</p>

      <h2 style={{ fontSize: 18 }}>Sletning</h2>
      <p>
        Kandidaten kan til enhver tid fjerne sin side. Så slettes siden, svarene, teksterne, billederne og login-kontoen
        med det samme.
      </p>

      <h2 style={{ fontSize: 18 }}>Cookies</h2>
      <p>Der bruges kun én nødvendig cookie, når du er logget ind. Der er ingen sporing eller statistik.</p>
    </main>
  );
}
