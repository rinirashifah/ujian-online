# Ujian Online — Next.js

Aplikasi ujian online (MVP) dibangun dengan Next.js 14 (App Router), TypeScript, dan Tailwind CSS. Mengikuti alur inti dari PRD: bank soal, penjadwalan ujian via token, pengerjaan ujian dengan timer & auto-save, penilaian otomatis untuk soal pilihan ganda, serta rekap hasil untuk admin/guru.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Alur yang sudah tersedia

- **`/`** — Landing page, pilih peran (Guru/Admin atau Peserta).
- **`/admin`** — Ringkasan dashboard.
- **`/admin/soal`** — Kelola bank soal (tambah, ubah, hapus). Mendukung tipe **pilihan ganda** (dinilai otomatis) dan **esai** (dinilai manual, belum ada UI penilaian manual di MVP ini).
- **`/admin/ujian`** — Susun sesi ujian dari bank soal, dapatkan **token akses**, dan lihat daftar sesi.
- **`/admin/ujian/[id]/hasil`** — Rekap hasil per sesi ujian (skor rata-rata, status peserta).
- **`/ujian/masuk`** — Peserta memasukkan token ujian.
- **`/ujian/[token]`** — Peserta mengisi nama, lalu mengerjakan ujian: timer mundur, navigasi antar soal, auto-save tiap jawaban, submit otomatis saat waktu habis.
- **`/ujian/selesai`** — Halaman konfirmasi & skor (jika diizinkan admin).

Ada data contoh (seed) di `data/db.json` dengan **token demo: `DEMO26`** — langsung bisa dicoba di `/ujian/masuk`.

## Catatan teknis & batasan MVP ini

- **Penyimpanan data**: memakai file `data/db.json` yang dibaca/ditulis oleh API routes (`lib/db.ts`). Ini cocok untuk *development* lokal, tapi **tidak cocok untuk deploy ke platform serverless** (mis. Vercel) karena filesystem di sana bersifat read-only/ephemeral. Untuk produksi, ganti `lib/db.ts` dengan koneksi ke database sungguhan (PostgreSQL/Supabase/PlanetScale, dsb) — struktur data di `lib/types.ts` bisa dipetakan langsung ke skema tabel.
- **Autentikasi**: belum ada login sungguhan untuk admin/guru (siapa pun bisa mengakses `/admin`). Untuk produksi, tambahkan NextAuth.js atau sejenisnya dengan role-based access control sesuai FR-1–FR-3 di PRD.
- **Anti-kecurangan**: belum diimplementasikan (deteksi tab-switch, fullscreen lock, webcam) — ini fitur Fase 2 di roadmap PRD.
- **Penilaian esai**: tersimpan otomatis tapi belum ada halaman penilaian manual oleh guru dengan rubrik.
- **Soal diacak**: opsi "acak soal" hanya mengacak urutan soal, bukan urutan opsi jawaban.

## Struktur folder penting

```
app/
  admin/            # Halaman untuk guru/admin
  ujian/masuk/       # Peserta memasukkan token
  ujian/[token]/     # Peserta mengerjakan ujian
  ujian/selesai/     # Halaman hasil peserta
  api/               # Route handler (soal, ujian, attempt)
lib/
  types.ts           # Tipe data inti (Soal, Ujian, Attempt)
  db.ts              # Modul baca/tulis data JSON
data/db.json          # "Database" file JSON + data contoh
```

## Langkah lanjutan yang disarankan

1. Ganti `lib/db.ts` dengan database sungguhan sebelum deploy ke produksi.
2. Tambahkan autentikasi & RBAC untuk admin/guru.
3. Tambahkan halaman penilaian manual untuk soal esai.
4. Tambahkan fitur anti-kecurangan (fullscreen lock, deteksi tab-switch, log audit) sesuai FR-14–FR-17 di PRD.
