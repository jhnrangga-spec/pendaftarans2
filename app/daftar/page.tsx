"use client";

import { useState } from "react";
import OceanBackground from "../components/OceanBackground";
import StepIndicator from "../components/StepIndicator";
import Step1DataPribadi from "../components/Step1DataPribadi";
import Step2Pendidikan from "../components/Step2Pendidikan";
import Step3Berkas from "../components/Step3Berkas";
import Step4Konfirmasi from "../components/Step4Konfirmasi";
import SuccessPage from "../components/SuccessPage";
import { Step1Data, Step2Data, Step3Data } from "../lib/schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type AllFormData = Partial<Step1Data & Step2Data & Step3Data>;

export default function DaftarPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AllFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nomorPendaftaran, setNomorPendaftaran] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleStep1 = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2 = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep3 = (data: Step3Data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setSubmitError(json.message ?? "Gagal mengirim. Coba lagi.");
        return;
      }
      setNomorPendaftaran(json.nomorPendaftaran);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const STEP_TITLES: Record<number, { title: string; subtitle: string }> = {
    1: { title: "Data Pribadi", subtitle: "Lengkapi informasi diri Anda" },
    2: { title: "Riwayat Pendidikan", subtitle: "Data akademik dan pekerjaan" },
    3: { title: "Berkas & Pernyataan", subtitle: "Unggah dokumen dan buat pernyataan" },
    4: { title: "Konfirmasi Data", subtitle: "Periksa kembali sebelum mengirim" },
  };

  return (
    <>
      <OceanBackground />

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-blue-800/30 backdrop-blur-xl bg-blue-950/50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/"
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-blue-700/40 text-blue-400/70 hover:text-blue-200 hover:border-blue-600/60 transition-all"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-3 flex-1">
              <img src="/logo-unkhair.svg" alt="Logo Universitas Khairun" className="w-8 h-8" />
              <div>
                <p className="text-xs text-blue-400/50 leading-none">Universitas Khairun</p>
                <p className="text-sm font-bold text-blue-100 leading-tight">
                  Pendaftaran S2 Ilmu Kelautan
                </p>
              </div>
            </div>
            {!submitted && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/40 border border-blue-700/30">
                <span className="text-xs text-blue-400/60">Langkah</span>
                <span className="text-sm font-bold text-cyan-300">{step}</span>
                <span className="text-xs text-blue-400/40">/ 4</span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          {submitted ? (
            /* Success */
            <div className="max-w-2xl mx-auto py-8">
              <div className="glass-card p-8">
                <SuccessPage
                  namaLengkap={formData.namaLengkap ?? "Pendaftar"}
                  email={formData.email ?? ""}
                  nomorPendaftaran={nomorPendaftaran}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {/* Step header */}
              <div className="mb-8">
                <StepIndicator currentStep={step} />
                <div className="mt-6">
                  <h1 className="text-2xl font-bold text-white">{STEP_TITLES[step].title}</h1>
                  <p className="text-blue-300/60 text-sm mt-1">{STEP_TITLES[step].subtitle}</p>
                </div>
              </div>

              {/* Form card */}
              <div className="glass-card p-6 sm:p-8">
                {step === 1 && (
                  <Step1DataPribadi
                    defaultValues={formData}
                    onNext={handleStep1}
                  />
                )}
                {step === 2 && (
                  <Step2Pendidikan
                    defaultValues={formData}
                    onNext={handleStep2}
                    onBack={goBack}
                  />
                )}
                {step === 3 && (
                  <Step3Berkas
                    defaultValues={formData}
                    onNext={handleStep3}
                    onBack={goBack}
                  />
                )}
                {step === 4 && (
                  <>
                    <Step4Konfirmasi
                      data={formData}
                      onBack={goBack}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                    {submitError && (
                      <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                        ⚠ {submitError}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Help text */}
              <p className="text-center text-xs text-blue-400/40 mt-6">
                Butuh bantuan?{" "}
                <span className="text-cyan-500/70">admisi.pascasarjana@unkhair.ac.id</span>
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
