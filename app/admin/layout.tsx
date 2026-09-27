import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-semibold text-navy-900">
            Ujian<span className="text-clay-500">.</span>Online
          </Link>
          <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-navy-500">
            <Link href="/admin" className="hover:text-navy-900">Ringkasan</Link>
            <Link href="/admin/soal" className="hover:text-navy-900">Bank Soal</Link>
            <Link href="/admin/ujian" className="hover:text-navy-900">Sesi Ujian</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
