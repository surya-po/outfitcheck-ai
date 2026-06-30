"use client";

import { Ruler } from "lucide-react";

interface HeightBadgeProps {
  isActive: boolean;
  estimatedHeight?: number;
  isEstimating: boolean;
}

export function HeightBadge({ isActive, estimatedHeight, isEstimating }: HeightBadgeProps) {
  return (
    <div
      className={`absolute top-4 right-4 z-20 transition-all duration-700 ${
        isActive
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#EC4899]/20 text-[#F472B6]">
          <Ruler className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
            Tinggi Badan
          </span>
          {isEstimating ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#F472B6] animate-pulse">
                Mengestimasi...
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-white">
              {estimatedHeight !== undefined ? `${estimatedHeight} cm` : "-- cm"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
