// Serverer uploadede billeder fra disk. Filnavne er tilfældige og
// praksis-prefixede; stien valideres, så der ikke kan læses udenfor mappen.
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  if (!/^[a-zA-Z0-9._-]+$/.test(file)) return new NextResponse("Ugyldigt filnavn", { status: 400 });

  const dir = process.env.UPLOAD_DIR ?? "./data/uploads";
  try {
    const data = await readFile(path.join(dir, file));
    const mime = MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": mime, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new NextResponse("Ikke fundet", { status: 404 });
  }
}
