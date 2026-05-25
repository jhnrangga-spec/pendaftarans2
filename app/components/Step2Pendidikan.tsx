"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, Step2Data } from "../lib/schema";
import FormField from "./FormField";
import { GraduationCap, Briefcase } from "lucide-react";

interface Props {
  defaultValues?: Partial<Step2Data>;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}

const AKREDITASI = ["A (Unggul)", "B (Baik Sekali)", "C (Baik)", "Tidak Terakreditasi"];
const PEKERJAAN = [
  "PNS / ASN", "TNI / POLRI", "BUMN / BUMD", "Swasta", "Wiraswasta",
  "Dosen / Peneliti", "Nelayan / Petani", "Belum Bekerja", "Lainnya",
];
const PENGALAMAN = [
  "Belum bekerja", "< 1 tahun", "1 – 3 tahun", "3 – 5 tahun",
  "5 – 10 tahun", "> 10 tahun",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

export default function Step2Pendidikan({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Pendidikan S1 */}
      <div className="glass-card-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <GraduationCap size={16} className="text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
            Pendidikan Terakhir (S1)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField
              label="Nama Perguruan Tinggi"
              error={errors.namaInstansiS1?.message}
              required
            >
              <input
                {...register("namaInstansiS1")}
                className={`ocean-input ${errors.namaInstansiS1 ? "input-error" : ""}`}
                placeholder="Universitas / Institut / Sekolah Tinggi"
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Program Studi"
              error={errors.programStudiS1?.message}
              required
            >
              <input
                {...register("programStudiS1")}
                className={`ocean-input ${errors.programStudiS1 ? "input-error" : ""}`}
                placeholder="Nama program studi S1"
              />
            </FormField>
          </div>

          <FormField label="Tahun Masuk" error={errors.tahunMasukS1?.message} required>
            <select
              {...register("tahunMasukS1")}
              className={`ocean-input ${errors.tahunMasukS1 ? "input-error" : ""}`}
            >
              <option value="">-- Tahun --</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Tahun Lulus" error={errors.tahunLulusS1?.message} required>
            <select
              {...register("tahunLulusS1")}
              className={`ocean-input ${errors.tahunLulusS1 ? "input-error" : ""}`}
            >
              <option value="">-- Tahun --</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </FormField>

          <FormField
            label="IPK (Indeks Prestasi Kumulatif)"
            error={errors.ipkS1?.message}
            required
            hint="Skala 0.00 – 4.00"
          >
            <input
              {...register("ipkS1")}
              className={`ocean-input ${errors.ipkS1 ? "input-error" : ""}`}
              placeholder="3.50"
              step="0.01"
            />
          </FormField>

          <FormField
            label="Akreditasi Program Studi"
            error={errors.statusAkreditasiS1?.message}
            required
          >
            <select
              {...register("statusAkreditasiS1")}
              className={`ocean-input ${errors.statusAkreditasiS1 ? "input-error" : ""}`}
            >
              <option value="">-- Pilih Akreditasi --</option>
              {AKREDITASI.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      {/* Pekerjaan */}
      <div className="glass-card-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
            <Briefcase size={16} className="text-teal-400" />
          </div>
          <h3 className="text-sm font-semibold text-teal-300 uppercase tracking-wide">
            Pekerjaan Saat Ini
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Status Pekerjaan" error={errors.pekerjaan?.message} required>
            <select
              {...register("pekerjaan")}
              className={`ocean-input ${errors.pekerjaan ? "input-error" : ""}`}
            >
              <option value="">-- Pilih Pekerjaan --</option>
              {PEKERJAAN.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Pengalaman Kerja" error={errors.pengalamanKerja?.message} required>
            <select
              {...register("pengalamanKerja")}
              className={`ocean-input ${errors.pengalamanKerja ? "input-error" : ""}`}
            >
              <option value="">-- Pilih --</option>
              {PENGALAMAN.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Nama Instansi / Perusahaan" error={errors.instansiKerja?.message}>
            <input
              {...register("instansiKerja")}
              className="ocean-input"
              placeholder="Nama instansi (opsional)"
            />
          </FormField>

          <FormField label="Jabatan / Posisi" error={errors.jabatan?.message}>
            <input
              {...register("jabatan")}
              className="ocean-input"
              placeholder="Jabatan saat ini (opsional)"
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <button type="submit" className="btn-primary">
          Selanjutnya
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
