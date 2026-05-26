# Prompt: Aktifkan Fitur Upload & Download Berkas Pendaftar

Paste prompt ini ke Claude browser/computer use secara lengkap.

---

## PROMPT

Bantu saya menyelesaikan setup fitur upload dan download berkas untuk aplikasi pendaftaran S2 Universitas Khairun. Ikuti setiap langkah dengan teliti dan berurutan.

---

### LANGKAH 1 — Merge branch ke main di GitHub

1. Buka **github.com/jhnrangga-spec/pendaftarans2**
2. Klik tab **"Pull requests"**
3. Cari PR dari branch `claude/kind-ritchie-UJgNE` ke `main`
   - Jika sudah ada → buka PR → klik **"Merge pull request"** → **"Confirm merge"**
   - Jika belum ada → klik **"New pull request"** → base: `main`, compare: `claude/kind-ritchie-UJgNE` → **"Create pull request"** → isi judul "feat: upload berkas & download admin" → **"Create pull request"** → **"Merge pull request"** → **"Confirm merge"**
4. Tunggu sampai muncul tanda **"Merged"** (ungu) ✅

---

### LANGKAH 2 — Jalankan SQL Migration di Supabase

1. Buka **supabase.com** → login → masuk ke project yang digunakan
2. Di sidebar kiri klik **"SQL Editor"**
3. Klik **"New query"**
4. Paste SQL berikut ke editor, lalu klik **"Run"**:

```sql
-- Tambah kolom file ke tabel pendaftaran_s2
ALTER TABLE pendaftaran_s2
  ADD COLUMN IF NOT EXISTS file_ijazah text,
  ADD COLUMN IF NOT EXISTS file_transkrip text,
  ADD COLUMN IF NOT EXISTS file_ktp text,
  ADD COLUMN IF NOT EXISTS file_foto text,
  ADD COLUMN IF NOT EXISTS file_cv text,
  ADD COLUMN IF NOT EXISTS file_rekomendasi text;

-- Buat storage bucket untuk berkas pendaftar
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'berkas-pendaftar',
  'berkas-pendaftar',
  false,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','application/pdf']
) ON CONFLICT (id) DO NOTHING;
```

5. Pastikan muncul pesan **"Success. No rows returned"** atau **"1 row affected"** → berarti berhasil ✅
6. Verifikasi kolom baru: klik **"Table Editor"** di sidebar → pilih tabel `pendaftaran_s2` → pastikan kolom `file_ijazah`, `file_transkrip`, `file_ktp`, `file_foto`, `file_cv`, `file_rekomendasi` sudah ada

---

### LANGKAH 3 — Aktifkan Storage Policy di Supabase

1. Masih di Supabase, klik **"Storage"** di sidebar kiri
2. Pastikan bucket **"berkas-pendaftar"** sudah muncul di daftar
3. Klik bucket **"berkas-pendaftar"** → klik tab **"Policies"**
4. Klik **"New policy"** → pilih **"For full customization"**
5. Buat policy untuk **INSERT** (upload):
   - Policy name: `Allow service role uploads`
   - Allowed operation: `INSERT`
   - Target roles: `service_role`
   - Policy definition: `true`
   - Klik **"Review"** → **"Save policy"**
6. Buat policy untuk **SELECT** (download/signed URL):
   - Policy name: `Allow service role reads`
   - Allowed operation: `SELECT`
   - Target roles: `service_role`
   - Policy definition: `true`
   - Klik **"Review"** → **"Save policy"**

---

### LANGKAH 4 — Verifikasi & Redeploy di Vercel

1. Buka **vercel.com** → login → masuk ke project **pendaftarans2**
2. Klik tab **"Deployments"**
3. Lihat deployment terbaru:
   - Jika sudah **"Ready"** → lanjut ke langkah 5
   - Jika masih **"Building"** → tunggu 1–2 menit
   - Jika tidak ada deployment baru → klik **"..."** pada deployment terakhir → **"Redeploy"** → konfirmasi
4. Pastikan semua 6 environment variables sudah ada (**Settings → Environment Variables**):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = `unkhair2025`
   - `ADMIN_JWT_SECRET` = string acak panjang

---

### LANGKAH 5 — Test Upload Berkas (sebagai Pendaftar)

1. Buka URL aplikasi (cek di Vercel → domain)
2. Klik **"Daftar Sekarang"** di halaman utama
3. Isi Step 1 (Data Pribadi) → klik **"Lanjut"**
4. Isi Step 2 (Pendidikan) → klik **"Lanjut"**
5. Di Step 3 (Berkas & Pernyataan):
   - Klik salah satu kotak upload, misalnya **"Ijazah S1 (Legalisir)"**
   - Pilih file PDF atau gambar (ukuran < 5MB)
   - Tunggu proses upload — harus muncul tanda **centang hijau** dan nama file
   - Coba upload beberapa berkas lainnya
   - Isi Motivasi (min. 100 karakter) dan Rencana Penelitian (min. 50 karakter)
   - Centang dua pernyataan → klik **"Review & Kirim"**
6. Di Step 4 → klik **"Kirim Pendaftaran"**
7. Harus muncul halaman sukses dengan nomor pendaftaran ✅

---

### LANGKAH 6 — Test Download Berkas (sebagai Admin)

1. Di navbar halaman utama klik **"Login Admin"**
2. Login dengan username `admin` dan password `unkhair2025`
3. Di Dashboard, cari pendaftar yang baru mendaftar → klik **"Detail"**
4. Scroll ke bawah hingga bagian **"Berkas Pendaftar"**
5. Pastikan daftar berkas yang diunggah muncul dengan tombol **"Download"** di setiap berkas
6. Klik tombol **"Download"** pada salah satu berkas
7. File harus terbuka/terunduh di tab baru ✅

---

### LANGKAH 7 — Jika Upload Berkas Gagal (Error)

Jika saat upload muncul error "Server tidak dikonfigurasi":
- Pastikan `SUPABASE_SERVICE_ROLE_KEY` sudah diset di Vercel

Jika muncul error "Bucket not found":
- Ulangi **Langkah 2** — jalankan ulang SQL di Supabase

Jika muncul error "row-level security":
- Ulangi **Langkah 3** — pastikan policy storage sudah dibuat

Jika berkas ter-upload tapi tidak bisa di-download (signed URL error):
- Pastikan policy **SELECT** untuk `service_role` sudah dibuat (Langkah 3 poin 6)
- Di Supabase → Storage → berkas-pendaftar → Policies → cek ada 2 policy (INSERT + SELECT)

---

**Catatan penting:**
- Bucket `berkas-pendaftar` bersifat **private** — file hanya bisa diakses admin melalui signed URL (berlaku 5 menit)
- Ukuran file maksimal **5 MB** per berkas
- Format yang didukung: **PDF, JPG, PNG**
- SQL migration dan kode sudah ada di branch — tinggal dijalankan setup-nya
