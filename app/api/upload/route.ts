// Billedupload. Billedet gemmes i databasen (ingen fast disk på hostingen).
// Kun for indloggede kandidater.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Ikke logget ind." }, { status: 401 });
  const k = await db.kandidat.findUnique({ where: { ownerId: user.id } });
  if (!k) return NextResponse.json({ error: "Ingen kandidatside." }, { status: 400 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Ingen fil." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Billedet er for stort (højst 5 MB)." }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Kun JPEG, PNG og WebP." }, { status: 400 });

  const billede = await db.billede.create({
    data: { kandidatId: k.id, mime: file.type, data: Buffer.from(await file.arrayBuffer()) },
  });
  return NextResponse.json({ url: `/api/uploads/${billede.id}` });
}
