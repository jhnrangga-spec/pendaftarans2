"use client";

import { useState } from "react";
import { Download, Loader2, AlertCircle } from "lucide-react";

interface Props {
  label: string;
  path: string;
}

export default function BerkasDownloader({ label, path }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/berkas?path=${encodeURIComponent(path)}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error ?? "Gagal mendapatkan URL unduhan.");
        return;
      }

      window.open(json.url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-80"
        style={{
          background: "rgba(14,165,233,0.1)",
          borderColor: "rgba(14,165,233,0.25)",
          color: "#38bdf8",
        }}
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin flex-shrink-0" />
        ) : (
          <Download size={15} className="flex-shrink-0" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </button>

      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 ml-1">
          <AlertCircle size={12} style={{ color: "#f87171" }} />
          <span className="text-xs" style={{ color: "#f87171" }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
