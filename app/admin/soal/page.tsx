"use client";

import { useEffect, useState } from "react";
import type { Soal, TipeSoal } from "@/lib/types";

const KOSONG = {
  tipe: "pilihan_ganda" as TipeSoal,
  pertanyaan: "",
  opsi: ["", "", "", ""],
  jawabanBenar: 0,
  poin: 10,
  topik: "",
};

export default function BankSoalPage() {
  const [daftar, setDaftar] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(KOSONG);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function muat() {
    setLoading(true);
    const res = await fetch("/api/soal");
    setDaftar(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  function resetForm() {
    setForm(KOSONG);
    setEditingId(null);
    setError("");
  }

  async function simpan() {
    setError("");
    if (!form.pertanyaan.trim()) {
      setError("Pertanyaan wajib diisi.");
      return;
    }
    if (form.tipe === "pilihan_ganda" && form.opsi.some((o) => !o.trim())) {
      setError("Semua opsi jawaban wajib diisi.");
      return;
    }

    const payload = {
      ...form,
      topik: form.topik.trim() || "Umum",
    };

    if (editingId) {
      await fetch(`/api/soal/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/soal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    muat();
  }

  function editSoal(s: Soal) {
    setEditingId(s.id);
    setForm({
      tipe: s.tipe,
      pertanyaan: s.pertanyaan,
      opsi: s.opsi ?? ["", "", "", ""],
      jawabanBenar: s.jawabanBenar ?? 0,
      poin: s.poin,
      topik: s.topik,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function hapusSoal(id: string) {
    if (!confirm("Hapus soal ini? Tindakan tidak dapat dibatalkan.")) return;
    await fetch(`/api/soal/${id}`, { method: "DELETE" });
    muat();
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-500">
        Bank Soal
      </p>
      <h1 className="mt-2 font-display text-3xl text-navy-900">
        {editingId ? "Ubah soal" : "Tambah soal baru"}
      </h1>

      <div className="mt-6 rounded-sm border border-navy-100 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <Field label="Topik">
            <input
              className="w-full rounded-sm border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-300"
              placeholder="mis. Matematika"
              value={form.topik}
              onChange={(e) => setForm({ ...form, topik: e.target.value })}
            />
          </Field>
          <Field label="Tipe soal">
            <select
              className="w-full rounded-sm border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-300"
              value={form.tipe}
              onChange={(e) =>
                setForm({ ...form, tipe: e.target.value as TipeSoal })
              }
            >
              <option value="pilihan_ganda">Pilihan Ganda</option>
              <option value="esai">Esai</option>
            </select>
          </Field>
          <Field label="Poin">
            <input
              type="number"
              min={1}
              className="w-24 rounded-sm border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-300"
              value={form.poin}
              onChange={(e) => setForm({ ...form, poin: Number(e.target.value) })}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Pertanyaan">
            <textarea
              className="w-full rounded-sm border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-300"
              rows={3}
              placeholder="Tulis pertanyaan di sini..."
              value={form.pertanyaan}
              onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })}
            />
          </Field>
        </div>

        {form.tipe === "pilihan_ganda" && (
          <div className="mt-4">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-navy-500">
              Opsi jawaban (tandai yang benar)
            </p>
            <div className="grid gap-2">
              {form.opsi.map((opsi, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="jawabanBenar"
                    checked={form.jawabanBenar === i}
                    onChange={() => setForm({ ...form, jawabanBenar: i })}
                    className="h-4 w-4 accent-teal-600"
                  />
                  <input
                    className="w-full rounded-sm border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-300"
                    placeholder={`Opsi ${i + 1}`}
                    value={opsi}
                    onChange={(e) => {
                      const opsiBaru = [...form.opsi];
                      opsiBaru[i] = e.target.value;
                      setForm({ ...form, opsi: opsiBaru });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-clay-500">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button
            onClick={simpan}
            className="rounded-sm bg-navy-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-navy-700"
          >
            {editingId ? "Simpan perubahan" : "Tambah soal"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="rounded-sm border border-navy-100 px-5 py-2 text-sm text-navy-700 hover:border-navy-300"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      <div className="mt-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-navy-500">
          {loading ? "Memuat..." : `${daftar.length} soal tersimpan`}
        </p>
        <div className="mt-4 grid gap-3">
          {daftar.map((s) => (
            <div
              key={s.id}
              className="flex items-start justify-between gap-4 rounded-sm border border-navy-100 bg-white p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-sm bg-navy-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-navy-500">
                    {s.tipe === "pilihan_ganda" ? "Pilihan Ganda" : "Esai"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-clay-500">
                    {s.topik}
                  </span>
                  <span className="font-mono text-[10px] text-navy-300">
                    {s.poin} poin
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm text-navy-900">{s.pertanyaan}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => editSoal(s)}
                  className="font-mono text-xs uppercase tracking-widest text-navy-500 hover:text-navy-900"
                >
                  Ubah
                </button>
                <button
                  onClick={() => hapusSoal(s.id)}
                  className="font-mono text-xs uppercase tracking-widest text-clay-500 hover:text-clay-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          {!loading && daftar.length === 0 && (
            <p className="rounded-sm border border-dashed border-navy-100 p-6 text-center text-sm text-navy-500">
              Belum ada soal. Tambahkan soal pertama Anda di atas.
            </p>
          )}
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
