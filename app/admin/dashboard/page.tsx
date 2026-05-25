import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/auth";
import AdminLayout from "@/app/components/admin/AdminLayout";
import StatusBadge from "@/app/components/admin/StatusBadge";
import Link from "next/link";
import {
  Users, Clock, CheckCircle, XCircle, Award, Eye, TrendingUp,
} from "lucide-react";

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

async function getData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabase
    .from("pendaftaran_s2")
    .select("id, nomor_pendaftaran, nama_lengkap, email, program_studi_s1, ipk_s1, jalur_masuk, status, created_at")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Pendaftar[];
}

const JALUR_LABEL: Record<string, string> = {
  reguler: "Reguler",
  beasiswa: "Beasiswa",
  kerjasama: "Kerjasama",
};

const CARD_BG = "linear-gradient(135deg, #0c1d35 0%, #0a1a2e 100%)";
const BORDER = "rgba(30,58,95,0.6)";

export default async function DashboardPage() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin");

  const data = await getData();
  const stats = {
    total: data.length,
    pending: data.filter((d) => d.status === "pending").length,
    lolos: data.filter((d) => d.status === "lolos_administrasi").length,
    diterima: data.filter((d) => d.status === "diterima").length,
    tidakLolos: data.filter((d) => d.status === "tidak_lolos").length,
  };

  const statCards = [
    {
      icon: Users,
      label: "Total Pendaftar",
      value: stats.total,
      accent: "#0ea5e9",
      accentBg: "rgba(14,165,233,0.12)",
      sub: "semua gelombang",
    },
    {
      icon: Clock,
      label: "Menunggu Verifikasi",
      value: stats.pending,
      accent: "#f59e0b",
      accentBg: "rgba(245,158,11,0.12)",
      sub: "perlu ditinjau",
    },
    {
      icon: CheckCircle,
      label: "Lolos Administrasi",
      value: stats.lolos,
      accent: "#06b6d4",
      accentBg: "rgba(6,182,212,0.12)",
      sub: "lanjut seleksi",
    },
    {
      icon: Award,
      label: "Diterima",
      value: stats.diterima,
      accent: "#10b981",
      accentBg: "rgba(16,185,129,0.12)",
      sub: "mahasiswa baru",
    },
  ];

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#e0f2fe" }}>
          Dashboard Pendaftaran
        </h1>
        <p className="text-sm" style={{ color: "#2d5a7a" }}>
          Program Magister Ilmu Kelautan — Universitas Khairun
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ icon: Icon, label, value, accent, accentBg, sub }) => (
          <div
            key={label}
            className="rounded-2xl p-5 border"
            style={{ background: CARD_BG, borderColor: BORDER }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: accentBg }}
            >
              <Icon size={20} style={{ color: accent }} />
            </div>
            <p className="text-3xl font-bold mb-0.5" style={{ color: "#e0f2fe" }}>
              {value}
            </p>
            <p className="text-sm font-medium mb-0.5" style={{ color: "#7eb8d4" }}>
              {label}
            </p>
            <p className="text-xs" style={{ color: "#2d5a7a" }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Not lolos alert */}
      {stats.tidakLolos > 0 && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl border mb-6"
          style={{
            background: "rgba(239,68,68,0.07)",
            borderColor: "rgba(239,68,68,0.2)",
          }}
        >
          <XCircle size={16} style={{ color: "#f87171" }} className="flex-shrink-0" />
          <p className="text-sm" style={{ color: "#fca5a5" }}>
            <span className="font-semibold">{stats.tidakLolos}</span> pendaftar dinyatakan tidak lolos seleksi administrasi.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: CARD_BG, borderColor: BORDER }}>
        {/* Table header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp size={16} style={{ color: "#0ea5e9" }} />
            <span className="font-semibold text-sm" style={{ color: "#e0f2fe" }}>
              Semua Pendaftar
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(14,165,233,0.12)", color: "#38bdf8" }}
            >
              {data.length}
            </span>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={40} className="mx-auto mb-3" style={{ color: "#1e3a5f" }} />
            <p className="text-sm" style={{ color: "#2d5a7a" }}>
              Belum ada data pendaftar
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["No. Pendaftaran", "Nama Lengkap", "Email", "Asal S1", "IPK", "Jalur", "Status", "Tgl Daftar", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: "#2d5a7a" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: `1px solid rgba(30,58,95,0.35)`,
                      background: idx % 2 !== 0 ? "rgba(10,22,40,0.4)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(14,165,233,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        idx % 2 !== 0 ? "rgba(10,22,40,0.4)" : "transparent";
                    }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-xs" style={{ color: "#38bdf8" }}>
                        {row.nomor_pendaftaran}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: "#cbd5e1" }}>
                      {row.nama_lengkap}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#4a7fa5" }}>
                      {row.email}
                    </td>
                    <td className="px-4 py-3 max-w-[150px] truncate" style={{ color: "#4a7fa5" }}>
                      {row.program_studi_s1 ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-bold" style={{
                      color: row.ipk_s1 >= 3.5 ? "#6ee7b7" : row.ipk_s1 >= 3.0 ? "#38bdf8" : "#94a3b8",
                    }}>
                      {row.ipk_s1 ? Number(row.ipk_s1).toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: "rgba(14,165,233,0.1)",
                          color: "#7dd3fc",
                          border: "1px solid rgba(14,165,233,0.2)",
                        }}
                      >
                        {JALUR_LABEL[row.jalur_masuk] ?? row.jalur_masuk}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#2d5a7a" }}>
                      {new Date(row.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pendaftar/${row.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: "rgba(14,165,233,0.12)",
                          color: "#38bdf8",
                          border: "1px solid rgba(14,165,233,0.2)",
                        }}
                      >
                        <Eye size={12} />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
