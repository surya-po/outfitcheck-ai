"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  isDirty: boolean;
}

export function UnsavedChangesWarning({ isDirty }: Props) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return (
    <div className="flex items-center gap-2 mb-6">
      {isDirty ? (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-200">
          <AlertCircle className="w-4 h-4" />
          Perubahan belum disimpan
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          Semua perubahan telah disimpan
        </div>
      )}
    </div>
  );
}
