import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = readDb();
  const attempt = db.attempts.find((a) => a.id === params.id);
  if (!attempt) {
    return NextResponse.json({ error: "Attempt tidak ditemukan" }, { status: 404 });
  }
  if (attempt.status === "selesai") {
    return NextResponse.json(attempt);
  }

  const ujian = db.ujian.find((u) => u.id === attempt.ujianId);
  const soalUjian = db.soal.filter((s) => ujian?.soalIds.includes(s.id));

  let skor = 0;
  let skorMaksimal = 0;
  for (const s of soalUjian) {
    skorMaksimal += s.poin;
    if (s.tipe === "pilihan_ganda") {
      const jawaban = attempt.jawaban.find((j) => j.soalId === s.id);
      if (jawaban && jawaban.jawabanIndex === s.jawabanBenar) {
        skor += s.poin;
      }
    }
    // soal esai tidak dinilai otomatis, menunggu penilaian manual guru
  }

  attempt.status = "selesai";
  attempt.selesaiPada = new Date().toISOString();
  attempt.skor = skor;
  attempt.skorMaksimal = skorMaksimal;

  writeDb(db);
  return NextResponse.json(attempt);
}
