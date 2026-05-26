-- Add file columns to pendaftaran_s2 table
ALTER TABLE pendaftaran_s2
  ADD COLUMN IF NOT EXISTS file_ijazah text,
  ADD COLUMN IF NOT EXISTS file_transkrip text,
  ADD COLUMN IF NOT EXISTS file_ktp text,
  ADD COLUMN IF NOT EXISTS file_foto text,
  ADD COLUMN IF NOT EXISTS file_cv text,
  ADD COLUMN IF NOT EXISTS file_rekomendasi text;

-- Create storage bucket for berkas pendaftar
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'berkas-pendaftar',
  'berkas-pendaftar',
  false,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Allow uploads via service role (no RLS needed for service role)
-- Allow read via service role (for signed URLs)
