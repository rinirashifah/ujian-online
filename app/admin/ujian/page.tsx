"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Soal, Ujian } from "@/lib/types";

export default function SesiUjianPage() {
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [ujianList, setUjianList] = useState<(Ujian & { jumlahPeserta: number })[]>([]);
  const [loading, setLoading] = useState(true);

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [durasiMenit, setDurasiMenit] = useState(30);
  const [acakSoal, setAcakSoal] = useState(false);
  const [tampilkanHasil, setTampilkanHasil] = useState(true);
  const [dipilih, setDipilih] = useState<string[]>([]);
  const [dibuat, setDibuat] = useState<Ujian | null>(null);
  const [error, setError] = useState("");

  async function muat() {
    setLoading(true);
    const [rs, ru] = await Promise.all([fetch("/api/soal"), fetch("/api/ujian")]);
    setSoalList(await rs.json());
    setUjianList(await ru.json());
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  function toggleSoal(id: string) {
    setDipilih((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function buatUjian() {
    setError("");
    if (!judul.trim()) {
      setError("Judul ujian wajib diisi.");
      return;
    }
    if (dipilih.length === 0) {
      setError("Pilih minimal satu soal untuk ujian ini.");
      return;
    }
    const res = await fetch("/api/ujian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        judul,
        deskripsi,
        durasiMenit,
        acakSoal,
        tampilkanHasil,
        soalIds: dipilih,
      }),
    });
    const data = await res.json();
    setDibuat(data);
    setJudul("");
    setDeskripsi("");
    setDurasiMenit(30);
    setDipilih([]);
    muat();
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-500">
        Sesi Ujian
      </p>
      <h1 className="mt-2 font-display text-3xl text-navy-900">Buat sesi ujian baru</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-sm border border-navy-100 bg-white p-6">
          <div className="grid gap-4">
            <Field label="Judul ujian">
              <input
                className="w-full rounded-sm border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-300"
                placeholder="mis. Ujian Tengah Semester - IPA"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
              />
            </Field>
            <Field label="Deskripsi (opsional)">
              <input
                className="w-full rounded-sm border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-300"
                placeholder="Instruksi singkat untuk peserta"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Durasi (menit)">
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-sm border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-300"
                  value={durasiMenit}
                  onChange={(e) => setDurasiMenit(Number(e.target.value))}
                />
              </Field>
              <div className="flex flex-col justify-end gap-2 pb-1.5">
                <label className="flex items-center gap-2 text-sm text-navy-700">
                  <input
                    type="checkbox"
                    checked={acakSoal}
                    onChange={(e) => setAcakSoal(e.target.checked)}
                    className="h-4 w-4 accent-navy-900"
                  />
                  Acak urutan soal
                </label>
                <label className="flex items-center gap-2 text-sm text-navy-700">
                  <input
                    type="checkbox"
                    checked={tampilkanHasil}
                    onChange={(e) => setTampilkanHasil(e.target.checked)}
                    className="h-4 w-4 accent-navy-900"
                  />
                  Tampilkan skor ke peserta
                </label>
              </div>
            </div>

            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-navy-500">
                Pilih soal ({dipilih.length} dipilih)
              </p>
              <div className="max-h-72 overflow-y-auto rounded-sm border border-navy-100">
                {soalList.map((s) => (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-start gap-3 border-b border-navy-50 p-3 text-sm last:border-b-0 hover:bg-navy-50/50"
                  >
                    <input
                      type="checkbox"
                      checked={dipilih.includes(s.id)}
                      onChange={() => toggleSoal(s.id)}
                      className="mt-1 h-4 w-4 accent-navy-900"
                    />
                    <span>
                      <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-clay-500">
                        {s.topik}
                      </span>
                      {s.pertanyaan}
                    </span>
                  </label>
                ))}
                {soalList.length === 0 && (
                  <p className="p-4 text-sm text-navy-500">
                    Belum ada soal.{" "}
                    <Link href="/admin/soal" className="underline">
                      Tambahkan soal
                    </Link>{" "}
                    terlebih dahulu.
                  </p>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-clay-500">{error}</p>}

            <button
              onClick={buatUjian}
              className="w-fit rounded-sm bg-navy-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-navy-700"
            >
              Buat sesi ujian
            </button>
          </div>
        </div>

        <div>
          {dibuat && (
            <div className="mb-6 rounded-sm bg-navy-900 p-6 text-white perforated">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy-300">
                Ujian dibuat — bagikan token ini
              </p>
              <p className="mt-2 font-display text-xl">{dibuat.judul}</p>
              <p className="mt-4 font-mono text-4xl tracking-[0.3em] text-amber-400">
                {dibuat.token}
              </p>
              <p className="mt-3 text-xs text-navy-300">
                Peserta memasukkan token ini di halaman &ldquo;Ikuti Ujian&rdquo;.
              </p>
            </div>
          )}

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-navy-500">
            {loading ? "Memuat..." : `${ujianList.length} sesi ujian`}
          </p>
          <div className="mt-4 grid gap-3">
            {ujianList.map((u) => (
              <Link
                key={u.id}
                href={`/admin/ujian/${u.id}/hasil`}
                className="block rounded-sm border border-navy-100 bg-white p-4 transition hover:border-navy-300"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg text-navy-900">{u.judul}</p>
                  <span className="font-mono text-xs uppercase tracking-widest text-navy-300">
                    {u.jumlahPeserta} peserta
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-navy-500">
                  <span className="font-mono uppercase tracking-widest text-clay-500">
                    Token: {u.token}
                  </span>
                  <span>{u.durasiMenit} menit</span>
                  <span>{u.soalIds.length} soal</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-navy-500">
        {label}
      </span>
      {children}
    </label>
  );
}
