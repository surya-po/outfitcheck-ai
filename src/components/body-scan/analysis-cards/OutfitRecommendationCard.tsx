"use client";

import { Sparkles, CheckCircle2 } from "lucide-react";
import { FullOutfit } from "@/lib/outfit-engine/outfit-service";

export function OutfitRecommendationCard({ outfits }: { outfits: FullOutfit[] }) {
  if (!outfits || outfits.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-sm backdrop-blur-sm sm:col-span-2 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Rekomendasi Kombinasi Outfit Lengkap</h2>
          <p className="text-xs text-white/60">Gagasan padu padan outfit untuk bentuk tubuh Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {outfits.map((outfit, idx) => (
          <div 
            key={idx}
            className="flex flex-col bg-black/20 border border-white/5 hover:border-[#EC4899]/30 rounded-xl p-4 transition-colors relative"
          >
            <div className="absolute top-4 right-4 bg-[#EC4899]/20 text-[#F472B6] text-[10px] font-bold px-2 py-1 rounded-md border border-[#EC4899]/20">
              {outfit.matchScore}% Cocok
            </div>
            
            <div className="mb-4 pr-16">
              <div className="text-[10px] uppercase tracking-wider text-[#EC4899] font-bold mb-1">
                {outfit.style}
              </div>
              <h3 className="text-white font-bold text-base leading-tight">
                {outfit.name}
              </h3>
            </div>
            
            <p className="text-xs text-white/70 mb-4 flex-1">
              {outfit.description}
            </p>
            
            <div className="bg-white/5 rounded-lg p-3 mt-auto">
              <ul className="space-y-2">
                {outfit.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-xs text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#EC4899] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
