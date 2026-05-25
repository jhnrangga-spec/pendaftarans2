"use client";

export default function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
      style={{
        background: "rgba(14,165,233,0.15)",
        color: "#38bdf8",
        border: "1px solid rgba(14,165,233,0.25)",
      }}
    >
      Coba Lagi
    </button>
  );
}
