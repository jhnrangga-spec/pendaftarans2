"use client";

import { useRouter } from "next/navigation";
import { Waves, LogOut, LayoutDashboard, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-blue-800/30 backdrop-blur-xl bg-blue-950/60">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
            <Waves size={15} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-blue-400/50 leading-none">Universitas Khairun</p>
            <p className="text-sm font-bold text-blue-100 leading-tight">Panel Admin</p>
          </div>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav items */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-blue-300/70 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all text-sm"
        >
          <LayoutDashboard size={15} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
          <Shield size={14} />
          <span className="hidden sm:inline text-xs">Admin</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
