import { createClient } from "@supabase/supabase-js";
import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/app/lib/auth";
import AdminLayout from "@/app/components/admin/AdminLayout";
import StatusBadge from "@/app/components/admin/StatusBadge";
import StatusUpdater from "@/app/components/admin/StatusUpdater";
import ReloadButton from "@/app/components/admin/ReloadButton";
import BerkasDownloader from "@/app/components/admin/BerkasDownloader";
import DownloadAllButton from "@/app/components/admin/DownloadAllButton";
import Link from "next/link";
import {
  ArrowLeft, User, Phone, GraduationCap, Briefcase, FileText, Calendar, Hash, FolderOpen,
} from "lucide-react";

interface Pendaftar {
  id: number;
  nomor_pendaftaran: string;
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  kewarganegaraan: string;
  nik: string;
  nomor_hp: string;
  email: string;
  alamat: string;
  provinsi: string;
  kota: string;
  kode_pos: string;
  nama_instansi_s1: string;
  program_studi_s1: string;
  tahun_masuk_s1: string;
  tahun_lulus_s1: string;
  ipk_s1: number;
  akreditasi_s1: string;
  pekerjaan: string;
  instansi_kerja: string;
  jabatan: string;
  pengalaman_kerja: string;
  jalur_masuk: string;
  motivasi: string;
  rencana_penelitian: string;
  referensi: string;
  status: string;
  created_at: string;
  file_ijazah: string | null;
  file_transkrip: string | null;
  file_ktp: string | null;
  file_foto: string | null;
  file_cv: string | null;
  file_rekomendasi: string | null;
}

async function getPendaftar(id: string): Promise<{ data: Pendaftar | null; error: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { data: null, error: "env_missing" };
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from("pendaftaran_s2").select("*").eq("id", id).single();
    if (error) return { data: null, error: error.message };
    return { data: data as Pendaftar, error: null };
  } catch (e) {
    return { data: null, error: String(e) };
  }
}

const CARD_BG = "linear-gradient(135deg, #0c1d35 0%, #0a1a2e 100%)";
const BORDER = "rgba(30,58,95,0.6)";
const JALUR_LABEL: Record<string, string> = { reguler: "Reguler", beasiswa: "Beasiswa", kerjasama: "Kerjasama" };

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex gap-4 py-3" style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
      <span className="text-xs min-w-[160px] flex-shrink-0 pt-0.5" style={{ color: "#2d5a7a" }}>
        {label}
      </span>
      <span className="text-sm font-medium break-words" style={{ color: "#cbd5e1" }}>
        {value ?? <span style={{ color: "#1e3a5f", fontStyle: "italic" }}>—</span>}
      </span>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-6" style={{ background: CARD_BG, borderColor: BORDER }}>
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(14,165,233,0.12)" }}
        >
          {icon}
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0ea5e9" }}>
          {title}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default async function DetailPendaftarPage({ params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin");

  const { id } = await params;
  const { data: p, error: fetchError } = await getPendaftar(id);

  if (fetchError) {
    return (
      <AdminLayout>
        <div className="max-w-lg mx-auto mt-12">
          <div
            className="rounded-2xl border p-8 text-center"
            style={{ background: "linear-gradient(135deg,#0c1d35,#0a1a2e)", borderColor: "rgba(239,68,68,0.4)" }}
          >
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#e0f2fe" }}>Gagal Memuat Data</h2>
            <p className="text-sm mb-6" style={{ color: "#4a7fa5" }}>
              {fetchError === "env_missing"
                ? "Koneksi Supabase belum dikonfigurasi."
                : fetchError}
            </p>
            <ReloadButton />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!p) notFound();

  const tglLahir = p.tanggal_lahir
    ? new Date(p.tanggal_lahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const tglDaftar = new Date(p.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back + header */}
        <div className="flex items-start gap-4">
          <Link
            href="/admin/dashboard"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            style={{ background: "rgba(14,165,233,0.1)", color: "#38bdf8", border: "1px solid rgba(14,165,233,0.2)" }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl font-bold" style={{ color: "#e0f2fe" }}>
                {p.nama_lengkap}
              </h1>
              <StatusBadge status={p.status} />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#2d5a7a" }}>
                <Hash size={11} />
                {p.nomor_pendaftaran}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#2d5a7a" }}>
                <Calendar size={11} />
                {tglDaftar}
              </span>
            </div>
          </div>
        </div>

        {/* Status updater */}
        <div className="rounded-2xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2d5a7a" }}>
            Update Status Pendaftar
          </p>
          <StatusUpdater id={p.id} currentStatus={p.status} />
        </div>

        {/* Data grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Section title="Identitas Diri" icon={<User size={16} style={{ color: "#0ea5e9" }} />}>
            <Row label="Nama Lengkap" value={p.nama_lengkap} />
            <Row label="Tempat, Tgl Lahir" value={p.tempat_lahir && tglLahir ? `${p.tempat_lahir}, ${tglLahir}` : null} />
            <Row label="Jenis Kelamin" value={p.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"} />
            <Row label="Agama" value={p.agama} />
            <Row label="Kewarganegaraan" value={p.kewarganegaraan} />
            <Row label="NIK" value={p.nik} />
          </Section>

          <Section title="Kontak" icon={<Phone size={16} style={{ color: "#0ea5e9" }} />}>
            <Row label="Nomor HP" value={p.nomor_hp} />
            <Row label="Email" value={p.email} />
            <Row label="Alamat" value={p.alamat} />
            <Row label="Kota / Provinsi" value={p.kota && p.provinsi ? `${p.kota}, ${p.provinsi} ${p.kode_pos ?? ""}`.trim() : null} />
          </Section>

          <Section title="Pendidikan S1" icon={<GraduationCap size={16} style={{ color: "#0ea5e9" }} />}>
            <Row label="Perguruan Tinggi" value={p.nama_instansi_s1} />
            <Row label="Program Studi" value={p.program_studi_s1} />
            <Row label="Tahun Masuk – Lulus" value={p.tahun_masuk_s1 && p.tahun_lulus_s1 ? `${p.tahun_masuk_s1} – ${p.tahun_lulus_s1}` : null} />
            <Row label="IPK" value={p.ipk_s1 ? Number(p.ipk_s1).toFixed(2) : null} />
            <Row label="Akreditasi Prodi" value={p.akreditasi_s1} />
          </Section>

          <Section title="Pekerjaan" icon={<Briefcase size={16} style={{ color: "#0ea5e9" }} />}>
            <Row label="Status Pekerjaan" value={p.pekerjaan} />
            <Row label="Instansi / Perusahaan" value={p.instansi_kerja} />
            <Row label="Jabatan" value={p.jabatan} />
            <Row label="Pengalaman Kerja" value={p.pengalaman_kerja} />
          </Section>
        </div>

        {/* Pernyataan akademik */}
        <Section title="Pernyataan Akademik" icon={<FileText size={16} style={{ color: "#0ea5e9" }} />}>
          <Row label="Jalur Masuk" value={JALUR_LABEL[p.jalur_masuk] ?? p.jalur_masuk} />
          {p.referensi && <Row label="Referensi / Dosen" value={p.referensi} />}

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#2d5a7a" }}>
                Motivasi
              </p>
              <div
                className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                style={{ background: "rgba(10,22,40,0.6)", color: "#94a3b8", border: "1px solid rgba(30,58,95,0.5)" }}
              >
                {p.motivasi}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#2d5a7a" }}>
                Rencana Penelitian
              </p>
              <div
                className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                style={{ background: "rgba(10,22,40,0.6)", color: "#94a3b8", border: "1px solid rgba(30,58,95,0.5)" }}
              >
                {p.rencana_penelitian}
              </div>
            </div>
          </div>
        </Section>

        {/* Berkas Pendaftar */}
        <Section title="Berkas Pendaftar" icon={<FolderOpen size={16} style={{ color: "#0ea5e9" }} />}>
          {(() => {
            const BERKAS_LIST = [
              { field: "file_ijazah" as const, label: "Ijazah S1 (Legalisir)" },
              { field: "file_transkrip" as const, label: "Transkrip Nilai S1 (Legalisir)" },
              { field: "file_ktp" as const, label: "KTP / Identitas Diri" },
              { field: "file_foto" as const, label: "Pas Foto 4×6 (Terbaru)" },
              { field: "file_cv" as const, label: "Curriculum Vitae" },
              { field: "file_rekomendasi" as const, label: "Surat Rekomendasi" },
            ];
            const uploaded = BERKAS_LIST.filter((b) => p[b.field]);
            if (uploaded.length === 0) {
              return (
                <p className="text-sm" style={{ color: "#2d5a7a", fontStyle: "italic" }}>
                  Belum ada berkas yang diunggah.
                </p>
              );
            }
            return (
              <div className="space-y-4">
                {/* Download semua sekaligus */}
                <div className="pb-4" style={{ borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
                  <DownloadAllButton id={p.id} nomorPendaftaran={p.nomor_pendaftaran} />
                </div>
                {/* Download per berkas */}
                <div className="flex flex-wrap gap-3">
                  {uploaded.map((b) => (
                    <BerkasDownloader key={b.field} label={b.label} path={p[b.field]!} />
                  ))}
                </div>
              </div>
            );
          })()}
        </Section>
      </div>
    </AdminLayout>
  );
}
