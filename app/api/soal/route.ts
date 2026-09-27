import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, genId } from "@/lib/db";
import type { Soal } from "@/lib/types";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.soal);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDb();

  const soal: Soal = {
    id: genId("soal"),
    tipe: body.tipe,
    pertanyaan: body.pertanyaan,
    opsi: body.tipe === "pilihan_ganda" ? body.opsi : undefined,
    jawabanBenar: body.tipe === "pilihan_ganda" ? body.jawabanBenar : undefined,
    poin: Number(body.poin) || 10,
    topik: body.topik || "Umum",
    createdAt: new Date().toISOString(),
  };

  db.soal.unshift(soal);
  writeDb(db);
  return NextResponse.json(soal, { status: 201 });
}
