"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        className="ocean-input py-2 text-sm w-auto min-w-[200px]"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        disabled={loading || status === currentStatus}
        className="btn-primary py-2 px-5 text-sm"
      >
        {loading ? (
          <>
            <svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            </svg>
            Menyimpan...
          </>
        ) : (
          "Simpan Status"
        )}
      </button>

      {saved && (
        <span className="text-teal-400 text-sm font-medium">✓ Tersimpan</span>
      )}
    </div>
  );
}
