"use server";

// Kontaktformularen: beskeden videresendes til kandidatens e-mail og gemmes ikke.
import { db } from "@/lib/db";
import { laes } from "@/lib/kandidat";
import { sendMail } from "@/lib/mailer";

export async function sendBesked(slug: string, formData: FormData): Promise<{ ok: boolean; message: string }> {
  if (String(formData.get("website") ?? "")) return { ok: true, message: "Tak. Din besked er sendt." };

  const navn = String(formData.get("navn") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const besked = String(formData.get("besked") ?? "").trim().slice(0, 2000);
  if (!navn || !email || !besked) return { ok: false, message: "Udfyld navn, e-mail og besked." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, message: "E-mailadressen ser forkert ud." };

  const k = await db.kandidat.findUnique({ where: { slug } });
  if (!k?.published) return { ok: false, message: "Siden er ikke aktiv." };
  const { data } = laes(k);
  if (!data.grund.formular || !data.grund.email.trim()) return { ok: false, message: "Kontaktformularen er slået fra." };

  await sendMail({
    to: data.grund.email.trim(),
    subject: `Ny besked via din kandidatside fra ${navn}`,
    replyTo: email,
    text:
      `Du har fået en besked via kontaktformularen på din kandidatside.\n\n` +
      `Navn: ${navn}\nE-mail: ${email}\n\n${besked}\n\n` +
      `Svar direkte på denne mail for at skrive tilbage. Beskeden er ikke gemt på Psykologkompasset.`,
  });
  return { ok: true, message: "Tak. Din besked er sendt." };
}
