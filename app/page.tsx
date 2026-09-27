import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="mb-16 flex items-center justify-between">
          <span className="font-display text-lg font-semibold tracking-tight text-navy-900">
            Ujian<span className="text-clay-500">.</span>Online
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-navy-300">
            Semester Ganjil 2026
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.3fr_1fr] md:gap-8">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-clay-500">
              Sistem Penyelenggaraan Ujian
            </p>
            <h1 className="font-display text-4xl italic leading-[1.05] text-navy-900 md:text-6xl">
              Satu ruang ujian,
              <br />
              <span className="not-italic">tanpa kertas.</span>
            </h1>
            <p className="mt-6 max-w-md font-body text-navy-700">
              Susun bank soal, jadwalkan sesi ujian, dan biarkan sistem menilai
              jawaban objektif secara instan — sementara Anda fokus meninjau esai.
            </p>
          </div>

          <div className="flex flex-col justify-end gap-3">
            <RoleCard
              href="/admin"
              eyebrow="Untuk Guru & Admin"
              title="Kelola Ujian"
              desc="Bank soal, jadwal, dan hasil peserta."
              accent="navy"
            />
            <RoleCard
              href="/ujian/masuk"
              eyebrow="Untuk Peserta"
              title="Ikuti Ujian"
              desc="Masukkan token ujian dari pengawas."
              accent="clay"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-sm border border-navy-100 bg-navy-100 md:grid-cols-3">
          <Feature
            no="01"
            title="Bank soal terstruktur"
            desc="Kategorikan soal per topik, atur poin, dan gunakan ulang di berbagai sesi ujian."
          />
          <Feature
            no="02"
            title="Penilaian instan"
            desc="Soal pilihan ganda dinilai otomatis begitu peserta menekan submit."
          />
          <Feature
            no="03"
            title="Auto-save jawaban"
            desc="Setiap jawaban tersimpan otomatis — koneksi putus tidak berarti kehilangan progres."
          />
        </div>
      </div>
    </main>
  );
}

function RoleCard({
  href,
  eyebrow,
  title,
  desc,
  accent,
}: {
  href: string;
  eyebrow: string;
  title: string;
  desc: string;
  accent: "navy" | "clay";
}) {
  const accentClass = accent === "navy" ? "bg-navy-900" : "bg-clay-500";
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-sm bg-white p-6 shadow-[0_1px_0_rgba(13,23,48,0.06)] ring-1 ring-navy-100 transition hover:ring-navy-300"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${accentClass}`} />
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-navy-300">
        {eyebrow}
      </p>
      <p className="mt-2 font-display text-2xl text-navy-900">{title}</p>
      <p className="mt-1 text-sm text-navy-500">{desc}</p>
      <span className="mt-4 inline-block font-mono text-xs text-navy-700 transition group-hover:translate-x-1">
        Masuk →
      </span>
    </Link>
  );
}

function Feature({ no, title, desc }: { no: string; title: string; desc: string }) {
  return (
    <div className="bg-paper p-6">
      <p className="font-mono text-xs text-clay-500">{no}</p>
      <p className="mt-3 font-display text-lg text-navy-900">{title}</p>
      <p className="mt-2 text-sm text-navy-500">{desc}</p>
    </div>
  );
}
