"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Shield, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/pendaftar", icon: Users, label: "Data Pendaftar" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#060f1e" }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 border-r"
        style={{
          background: "linear-gradient(180deg, #0a1628 0%, #0c1d35 100%)",
          borderColor: "rgba(30,58,95,0.6)",
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(30,58,95,0.6)" }}>
          <div className="flex items-center gap-3">
            <img src="/logo-unkhair.svg" alt="Logo Universitas Khairun" className="w-9 h-9 flex-shrink-0" />
            <div>
              <p className="text-xs leading-none" style={{ color: "#4a7fa5" }}>
                Universitas Khairun
              </p>
              <p className="text-sm font-bold leading-tight" style={{ color: "#e0f2fe" }}>
                Panel Admin
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p
            className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
            style={{ color: "#2d5a7a" }}
          >
            Menu
          </p>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active =
              href === "/admin/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
                style={{
                  background: active ? "rgba(14,165,233,0.15)" : "transparent",
                  color: active ? "#7dd3fc" : "#4a7fa5",
                  border: active ? "1px solid rgba(14,165,233,0.25)" : "1px solid transparent",
                }}
              >
                <Icon size={16} />
                <span>{label}</span>
                {active && (
                  <ChevronRight size={14} className="ml-auto" style={{ color: "#38bdf8" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(30,58,95,0.6)" }}>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
            style={{ background: "rgba(14,165,233,0.08)" }}
          >
            <Shield size={13} style={{ color: "#38bdf8" }} />
            <span className="text-xs font-medium" style={{ color: "#38bdf8" }}>
              Administrator
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: "#f87171" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile + breadcrumb) */}
        <header
          className="sticky top-0 z-40 border-b px-4 sm:px-6 py-3 flex items-center gap-4"
          style={{
            background: "rgba(6,15,30,0.95)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(30,58,95,0.5)",
          }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 md:hidden">
            <img src="/logo-unkhair.svg" alt="Logo Universitas Khairun" className="w-7 h-7" />
            <span className="text-sm font-bold" style={{ color: "#e0f2fe" }}>
              Admin
            </span>
          </div>

          <div className="flex-1" />

          {/* Mobile logout */}
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{ color: "#f87171" }}
          >
            <LogOut size={14} />
          </button>

          {/* Desktop: right info */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{
              background: "rgba(14,165,233,0.08)",
              color: "#38bdf8",
              border: "1px solid rgba(14,165,233,0.15)",
            }}
          >
            <Shield size={12} />
            Administrator
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
