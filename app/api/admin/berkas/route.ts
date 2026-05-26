import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Path wajib diisi" }, { status: 400 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.storage
      .from("berkas-pendaftar")
      .createSignedUrl(path, 300); // 5 minutes

    if (error || !data?.signedUrl) {
      console.error("Signed URL error:", error);
      return NextResponse.json({ error: "Gagal membuat URL unduhan." }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err) {
    console.error("Berkas API error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
