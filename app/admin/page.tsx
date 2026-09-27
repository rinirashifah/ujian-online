import Link from "next/link";
import { readDb } from "@/lib/db";

export default function AdminDashboard() {
  const db = readDb();
  const totalSoal = db.soal.length;
  const totalUjian = db.ujian.length;
  const totalAttempt = db.attempts.length;
  const sedangBerlangsung = db.attempts.filter((a) => a.status === "berlangsung").length;

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-500">
        Ringkasan
      </p>
      <h1 className="mt-2 font-display text-3xl text-navy-900">
        Selamat datang kembali.
      </h1>

      <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-navy-100 bg-navy-100 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Bank soal" value={totalSoal} />
        <Stat label="Sesi ujian dibuat" value={totalUjian} />
        <Stat label="Total pengerjaan" value={totalAttempt} />
        <Stat label="Sedang berlangsung" value={sedangBerlangsung} />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/soal"
          className="block rounded-sm border border-navy-100 bg-white p-6 transition hover:border-navy-300"
        >
          <p className="font-display text-xl text-navy-900">Kelola Bank Soal →</p>
          <p className="mt-1 text-sm text-navy-500">
            Tambah, ubah, atau hapus soal pilihan ganda dan esai.
          </p>
        </Link>
        <Link
          href="/admin/ujian"
          className="block rounded-sm border border-navy-100 bg-white p-6 transition hover:border-navy-300"
        >
          <p className="font-display text-xl text-navy-900">Buat & Pantau Ujian →</p>
          <p className="mt-1 text-sm text-navy-500">
            Susun sesi ujian dari bank soal dan lihat hasil peserta.
          </p>
        </Link>
      </div>

      {db.ujian[0] && (
        <div className="mt-10 rounded-sm border border-dashed border-navy-300 bg-navy-50/50 p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-500">
            Coba alur peserta
          </p>
          <p className="mt-2 text-sm text-navy-700">
            Gunakan token{" "}
            <span className="font-mono font-semibold text-navy-900">
              {db.ujian[0].token}
            </span>{" "}
            pada halaman{" "}
            <Link href="/ujian/masuk" className="underline decoration-clay-500 underline-offset-2">
              Ikuti Ujian
            </Link>{" "}
            untuk mencoba ujian contoh &ldquo;{db.ujian[0].judul}&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-6">
      <p className="font-display text-4xl text-navy-900">{value}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-navy-500">
        {label}
      </p>
    </div>
  );
}
