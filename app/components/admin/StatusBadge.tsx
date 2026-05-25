const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: {
    label: "Menunggu Verifikasi",
    color: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  lolos_administrasi: {
    label: "Lolos Administrasi",
    color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  },
  tidak_lolos: {
    label: "Tidak Lolos",
    color: "bg-red-500/15 text-red-300 border-red-500/30",
  },
  diterima: {
    label: "Diterima",
    color: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? {
    label: status,
    color: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color}`}
    >
      {s.label}
    </span>
  );
}
