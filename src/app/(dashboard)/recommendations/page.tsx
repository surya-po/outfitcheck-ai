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
  const analysis = scan?.fashionAnalysisJson as any;
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
                <Button className="mt-4 rounded-[var(--radius-button)] shadow-sm">
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
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Rekomendasi Outfit Anda
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Berdasarkan hasil analisis scan tubuh terbaru Anda.
        </p>
      </div>

      <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-card to-muted border border-border/60 p-4 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 gap-6">
          <RecommendationCard 
            result={recommendation} 
            products={matchedProducts || []}
          />

          {shape && (
            <OutfitRecommendationCard 
              outfits={generateOutfitRecommendations(analysis, gemini?.isWearingHijab)}
            />
          )}
        </div>
      </div>
    </div>
  );
}


