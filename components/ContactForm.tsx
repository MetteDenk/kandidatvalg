"use client";

// Kontaktformularen på kandidatsiden. Beskeden sendes direkte til kandidatens
// e-mail og gemmes ikke på platformen. Formularen poster til en server action,
// så den også virker, før siden er færdigindlæst, og aldrig lægger data i adressen.
import { useActionState } from "react";
import { sendBesked } from "@/app/site-actions";

type Status = { ok: boolean; message: string } | null;

export function ContactForm({ slug }: { slug: string }) {
  const [status, action, sender] = useActionState<Status, FormData>(
    (_prev, fd) => sendBesked(slug, fd),
    null
  );

  if (status?.ok) return <p style={{ marginTop: 16, fontWeight: 600 }}>{status.message}</p>;

  return (
    <form className="s-form" action={action}>
      <input name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999 }} aria-hidden="true" />
      <input name="navn" required placeholder="Dit navn" />
      <input name="email" type="email" required placeholder="Din e-mail" />
      <textarea name="besked" required rows={4} maxLength={2000} placeholder="Din besked" />
      {status && !status.ok && <p style={{ color: "#b91c1c", fontSize: 13, margin: 0 }}>{status.message}</p>}
      <button className="s-btn" type="submit" disabled={sender}>{sender ? "Sender …" : "Send"}</button>
      <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>Din besked går direkte til mig.</p>
    </form>
  );
}
