Kamu adalah asisten dengan kemampuan menggunakan browser. Tugasmu adalah menyelesaikan seluruh proses berikut secara mandiri menggunakan browser: membuat akun Supabase, membuat database, membuat akun Vercel, dan men-deploy aplikasi pendaftaran S2 Ilmu Kelautan Universitas Khairun hingga bisa diakses online.

Ikuti setiap langkah secara berurutan. Jangan lewati satu pun. Jika ada dialog konfirmasi, popup, atau captcha yang muncul, tangani terlebih dahulu sebelum melanjutkan. Setelah selesai semua langkah, laporkan URL aplikasi yang sudah online beserta nomor pendaftaran hasil uji coba.

---

## INFORMASI APLIKASI

- Kode aplikasi ada di GitHub: https://github.com/jhnrangga-spec/pendaftarans2
- Branch yang digunakan: claude/kind-ritchie-UJgNE
- Teknologi: Next.js 16, TypeScript, Tailwind CSS, Supabase
- Aplikasi menyimpan data pendaftaran mahasiswa S2 ke database Supabase melalui API route POST /api/pendaftaran
- Aplikasi membutuhkan tiga environment variable:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY

---

## BAGIAN 1 — BUAT AKUN DAN SETUP SUPABASE

### LANGKAH 1 — Buka Supabase dan Daftar Akun Baru

1. Buka browser dan navigasi ke alamat https://supabase.com
2. Tunggu halaman sepenuhnya dimuat
3. Cari tombol "Start your project" atau "Sign Up" lalu klik
4. Di halaman pendaftaran, pilih opsi "Continue with GitHub"
5. Jika belum login ke GitHub, kamu akan diarahkan ke halaman login GitHub — masukkan kredensial GitHub yang tersedia
6. Setelah login GitHub berhasil, Supabase akan meminta izin akses — klik "Authorize supabase"
7. Tunggu proses redirect selesai hingga kamu berada di halaman Supabase Dashboard
8. Jika ada wizard selamat datang atau onboarding popup, tutup atau klik "Skip" / "Later"

### LANGKAH 2 — Buat Project Supabase Baru

1. Di halaman Supabase Dashboard, cari dan klik tombol "New project"
2. Jika diminta memilih organization, pilih organization yang tersedia (biasanya nama akun GitHub kamu)
3. Isi form pembuatan project:
   - Kolom "Name": ketik  pendaftaran-s2-unkhair
   - Kolom "Database Password": ketik password ini persis  Unkhair@2025!Secure  — catat password ini
   - Kolom "Region": klik dropdown dan pilih "Southeast Asia (Singapore)"
   - Kolom "Pricing Plan": pilih "Free" jika ada pilihan
4. Klik tombol "Create new project"
5. Kamu akan melihat halaman loading dengan tulisan "Setting up your project" atau loading spinner
6. Tunggu dengan sabar hingga setup selesai — ini bisa memakan waktu 2 hingga 5 menit
7. Jangan refresh halaman selama menunggu
8. Project siap ketika kamu melihat dashboard project dengan sidebar lengkap di sebelah kiri (ada menu Table Editor, SQL Editor, Authentication, dll)

### LANGKAH 3 — Buat Tabel Database

1. Di sidebar kiri halaman project Supabase, cari menu "SQL Editor" dan klik
2. Di halaman SQL Editor, cari tombol "New query" atau ikon tambah (+) di bagian atas — klik
3. Sebuah editor teks kosong akan muncul di tengah halaman
4. Klik di dalam area editor agar kursor aktif
5. Pilih semua teks yang ada di editor (Ctrl+A) lalu hapus
6. Ketik atau paste seluruh SQL berikut ini ke dalam editor:

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

7. Setelah semua SQL ter-paste, klik tombol "Run" (biasanya tombol hijau atau biru di pojok kanan atas editor, atau tekan F5)
8. Tunggu eksekusi selesai
9. Pastikan di bagian bawah muncul pesan sukses seperti "Success. No rows returned" atau "Query ran successfully"
10. Jika muncul pesan error, baca pesannya — kemungkinan ada karakter yang tidak ter-copy dengan benar. Hapus semua dan paste ulang SQL di atas.
11. Setelah berhasil, klik "Table Editor" di sidebar kiri untuk memverifikasi — tabel "pendaftaran_s2" harus muncul dalam daftar tabel

### LANGKAH 4 — Ambil API Keys dari Supabase

1. Di sidebar kiri, scroll ke paling bawah dan cari ikon gerigi/roda gigi (Settings) — klik
2. Di halaman Settings, cari dan klik submenu "API" di bagian kiri
3. Halaman API Settings akan terbuka — di sini ada semua informasi koneksi
4. Temukan bagian "Project URL" — salin nilai URL tersebut (format: https://xxxxxxxxxxxxxxxxxx.supabase.co) — ini adalah nilai untuk NEXT_PUBLIC_SUPABASE_URL
5. Temukan bagian "Project API Keys"
6. Di baris "anon" atau "anon public", klik tombol "Copy" — ini adalah nilai untuk NEXT_PUBLIC_SUPABASE_ANON_KEY
7. Di baris "service_role", klik tombol "Reveal" terlebih dahulu untuk menampilkan nilainya, lalu klik "Copy" — ini adalah nilai untuk SUPABASE_SERVICE_ROLE_KEY
8. Simpan ketiga nilai ini di notepad atau clipboard manager karena akan dipakai di langkah selanjutnya — jangan tutup tab Supabase ini

---

## BAGIAN 2 — BUAT AKUN DAN DEPLOY KE VERCEL

### LANGKAH 5 — Buka Vercel dan Daftar Akun Baru

1. Buka tab browser baru dan navigasi ke https://vercel.com
2. Tunggu halaman sepenuhnya dimuat
3. Klik tombol "Sign Up" di pojok kanan atas halaman
4. Di halaman Sign Up, pilih opsi "Continue with GitHub"
5. GitHub akan meminta konfirmasi untuk authorize Vercel — klik "Authorize Vercel"
6. Jika muncul pertanyaan "How are you planning to use Vercel?", pilih "Personal" lalu klik Continue
7. Jika ada langkah pengisian nama atau username, isi dengan nama yang sesuai lalu lanjutkan
8. Tunggu hingga kamu berada di halaman Vercel Dashboard (tampak seperti halaman kosong dengan tombol "Import Project" atau "New Project")

### LANGKAH 6 — Import Repository GitHub ke Vercel

1. Di Vercel Dashboard, cari dan klik tombol "Add New..." lalu pilih "Project", atau klik "Import Project"
2. Kamu akan melihat halaman "Import Git Repository"
3. Vercel akan menampilkan daftar repository GitHub yang bisa diakses
4. Cari repository bernama "pendaftarans2" di daftar tersebut
5. Jika repository tidak muncul dalam daftar, klik link "Adjust GitHub App Permissions" atau "Configure GitHub App":
   - Di halaman GitHub yang terbuka, scroll ke bagian "Repository access"
   - Pilih "Only select repositories"
   - Klik dropdown "Select repositories" dan cari "pendaftarans2"
   - Pilih repository tersebut lalu klik "Save"
   - Kembali ke halaman Vercel dan refresh
6. Setelah repository "pendaftarans2" muncul, klik tombol "Import" di sebelah kanannya

### LANGKAH 7 — Konfigurasi Project

1. Kamu akan berada di halaman "Configure Project"
2. Periksa bagian "Framework Preset" — pastikan sudah terdeteksi sebagai "Next.js" secara otomatis. Jika belum, klik dropdown dan pilih "Next.js"
3. Periksa bagian "Root Directory" — biarkan kosong atau titik (.) yang artinya root repository
4. Jangan ubah Build Command dan Output Directory — biarkan default
5. Di bagian "Build & Development Settings", pastikan tidak ada yang perlu diubah

### LANGKAH 8 — Tambahkan Environment Variables

Ini adalah langkah paling penting. Masih di halaman Configure Project, scroll ke bawah hingga menemukan bagian "Environment Variables".

Kamu perlu menambahkan tiga variabel. Untuk setiap variabel, ikuti langkah ini:
- Klik pada kolom input "Key" dan ketik nama variabelnya
- Klik pada kolom input "Value" dan paste nilainya (yang sudah kamu catat di Langkah 4)
- Pastikan environment yang dipilih mencakup "Production" (dan "Preview" serta "Development" jika tersedia)
- Klik tombol "Add" untuk menyimpan variabel tersebut
- Pastikan variabel muncul di daftar sebelum menambahkan variabel berikutnya

Tambahkan ketiga variabel berikut:

Variabel pertama:
- Key: NEXT_PUBLIC_SUPABASE_URL
- Value: (paste URL dari Supabase yang kamu salin di Langkah 4, contoh: https://abcdefgh.supabase.co)

Variabel kedua:
- Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
- Value: (paste anon key yang kamu salin di Langkah 4, nilai panjang yang dimulai dengan eyJ)

Variabel ketiga:
- Key: SUPABASE_SERVICE_ROLE_KEY
- Value: (paste service role key yang kamu salin di Langkah 4, nilai panjang yang dimulai dengan eyJ)

Setelah selesai, verifikasi bahwa ketiga variabel muncul dalam daftar di halaman tersebut sebelum melanjutkan.

### LANGKAH 9 — Jalankan Deploy

1. Setelah semua environment variable ditambahkan, scroll ke bawah atau cari tombol "Deploy"
2. Klik tombol "Deploy"
3. Vercel akan mulai proses build — kamu akan melihat halaman dengan log build berjalan
4. Pantau log build dan tunggu hingga selesai. Tahapan yang akan terlihat:
   - Cloning repository
   - Installing dependencies (npm install)
   - Building application (npm run build)
   - Uploading build output
   - Deployment complete
5. Proses ini biasanya memakan waktu 2 hingga 4 menit
6. Jika build berhasil, halaman akan berubah menampilkan animasi konfeti dan pesan selamat
7. Catat URL aplikasi yang diberikan Vercel — biasanya format https://pendaftarans2-xxxx.vercel.app

---

## BAGIAN 3 — PENGUJIAN AKHIR

### LANGKAH 10 — Test Aplikasi

1. Klik URL aplikasi yang diberikan Vercel untuk membuka halaman di tab baru
2. Halaman utama (landing page) harus tampil dengan latar biru laut gelap, animasi gelembung, dan teks "Program Magister Ilmu Kelautan"
3. Klik tombol "Mulai Pendaftaran"
4. Isi form step pertama (Data Pribadi) dengan data uji berikut:
   - Nama Lengkap: Ahmad Bahar Kusuma
   - Tempat Lahir: Ternate
   - Tanggal Lahir: 1995-06-15
   - Jenis Kelamin: Laki-laki
   - Agama: Islam
   - Kewarganegaraan: WNI
   - NIK: 8271234567890123
   - Nomor HP: 081234567890
   - Email: ahmad.bahar@test.com
   - Alamat: Jl. Sultan Baabulah No. 12, RT 01 RW 02, Kelurahan Gamalama
   - Provinsi: Maluku Utara
   - Kota: Ternate
   - Kode Pos: 97719
5. Klik "Selanjutnya"
6. Isi form step kedua (Riwayat Pendidikan) dengan data uji berikut:
   - Nama Perguruan Tinggi: Universitas Khairun
   - Program Studi: Ilmu Kelautan
   - Tahun Masuk: 2013
   - Tahun Lulus: 2017
   - IPK: 3.45
   - Akreditasi: B (Baik Sekali)
   - Status Pekerjaan: Dosen / Peneliti
   - Pengalaman Kerja: 3 – 5 tahun
7. Klik "Selanjutnya"
8. Isi form step ketiga (Berkas dan Pernyataan):
   - Jalur Masuk: klik pilihan "Reguler"
   - Motivasi: ketik teks ini  Saya bermotivasi kuat untuk mengikuti program S2 Ilmu Kelautan karena ingin memperdalam pengetahuan tentang ekosistem laut Maluku Utara yang kaya biodiversitas. Dengan latar belakang S1 ilmu kelautan dan pengalaman kerja sebagai peneliti, saya ingin berkontribusi pada pelestarian sumber daya laut Indonesia melalui penelitian yang berkualitas.
   - Rencana Penelitian: ketik  Kajian kepadatan dan distribusi terumbu karang di perairan Ternate sebagai baseline data konservasi ekosistem laut Maluku Utara
   - Centang checkbox pernyataan pertama
   - Centang checkbox pernyataan kedua
9. Klik "Review dan Kirim"
10. Di halaman step keempat (Konfirmasi), periksa data yang ditampilkan sudah benar
11. Klik tombol "Kirim Pendaftaran"
12. Tunggu proses pengiriman
13. Pastikan muncul halaman sukses dengan nomor pendaftaran format UNKHAIR-IK-2025-XXXXX

### LANGKAH 11 — Verifikasi Data di Supabase

1. Kembali ke tab Supabase
2. Di sidebar kiri, klik "Table Editor"
3. Klik nama tabel "pendaftaran_s2"
4. Pastikan ada satu baris data baru dengan nama "Ahmad Bahar Kusuma" dan nomor pendaftaran yang sama seperti yang muncul di aplikasi
5. Jika data muncul, seluruh proses berhasil

---

## JIKA TERJADI ERROR

Jika build Vercel gagal dengan error "Cannot find module":
Pergi ke Vercel → Project Settings → Git → pastikan branch yang digunakan adalah claude/kind-ritchie-UJgNE bukan main. Untuk mengganti branch: Project Settings → Git → Production Branch → ketik claude/kind-ritchie-UJgNE → Save → lalu trigger redeploy dari menu Deployments → klik titik tiga → Redeploy

Jika muncul error "supabaseUrl is required" saat membuka aplikasi:
Environment variable NEXT_PUBLIC_SUPABASE_URL belum ter-set. Pergi ke Vercel → Project → Settings → Environment Variables → tambahkan ulang variabel tersebut → kemudian pergi ke Deployments → klik Redeploy pada deployment terbaru

Jika data tidak tersimpan di Supabase setelah submit form:
Pergi ke Supabase → Logs → pilih "Edge" atau "API" → cari request dengan status 500 → baca error messagenya. Kemungkinan besar SUPABASE_SERVICE_ROLE_KEY salah. Cek kembali di Supabase Settings → API dan copy ulang service_role key dengan benar.

Jika halaman aplikasi menampilkan error 404:
Pastikan di Vercel deployment sudah menggunakan branch yang benar. Pergi ke Project → Settings → Git → Production Branch dan pastikan isinya adalah claude/kind-ritchie-UJgNE

---

## LAPORAN AKHIR

Setelah semua langkah selesai, berikan laporan dalam format berikut:

URL Aplikasi: (isi dengan URL Vercel)
Status Aplikasi: (Online / Error)
Database Supabase: (Terhubung / Tidak)
Nomor Pendaftaran Uji Coba: (isi nomor yang muncul setelah uji coba)
Catatan: (jika ada kendala yang ditemui)
