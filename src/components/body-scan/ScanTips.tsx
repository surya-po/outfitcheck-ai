"use client";

import { Check, Lightbulb } from "lucide-react";

const tips = [
  "Berdiri 2 meter dari kamera",
  "Menghadap langsung ke kamera",
  "Pastikan seluruh tubuh terlihat di layar",
  "Pastikan pencahayaan cukup dan merata",
  "Singkirkan benda yang menghalangi tubuh Anda",
  "Gunakan pakaian pas badan untuk hasil terbaik",
];

export function ScanTips() {
  return (
    <div className="rounded-[var(--radius-card)] border border-[#FDF2F8] bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-500">
          <Lightbulb className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold text-[#1E1E2D]">
          Tips Scan
        </h3>
      </div>
      <div className="space-y-2.5">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-2.5 group"
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#FDF2F8] text-[#EC4899] shrink-0 mt-0.5 transition-colors group-hover:bg-[#EC4899] group-hover:text-white">
              <Check className="w-3 h-3" />
            </div>
            <span className="text-sm text-gray-600 leading-relaxed">
              {tip}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


