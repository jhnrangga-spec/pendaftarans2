"use client";

import { Check } from "lucide-react";

const STEPS = [
  { number: 1, label: "Data Pribadi" },
  { number: 2, label: "Riwayat Pendidikan" },
  { number: 3, label: "Berkas & Pernyataan" },
  { number: 4, label: "Konfirmasi" },
];

interface Props {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: Props) {
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="progress-track mb-6">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${isActive ? "step-active" : isCompleted ? "step-completed" : "step-inactive"}
                `}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.number}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block transition-colors duration-300 ${
                  isActive
                    ? "text-cyan-300"
                    : isCompleted
                    ? "text-teal-400"
                    : "text-blue-400/40"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
