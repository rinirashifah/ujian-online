"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SoalTampil {
  id: string;
  tipe: "pilihan_ganda" | "esai";
  pertanyaan: string;
  opsi?: string[];
  poin: number;
  topik: string;
}

interface UjianInfo {
  id: string;
  judul: string;
  deskripsi: string;
  durasiMenit: number;
  tampilkanHasil: boolean;
}

interface JawabanState {
  [soalId: string]: { jawabanIndex?: number; jawabanTeks?: string };
}

export default function KerjakanUjianPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [tahap, setTahap] = useState<"masuk" | "mengerjakan">("masuk");
  const [nama, setNama] = useState("");
  const [errorMasuk, setErrorMasuk] = useState("");
  const [memulai, setMemulai] = useState(false);

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [ujian, setUjian] = useState<UjianInfo | null>(null);
  const [soalList, setSoalList] = useState<SoalTampil[]>([]);
  const [jawaban, setJawaban] = useState<JawabanState>({});
  const [aktif, setAktif] = useState(0);
  const [sisaDetik, setSisaDetik] = useState(0);
  const [status, setStatus] = useState("");
  const [mengirim, setMengirim] = useState(false);

  const batasWaktuRef = useRef<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function mulaiUjian(e: React.FormEvent) {
    e.preventDefault();
    setErrorMasuk("");
    if (!nama.trim()) {
      setErrorMasuk("Nama wajib diisi.");
      return;
    }
    setMemulai(true);
    const res = await fetch("/api/attempt/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: params.token, namaPeserta: nama }),
    });
    setMemulai(false);
    if (!res.ok) {
      const d = await res.json();
      setErrorMasuk(d.error || "Gagal memulai ujian.");
      return;
    }
    const data = await res.json();
    setAttemptId(data.attempt.id);
    setUjian(data.ujian);
    setSoalList(data.soal);
    batasWaktuRef.current = data.attempt.batasWaktu;

    const initJawaban: JawabanState = {};
    for (const j of data.attempt.jawaban) {
      initJawaban[j.soalId] = { jawabanIndex: j.jawabanIndex, jawabanTeks: j.jawabanTeks };
    }
    setJawaban(initJawaban);
    setTahap("mengerjakan");
  }

  const submitUjian = useCallback(
    async (auto = false) => {
      if (!attemptId) return;
      setMengirim(true);
      const res = await fetch(`/api/attempt/${attemptId}/submit`, { method: "POST" });
      const hasil = await res.json();
      sessionStorage.setItem(`hasil_${attemptId}`, JSON.stringify(hasil));
      sessionStorage.setItem(
        `ujianinfo_${attemptId}`,
        JSON.stringify({ judul: ujian?.judul, tampilkanHasil: ujian?.tampilkanHasil })
      );
      router.push(`/ujian/selesai?attempt=${attemptId}${auto ? "&auto=1" : ""}`);
    },
    [attemptId, router, ujian]
  );

  // Timer
  useEffect(() => {
    if (tahap !== "mengerjakan" || !batasWaktuRef.current) return;
    const hitung = () => {
      const sisa = Math.max(
        0,
        Math.floor((new Date(batasWaktuRef.current!).getTime() - Date.now()) / 1000)
      );
      setSisaDetik(sisa);
      if (sisa === 0) {
        submitUjian(true);
      }
    };
    hitung();
    const interval = setInterval(hitung, 1000);
    return () => clearInterval(interval);
  }, [tahap, submitUjian]);

  function simpanJawabanPG(soalId: string, jawabanIndex: number) {
    setJawaban((prev) => ({ ...prev, [soalId]: { jawabanIndex } }));
    autosave(soalId, { jawabanIndex });
  }

  function simpanJawabanEsai(soalId: string, jawabanTeks: string) {
    setJawaban((prev) => ({ ...prev, [soalId]: { jawabanTeks } }));
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => autosave(soalId, { jawabanTeks }), 600);
  }

  async function autosave(
    soalId: string,
    payload: { jawabanIndex?: number; jawabanTeks?: string }
  ) {
    if (!attemptId) return;
    setStatus("Menyimpan...");
    const res = await fetch(`/api/attempt/${attemptId}/autosave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soalId, ...payload }),
    });
    setStatus(res.ok ? "Tersimpan" : "Gagal menyimpan");
    setTimeout(() => setStatus(""), 1500);
  }

  if (tahap === "masuk") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy-900 px-6">
        <div className="w-full max-w-sm rounded-sm bg-white p-8 perforated">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay-500">
            Token {params.token}
          </p>
          <h1 className="mt-2 font-display text-2xl text-navy-900">Siapa nama Anda?</h1>
          <p className="mt-1 text-sm text-navy-500">
            Nama ini akan tercatat sebagai identitas peserta ujian.
          </p>
          <form onSubmit={mulaiUjian} className="mt-6">
            <input
              autoFocus
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap"
              className="w-full rounded-sm border border-navy-100 px-4 py-3 text-navy-900 outline-none focus:border-navy-300"
            />
            {errorMasuk && <p className="mt-3 text-sm text-clay-500">{errorMasuk}</p>}
            <button
              type="submit"
              disabled={memulai}
              className="mt-5 w-full rounded-sm bg-navy-900 py-3 text-sm font-medium text-white transition hover:bg-navy-700 disabled:opacity-60"
            >
              {memulai ? "Memulai..." : "Mulai ujian"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const menit = String(Math.floor(sisaDetik / 60)).padStart(2, "0");
  const detik = String(sisaDetik % 60).padStart(2, "0");
  const waktuKritis = sisaDetik <= 60;
  const soalSekarang = soalList[aktif];
  const terjawab = Object.keys(jawaban).filter(
    (id) => jawaban[id]?.jawabanIndex !== undefined || jawaban[id]?.jawabanTeks
  ).length;

  return (
    <div className="min-h-screen bg-paper pb-24">
      <header className="sticky top-0 z-10 border-b border-navy-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-display text-lg text-navy-900">{ujian?.judul}</p>
            <p className="font-mono text-xs text-navy-400">{status || `${terjawab}/${soalList.length} terjawab`}</p>
          </div>
          <div
            className={`rounded-sm px-4 py-2 font-mono text-2xl tabular-nums ${
              waktuKritis ? "bg-clay-500 text-white" : "bg-navy-900 text-amber-400"
            }`}
          >
            {menit}:{detik}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {soalList.map((s, i) => {
            const sudahJawab =
              jawaban[s.id]?.jawabanIndex !== undefined || jawaban[s.id]?.jawabanTeks;
            return (
              <button
                key={s.id}
                onClick={() => setAktif(i)}
                className={`h-9 w-9 rounded-sm font-mono text-sm transition ${
                  i === aktif
                    ? "bg-navy-900 text-white"
                    : sudahJawab
                    ? "bg-teal-500/15 text-teal-600"
                    : "bg-white text-navy-400 ring-1 ring-navy-100"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {soalSekarang && (
          <div className="rounded-sm border border-navy-100 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-sm bg-navy-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-navy-500">
                Soal {aktif + 1} dari {soalList.length}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-clay-500">
                {soalSekarang.topik}
              </span>
              <span className="font-mono text-[10px] text-navy-300">{soalSekarang.poin} poin</span>
            </div>
            <p className="font-display text-lg text-navy-900">{soalSekarang.pertanyaan}</p>

            {soalSekarang.tipe === "pilihan_ganda" ? (
              <div className="mt-5 grid gap-2">
                {soalSekarang.opsi?.map((opsi, i) => {
                  const terpilih = jawaban[soalSekarang.id]?.jawabanIndex === i;
                  return (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-center gap-3 rounded-sm border p-3 text-sm transition ${
                        terpilih
                          ? "border-navy-900 bg-navy-50"
                          : "border-navy-100 hover:border-navy-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`soal-${soalSekarang.id}`}
                        checked={terpilih}
                        onChange={() => simpanJawabanPG(soalSekarang.id, i)}
                        className="h-4 w-4 accent-navy-900"
                      />
                      {opsi}
                    </label>
                  );
                })}
              </div>
            ) : (
              <textarea
                rows={6}
                className="mt-5 w-full rounded-sm border border-navy-100 p-3 text-sm outline-none focus:border-navy-300"
                placeholder="Tulis jawaban Anda di sini..."
                value={jawaban[soalSekarang.id]?.jawabanTeks || ""}
                onChange={(e) => simpanJawabanEsai(soalSekarang.id, e.target.value)}
              />
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setAktif((a) => Math.max(0, a - 1))}
                disabled={aktif === 0}
                className="rounded-sm border border-navy-100 px-4 py-2 text-sm text-navy-700 disabled:opacity-40"
              >
                ← Sebelumnya
              </button>
              {aktif < soalList.length - 1 ? (
                <button
                  onClick={() => setAktif((a) => Math.min(soalList.length - 1, a + 1))}
                  className="rounded-sm bg-navy-900 px-4 py-2 text-sm text-white hover:bg-navy-700"
                >
                  Selanjutnya →
                </button>
              ) : (
                <button
                  onClick={() => submitUjian(false)}
                  disabled={mengirim}
                  className="rounded-sm bg-clay-500 px-5 py-2 text-sm font-medium text-white hover:bg-clay-500/90 disabled:opacity-60"
                >
                  {mengirim ? "Mengirim..." : "Selesai & Kumpulkan"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
