"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Waves, Eye, EyeOff, Lock, User, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const json = await res.json();
    if (json.success) {
      router.push("/admin/dashboard");
    } else {
      setError(json.message ?? "Login gagal");
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg,#060f1e 0%,#0a1628 50%,#0c1d35 100%)" }}
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/30 mb-4">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
            <p className="text-blue-300/60 text-sm mt-1">
              Sistem Pendaftaran S2 Ilmu Kelautan
            </p>
            <p className="text-blue-400/40 text-xs mt-0.5">Universitas Khairun</p>
          </div>

          {/* Card */}
          <div
            className="p-8 rounded-2xl border"
            style={{
              background: "linear-gradient(135deg,#0c1d35 0%,#0a1a2e 100%)",
              borderColor: "rgba(30,58,95,0.6)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="ocean-label">Username</label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/50"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="ocean-input pl-10"
                    placeholder="Masukkan username"
                    required
                    autoComplete="username"
                    style={{ background: "rgba(6,15,30,0.7)", borderColor: "rgba(30,58,95,0.8)" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="ocean-label">Password</label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/50"
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ocean-input pl-10 pr-12"
                    placeholder="Masukkan password"
                    required
                    autoComplete="current-password"
                    style={{ background: "rgba(6,15,30,0.7)", borderColor: "rgba(30,58,95,0.8)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400/50 hover:text-blue-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="text-red-400 text-sm">⚠ {error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="spin"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Masuk...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Masuk ke Panel Admin
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back */}
          <div className="text-center mt-6">
            <Link href="/" className="text-blue-400/50 text-xs hover:text-blue-300 transition-colors">
              ← Kembali ke halaman utama
            </Link>
          </div>

          {/* Branding */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <Waves size={12} className="text-white" />
            </div>
            <span className="text-blue-400/30 text-xs">Universitas Khairun</span>
          </div>
        </div>
      </div>
    </>
  );
}

