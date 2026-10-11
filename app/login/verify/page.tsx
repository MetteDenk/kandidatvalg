import Link from "next/link";
import { verifyMagicLinkAction } from "./actions";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string; fejl?: string }> }) {
  const params = await searchParams;
  return (
    <main className="smal">
      <Link href="/" className="hint">Psykologkompasset</Link>
      <div className="card" style={{ marginTop: 16 }}>
        {params.fejl ? (
          <>
            <h1 style={{ fontSize: 22, margin: "0 0 6px" }}>Linket virker ikke</h1>
            <p className="hint" style={{ marginBottom: 16 }}>Linket er udløbet eller allerede brugt. Få tilsendt et nyt.</p>
            <Link href="/login" className="btn primary">Tilbage til login</Link>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 22, margin: "0 0 6px" }}>Bekræft login</h1>
            <p className="hint" style={{ marginBottom: 16 }}>Klik på knappen for at logge ind.</p>
            <form action={verifyMagicLinkAction}>
              <input type="hidden" name="token" value={params.token ?? ""} />
              <button type="submit" className="btn primary" style={{ width: "100%" }}>Log mig ind</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
