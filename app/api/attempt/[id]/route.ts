import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = readDb();
  const attempt = db.attempts.find((a) => a.id === params.id);
  if (!attempt) {
    return NextResponse.json({ error: "Attempt tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json(attempt);
}
