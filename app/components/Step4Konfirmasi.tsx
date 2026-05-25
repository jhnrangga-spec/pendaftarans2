"use client";

import { FormData } from "../lib/schema";
import { User, GraduationCap, FileText, ChevronRight } from "lucide-react";

interface Props {
  data: Partial<FormData>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-2 py-2 border-b border-blue-800/30 last:border-0">
      <span className="text-blue-400/60 text-sm min-w-[140px] flex-shrink-0">{label}</span>
      <span className="text-blue-100 text-sm font-medium">{value || "-"}</span>
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
    <div className="glass-card-light p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-cyan-500/15 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

export default function Step4Konfirmasi({ data, onBack, onSubmit, isSubmitting }: Props) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <p className="text-blue-300/70 text-sm">
          Periksa kembali data Anda sebelum mengirimkan pendaftaran
        </p>
      </div>

      <Section title="Data Pribadi" icon={<User size={16} className="text-cyan-400" />}>
        <ReviewRow label="Nama Lengkap" value={data.namaLengkap} />
        <ReviewRow
          label="Tempat, Tgl Lahir"
          value={
            data.tempatLahir && data.tanggalLahir
              ? `${data.tempatLahir}, ${new Date(data.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
              : undefined
          }
        />
        <ReviewRow label="Jenis Kelamin" value={data.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"} />
        <ReviewRow label="Agama" value={data.agama} />
        <ReviewRow label="NIK" value={data.nik} />
        <ReviewRow label="No. HP" value={data.nomorHp} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="Alamat" value={data.alamat} />
        <ReviewRow
          label="Kota / Provinsi"
          value={data.kota && data.provinsi ? `${data.kota}, ${data.provinsi} ${data.kodePos}` : undefined}
        />
      </Section>

      <Section title="Riwayat Pendidikan" icon={<GraduationCap size={16} className="text-cyan-400" />}>
        <ReviewRow label="Perguruan Tinggi" value={data.namaInstansiS1} />
        <ReviewRow label="Program Studi" value={data.programStudiS1} />
        <ReviewRow
          label="Tahun"
          value={
            data.tahunMasukS1 && data.tahunLulusS1
              ? `${data.tahunMasukS1} – ${data.tahunLulusS1}`
              : undefined
          }
        />
        <ReviewRow label="IPK" value={data.ipkS1} />
        <ReviewRow label="Akreditasi" value={data.statusAkreditasiS1} />
        <ReviewRow label="Pekerjaan" value={data.pekerjaan} />
        <ReviewRow label="Pengalaman Kerja" value={data.pengalamanKerja} />
        {data.instansiKerja && (
          <ReviewRow label="Instansi Kerja" value={data.instansiKerja} />
        )}
      </Section>

      <Section title="Berkas & Pernyataan" icon={<FileText size={16} className="text-cyan-400" />}>
        <ReviewRow
          label="Jalur Masuk"
          value={
            data.jalurMasuk === "reguler"
              ? "Reguler"
              : data.jalurMasuk === "beasiswa"
              ? "Beasiswa"
              : "Kerjasama"
          }
        />
        <ReviewRow label="Surat Pernyataan" value="✓ Disetujui" />
        <ReviewRow label="Surat Kesanggupan" value="✓ Disetujui" />
      </Section>

      {data.motivasi && (
        <div className="glass-card-light p-5">
          <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide mb-3">
            Motivasi
          </h3>
          <p className="text-blue-200/70 text-sm leading-relaxed">{data.motivasi}</p>
        </div>
      )}

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <span className="text-amber-400 text-lg flex-shrink-0">⚠</span>
        <p className="text-amber-200/80 text-xs leading-relaxed">
          Setelah formulir dikirim, data tidak dapat diubah. Pastikan seluruh informasi
          yang Anda masukkan sudah benar dan lengkap.
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary" disabled={isSubmitting}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Mengirim...
            </>
          ) : (
            <>
              Kirim Pendaftaran
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
