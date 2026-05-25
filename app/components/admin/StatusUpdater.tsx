"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

const OPTIONS = [
  { value: "pending", label: "Menunggu Verifikasi" },
  { value: "lolos_administrasi", label: "Lolos Administrasi" },
  { value: "tidak_lolos", label: "Tidak Lolos" },
  { value: "diterima", label: "Diterima" },
];

interface Props {
  id: number;
  currentStatus: string;
}

export default function StatusUpdater({ id, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    const res = await fetch("/api/admin/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLoading(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="text-sm px-3 py-2 rounded-xl border outline-none min-w-[200px]"
        style={{
          background: "rgba(10,22,40,0.8)",
          color: "#e0f2fe",
          borderColor: "rgba(30,58,95,0.8)",
        }}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#0c1d35" }}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        disabled={loading || status === currentStatus}
        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
          color: "#001830",
        }}
      >
        {loading ? (
          <>
            <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            </svg>
            Menyimpan...
          </>
        ) : (
          "Simpan Status"
        )}
      </button>

      {saved && (
        <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#6ee7b7" }}>
          <Check size={14} />
          Tersimpan
        </span>
      )}
    </div>
  );
}
