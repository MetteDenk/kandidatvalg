import Link from "next/link";

// UDKAST: dataansvarliges navn og adresse skal udfyldes, før siden går i luften.
export default function Privatliv() {
  return (
    <main className="bred">
      <Link href="/" className="hint">Psykologkompasset</Link>
      <h1 style={{ fontSize: 28, margin: "16px 0" }}>Sådan behandles dine oplysninger</h1>

      <h2 style={{ fontSize: 18 }}>Hvem er ansvarlig</h2>
      <p>Psykologkompasset drives af [navn og adresse på den dataansvarlige].</p>

      <h2 style={{ fontSize: 18 }}>Hvad gemmes</h2>
      <p>
        Din e-mail til login, dine svar i guiden, de tekster, der laves ud fra dem, dine rettelser, dine designvalg og
        de billeder, du uploader. Dine svar kan indeholde politiske holdninger og oplyse, at du er medlem af en
        fagforening. Det er følsomme oplysninger, og de behandles kun med dit samtykke, som du giver ved at bruge guiden.
      </p>

      <h2 style={{ fontSize: 18 }}>Hvem ser hvad</h2>
      <p>
        Kun du kan se dine svar og din side, indtil du selv offentliggør den. Platformen rangerer ikke kandidater og
        sammenligner dem ikke.
      </p>

      <h2 style={{ fontSize: 18 }}>Hvor ligger det</h2>
      <p>
        Alt ligger i EU: server og database hos Hetzner i Tyskland. Teksterne skrives af Mistral AI i Frankrig, som ikke
        bruger dine data til træning.
      </p>

      <h2 style={{ fontSize: 18 }}>Kontaktformularen</h2>
      <p>Beskeder fra besøgende sendes direkte til kandidatens e-mail og gemmes ikke på platformen.</p>

      <h2 style={{ fontSize: 18 }}>Sletning</h2>
      <p>
        Du kan til enhver tid fjerne din side. Så slettes siden, dine svar, teksterne, billederne og din login-konto med
        det samme. Efter valget i marts 2027 slettes alle oplysninger, som kandidaten ikke selv har valgt at beholde.
      </p>

      <h2 style={{ fontSize: 18 }}>Cookies</h2>
      <p>Der bruges kun én nødvendig cookie, når du er logget ind. Der er ingen sporing eller statistik.</p>
    </main>
  );
}
