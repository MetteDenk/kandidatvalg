// ---------------------------------------------------------------------------
// Auth: e-mail magic link. Ingen adgangskoder.
//  - Login-token: engangs, 15 min levetid, gemmes hash'et.
//  - Session: httpOnly-cookie med tilfældigt token, gemmes hash'et, 30 dage.
// Bevidst uden tredjeparts auth-tjeneste (EU-krav + transparens).
// ---------------------------------------------------------------------------
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";
import { sendMail } from "./mailer";

const SESSION_COOKIE = "psykologkompasset_session";
const SESSION_DAYS = 30;
const LOGIN_TOKEN_MINUTES = 15;

function hash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestMagicLink(rawEmail: string): Promise<void> {
  const email = rawEmail.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Ugyldig e-mailadresse.");

  const user = await db.user.upsert({ where: { email }, update: {}, create: { email } });

  const token = randomBytes(32).toString("hex");
  await db.loginToken.create({
    data: {
      userId: user.id,
      tokenHash: hash(token),
      expiresAt: new Date(Date.now() + LOGIN_TOKEN_MINUTES * 60_000),
    },
  });

  const url = `${process.env.APP_URL ?? "http://localhost:3100"}/login/verify?token=${token}`;
  await sendMail({
    to: email,
    subject: "Log ind hos Psykologkompasset",
    text:
      `Hej!\n\nKlik på linket for at logge ind hos Psykologkompasset:\n\n${url}\n\n` +
      `Linket virker i ${LOGIN_TOKEN_MINUTES} minutter og kan kun bruges én gang.\n` +
      "Har du ikke bedt om dette, kan du se bort fra mailen.",
  });
}

// Indløser et magic-link-token og opretter en session. Returnerer userId
// eller null hvis tokenet er ugyldigt/udløbet/brugt.
export async function redeemMagicLink(token: string): Promise<string | null> {
  const record = await db.loginToken.findUnique({ where: { tokenHash: hash(token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;

  await db.loginToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });

  const sessionToken = randomBytes(32).toString("hex");
  await db.session.create({
    data: {
      userId: record.userId,
      tokenHash: hash(sessionToken),
      expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 3600_000),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 3600,
    path: "/",
  });

  return record.userId;
}

export async function currentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hash(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hash(token) } });
    cookieStore.delete(SESSION_COOKIE);
  }
}
