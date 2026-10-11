// Billedupload: gemmes på disk (UPLOAD_DIR, persistent volume i produktion).
// Kun for indloggede kandidater.
import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Ikke logget ind." }, { status: 401 });
  const k = await db.kandidat.findUnique({ where: { ownerId: user.id } });
  if (!k) return NextResponse.json({ error: "Ingen kandidatside." }, { status: 400 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Ingen fil." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Billedet er for stort (højst 10 MB)." }, { status: 400 });
  const ext = ALLOWED.get(file.type);
  if (!ext) return NextResponse.json({ error: "Kun JPEG, PNG og WebP." }, { status: 400 });

  const dir = process.env.UPLOAD_DIR ?? "./data/uploads";
  await mkdir(dir, { recursive: true });
  const filename = `${k.id}-${randomBytes(8).toString("hex")}${ext}`;
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/api/uploads/${filename}` });
}
