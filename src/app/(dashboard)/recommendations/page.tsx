import { EmptyState } from "@/components/ui/EmptyState";
import { Sparkles, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { RecommendationCard } from "@/components/body-scan/analysis-cards/RecommendationCard";
import { OutfitRecommendationCard } from "@/components/body-scan/analysis-cards/OutfitRecommendationCard";
import { generateOutfitRecommendations } from "@/lib/outfit-engine/outfit-service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let scan = null;
  if (user) {
    scan = await prisma.scanHistory.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recommendation = scan?.recommendationJson as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shape = scan?.fashionAnalysisJson ? (scan.fashionAnalysisJson as any).shape : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchedProducts = scan?.matchedProductsJson as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gemini = scan?.geminiAnalysisJson as any;

  if (!scan || !recommendation || Object.keys(recommendation).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] animate-in fade-in-50 duration-500">
        <div className="w-full max-w-2xl">
          <EmptyState
            icon={Sparkles}
            title="Belum Ada Rekomendasi"
            description="Lakukan Body Scan terlebih dahulu untuk mendapatkan rekomendasi gaya dan outfit personal dari AI."
            action={
              <Link href="/body-scan">
                <Button className="mt-4 bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl">
                  Mulai Body Scan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E2D] tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#EC4899]" /> Rekomendasi Outfit Anda
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Berdasarkan hasil analisis scan tubuh terbaru Anda.
        </p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#1E1E2D] to-gray-900 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 gap-6">
          <RecommendationCard 
            result={recommendation} 
            products={matchedProducts || []}
          />

          {shape && (
            <OutfitRecommendationCard 
              outfits={generateOutfitRecommendations(shape.shape, gemini?.gender, gemini?.isWearingHijab)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
