import OceanBackground from "./components/OceanBackground";
import Link from "next/link";
import {
  Waves,
  Fish,
  Microscope,
  Anchor,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  MapPin,
  Clock,
  GraduationCap,
  Shield,
} from "lucide-react";

const KEUNGGULAN = [
  {
    icon: Microscope,
    title: "Riset Unggulan",
    desc: "Laboratorium canggih untuk penelitian oseanografi, biologi laut, dan ekosistem pesisir Maluku Utara.",
  },
  {
    icon: Users,
    title: "Dosen Berpengalaman",
    desc: "Tenaga pengajar bergelar Doktor dan Profesor dengan rekam jejak penelitian internasional.",
  },
  {
    icon: Award,
    title: "Akreditasi B",
    desc: "Program studi terakreditasi B oleh BAN-PT dengan kurikulum berbasis KKNI Level 8.",
  },
  {
    icon: Waves,
    title: "Lokasi Strategis",
    desc: "Terletak di Ternate, pusat Segitiga Karang Dunia — surga biodiversitas kelautan terkaya di bumi.",
  },
];

const PRODI_FOKUS = [
  { icon: Fish, label: "Biologi Kelautan" },
  { icon: Waves, label: "Oseanografi" },
  { icon: Anchor, label: "Teknologi Kelautan" },
  { icon: Microscope, label: "Manajemen Pesisir" },
];

export default function HomePage() {
  return (
    <>
      <OceanBackground />

      <div className="relative min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-blue-800/30 backdrop-blur-xl bg-blue-950/40">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Waves size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-400/60 leading-none">Universitas Khairun</p>
                <p className="text-sm font-bold text-blue-100 leading-tight">Pascasarjana Ilmu Kelautan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
                style={{
                  background: "rgba(14,165,233,0.08)",
                  color: "#38bdf8",
                  border: "1px solid rgba(14,165,233,0.25)",
                }}
              >
                <Shield size={15} />
                Login Admin
              </Link>
              <Link href="/daftar" className="btn-primary text-sm py-2.5 px-5">
                Daftar Sekarang
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm text-cyan-300 font-medium">
                Pendaftaran Gelombang II · TA 2025/2026
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                <span className="text-white">Program Magister</span>
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #00b4d8, #00e5c0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "none",
                  }}
                >
                  Ilmu Kelautan
                </span>
              </h1>
              <p className="text-xl text-blue-300/80 font-medium">
                Universitas Khairun · Ternate, Maluku Utara
              </p>
            </div>

            <p className="text-blue-300/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Jadilah bagian dari generasi penjaga laut. Pelajari, teliti, dan lestarikan
              kekayaan bahari Nusantara bersama para ahli terbaik di jantung Segitiga Karang Dunia.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: MapPin, text: "Ternate, Maluku Utara" },
                { icon: Clock, text: "4 Semester · 2 Tahun" },
                { icon: GraduationCap, text: "Gelar M.Si." },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/40 border border-blue-700/30"
                >
                  <Icon size={14} className="text-cyan-400" />
                  <span className="text-sm text-blue-200/70">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/daftar" className="btn-primary text-base py-4 px-8">
                Mulai Pendaftaran
                <ArrowRight size={18} />
              </Link>
              <a href="#info" className="btn-secondary text-base py-4 px-8">
                <BookOpen size={18} />
                Info Lengkap
              </a>
            </div>
          </div>
        </section>

        {/* Wave */}
        <div className="relative h-16 overflow-hidden">
          <svg viewBox="0 0 1440 60" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path
              d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,60 L0,60 Z"
              fill="rgba(10,22,40,0.5)"
            />
          </svg>
        </div>

        {/* Keunggulan */}
        <section id="info" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Mengapa Ilmu Kelautan Unkhair?</h2>
              <p className="text-blue-300/60 max-w-xl mx-auto">
                Pendidikan pascasarjana berkualitas tinggi dengan fasilitas riset terdepan dan jejaring akademik global.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {KEUNGGULAN.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass-card p-6 group hover:border-cyan-500/40 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} className="text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-blue-100 mb-2">{title}</h3>
                  <p className="text-sm text-blue-400/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Konsentrasi + Detail */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="glass-card p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Bidang Konsentrasi</h2>
                  <p className="text-blue-300/60 mb-6 leading-relaxed">
                    Empat konsentrasi dirancang sesuai kebutuhan riset dan industri kelautan nasional.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {PRODI_FOKUS.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-2 p-3 rounded-xl bg-blue-900/30 border border-blue-700/20">
                        <Icon size={16} className="text-teal-400" />
                        <span className="text-sm text-blue-200/80 font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "SKS Total", value: "36 SKS" },
                    { label: "Beban Tesis", value: "6 SKS" },
                    { label: "Masa Studi", value: "4 – 8 Semester" },
                    { label: "Bahasa Pengantar", value: "Bahasa Indonesia" },
                    { label: "Biaya Pendidikan", value: "Rp 8.500.000 / semester" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-blue-800/30 last:border-0">
                      <span className="text-blue-400/60 text-sm">{label}</span>
                      <span className="text-blue-100 font-semibold text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white mb-2">Jadwal Pendaftaran</h2>
              <p className="text-blue-300/60 text-sm">Gelombang II — Tahun Akademik 2025/2026</p>
            </div>
            <div className="relative">
              <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-400 via-teal-400 to-blue-600 hidden sm:block" />
              <div className="space-y-4">
                {[
                  { tanggal: "1 – 30 Juni 2025", kegiatan: "Pendaftaran Online", aktif: true },
                  { tanggal: "5 Juli 2025", kegiatan: "Batas Pengumpulan Berkas", aktif: false },
                  { tanggal: "10 – 12 Juli 2025", kegiatan: "Seleksi Administrasi", aktif: false },
                  { tanggal: "17 Juli 2025", kegiatan: "Tes Potensi Akademik", aktif: false },
                  { tanggal: "19 Juli 2025", kegiatan: "Wawancara", aktif: false },
                  { tanggal: "25 Juli 2025", kegiatan: "Pengumuman Hasil Seleksi", aktif: false },
                  { tanggal: "4 Agustus 2025", kegiatan: "Registrasi Mahasiswa Baru", aktif: false },
                ].map(({ tanggal, kegiatan, aktif }, i) => (
                  <div key={i} className="flex gap-4 sm:gap-6 items-start">
                    <div
                      className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold z-10 ${
                        aktif
                          ? "bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-900 shadow-lg shadow-cyan-500/30"
                          : "bg-blue-900/60 border border-blue-700/40 text-blue-400/50"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div
                      className={`flex-1 p-4 rounded-xl border transition-all ${
                        aktif
                          ? "bg-cyan-500/10 border-cyan-500/30"
                          : "bg-blue-900/20 border-blue-800/30"
                      }`}
                    >
                      <p className="text-xs text-blue-400/60 mb-0.5">{tanggal}</p>
                      <p className={`font-semibold text-sm ${aktif ? "text-cyan-200" : "text-blue-200/70"}`}>
                        {kegiatan}
                      </p>
                      {aktif && (
                        <span className="inline-block mt-1 text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                          Sedang Berlangsung
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Bottom */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass-card p-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={28} className="text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Siap Menjelajahi Lautan Ilmu?</h2>
              <p className="text-blue-300/60 mb-8 leading-relaxed">
                Daftarkan diri Anda sekarang dan jadilah bagian dari komunitas ilmuwan
                kelautan yang berkontribusi bagi keberlanjutan laut Indonesia.
              </p>
              <Link href="/daftar" className="btn-primary text-base py-4 px-10">
                Mulai Pendaftaran Online
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-blue-800/30 py-8 px-4">
          <div className="max-w-6xl mx-auto text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <Waves size={14} className="text-white" />
              </div>
              <span className="font-bold text-blue-100 text-sm">
                Universitas Khairun — Pascasarjana Ilmu Kelautan
              </span>
            </div>
            <p className="text-xs text-blue-400/40">
              Jl. Jati, Kelurahan Jati, Kota Ternate Selatan, Maluku Utara 97719
            </p>
            <p className="text-xs text-blue-400/30">
              © {new Date().getFullYear()} Universitas Khairun. Hak Cipta Dilindungi.
            </p>
            <Link
              href="/admin"
              className="text-xs text-blue-400/20 hover:text-blue-400/50 transition-colors mt-1 inline-block"
            >
              Admin
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
