// ---------------------------------------------------------------------------
// Mailer-abstraktion. I produktion: SMTP hos en EU-udbyder (fx Brevo,
// Mailjet eller Scaleway TEM) — konfigureres alene med miljøvariabler.
// Uden SMTP-konfiguration (lokal udvikling) logges mailen til konsollen,
// så magic links kan afprøves uden mailkonto.
// ---------------------------------------------------------------------------
import nodemailer from "nodemailer";

export type Mail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendMail(mail: Mail): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

  if (!SMTP_HOST) {
    console.log(
      "\n=== MAIL (ingen SMTP konfigureret - logges kun) ===\n" +
        `Til: ${mail.to}\nEmne: ${mail.subject}\n\n${mail.text}\n` +
        "===================================================\n"
    );
    return;
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS ?? "" } : undefined,
  });

  await transport.sendMail({
    from: MAIL_FROM ?? "Psykologkompasset <noreply@psykologkompasset.dk>",
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    replyTo: mail.replyTo,
  });
}
