import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/app/lib/auth";

export async function DELETE(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Server tidak dikonfigurasi" }, { status: 500 });

  try {
    const supabase = createClient(url, key);

    // Delete storage files first
    const { data: p } = await supabase
      .from("pendaftaran_s2")
      .select("file_ijazah, file_transkrip, file_ktp, file_foto, file_cv, file_rekomendasi")
      .eq("id", id)
      .single();

    if (p) {
      const paths = [p.file_ijazah, p.file_transkrip, p.file_ktp, p.file_foto, p.file_cv, p.file_rekomendasi]
        .filter(Boolean) as string[];
      if (paths.length > 0) {
        await supabase.storage.from("berkas-pendaftar").remove(paths);
      }
    }

    const { error } = await supabase.from("pendaftaran_s2").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
