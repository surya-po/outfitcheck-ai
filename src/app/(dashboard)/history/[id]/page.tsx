import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BodyShapeCard } from "@/components/body-scan/analysis-cards/BodyShapeCard";
import { ProportionsCard } from "@/components/body-scan/analysis-cards/ProportionsCard";

import { AiVisionCard } from "@/components/body-scan/analysis-cards/AiVisionCard";
import { RecommendationCard } from "@/components/body-scan/analysis-cards/RecommendationCard";
import { OutfitRecommendationCard } from "@/components/body-scan/analysis-cards/OutfitRecommendationCard";
import { generateOutfitRecommendations } from "@/lib/outfit-engine/outfit-service";

export const dynamic = "force-dynamic";

export default async function HistoryDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const scan = await prisma.scanHistory.findUnique({
    where: { id: params.id, userId: user.id }
  });

  if (!scan) {
    return notFound();
  }

  const d = new Date(scan.createdAt);
  const dateStr = format(d, "dd MMMM yyyy", { locale: localeId });
  const timeStr = format(d, "HH:mm", { locale: localeId });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shape = (scan.fashionAnalysisJson as any).shape;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proportion = (scan.fashionAnalysisJson as any).proportion;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sizing = (scan.fashionAnalysisJson as any).sizing;

  const profile = {
    shape,
    proportion,
    sizing,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    colorAnalysis: scan.geminiAnalysisJson as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recommendation: scan.recommendationJson as any,
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <Link href="/history" className="inline-flex items-center text-gray-500 hover:text-[#EC4899] font-medium text-sm mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Riwayat
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E2D] tracking-tight">Detail Analisis</h1>
          <p className="text-sm text-gray-500 mt-1">Disimpan pada {dateStr} pukul {timeStr}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image & Measurements (Mocked visual representation for history) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#FDF2F8] bg-white p-4 sm:p-5 shadow-sm">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scan.capturedImageUrl}
                alt={`Scan ${dateStr}`}
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }} // Mirror to match camera behavior
              />
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium border border-white/10">
                Skor AI: {scan.aiScore ? Math.round(scan.aiScore) : "-"}
              </div>
            </div>
          </div>
          
          {/* We could render MeasurementPanel here if we pass scan.measurementsJson, but to keep it simple, we reuse analysis cards */}
        </div>
        
        {/* Right Column: AI Analysis Cards */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-gradient-to-br from-[#1E1E2D] to-gray-900 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-white font-bold text-xl mb-4">Profil Fashion AI Tersimpan</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.shape && <BodyShapeCard result={profile.shape} />}
              {profile.proportion && <ProportionsCard result={profile.proportion} />}

              
              {profile.colorAnalysis && (
                <div className="sm:col-span-2">
                  <AiVisionCard result={profile.colorAnalysis} />
                </div>
              )}

              {profile.recommendation && (
                <div className="sm:col-span-2 mt-4">
                  {/* Since RecommendationCard uses RecommendationProfile natively, this works seamlessly */}
                  <RecommendationCard 
                    result={profile.recommendation} 
                    products={(scan.matchedProductsJson as any) || []}
                  />
                </div>
              )}

              {profile.shape && (
                <OutfitRecommendationCard 
                  outfits={generateOutfitRecommendations(
                    profile.shape.shape, 
                    profile.colorAnalysis?.gender, 
                    profile.colorAnalysis?.isWearingHijab
                  )}
                />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
