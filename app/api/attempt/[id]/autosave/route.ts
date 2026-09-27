import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import type { JawabanPeserta } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { soalId, jawabanIndex, jawabanTeks } = await req.json();
  const db = readDb();
  const attempt = db.attempts.find((a) => a.id === params.id);
  if (!attempt) {
    return NextResponse.json({ error: "Attempt tidak ditemukan" }, { status: 404 });
  }
  if (attempt.status === "selesai") {
    return NextResponse.json({ error: "Ujian sudah disubmit" }, { status: 400 });
  }
  if (new Date() > new Date(attempt.batasWaktu)) {
    return NextResponse.json({ error: "Waktu ujian telah habis" }, { status: 400 });
  }

  const jawabanBaru: JawabanPeserta = { soalId, jawabanIndex, jawabanTeks };
  const idx = attempt.jawaban.findIndex((j) => j.soalId === soalId);
  if (idx === -1) {
    attempt.jawaban.push(jawabanBaru);
  } else {
    attempt.jawaban[idx] = jawabanBaru;
  }
  writeDb(db);
  return NextResponse.json({ ok: true, tersimpanPada: new Date().toISOString() });
}
