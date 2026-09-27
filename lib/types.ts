export type TipeSoal = "pilihan_ganda" | "esai";

export interface Soal {
  id: string;
  tipe: TipeSoal;
  pertanyaan: string;
  opsi?: string[]; // untuk pilihan_ganda
  jawabanBenar?: number; // index opsi yang benar, untuk pilihan_ganda
  poin: number;
  topik: string;
  createdAt: string;
}

export interface Ujian {
  id: string;
  token: string;
  judul: string;
  deskripsi: string;
  durasiMenit: number;
  soalIds: string[];
  acakSoal: boolean;
  tampilkanHasil: boolean;
  createdAt: string;
}

export interface JawabanPeserta {
  soalId: string;
  jawabanIndex?: number; // pilihan_ganda
  jawabanTeks?: string; // esai
}

export interface Attempt {
  id: string;
  ujianId: string;
  namaPeserta: string;
  mulaiPada: string;
  batasWaktu: string;
  selesaiPada?: string;
  jawaban: JawabanPeserta[];
  skor?: number;
  skorMaksimal?: number;
  status: "berlangsung" | "selesai";
}

export interface Database {
  soal: Soal[];
  ujian: Ujian[];
  attempts: Attempt[];
}
