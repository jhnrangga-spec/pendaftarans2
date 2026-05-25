import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await req.json();

    const nomorPendaftaran = `UNKHAIR-IK-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 90000 + 10000
    )}`;

    const { error } = await supabase.from("pendaftaran_s2").insert({
      nomor_pendaftaran: nomorPendaftaran,
      nama_lengkap: body.namaLengkap,
      tempat_lahir: body.tempatLahir,
      tanggal_lahir: body.tanggalLahir,
      jenis_kelamin: body.jenisKelamin,
      agama: body.agama,
      kewarganegaraan: body.kewarganegaraan,
      nik: body.nik,
      nomor_hp: body.nomorHp,
      email: body.email,
      alamat: body.alamat,
      provinsi: body.provinsi,
      kota: body.kota,
      kode_pos: body.kodePos,
      nama_instansi_s1: body.namaInstansiS1,
      program_studi_s1: body.programStudiS1,
      tahun_masuk_s1: body.tahunMasukS1,
      tahun_lulus_s1: body.tahunLulusS1,
      ipk_s1: parseFloat(body.ipkS1),
      akreditasi_s1: body.statusAkreditasiS1,
      pekerjaan: body.pekerjaan,
      instansi_kerja: body.instansiKerja ?? null,
      jabatan: body.jabatan ?? null,
      pengalaman_kerja: body.pengalamanKerja,
      jalur_masuk: body.jalurMasuk,
      motivasi: body.motivasi,
      rencana_penelitian: body.rencanaPenelitian,
      referensi: body.referensi ?? null,
      status: "pending",
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Gagal menyimpan data. Coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, nomorPendaftaran });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
