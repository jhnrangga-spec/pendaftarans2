import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/auth";
import AdminLayout from "@/app/components/admin/AdminLayout";
import ReloadButton from "@/app/components/admin/ReloadButton";
import DashboardClient from "@/app/components/admin/DashboardClient";

interface Pendaftar {
  id: number;
  nomor_pendaftaran: string;
  nama_lengkap: string;
  email: string;
  program_studi_s1: string;
  ipk_s1: number;
  jalur_masuk: string;
  status: string;
  created_at: string;
}

async function getData(): Promise<{ data: Pendaftar[]; error: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { data: [], error: "env_missing" };
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("pendaftaran_s2")
      .select("id, nomor_pendaftaran, nama_lengkap, email, program_studi_s1, ipk_s1, jalur_masuk, status, created_at")
      .order("created_at", { ascending: false });
    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as Pendaftar[], error: null };
  } catch (e) {
    return { data: [], error: String(e) };
  }
}

export default async function DashboardPage() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin");

  const { data, error: fetchError } = await getData();

  if (fetchError) {
    const isEnvMissing = fetchError === "env_missing";
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto mt-12">
          <div
            className="rounded-2xl border p-8"
            style={{
              background: "linear-gradient(135deg,#0c1d35,#0a1a2e)",
              borderColor: isEnvMissing ? "rgba(245,158,11,0.4)" : "rgba(239,68,68,0.4)",
            }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: isEnvMissing ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)" }}>
              <span className="text-2xl">{isEnvMissing ? "⚙️" : "⚠️"}</span>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#e0f2fe" }}>
              {isEnvMissing ? "Konfigurasi Supabase Belum Lengkap" : "Gagal Memuat Data"}
            </h2>
            <p className="text-sm mb-6" style={{ color: "#4a7fa5" }}>
              {isEnvMissing
                ? "Environment variable Supabase belum diset di Vercel. Dashboard tidak dapat memuat data pendaftar."
                : `Terjadi kesalahan saat menghubungi database: ${fetchError}`}
            </p>
            {isEnvMissing && (
              <div className="rounded-xl p-5 mb-6 text-sm space-y-3"
                style={{ background: "rgba(6,15,30,0.6)", border: "1px solid rgba(30,58,95,0.6)" }}>
                <p className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: "#2d5a7a" }}>
                  Langkah Perbaikan di Vercel
                </p>
                {[
                  ["1", "Buka", "vercel.com → Project → Settings → Environment Variables"],
                  ["2", "Tambahkan", "NEXT_PUBLIC_SUPABASE_URL"],
                  ["3", "Tambahkan", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
                  ["4", "Tambahkan", "SUPABASE_SERVICE_ROLE_KEY"],
                  ["5", "Tambahkan", "ADMIN_JWT_SECRET  (string acak panjang)"],
                  ["6", "Klik", "Deployments → Redeploy pada deployment terbaru"],
                ].map(([num, action, detail]) => (
                  <div key={num} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(14,165,233,0.15)", color: "#38bdf8" }}>
                      {num}
                    </span>
                    <div>
                      <span style={{ color: "#4a7fa5" }}>{action} </span>
                      <span className="font-mono text-xs" style={{ color: "#7dd3fc" }}>{detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ReloadButton />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <DashboardClient data={data} />
    </AdminLayout>
  );
}
