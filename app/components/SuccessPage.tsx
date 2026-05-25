"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Download, Home, Mail } from "lucide-react";

interface Props {
  namaLengkap: string;
  email: string;
}

export default function SuccessPage({ namaLengkap, email }: Props) {
  const [nomorPendaftaran] = useState(() => {
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 90000) + 10000;
    return `UNKHAIR-IK-${year}-${rand}`;
  });

  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`text-center space-y-6 transition-all duration-700 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-teal-500/20 flex items-center justify-center">
            <CheckCircle size={48} className="text-teal-400" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-teal-400/30 animate-ping" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Pendaftaran Berhasil!
        </h2>
        <p className="text-blue-300/70 text-sm">
          Selamat, {namaLengkap.split(" ")[0]}! Formulir pendaftaran Anda telah berhasil dikirim.
        </p>
      </div>

      {/* Nomor Pendaftaran */}
      <div className="success-card">
        <p className="text-blue-400/60 text-xs uppercase tracking-widest mb-2">
          Nomor Pendaftaran
        </p>
        <p className="text-2xl font-mono font-bold text-cyan-300 glow-cyan">
          {nomorPendaftaran}
        </p>
        <p className="text-blue-400/50 text-xs mt-2">
          Simpan nomor ini untuk keperluan verifikasi
        </p>
      </div>

      {/* Info */}
      <div className="glass-card-light p-5 text-left space-y-3">
        <h3 className="text-sm font-semibold text-cyan-300 mb-3">Langkah Selanjutnya</h3>
        {[
          {
            step: "1",
            title: "Cek Email",
            desc: `Konfirmasi pendaftaran telah dikirim ke ${email}`,
          },
          {
            step: "2",
            title: "Verifikasi Berkas",
            desc: "Tim admisi akan memverifikasi berkas Anda dalam 3–5 hari kerja",
          },
          {
            step: "3",
            title: "Jadwal Seleksi",
            desc: "Pengumuman jadwal tes dan wawancara akan dikirimkan melalui email",
          },
          {
            step: "4",
            title: "Pengumuman",
            desc: "Hasil seleksi akan diumumkan sesuai jadwal akademik",
          },
        ].map((item) => (
          <div key={item.step} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-cyan-400 text-xs font-bold">{item.step}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-100">{item.title}</p>
              <p className="text-xs text-blue-400/60">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-900/30 border border-blue-700/30">
        <Mail size={16} className="text-blue-400 flex-shrink-0" />
        <p className="text-xs text-blue-300/70">
          Pertanyaan? Hubungi kami di{" "}
          <span className="text-cyan-400 font-medium">admisi.pascasarjana@unkhair.ac.id</span>
          {" "}atau telepon{" "}
          <span className="text-cyan-400 font-medium">(0921) 3110901</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => window.print()}
          className="btn-secondary text-sm py-3 px-6"
        >
          <Download size={16} />
          Cetak Bukti
        </button>
        <a href="/" className="btn-primary text-sm py-3 px-6">
          <Home size={16} />
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
