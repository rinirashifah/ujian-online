import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = readDb();
  const ujian = db.ujian.find((u) => u.id === params.id);
  if (!ujian) {
    return NextResponse.json({ error: "Ujian tidak ditemukan" }, { status: 404 });
  }
  const attempts = db.attempts
    .filter((a) => a.ujianId === params.id)
    .sort((a, b) => (b.skor ?? 0) - (a.skor ?? 0));

  const soalUjian = db.soal.filter((s) => ujian.soalIds.includes(s.id));
  const skorMaksimal = soalUjian.reduce((sum, s) => sum + s.poin, 0);

  const selesai = attempts.filter((a) => a.status === "selesai");
  const rataRata =
    selesai.length > 0
      ? selesai.reduce((sum, a) => sum + (a.skor ?? 0), 0) / selesai.length
      : 0;

  return NextResponse.json({
    ujian,
    attempts,
    skorMaksimal,
    rataRata: Math.round(rataRata * 10) / 10,
    jumlahSelesai: selesai.length,
    jumlahBerlangsung: attempts.length - selesai.length,
  });
}
