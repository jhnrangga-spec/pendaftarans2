# Prompt: Fix & Deploy Admin Login — Pendaftaran S2 Ilmu Kelautan

Paste prompt ini ke Claude browser/computer use secara lengkap.

---

## PROMPT

Bantu saya melakukan serangkaian langkah berikut di browser untuk memperbaiki dan men-deploy aplikasi pendaftaran S2 Universitas Khairun. Ikuti setiap langkah dengan teliti.

---

### LANGKAH 1 — Merge branch ke main di GitHub

1. Buka **github.com** dan login jika belum.
2. Masuk ke repository: **jhnrangga-spec/pendaftarans2**
3. Klik tab **"Pull requests"**.
4. Cek apakah sudah ada Pull Request dari branch `claude/kind-ritchie-UJgNE` ke `main`.
   - Jika sudah ada → buka PR tersebut → klik **"Merge pull request"** → klik **"Confirm merge"**.
   - Jika belum ada → klik **"New pull request"** → pilih base: `main`, compare: `claude/kind-ritchie-UJgNE` → klik **"Create pull request"** → beri judul "Fix: perbaikan admin login & navbar" → klik **"Create pull request"** → lalu **"Merge pull request"** → **"Confirm merge"**.
5. Tunggu hingga merge berhasil (muncul tanda "Merged" berwarna ungu).

---

### LANGKAH 2 — Pastikan Vercel auto-deploy berjalan

1. Buka **vercel.com** dan login.
2. Masuk ke project **pendaftarans2**.
3. Klik tab **"Deployments"**.
4. Lihat deployment paling atas — pastikan sedang berstatus **"Building"** atau sudah **"Ready"**.
   - Jika masih Building → tunggu hingga selesai (biasanya 1–2 menit).
   - Jika tidak ada deployment baru → klik tombol **"..."** pada deployment terakhir → pilih **"Redeploy"** → konfirmasi.
5. Tunggu status berubah menjadi **"Ready"** ✅.

---

### LANGKAH 3 — Verifikasi Environment Variables di Vercel

1. Masih di project Vercel, klik **"Settings"** → **"Environment Variables"**.
2. Pastikan 6 variabel berikut sudah ada (jika belum, tambahkan):

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project (format: https://xxx.supabase.co) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key dari Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key dari Supabase |
   | `ADMIN_USERNAME` | `admin` |
   | `ADMIN_PASSWORD` | `unkhair2025` |
   | `ADMIN_JWT_SECRET` | String acak panjang minimal 32 karakter, contoh: `unkhair-s2-kelautan-2025-secret-key-jwt` |

3. Jika ada variabel yang baru ditambahkan → setelah semua ditambahkan, kembali ke tab **"Deployments"** → klik **"..."** pada deployment terbaru → **"Redeploy"** → tunggu hingga **"Ready"**.

---

### LANGKAH 4 — Ambil URL Supabase dan Keys (jika belum punya)

Jika belum tahu nilai Supabase URL dan keys:

1. Buka **supabase.com** → login → masuk ke project yang digunakan.
2. Klik **"Project Settings"** (ikon gear) → **"API"**.
3. Salin:
   - **Project URL** → isi ke `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → isi ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → isi ke `SUPABASE_SERVICE_ROLE_KEY`
4. Kembali ke Vercel, update ketiga variabel tersebut, lalu Redeploy.

---

### LANGKAH 5 — Test Login Admin

1. Buka URL aplikasi yang sudah deploy (cek di Vercel → Deployments → klik URL domain).
2. Di navbar halaman utama, klik tombol **"Login Admin"**.
3. Masukkan:
   - **Username:** `admin`
   - **Password:** `unkhair2025`
4. Klik **"Masuk ke Panel Admin"**.
5. Harusnya berhasil masuk ke halaman **Dashboard Pendaftaran** yang menampilkan statistik dan tabel data pendaftar.

---

### LANGKAH 6 — Jika masih gagal login

Jika setelah semua langkah di atas login masih gagal:

1. Di Vercel → **Settings** → **Environment Variables** → hapus `ADMIN_JWT_SECRET` lama → tambahkan baru dengan nilai: `unkhair-s2-kelautan-secret-2025-jwt-key-xyz`
2. Redeploy ulang.
3. Coba login lagi dengan username `admin` dan password `unkhair2025`.
4. Jika masih gagal, screenshot halaman error-nya dan laporkan.

---

**Catatan penting:**
- Branch yang berisi perbaikan adalah `claude/kind-ritchie-UJgNE`
- Perbaikan utama: fungsi `proxy()` di `proxy.ts` sudah diubah ke `export default` sehingga Next.js 16 bisa mengenalinya sebagai middleware proteksi rute admin
- Jangan tutup tab Vercel sampai deployment berstatus "Ready"
