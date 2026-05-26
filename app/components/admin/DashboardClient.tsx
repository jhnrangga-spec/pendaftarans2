"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import {
  Eye, Search, Download, ChevronLeft, ChevronRight,
  Users, Clock, CheckCircle, XCircle, Award, Filter, X,
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

interface Props {
  data: Pendaftar[];
}

const JALUR_LABEL: Record<string, string> = {
  reguler: "Reguler",
  beasiswa: "Beasiswa",
  kerjasama: "Kerjasama",
};

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "pending", label: "Menunggu Verifikasi" },
  { value: "lolos_administrasi", label: "Lolos Administrasi" },
  { value: "diterima", label: "Diterima" },
  { value: "tidak_lolos", label: "Tidak Lolos" },
];

const JALUR_OPTIONS = [
  { value: "", label: "Semua Jalur" },
  { value: "reguler", label: "Reguler" },
  { value: "beasiswa", label: "Beasiswa" },
  { value: "kerjasama", label: "Kerjasama" },
];

const PAGE_SIZE = 10;
const CARD_BG = "linear-gradient(135deg, #0c1d35 0%, #0a1a2e 100%)";
const BORDER = "rgba(30,58,95,0.6)";

function exportCSV(data: Pendaftar[]) {
  const headers = ["No. Pendaftaran", "Nama Lengkap", "Email", "Asal S1", "IPK", "Jalur Masuk", "Status", "Tanggal Daftar"];
  const rows = data.map((r) => [
    r.nomor_pendaftaran,
    r.nama_lengkap,
    r.email,
    r.program_studi_s1 ?? "",
    r.ipk_s1 ? Number(r.ipk_s1).toFixed(2) : "",
    JALUR_LABEL[r.jalur_masuk] ?? r.jalur_masuk,
    r.status,
    new Date(r.created_at).toLocaleDateString("id-ID"),
  ]);
  const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pendaftar-s2-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardClient({ data }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jalurFilter, setJalurFilter] = useState("");
  const [page, setPage] = useState(1);

  const stats = useMemo(() => ({
    total: data.length,
    pending: data.filter((d) => d.status === "pending").length,
    lolos: data.filter((d) => d.status === "lolos_administrasi").length,
    diterima: data.filter((d) => d.status === "diterima").length,
    tidakLolos: data.filter((d) => d.status === "tidak_lolos").length,
  }), [data]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((r) => {
      const matchSearch = !q || r.nama_lengkap.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.nomor_pendaftaran.toLowerCase().includes(q);
      const matchStatus = !statusFilter || r.status === statusFilter;
      const matchJalur = !jalurFilter || r.jalur_masuk === jalurFilter;
      return matchSearch && matchStatus && matchJalur;
    });
  }, [data, search, statusFilter, jalurFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasFilter = search || statusFilter || jalurFilter;

  function resetFilters() {
    setSearch("");
    setStatusFilter("");
    setJalurFilter("");
    setPage(1);
  }

  const statCards = [
    { icon: Users, label: "Total Pendaftar", value: stats.total, accent: "#0ea5e9", accentBg: "rgba(14,165,233,0.12)", sub: "semua gelombang" },
    { icon: Clock, label: "Menunggu Verifikasi", value: stats.pending, accent: "#f59e0b", accentBg: "rgba(245,158,11,0.12)", sub: "perlu ditinjau" },
    { icon: CheckCircle, label: "Lolos Administrasi", value: stats.lolos, accent: "#06b6d4", accentBg: "rgba(6,182,212,0.12)", sub: "lanjut seleksi" },
    { icon: Award, label: "Diterima", value: stats.diterima, accent: "#10b981", accentBg: "rgba(16,185,129,0.12)", sub: "mahasiswa baru" },
    { icon: XCircle, label: "Tidak Lolos", value: stats.tidakLolos, accent: "#ef4444", accentBg: "rgba(239,68,68,0.12)", sub: "gugur seleksi" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#e0f2fe" }}>
            Dashboard Pendaftaran
          </h1>
          <p className="text-sm" style={{ color: "#2d5a7a" }}>
            Program Magister Ilmu Kelautan — Universitas Khairun
          </p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
          style={{
            background: "rgba(16,185,129,0.12)",
            color: "#34d399",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map(({ icon: Icon, label, value, accent, accentBg, sub }) => (
          <div key={label} className="rounded-2xl p-5 border" style={{ background: CARD_BG, borderColor: BORDER }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: accentBg }}>
              <Icon size={18} style={{ color: accent }} />
            </div>
            <p className="text-3xl font-bold mb-0.5" style={{ color: "#e0f2fe" }}>{value}</p>
            <p className="text-xs font-semibold mb-0.5" style={{ color: "#7eb8d4" }}>{label}</p>
            <p className="text-xs" style={{ color: "#2d5a7a" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar acceptance rate */}
      {stats.total > 0 && (
        <div className="rounded-2xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2d5a7a" }}>
              Progres Seleksi
            </p>
            <p className="text-xs" style={{ color: "#4a7fa5" }}>
              {stats.diterima} dari {stats.total} pendaftar diterima
            </p>
          </div>
          <div className="space-y-2">
            {[
              { label: "Diterima", value: stats.diterima, color: "#10b981" },
              { label: "Lolos Adm.", value: stats.lolos, color: "#06b6d4" },
              { label: "Pending", value: stats.pending, color: "#f59e0b" },
              { label: "Tidak Lolos", value: stats.tidakLolos, color: "#ef4444" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs w-20 flex-shrink-0" style={{ color: "#4a7fa5" }}>{label}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(30,58,95,0.5)" }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(value / stats.total) * 100}%`, background: color }}
                  />
                </div>
                <span className="text-xs w-6 text-right font-bold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: CARD_BG, borderColor: BORDER }}>
        {/* Table header & filters */}
        <div className="px-5 py-4 border-b space-y-3" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: "#0ea5e9" }} />
              <span className="font-semibold text-sm" style={{ color: "#e0f2fe" }}>Semua Pendaftar</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(14,165,233,0.12)", color: "#38bdf8" }}>
                {filtered.length}{hasFilter && ` / ${data.length}`}
              </span>
            </div>
            {hasFilter && (
              <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all" style={{ color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <X size={12} /> Reset Filter
              </button>
            )}
          </div>

          {/* Search & filters */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#2d5a7a" }} />
              <input
                type="text"
                placeholder="Cari nama, email, no. pendaftaran..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl outline-none"
                style={{ background: "rgba(10,22,40,0.8)", color: "#cbd5e1", border: "1px solid rgba(30,58,95,0.8)" }}
              />
            </div>
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#2d5a7a" }} />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="pl-8 pr-3 py-2 text-sm rounded-xl outline-none appearance-none"
                style={{ background: "rgba(10,22,40,0.8)", color: "#cbd5e1", border: "1px solid rgba(30,58,95,0.8)" }}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} style={{ background: "#0c1d35" }}>{o.label}</option>
                ))}
              </select>
            </div>
            <select
              value={jalurFilter}
              onChange={(e) => { setJalurFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm rounded-xl outline-none appearance-none"
              style={{ background: "rgba(10,22,40,0.8)", color: "#cbd5e1", border: "1px solid rgba(30,58,95,0.8)" }}
            >
              {JALUR_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "#0c1d35" }}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={40} className="mx-auto mb-3" style={{ color: "#1e3a5f" }} />
            <p className="text-sm" style={{ color: "#2d5a7a" }}>
              {hasFilter ? "Tidak ada data yang cocok dengan filter" : "Belum ada data pendaftar"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {["No", "No. Pendaftaran", "Nama Lengkap", "Email", "Asal S1", "IPK", "Jalur", "Status", "Tgl Daftar", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#2d5a7a" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((row, idx) => {
                    const rowNum = (currentPage - 1) * PAGE_SIZE + idx + 1;
                    return (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: "1px solid rgba(30,58,95,0.35)",
                          background: idx % 2 !== 0 ? "rgba(10,22,40,0.4)" : "transparent",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(14,165,233,0.06)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = idx % 2 !== 0 ? "rgba(10,22,40,0.4)" : "transparent"; }}
                      >
                        <td className="px-4 py-3 text-xs" style={{ color: "#2d5a7a" }}>{rowNum}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-mono text-xs" style={{ color: "#38bdf8" }}>{row.nomor_pendaftaran}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: "#cbd5e1" }}>{row.nama_lengkap}</td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#4a7fa5" }}>{row.email}</td>
                        <td className="px-4 py-3 max-w-[140px] truncate" style={{ color: "#4a7fa5" }}>{row.program_studi_s1 ?? "—"}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: row.ipk_s1 >= 3.5 ? "#6ee7b7" : row.ipk_s1 >= 3.0 ? "#38bdf8" : "#94a3b8" }}>
                          {row.ipk_s1 ? Number(row.ipk_s1).toFixed(2) : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(14,165,233,0.1)", color: "#7dd3fc", border: "1px solid rgba(14,165,233,0.2)" }}>
                            {JALUR_LABEL[row.jalur_masuk] ?? row.jalur_masuk}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#2d5a7a" }}>
                          {new Date(row.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/pendaftar/${row.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: "rgba(14,165,233,0.12)", color: "#38bdf8", border: "1px solid rgba(14,165,233,0.2)" }}
                          >
                            <Eye size={12} /> Detail
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: BORDER }}>
                <p className="text-xs" style={{ color: "#2d5a7a" }}>
                  Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} data
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-30"
                    style={{ background: "rgba(14,165,233,0.1)", color: "#38bdf8" }}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs" style={{ color: "#2d5a7a" }}>…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: currentPage === p ? "rgba(14,165,233,0.25)" : "rgba(14,165,233,0.08)",
                            color: currentPage === p ? "#7dd3fc" : "#4a7fa5",
                            border: currentPage === p ? "1px solid rgba(14,165,233,0.4)" : "1px solid transparent",
                          }}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-30"
                    style={{ background: "rgba(14,165,233,0.1)", color: "#38bdf8" }}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
