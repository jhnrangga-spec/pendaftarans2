import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/auth";
import AdminLayout from "@/app/components/admin/AdminLayout";
import ReloadButton from "@/app/components/admin/ReloadButton";
import PendaftarClient from "@/app/components/admin/PendaftarClient";

interface Pendaftar {
  id: number;
  nomor_pendaftaran: string;
  nama_lengkap: string;
  email: string;
  nomor_hp: string;
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
      .select("id, nomor_pendaftaran, nama_lengkap, email, nomor_hp, program_studi_s1, ipk_s1, jalur_masuk, status, created_at")
      .order("created_at", { ascending: false });
    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as Pendaftar[], error: null };
  } catch (e) {
    return { data: [], error: String(e) };
  }
}

export default async function PendaftarPage() {
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
                ? "Environment variable Supabase belum diset. Halaman ini tidak dapat memuat data."
                : `Kesalahan: ${fetchError}`}
            </p>
            <ReloadButton />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PendaftarClient data={data} />
    </AdminLayout>
  );
}
