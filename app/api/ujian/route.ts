import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, genId, genToken } from "@/lib/db";
import type { Ujian } from "@/lib/types";

export async function GET() {
  const db = readDb();
  const withCount = db.ujian.map((u) => ({
    ...u,
    jumlahPeserta: db.attempts.filter((a) => a.ujianId === u.id).length,
  }));
  return NextResponse.json(withCount);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = readDb();

  let token = genToken();
  while (db.ujian.some((u) => u.token === token)) token = genToken();

  const ujian: Ujian = {
    id: genId("ujian"),
    token,
    judul: body.judul,
    deskripsi: body.deskripsi || "",
    durasiMenit: Number(body.durasiMenit) || 30,
    soalIds: body.soalIds || [],
    acakSoal: Boolean(body.acakSoal),
    tampilkanHasil: body.tampilkanHasil !== false,
    createdAt: new Date().toISOString(),
  };

  db.ujian.unshift(ujian);
  writeDb(db);
  return NextResponse.json(ujian, { status: 201 });
}
