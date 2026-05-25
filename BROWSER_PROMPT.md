# Prompt untuk Claude Browser

Salin seluruh teks di bawah ini dan paste ke Claude yang memiliki kemampuan browser/computer use.

---

## PROMPT

Kamu adalah asisten yang akan membantu saya men-deploy aplikasi web **Pendaftaran S2 Ilmu Kelautan Universitas Khairun** ke internet secara penuh menggunakan **Supabase** (database) dan **Vercel** (hosting). Ikuti semua langkah berikut secara berurutan menggunakan browser. Jangan skip langkah apapun.

---

### KONTEKS APLIKASI

- Repository GitHub: `https://github.com/jhnrangga-spec/pendaftarans2`
- Branch utama: `claude/kind-ritchie-UJgNE`
- Stack: Next.js 16, TypeScript, Tailwind CSS, Supabase, Zod
- API route yang akan menyimpan data: `POST /api/pendaftaran`
- Environment variables yang dibutuhkan:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

---

## BAGIAN 1 — SETUP SUPABASE

### LANGKAH 1: Buka Supabase dan Login

1. Buka browser, navigasi ke `https://supabase.com`
2. Klik tombol **"Start your project"** atau **"Sign In"**
3. Pilih **"Continue with GitHub"** dan selesaikan proses login
4. Setelah masuk, kamu akan berada di Supabase Dashboard

### LANGKAH 2: Buat Project Baru

1. Klik tombol **"New project"**
2. Pilih organization yang tersedia
3. Isi form berikut:
   - **Name**: `pendaftaran-s2-unkhair`
   - **Database Password**: buat password acak yang kuat (minimal 12 karakter, kombinasi huruf besar, kecil, angka, simbol) — **catat password ini**
   - **Region**: pilih **Southeast Asia (Singapore)**
4. Klik **"Create new project"**
5. Tunggu hingga status berubah dari "Setting up project" menjadi siap (biasanya 1–3 menit). Pantau indikator loading di halaman dashboard.

### LANGKAH 3: Buat Tabel Database via SQL Editor

1. Setelah project siap, di sidebar kiri klik **"SQL Editor"**
2. Klik **"New query"** (tombol + atau new query)
3. Hapus teks yang sudah ada di editor, lalu ketik atau paste SQL berikut:

```sql
create table public.pendaftaran_s2 (
  id                  bigserial primary key,
  nomor_pendaftaran   text unique not null,
  nama_lengkap        text not null,
  tempat_lahir        text,
  tanggal_lahir       date,
  jenis_kelamin       text,
  agama               text,
  kewarganegaraan     text,
  nik                 text,
  nomor_hp            text,
  email               text not null,
  alamat              text,
  provinsi            text,
  kota                text,
  kode_pos            text,
  nama_instansi_s1    text,
  program_studi_s1    text,
  tahun_masuk_s1      text,
  tahun_lulus_s1      text,
  ipk_s1              numeric(3,2),
  akreditasi_s1       text,
  pekerjaan           text,
  instansi_kerja      text,
  jabatan             text,
  pengalaman_kerja    text,
  jalur_masuk         text,
  motivasi            text,
  rencana_penelitian  text,
  referensi           text,
  status              text default 'pending',
  created_at          timestamptz default now()
);

alter table public.pendaftaran_s2 enable row level security;

create policy "Allow insert anon"
  on public.pendaftaran_s2
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow select authenticated"
  on public.pendaftaran_s2
  for select
  to authenticated
  using (true);
```

4. Klik tombol **"Run"** (atau tekan F5)
5. Pastikan muncul pesan sukses seperti "Success. No rows returned" — ini berarti tabel berhasil dibuat
6. Untuk memverifikasi, klik **"Table Editor"** di sidebar kiri dan pastikan tabel `pendaftaran_s2` muncul dalam daftar

### LANGKAH 4: Ambil API Keys

1. Di sidebar kiri, klik ikon **"Settings"** (gear/roda gigi) di bagian bawah
2. Di menu Settings, klik **"API"**
3. Kamu akan melihat halaman API Settings. Cari dan catat ketiga nilai berikut:
   - **Project URL** → ini adalah nilai `NEXT_PUBLIC_SUPABASE_URL` (format: `https://xxxxxxxxxx.supabase.co`)
   - **Project API Keys → anon public** → ini adalah `NEXT_PUBLIC_SUPABASE_ANON_KEY` (klik "Copy" di sebelah kanannya)
   - **Project API Keys → service_role** → ini adalah `SUPABASE_SERVICE_ROLE_KEY` (klik "Reveal" lalu "Copy")
4. Simpan ketiga nilai ini — kamu akan membutuhkannya di Langkah 8

---

## BAGIAN 2 — DEPLOY KE VERCEL

### LANGKAH 5: Buka Vercel dan Login

1. Buka tab baru di browser, navigasi ke `https://vercel.com`
2. Klik **"Sign Up"** atau **"Log In"**
3. Pilih **"Continue with GitHub"** dan selesaikan proses login/authorize
4. Setelah masuk, kamu berada di Vercel Dashboard

### LANGKAH 6: Import Repository dari GitHub

1. Di Vercel Dashboard, klik tombol **"Add New..."** lalu pilih **"Project"**
2. Kamu akan melihat daftar repository GitHub. Cari repository **`pendaftarans2`** (milik user `jhnrangga-spec`)
   - Jika tidak muncul, klik **"Adjust GitHub App Permissions"** → pilih repository `pendaftarans2` → save
3. Setelah muncul, klik tombol **"Import"** di sebelah kanan repository tersebut

### LANGKAH 7: Konfigurasi Project di Vercel

Di halaman "Configure Project", periksa pengaturan berikut:
1. **Framework Preset**: pastikan terdeteksi sebagai **Next.js** secara otomatis
2. **Root Directory**: biarkan `.` (default)
3. **Build Command**: `npm run build` (auto-filled)
4. **Output Directory**: `.next` (auto-filled)
5. **Node.js Version**: pilih **20.x** jika ada pilihan

### LANGKAH 8: Tambahkan Environment Variables

Ini adalah langkah terpenting. Masih di halaman Configure Project, scroll ke bawah ke bagian **"Environment Variables"**.

Tambahkan tiga variabel berikut satu per satu. Untuk setiap variabel:
- Klik area input **"Key"**, ketik nama variabelnya
- Klik area input **"Value"**, paste nilainya (yang sudah kamu catat di Langkah 4)
- Pastikan checkbox **Production**, **Preview**, dan **Development** semuanya dicentang
- Klik **"Add"**

Variabel yang harus ditambahkan:

**Variabel 1:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: (paste Project URL dari Supabase, contoh: `https://abcdefghijkl.supabase.co`)

**Variabel 2:**
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: (paste anon/public key dari Supabase, dimulai dengan `eyJ...`)

**Variabel 3:**
- Key: `SUPABASE_SERVICE_ROLE_KEY`
- Value: (paste service_role key dari Supabase, dimulai dengan `eyJ...`)

Setelah ketiga variabel ditambahkan, verifikasi semua tiga muncul dalam daftar di bawah form.

### LANGKAH 9: Deploy

1. Klik tombol **"Deploy"** (biasanya besar dan berwarna hitam/biru)
2. Vercel akan memulai proses build. Kamu akan melihat log build secara real-time
3. Tunggu hingga semua tahap selesai:
   - ✓ Cloning repository
   - ✓ Installing dependencies
   - ✓ Building (Next.js build)
   - ✓ Deploying
4. Jika build berhasil, akan muncul halaman sukses dengan konfeti 🎉 dan URL aplikasi
5. Catat URL aplikasi yang diberikan Vercel (format: `https://pendaftarans2-xxxx.vercel.app`)

---

## BAGIAN 3 — VERIFIKASI

### LANGKAH 10: Test Aplikasi Live

1. Klik URL yang diberikan Vercel untuk membuka aplikasi
2. Pastikan halaman landing muncul dengan benar (tema laut, animasi gelembung)
3. Klik tombol **"Mulai Pendaftaran"**
4. Isi form pendaftaran dengan data uji:
   - Step 1 (Data Pribadi): isi semua field yang bertanda *
   - Step 2 (Pendidikan): isi semua field yang bertanda *
   - Step 3 (Berkas): pilih jalur masuk, isi motivasi (minimal 100 karakter), rencana penelitian (minimal 50 karakter), centang kedua checkbox pernyataan
   - Step 4 (Konfirmasi): periksa data dan klik **"Kirim Pendaftaran"**
5. Pastikan muncul halaman sukses dengan nomor pendaftaran (format: `UNKHAIR-IK-2025-XXXXX`)

### LANGKAH 11: Verifikasi Data Tersimpan di Supabase

1. Kembali ke tab Supabase
2. Di sidebar klik **"Table Editor"**
3. Klik tabel **`pendaftaran_s2`**
4. Pastikan data yang baru saja didaftarkan muncul sebagai baris baru dalam tabel
5. Jika data muncul → deployment berhasil sepenuhnya ✓

---

## PENANGANAN ERROR

Jika terjadi error saat build di Vercel:
- Cek log build, cari baris merah yang dimulai dengan `Error:`
- Penyebab paling umum: environment variables tidak ter-set dengan benar → kembali ke Project Settings → Environment Variables → tambahkan ulang yang kurang

Jika form berhasil submit tapi data tidak muncul di Supabase:
- Cek Supabase → **Logs** → **API** untuk melihat request yang masuk
- Pastikan `SUPABASE_SERVICE_ROLE_KEY` sudah di-set dengan benar (bukan anon key)

Jika muncul error "supabaseUrl is required":
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` sudah ditambahkan ke environment variables Vercel
- Pergi ke Vercel Project → Settings → Environment Variables → verifikasi

---

## HASIL AKHIR YANG DIHARAPKAN

Setelah semua langkah selesai:
- ✅ Aplikasi pendaftaran S2 online dan dapat diakses di URL Vercel
- ✅ Setiap pendaftaran yang masuk tersimpan otomatis di database Supabase
- ✅ Data dapat dilihat di Supabase Table Editor (untuk keperluan admin)
- ✅ Auto-deploy aktif: setiap push ke GitHub akan otomatis update aplikasi

Laporkan URL aplikasi final yang berhasil di-deploy.
