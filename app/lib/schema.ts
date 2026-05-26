import { z } from "zod";

export const step1Schema = z.object({
  namaLengkap: z.string().min(3, "Nama minimal 3 karakter"),
  tempatLahir: z.string().min(2, "Tempat lahir wajib diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  jenisKelamin: z.enum(["L", "P"], { error: "Pilih jenis kelamin" }),
  agama: z.string().min(1, "Pilih agama"),
  kewarganegaraan: z.string().min(1, "Kewarganegaraan wajib diisi"),
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK hanya angka"),
  nomorHp: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .regex(/^[\d+\-\s]+$/, "Format nomor HP tidak valid"),
  email: z.string().email("Format email tidak valid"),
  alamat: z.string().min(10, "Alamat minimal 10 karakter"),
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  kota: z.string().min(1, "Kota/Kabupaten wajib diisi"),
  kodePos: z.string().min(5, "Kode pos wajib diisi").regex(/^\d+$/, "Kode pos hanya angka"),
});

export const step2Schema = z.object({
  namaInstansiS1: z.string().min(3, "Nama institusi wajib diisi"),
  programStudiS1: z.string().min(3, "Program studi wajib diisi"),
  tahunMasukS1: z.string().min(4, "Tahun masuk wajib diisi"),
  tahunLulusS1: z.string().min(4, "Tahun lulus wajib diisi"),
  ipkS1: z
    .string()
    .min(1, "IPK wajib diisi")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 2.0 && num <= 4.0;
      },
      { message: "IPK harus antara 2.00 – 4.00" }
    ),
  statusAkreditasiS1: z.string().min(1, "Pilih akreditasi"),
  pekerjaan: z.string().min(1, "Pekerjaan wajib diisi"),
  instansiKerja: z.string().optional(),
  jabatan: z.string().optional(),
  pengalamanKerja: z.string().min(1, "Pilih pengalaman kerja"),
});

export const step3Schema = z.object({
  jalurMasuk: z.enum(["reguler", "beasiswa", "kerjasama"], {
    error: "Pilih jalur masuk",
  }),
  motivasi: z.string().min(100, "Motivasi minimal 100 karakter"),
  rencanaPenelitian: z.string().min(50, "Rencana penelitian minimal 50 karakter"),
  referensi: z.string().optional(),
  suratPernyataan: z.boolean().refine((v) => v === true, {
    message: "Anda harus menyetujui pernyataan ini",
  }),
  suratKesanggupan: z.boolean().refine((v) => v === true, {
    message: "Anda harus menyetujui pernyataan ini",
  }),
  fileIjazah: z.string().optional(),
  fileTranskrip: z.string().optional(),
  fileKtp: z.string().optional(),
  fileFoto: z.string().optional(),
  fileCv: z.string().optional(),
  fileRekomendasi: z.string().optional(),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;

export type FormData = Step1Data & Step2Data & Step3Data;
