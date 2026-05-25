"use client";

import { ReactNode } from "react";

interface Props {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export default function FormField({ label, error, required, children, hint }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="ocean-label">
        {label}
        {required && <span className="text-cyan-400 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-blue-400/50 text-xs mt-1">{hint}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
