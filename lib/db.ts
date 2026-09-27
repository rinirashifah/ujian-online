import fs from "fs";
import path from "path";
import type { Database } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function emptyDb(): Database {
  return { soal: [], ujian: [], attempts: [] };
}

export function readDb(): Database {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as Database;
  } catch {
    const db = emptyDb();
    writeDb(db);
    return db;
  }
}

export function writeDb(db: Database) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function genId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function genToken() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
