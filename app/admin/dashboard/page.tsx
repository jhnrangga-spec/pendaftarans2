import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/auth";
import OceanBackground from "@/app/components/OceanBackground";
import AdminNav from "@/app/components/admin/AdminNav";
import StatusBadge from "@/app/components/admin/StatusBadge";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Search,
  Eye,
} from "lucide-react";

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

async function getData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("pendaftaran_s2")
    .select(
      "id, nomor_pendaftaran, nama_lengkap, email, nomor_hp, program_studi_s1, ipk_s1, jalur_masuk, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as Pendaftar[];
}

const JALUR_LABEL: Record<string, string> = {
  reguler: "Reguler",
  beasiswa: "Beasiswa",
  kerjasama: "Kerjasama",
};

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

  return (
    <>
      <OceanBackground />
      <div className="relative min-h-screen flex flex-col">
        <AdminNav />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Pendaftaran</h1>
            <p className="text-blue-300/50 text-sm mt-1">
              S2 Ilmu Kelautan — Universitas Khairun
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: Users,
                label: "Total Pendaftar",
                value: stats.total,
                color: "cyan",
              },
              {
                icon: Clock,
                label: "Menunggu",
                value: stats.pending,
                color: "amber",
              },
              {
                icon: CheckCircle,
                label: "Lolos Administrasi",
                value: stats.lolos,
                color: "teal",
              },
              {
                icon: Award,
                label: "Diterima",
                value: stats.diterima,
                color: "green",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="glass-card p-5">
                <div
                  className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center
                  ${color === "cyan" ? "bg-cyan-500/20" : ""}
                  ${color === "amber" ? "bg-amber-500/20" : ""}
                  ${color === "teal" ? "bg-teal-500/20" : ""}
                  ${color === "green" ? "bg-emerald-500/20" : ""}
                `}
                >
                  <Icon
                    size={20}
                    className={`
                    ${color === "cyan" ? "text-cyan-400" : ""}
                    ${color === "amber" ? "text-amber-400" : ""}
                    ${color === "teal" ? "text-teal-400" : ""}
                    ${color === "green" ? "text-emerald-400" : ""}
                  `}
                  />
                </div>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-blue-400/60 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
            {/* Table header */}
            <div className="p-5 border-b border-blue-800/30 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="font-semibold text-blue-100 flex items-center gap-2">
                <Search size={16} className="text-cyan-400" />
                Daftar Pendaftar
                <span className="text-xs text-blue-400/50 font-normal ml-1">
                  ({data.length} data)
                </span>
              </h2>
            </div>

            {data.length === 0 ? (
              <div className="py-20 text-center">
                <Users size={40} className="text-blue-400/20 mx-auto mb-3" />
                <p className="text-blue-400/40 text-sm">Belum ada data pendaftar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-800/30">
                      {[
                        "No. Pendaftaran",
                        "Nama Lengkap",
                        "Email",
                        "Asal S1",
                        "IPK",
                        "Jalur",
                        "Status",
                        "Tanggal Daftar",
                        "Aksi",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-blue-400/50 text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
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
                        className={`border-b border-blue-800/20 hover:bg-blue-800/20 transition-colors ${
                          idx % 2 === 0 ? "" : "bg-blue-900/10"
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-cyan-300/80 whitespace-nowrap">
                          {row.nomor_pendaftaran}
                        </td>
                        <td className="px-4 py-3 font-medium text-blue-100 whitespace-nowrap">
                          {row.nama_lengkap}
                        </td>
                        <td className="px-4 py-3 text-blue-300/60 whitespace-nowrap">
                          {row.email}
                        </td>
                        <td className="px-4 py-3 text-blue-300/60 max-w-[160px] truncate">
                          {row.program_studi_s1 ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`font-semibold ${
                              row.ipk_s1 >= 3.5
                                ? "text-teal-400"
                                : row.ipk_s1 >= 3.0
                                ? "text-cyan-400"
                                : "text-blue-300"
                            }`}
                          >
                            {row.ipk_s1 ? Number(row.ipk_s1).toFixed(2) : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-800/40 text-blue-300/70 border border-blue-700/30">
                            {JALUR_LABEL[row.jalur_masuk] ?? row.jalur_masuk}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-4 py-3 text-blue-400/50 text-xs whitespace-nowrap">
                          {new Date(row.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/pendaftar/${row.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-xs font-medium"
                          >
                            <Eye size={13} />
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

          {/* Tidak lolos count info */}
          {stats.tidakLolos > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20">
              <XCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-300/70 text-sm">
                <span className="font-semibold text-red-300">{stats.tidakLolos}</span> pendaftar
                dinyatakan tidak lolos seleksi administrasi.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
