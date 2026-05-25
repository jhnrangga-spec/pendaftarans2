"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, Step1Data } from "../lib/schema";
import FormField from "./FormField";
import { User, MapPin, Phone, Mail } from "lucide-react";

interface Props {
  defaultValues?: Partial<Step1Data>;
  onNext: (data: Step1Data) => void;
}

const AGAMA = ["Islam", "Kristen Protestan", "Kristen Katolik", "Hindu", "Buddha", "Konghucu"];

const PROVINSI = [
  "Maluku Utara", "Maluku", "Papua Barat", "Papua", "Sulawesi Utara",
  "Gorontalo", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Selatan",
  "Sulawesi Barat", "Kalimantan Timur", "Kalimantan Utara", "Kalimantan Selatan",
  "Kalimantan Tengah", "Kalimantan Barat", "DKI Jakarta", "Jawa Barat",
  "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten", "Bali",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Aceh", "Sumatera Utara",
  "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Bengkulu",
  "Sumatera Selatan", "Kepulauan Bangka Belitung", "Lampung",
];

export default function Step1DataPribadi({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Section: Identitas */}
      <div className="glass-card-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <User size={16} className="text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
            Identitas Diri
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField label="Nama Lengkap" error={errors.namaLengkap?.message} required>
              <input
                {...register("namaLengkap")}
                className={`ocean-input ${errors.namaLengkap ? "input-error" : ""}`}
                placeholder="Sesuai ijazah terakhir"
              />
            </FormField>
          </div>

          <FormField label="Tempat Lahir" error={errors.tempatLahir?.message} required>
            <input
              {...register("tempatLahir")}
              className={`ocean-input ${errors.tempatLahir ? "input-error" : ""}`}
              placeholder="Kota/Kabupaten"
            />
          </FormField>

          <FormField label="Tanggal Lahir" error={errors.tanggalLahir?.message} required>
            <input
              {...register("tanggalLahir")}
              type="date"
              className={`ocean-input ${errors.tanggalLahir ? "input-error" : ""}`}
            />
          </FormField>

          <FormField label="Jenis Kelamin" error={errors.jenisKelamin?.message} required>
            <select
              {...register("jenisKelamin")}
              className={`ocean-input ${errors.jenisKelamin ? "input-error" : ""}`}
            >
              <option value="">-- Pilih --</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </FormField>

          <FormField label="Agama" error={errors.agama?.message} required>
            <select
              {...register("agama")}
              className={`ocean-input ${errors.agama ? "input-error" : ""}`}
            >
              <option value="">-- Pilih --</option>
              {AGAMA.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Kewarganegaraan" error={errors.kewarganegaraan?.message} required>
            <input
              {...register("kewarganegaraan")}
              className={`ocean-input ${errors.kewarganegaraan ? "input-error" : ""}`}
              placeholder="WNI / WNA"
              defaultValue="WNI"
            />
          </FormField>

          <FormField
            label="NIK (Nomor Induk Kependudukan)"
            error={errors.nik?.message}
            required
            hint="16 digit sesuai KTP"
          >
            <input
              {...register("nik")}
              className={`ocean-input ${errors.nik ? "input-error" : ""}`}
              placeholder="1234567890123456"
              maxLength={16}
            />
          </FormField>
        </div>
      </div>

      {/* Section: Kontak */}
      <div className="glass-card-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
            <Phone size={16} className="text-teal-400" />
          </div>
          <h3 className="text-sm font-semibold text-teal-300 uppercase tracking-wide">
            Informasi Kontak
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nomor HP / WhatsApp" error={errors.nomorHp?.message} required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/60 text-sm">
                +62
              </span>
              <input
                {...register("nomorHp")}
                className={`ocean-input pl-12 ${errors.nomorHp ? "input-error" : ""}`}
                placeholder="8123456789"
              />
            </div>
          </FormField>

          <FormField label="Alamat Email" error={errors.email?.message} required>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/50" />
              <input
                {...register("email")}
                type="email"
                className={`ocean-input pl-10 ${errors.email ? "input-error" : ""}`}
                placeholder="nama@email.com"
              />
            </div>
          </FormField>
        </div>
      </div>

      {/* Section: Alamat */}
      <div className="glass-card-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <MapPin size={16} className="text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide">
            Alamat Domisili
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField label="Alamat Lengkap" error={errors.alamat?.message} required>
              <textarea
                {...register("alamat")}
                rows={3}
                className={`ocean-input resize-none ${errors.alamat ? "input-error" : ""}`}
                placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
              />
            </FormField>
          </div>

          <FormField label="Provinsi" error={errors.provinsi?.message} required>
            <select
              {...register("provinsi")}
              className={`ocean-input ${errors.provinsi ? "input-error" : ""}`}
            >
              <option value="">-- Pilih Provinsi --</option>
              {PROVINSI.sort().map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Kota / Kabupaten" error={errors.kota?.message} required>
            <input
              {...register("kota")}
              className={`ocean-input ${errors.kota ? "input-error" : ""}`}
              placeholder="Kota/Kabupaten"
            />
          </FormField>

          <FormField label="Kode Pos" error={errors.kodePos?.message} required>
            <input
              {...register("kodePos")}
              className={`ocean-input ${errors.kodePos ? "input-error" : ""}`}
              placeholder="97700"
              maxLength={5}
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end pt-2">
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
