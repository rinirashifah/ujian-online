import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, genId } from "@/lib/db";
import type { Attempt } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { token, namaPeserta } = await req.json();
  const db = readDb();

  const ujian = db.ujian.find(
    (u) => u.token.toUpperCase() === String(token).toUpperCase()
  );
  if (!ujian) {
    return NextResponse.json({ error: "Token ujian tidak ditemukan" }, { status: 404 });
  }
  if (!namaPeserta || !String(namaPeserta).trim()) {
    return NextResponse.json({ error: "Nama peserta wajib diisi" }, { status: 400 });
  }

  // Jika peserta dengan nama sama sudah punya attempt berlangsung untuk ujian ini, lanjutkan itu
  const existing = db.attempts.find(
    (a) =>
      a.ujianId === ujian.id &&
      a.namaPeserta.toLowerCase() === String(namaPeserta).toLowerCase() &&
      a.status === "berlangsung"
  );

  let attempt: Attempt;
  if (existing) {
    attempt = existing;
  } else {
    const mulai = new Date();
    const batas = new Date(mulai.getTime() + ujian.durasiMenit * 60 * 1000);
    attempt = {
      id: genId("attempt"),
      ujianId: ujian.id,
      namaPeserta: String(namaPeserta).trim(),
      mulaiPada: mulai.toISOString(),
      batasWaktu: batas.toISOString(),
      jawaban: [],
      status: "berlangsung",
    };
    db.attempts.unshift(attempt);
    writeDb(db);
  }

  let soalUjian = db.soal
    .filter((s) => ujian.soalIds.includes(s.id))
    .map((s) => ({
      id: s.id,
      tipe: s.tipe,
      pertanyaan: s.pertanyaan,
      opsi: s.opsi,
      poin: s.poin,
      topik: s.topik,
    }));

  if (ujian.acakSoal && !existing) {
    soalUjian = soalUjian.sort(() => Math.random() - 0.5);
  }

  return NextResponse.json({
    attempt,
    ujian: {
      id: ujian.id,
      judul: ujian.judul,
      deskripsi: ujian.deskripsi,
      durasiMenit: ujian.durasiMenit,
      tampilkanHasil: ujian.tampilkanHasil,
    },
    soal: soalUjian,
  });
}
