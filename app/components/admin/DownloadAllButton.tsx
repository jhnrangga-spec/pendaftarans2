"use client";

import { useState } from "react";
import { Download, Loader2, PackageOpen } from "lucide-react";

interface Props {
  id: number;
  nomorPendaftaran: string;
}

export default function DownloadAllButton({ id, nomorPendaftaran }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/berkas/zip?id=${id}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Gagal mengunduh berkas");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `berkas-${nomorPendaftaran}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Koneksi gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
          color: "#001830",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Menyiapkan ZIP...
          </>
        ) : (
          <>
            <PackageOpen size={15} />
            Download Semua Berkas (.zip)
          </>
        )}
      </button>
      {error && (
        <p className="text-xs" style={{ color: "#f87171" }}>⚠ {error}</p>
      )}
    </div>
  );
}
