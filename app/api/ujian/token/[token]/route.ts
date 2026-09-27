import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const db = readDb();
  const ujian = db.ujian.find(
    (u) => u.token.toUpperCase() === params.token.toUpperCase()
  );
  if (!ujian) {
    return NextResponse.json({ error: "Token ujian tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({
    id: ujian.id,
    judul: ujian.judul,
    deskripsi: ujian.deskripsi,
    durasiMenit: ujian.durasiMenit,
    jumlahSoal: ujian.soalIds.length,
  });
}
