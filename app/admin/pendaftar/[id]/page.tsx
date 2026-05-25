import { createClient } from "@supabase/supabase-js";
import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/app/lib/auth";
import OceanBackground from "@/app/components/OceanBackground";
import AdminNav from "@/app/components/admin/AdminNav";
import StatusBadge from "@/app/components/admin/StatusBadge";
import StatusUpdater from "@/app/components/admin/StatusUpdater";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  GraduationCap,
  Briefcase,
  FileText,
  Calendar,
  Hash,
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
}

async function getPendaftar(id: string): Promise<Pendaftar | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await supabase
    .from("pendaftaran_s2")
    .select("*")
    .eq("id", id)
    .single();
  return data as Pendaftar | null;
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-blue-800/20 last:border-0">
      <span className="text-blue-400/50 text-sm min-w-[180px] flex-shrink-0">{label}</span>
      <span className="text-blue-100 text-sm font-medium break-words">
        {value ?? <span className="text-blue-400/30 italic">—</span>}
      </span>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h3 className="font-semibold text-cyan-300 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

const JALUR_LABEL: Record<string, string> = {
  reguler: "Reguler",
  beasiswa: "Beasiswa",
  kerjasama: "Kerjasama",
};

export default async function DetailPendaftarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin");

  const { id } = await params;
  const p = await getPendaftar(id);
  if (!p) notFound();

  const tglLahir = p.tanggal_lahir
    ? new Date(p.tanggal_lahir).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const tglDaftar = new Date(p.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <OceanBackground />
      <div className="relative min-h-screen flex flex-col">
        <AdminNav />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
          {/* Back + header */}
          <div className="flex items-start gap-4">
            <Link
              href="/admin/dashboard"
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-blue-700/40 text-blue-400/70 hover:text-blue-200 hover:border-blue-600/60 transition-all flex-shrink-0 mt-0.5"
            >
              <ArrowLeft size={17} />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-white">{p.nama_lengkap}</h1>
                <StatusBadge status={p.status} />
              </div>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-blue-400/50">
                  <Hash size={12} />
                  {p.nomor_pendaftaran}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-blue-400/50">
                  <Calendar size={12} />
                  Daftar: {tglDaftar}
                </span>
              </div>
            </div>
          </div>

          {/* Status updater */}
          <div className="glass-card p-5">
            <p className="text-sm text-blue-300/70 mb-3 font-medium">Update Status Pendaftar</p>
            <StatusUpdater id={p.id} currentStatus={p.status} />
          </div>

          {/* Data grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Identitas */}
            <Section title="Identitas Diri" icon={<User size={17} className="text-cyan-400" />}>
              <Row label="Nama Lengkap" value={p.nama_lengkap} />
              <Row
                label="Tempat, Tgl Lahir"
                value={p.tempat_lahir && tglLahir ? `${p.tempat_lahir}, ${tglLahir}` : null}
              />
              <Row
                label="Jenis Kelamin"
                value={p.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
              />
              <Row label="Agama" value={p.agama} />
              <Row label="Kewarganegaraan" value={p.kewarganegaraan} />
              <Row label="NIK" value={p.nik} />
            </Section>

            {/* Kontak */}
            <Section title="Kontak" icon={<Phone size={17} className="text-cyan-400" />}>
              <Row label="Nomor HP" value={p.nomor_hp} />
              <Row label="Email" value={p.email} />
              <Row label="Alamat" value={p.alamat} />
              <Row
                label="Kota / Provinsi"
                value={
                  p.kota && p.provinsi
                    ? `${p.kota}, ${p.provinsi} ${p.kode_pos ?? ""}`.trim()
                    : null
                }
              />
            </Section>

            {/* Pendidikan */}
            <Section
              title="Pendidikan S1"
              icon={<GraduationCap size={17} className="text-cyan-400" />}
            >
              <Row label="Perguruan Tinggi" value={p.nama_instansi_s1} />
              <Row label="Program Studi" value={p.program_studi_s1} />
              <Row
                label="Tahun Masuk – Lulus"
                value={
                  p.tahun_masuk_s1 && p.tahun_lulus_s1
                    ? `${p.tahun_masuk_s1} – ${p.tahun_lulus_s1}`
                    : null
                }
              />
              <Row
                label="IPK"
                value={p.ipk_s1 ? Number(p.ipk_s1).toFixed(2) : null}
              />
              <Row label="Akreditasi Prodi" value={p.akreditasi_s1} />
            </Section>

            {/* Pekerjaan */}
            <Section
              title="Pekerjaan"
              icon={<Briefcase size={17} className="text-cyan-400" />}
            >
              <Row label="Status Pekerjaan" value={p.pekerjaan} />
              <Row label="Instansi / Perusahaan" value={p.instansi_kerja} />
              <Row label="Jabatan" value={p.jabatan} />
              <Row label="Pengalaman Kerja" value={p.pengalaman_kerja} />
            </Section>
          </div>

          {/* Pernyataan akademik */}
          <Section
            title="Pernyataan Akademik"
            icon={<FileText size={17} className="text-cyan-400" />}
          >
            <div className="space-y-0">
              <Row
                label="Jalur Masuk"
                value={JALUR_LABEL[p.jalur_masuk] ?? p.jalur_masuk}
              />
              {p.referensi && <Row label="Referensi / Dosen" value={p.referensi} />}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-blue-400/50 text-xs uppercase tracking-wide mb-2">Motivasi</p>
                <div className="glass-card-light p-4 rounded-xl">
                  <p className="text-blue-200/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {p.motivasi}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-blue-400/50 text-xs uppercase tracking-wide mb-2">
                  Rencana Penelitian
                </p>
                <div className="glass-card-light p-4 rounded-xl">
                  <p className="text-blue-200/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {p.rencana_penelitian}
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </main>
      </div>
    </>
  );
}
