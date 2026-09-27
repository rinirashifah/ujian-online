"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MasukUjianPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lanjut(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!token.trim()) {
      setError("Masukkan token ujian.");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/ujian/token/${token.trim().toUpperCase()}`);
    setLoading(false);
    if (!res.ok) {
      setError("Token tidak ditemukan. Periksa kembali dengan pengawas ujian.");
      return;
    }
    router.push(`/ujian/${token.trim().toUpperCase()}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block font-display text-lg text-white">
          Ujian<span className="text-amber-400">.</span>Online
        </Link>

        <div className="rounded-sm bg-white p-8 perforated">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay-500">
            Tiket Masuk Ujian
          </p>
          <h1 className="mt-2 font-display text-2xl text-navy-900">
            Masukkan token ujian
          </h1>
          <p className="mt-1 text-sm text-navy-500">
            Token diberikan oleh guru atau pengawas ujian Anda.
          </p>

          <form onSubmit={lanjut} className="mt-6">
            <input
              autoFocus
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              placeholder="mis. DEMO26"
              className="w-full rounded-sm border border-navy-100 px-4 py-3 text-center font-mono text-2xl tracking-[0.3em] text-navy-900 outline-none focus:border-navy-300"
              maxLength={8}
            />
            {error && <p className="mt-3 text-sm text-clay-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-sm bg-navy-900 py-3 text-sm font-medium text-white transition hover:bg-navy-700 disabled:opacity-60"
            >
              {loading ? "Memeriksa..." : "Lanjutkan"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
