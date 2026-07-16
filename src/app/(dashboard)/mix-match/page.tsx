import { Metadata } from "next";
import { generateOutfitCombinations } from "@/app/actions/mix-match";
import { MixMatchClient } from "@/components/mix-match/MixMatchClient";

export const metadata: Metadata = {
  title: "AI Mix & Match - OutfitCheck AI",
  description:
    "Biarkan AI menyusun kombinasi outfit lengkap yang cocok untuk bentuk tubuh dan skin tone Anda dari katalog Boutique Partner.",
};

export default async function MixMatchPage() {
  // Pre-generate outfits on the server for the initial load
  const initialResult = await generateOutfitCombinations();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <MixMatchClient initialResult={initialResult} />
    </div>
  );
}


