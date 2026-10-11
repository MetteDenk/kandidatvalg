import Link from "next/link";
import { currentUser } from "@/lib/auth";

export default async function Forside({ searchParams }: { searchParams: Promise<{ slettet?: string }> }) {
  const user = await currentUser();
  const { slettet } = await searchParams;
  return (
    <main className="bred forside">
      {slettet && <div className="ok-boks" style={{ marginBottom: 24 }}>Din side, dine svar og din konto er slettet.</div>}
      <p className="group">Personvalget i Dansk Psykolog Forening · GF27</p>
      <h1>Få dine tanker på plads, og få en hjemmeside ud af dem</h1>
      <p>
        Psykologkompasset leder dig som kandidat gennem en række spørgsmål om, hvorfor du stiller op, hvor DP skal
        hen, og hvordan du vil arbejde. Du svarer på dem, du har lyst til, og kan skrive om helt andre emner. Stikord er nok.
      </p>
      <p>
        Bagefter vælger du sidens opbygning, layout, farver og billeder. Dine stikord bliver skrevet om til tekst i
        dit eget sprog, og du retter, til det siger det, du vil sige. Du bestemmer selv, om siden skal offentliggøres.
      </p>
      <p>Det er gratis og åbent for alle kandidater.</p>
      <p style={{ marginTop: 28 }}>
        <Link href={user ? "/guide" : "/login"} className="btn primary">{user ? "Fortsæt til din side" : "Kom i gang"}</Link>
      </p>
      <p className="hint" style={{ marginTop: 40 }}><Link href="/privatliv">Sådan behandles dine oplysninger</Link></p>
    </main>
  );
}
