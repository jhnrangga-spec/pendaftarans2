"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema, Step3Data } from "../lib/schema";
import FormField from "./FormField";
import { FileText, Upload, CheckSquare } from "lucide-react";
import { useState } from "react";

interface Props {
  defaultValues?: Partial<Step3Data>;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
}

const BERKAS_REQUIRED = [
  { id: "ijazah", label: "Ijazah S1 (Legalisir)" },
  { id: "transkrip", label: "Transkrip Nilai S1 (Legalisir)" },
  { id: "ktp", label: "KTP / Identitas Diri" },
  { id: "foto", label: "Pas Foto 4×6 (Terbaru)" },
  { id: "cv", label: "Curriculum Vitae" },
  { id: "motivasi_doc", label: "Surat Rekomendasi" },
];

export default function Step3Berkas({ defaultValues, onNext, onBack }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues,
  });

  const jalurMasuk = watch("jalurMasuk");

  const handleFileChange = (berkasId: string, file: File | null) => {
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [berkasId]: file.name }));
    }
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Jalur Masuk */}
      <div className="glass-card-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <FileText size={16} className="text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
            Jalur Pendaftaran
          </h3>
        </div>

        {errors.jalurMasuk && (
          <p className="error-text mb-3">{errors.jalurMasuk.message}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              value: "reguler",
              label: "Reguler",
              desc: "Jalur mandiri biaya sendiri",
              color: "cyan",
            },
            {
              value: "beasiswa",
              label: "Beasiswa",
              desc: "Beasiswa pemerintah / lembaga",
              color: "teal",
            },
            {
              value: "kerjasama",
              label: "Kerjasama",
              desc: "Program kerja sama instansi",
              color: "blue",
            },
          ].map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                {...register("jalurMasuk")}
                type="radio"
                value={opt.value}
                className="sr-only peer"
              />
              <div
                className={`
                  p-4 rounded-xl border transition-all duration-200 peer-checked:border-cyan-400
                  peer-checked:bg-cyan-500/10 border-blue-800/40 hover:border-blue-600/60
                  hover:bg-blue-900/20
                `}
              >
                <div className="font-semibold text-sm text-blue-100 mb-1">{opt.label}</div>
                <div className="text-xs text-blue-400/60">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Upload Berkas */}
      <div className="glass-card-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
            <Upload size={16} className="text-teal-400" />
          </div>
          <h3 className="text-sm font-semibold text-teal-300 uppercase tracking-wide">
            Unggah Berkas Persyaratan
          </h3>
        </div>

        <p className="text-xs text-blue-400/50 mb-4">
          Format: PDF / JPG / PNG · Maks. 5 MB per file
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BERKAS_REQUIRED.map((berkas) => (
            <div key={berkas.id}>
              <label
                className={`file-upload-zone block ${dragOver === berkas.id ? "border-teal-400 bg-teal-500/5" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(berkas.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileChange(berkas.id, file);
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(e) => handleFileChange(berkas.id, e.target.files?.[0] ?? null)}
                />
                {uploadedFiles[berkas.id] ? (
                  <div className="flex items-center gap-2 text-teal-400">
                    <CheckSquare size={18} />
                    <span className="text-sm truncate">{uploadedFiles[berkas.id]}</span>
                  </div>
                ) : (
                  <div>
                    <Upload size={20} className="text-blue-400/40 mx-auto mb-2" />
                    <p className="text-xs font-medium text-blue-200/80">{berkas.label}</p>
                    <p className="text-xs text-blue-400/40 mt-1">Klik atau seret ke sini</p>
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Motivasi & Rencana Penelitian */}
      <div className="glass-card-light p-5 space-y-4">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-4">
          Pernyataan Akademik
        </h3>

        <FormField
          label="Motivasi Mengikuti Program S2 Ilmu Kelautan"
          error={errors.motivasi?.message}
          required
          hint="Minimal 100 karakter"
        >
          <textarea
            {...register("motivasi")}
            rows={5}
            className={`ocean-input resize-none ${errors.motivasi ? "input-error" : ""}`}
            placeholder="Jelaskan motivasi, tujuan, dan harapan Anda mengikuti program ini..."
          />
        </FormField>

        <FormField
          label="Rencana Penelitian / Topik Tesis"
          error={errors.rencanaPenelitian?.message}
          required
          hint="Minimal 50 karakter"
        >
          <textarea
            {...register("rencanaPenelitian")}
            rows={4}
            className={`ocean-input resize-none ${errors.rencanaPenelitian ? "input-error" : ""}`}
            placeholder="Deskripsikan rencana penelitian atau topik tesis yang ingin Anda kerjakan..."
          />
        </FormField>

        <FormField
          label="Referensi / Nama Pembimbing yang Diminati"
          error={errors.referensi?.message}
        >
          <input
            {...register("referensi")}
            className="ocean-input"
            placeholder="Nama dosen (opsional)"
          />
        </FormField>
      </div>

      {/* Pernyataan */}
      <div className="glass-card-light p-5 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <CheckSquare size={16} className="text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide">
            Surat Pernyataan
          </h3>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            {...register("suratPernyataan")}
            type="checkbox"
            className="mt-0.5 w-5 h-5 accent-cyan-400 flex-shrink-0"
          />
          <span className="text-sm text-blue-200/80 group-hover:text-blue-200 transition-colors">
            Saya menyatakan bahwa seluruh data dan dokumen yang saya unggah adalah
            benar dan dapat dipertanggungjawabkan. Apabila terbukti tidak benar,
            saya bersedia menerima sanksi sesuai ketentuan yang berlaku.
          </span>
        </label>
        {errors.suratPernyataan && (
          <p className="error-text pl-8">{errors.suratPernyataan.message}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            {...register("suratKesanggupan")}
            type="checkbox"
            className="mt-0.5 w-5 h-5 accent-cyan-400 flex-shrink-0"
          />
          <span className="text-sm text-blue-200/80 group-hover:text-blue-200 transition-colors">
            Saya sanggup mengikuti seluruh proses seleksi dan bersedia mematuhi
            peraturan akademik Universitas Khairun apabila diterima sebagai
            mahasiswa Program Magister Ilmu Kelautan.
          </span>
        </label>
        {errors.suratKesanggupan && (
          <p className="error-text pl-8">{errors.suratKesanggupan.message}</p>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <button type="submit" className="btn-primary">
          Review & Kirim
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
