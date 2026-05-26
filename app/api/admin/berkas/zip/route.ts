import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/app/lib/auth";
import JSZip from "jszip";

const BERKAS_FIELDS = [
  { field: "file_ijazah",     label: "Ijazah_S1" },
  { field: "file_transkrip",  label: "Transkrip_S1" },
  { field: "file_ktp",        label: "KTP" },
  { field: "file_foto",       label: "Pas_Foto" },
  { field: "file_cv",         label: "CV" },
  { field: "file_rekomendasi",label: "Surat_Rekomendasi" },
];

export async function GET(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Server tidak dikonfigurasi" }, { status: 500 });

  try {
    const supabase = createClient(url, key);

    const { data: p, error: dbErr } = await supabase
      .from("pendaftaran_s2")
      .select("nomor_pendaftaran, nama_lengkap, file_ijazah, file_transkrip, file_ktp, file_foto, file_cv, file_rekomendasi")
      .eq("id", id)
      .single();

    if (dbErr || !p) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

    const zip = new JSZip();
    let fileCount = 0;

    for (const { field, label } of BERKAS_FIELDS) {
      const path = (p as Record<string, string | null>)[field];
      if (!path) continue;

      const { data: fileData, error: dlErr } = await supabase.storage
        .from("berkas-pendaftar")
        .download(path);

      if (dlErr || !fileData) continue;

      const ext = path.split(".").pop() ?? "bin";
      zip.file(`${label}.${ext}`, await fileData.arrayBuffer());
      fileCount++;
    }

    if (fileCount === 0) {
      return NextResponse.json({ error: "Tidak ada berkas yang tersedia" }, { status: 404 });
    }

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });
    const safeName = (p.nomor_pendaftaran as string).replace(/[^a-zA-Z0-9-]/g, "-");

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="berkas-${safeName}.zip"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
