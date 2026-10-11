import Link from "next/link";
import { requestMagicLinkAction } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sendt?: string; fejl?: string }> }) {
  const params = await searchParams;
  return (
    <main className="smal">
      <Link href="/" className="hint">Psykologkompasset</Link>
      <div className="card" style={{ marginTop: 16 }}>
        <h1 style={{ fontSize: 22, margin: "0 0 6px" }}>Log ind eller kom i gang</h1>
        <p className="hint" style={{ marginBottom: 16 }}>Skriv din e-mail, så får du et link til at logge ind. Ingen adgangskode.</p>
        {params.sendt ? (
          <div className="ok-boks">Tjek din indbakke. Linket virker i 15 minutter.</div>
        ) : (
          <form action={requestMagicLinkAction}>
            {params.fejl && <p className="err">Ugyldig e-mailadresse. Prøv igen.</p>}
            <label className="l" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required className="ui-input" />
            <button type="submit" className="btn primary" style={{ marginTop: 16, width: "100%" }}>Send login-link</button>
          </form>
        )}
      </div>
    </main>
  );
}
