// Serverer uploadede billeder fra databasen.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-z0-9]+$/.test(file)) return new NextResponse("Ugyldigt billede", { status: 400 });
  const billede = await db.billede.findUnique({ where: { id: file } });
  if (!billede) return new NextResponse("Ikke fundet", { status: 404 });
  return new NextResponse(new Uint8Array(billede.data), {
    headers: { "Content-Type": billede.mime, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
