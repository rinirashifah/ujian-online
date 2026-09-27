"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Attempt } from "@/lib/types";

export default function UjianSelesaiPage() {
  return (
    <Suspense fallback={null}>
      <UjianSelesaiContent />
    </Suspense>
  );
}

function UjianSelesaiContent() {
  const params = useSearchParams();
  const attemptId = params.get("attempt");
  const auto = params.get("auto") === "1";
  const [hasil, setHasil] = useState<Attempt | null>(null);
  const [info, setInfo] = useState<{ judul?: string; tampilkanHasil?: boolean }>({});

  useEffect(() => {
    if (!attemptId) return;
    const cached = sessionStorage.getItem(`hasil_${attemptId}`);
    const cachedInfo = sessionStorage.getItem(`ujianinfo_${attemptId}`);
    if (cached) setHasil(JSON.parse(cached));
    if (cachedInfo) setInfo(JSON.parse(cachedInfo));
  }, [attemptId]);

  const persen =
    hasil?.skor !== undefined && hasil.skorMaksimal
      ? Math.round((hasil.skor / hasil.skorMaksimal) * 100)
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-6">
      <div className="w-full max-w-md rounded-sm bg-white p-8 text-center perforated">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-600">
          {auto ? "Waktu habis — otomatis dikumpulkan" : "Ujian terkumpul"}
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy-900">Terima kasih.</h1>
        <p className="mt-1 text-sm text-navy-500">
          Jawaban Anda untuk &ldquo;{info.judul || "ujian ini"}&rdquo; telah tersimpan.
        </p>

        {info.tampilkanHasil !== false && persen !== null ? (
          <div className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full border-8 border-navy-50">
            <div>
              <p className="font-display text-3xl text-navy-900">{persen}%</p>
              <p className="font-mono text-[10px] text-navy-400">
                {hasil?.skor}/{hasil?.skorMaksimal}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-navy-500">
            Hasil akan diumumkan oleh pengawas ujian.
          </p>
        )}

        <Link
          href="/ujian/masuk"
          className="mt-8 inline-block rounded-sm border border-navy-100 px-5 py-2 text-sm text-navy-700 hover:border-navy-300"
        >
          Ikuti ujian lain
        </Link>
      </div>
    </main>
  );
}
