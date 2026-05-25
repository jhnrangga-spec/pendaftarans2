const STATUS_MAP: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: {
    label: "Menunggu Verifikasi",
    bg: "rgba(245,158,11,0.12)",
    text: "#fcd34d",
    border: "rgba(245,158,11,0.3)",
  },
  lolos_administrasi: {
    label: "Lolos Administrasi",
    bg: "rgba(14,165,233,0.12)",
    text: "#7dd3fc",
    border: "rgba(14,165,233,0.3)",
  },
  tidak_lolos: {
    label: "Tidak Lolos",
    bg: "rgba(239,68,68,0.12)",
    text: "#fca5a5",
    border: "rgba(239,68,68,0.3)",
  },
  diterima: {
    label: "Diterima",
    bg: "rgba(16,185,129,0.12)",
    text: "#6ee7b7",
    border: "rgba(16,185,129,0.3)",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? {
    label: status,
    bg: "rgba(99,102,241,0.12)",
    text: "#a5b4fc",
    border: "rgba(99,102,241,0.3)",
  };

  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      {s.label}
    </span>
  );
}
