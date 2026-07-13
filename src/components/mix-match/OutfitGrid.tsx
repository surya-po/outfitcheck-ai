"use client";

import { GeneratedOutfit } from "@/lib/mix-match-engine/outfit-types";
import { NormalizedProfile } from "@/lib/product-matching-engine/types";
import { OutfitCard } from "./OutfitCard";

interface Props {
  outfits: GeneratedOutfit[];
  profile: NormalizedProfile | null;
}

export function OutfitGrid({ outfits, profile }: Props) {
  if (outfits.length === 0) return null;

  const [best, ...alternatives] = outfits;

  return (
    <div className="space-y-8">
      {/* Best Match — full width */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-6 rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6]" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Best Match
          </h2>
        </div>
        <div className="max-w-2xl">
          <OutfitCard outfit={best} rank={0} profile={profile} />
        </div>
      </div>

      {/* Alternatives — 2 columns */}
      {alternatives.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Alternatif Outfit
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alternatives.map((outfit, i) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                rank={i + 1}
                profile={profile}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
