"use client";

import { useEffect, useState } from "react";
import type { Attempt, Ujian } from "@/lib/types";

interface HasilData {
  ujian: Ujian;
  attempts: Attempt[];
  skorMaksimal: number;
  rataRata: number;
  jumlahSelesai: number;
  jumlahBerlangsung: number;
}

export default function HasilUjianPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<HasilData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ujian/${params.id}/hasil`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <p className="text-sm text-navy-500">Memuat hasil...</p>;
  if (!data || !data.ujian) return <p className="text-sm text-clay-500">Ujian tidak ditemukan.</p>;

  const { ujian, attempts, skorMaksimal, rataRata, jumlahSelesai, jumlahBerlangsung } = data;

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-500">
        Hasil Ujian
      </p>
      <h1 className="mt-2 font-display text-3xl text-navy-900">{ujian.judul}</h1>
      <p className="mt-1 text-sm text-navy-500">
        Token <span className="font-mono text-navy-900">{ujian.token}</span> · {ujian.durasiMenit} menit · {ujian.soalIds.length} soal
      </p>

      <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-navy-100 bg-navy-100 sm:grid-cols-4">
        <Stat label="Skor maksimal" value={skorMaksimal} />
        <Stat label="Rata-rata skor" value={rataRata} />
        <Stat label="Selesai" value={jumlahSelesai} />
        <Stat label="Sedang berlangsung" value={jumlahBerlangsung} />
      </div>

      <div className="mt-8 overflow-hidden rounded-sm border border-navy-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50/60">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest text-navy-500">Peserta</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest text-navy-500">Status</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest text-navy-500">Mulai</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest text-navy-500">Skor</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => (
              <tr key={a.id} className="border-b border-navy-50 last:border-b-0">
                <td className="px-4 py-3 text-navy-900">{a.namaPeserta}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                      a.status === "selesai"
                        ? "bg-teal-500/10 text-teal-600"
                        : "bg-amber-400/20 text-amber-600"
                    }`}
                  >
                    {a.status === "selesai" ? "Selesai" : "Berlangsung"}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-500">
                  {new Date(a.mulaiPada).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3 font-mono text-navy-900">
                  {a.status === "selesai" ? `${a.skor} / ${a.skorMaksimal}` : "—"}
                </td>
              </tr>
            ))}
            {attempts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-navy-500">
                  Belum ada peserta yang mengerjakan ujian ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-5">
      <p className="font-display text-3xl text-navy-900">{value}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-navy-500">
        {label}
      </p>
    </div>
  );
}
