import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const db = readDb();
  const idx = db.soal.findIndex((s) => s.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Soal tidak ditemukan" }, { status: 404 });
  }
  db.soal[idx] = { ...db.soal[idx], ...body };
  writeDb(db);
  return NextResponse.json(db.soal[idx]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = readDb();
  db.soal = db.soal.filter((s) => s.id !== params.id);
  writeDb(db);
  return NextResponse.json({ ok: true });
}
