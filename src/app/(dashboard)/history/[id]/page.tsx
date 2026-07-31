import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft, Diamond, Ruler, Palette, Shirt, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

import { BodyShapeCard } from "@/components/body-scan/analysis-cards/BodyShapeCard";
import { ProportionsCard } from "@/components/body-scan/analysis-cards/ProportionsCard";
import { SizingCard } from "@/components/body-scan/analysis-cards/SizingCard";
import { AiVisionCard } from "@/components/body-scan/analysis-cards/AiVisionCard";
import { RecommendationCard } from "@/components/body-scan/analysis-cards/RecommendationCard";
import { OutfitRecommendationCard } from "@/components/body-scan/analysis-cards/OutfitRecommendationCard";
import { generateOutfitRecommendations } from "@/lib/outfit-engine/outfit-service";

export const dynamic = "force-dynamic";

function SectionHeader({ icon: Icon, title, description }: { icon: any, title: string, description?: string }) {
  return (
    <div className="flex flex-col items-center text-center mb-8 mt-16 first:mt-8">
      <div className="p-3 bg-secondary/30 rounded-full mb-4 text-primary ring-8 ring-secondary/10">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-heading font-bold text-foreground mb-2">{title}</h2>
      {description && <p className="text-sm text-muted-foreground max-w-lg">{description}</p>}
    </div>
  );
}

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
  const analysisData = scan.fashionAnalysisJson as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shape = analysisData.shape;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proportion = analysisData.proportion;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sizing = analysisData.sizing;

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
    <div className="max-w-3xl mx-auto pb-24 px-4 sm:px-0 animate-in fade-in-50 duration-500">
      
      {/* Hero */}
      <div className="flex justify-center mb-6">
        <Link href="/history" className="inline-flex items-center text-muted-foreground hover:text-primary font-medium text-sm transition-colors bg-secondary/20 px-4 py-2 rounded-[var(--radius-button)]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Riwayat
        </Link>
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground tracking-tight mb-3">AI Fashion Analysis</h1>
        <p className="text-sm text-muted-foreground">Analisis dilakukan pada {dateStr} pukul {timeStr}</p>
      </div>

      {/* Foto Scan */}
      <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-2 shadow-sm overflow-hidden mb-12 max-w-sm mx-auto">
        <div className="relative w-full aspect-[3/4] rounded-[20px] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scan.capturedImageUrl}
            alt={`Scan ${dateStr}`}
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground text-xs px-3 py-1.5 rounded-[var(--radius-button)] font-bold border border-border/60 shadow-sm flex items-center gap-1.5">
            <Diamond className="w-3.5 h-3.5 text-primary" />
            Skor AI: {scan.aiScore ? Math.round(scan.aiScore) : "-"}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Ringkasan AI (Color Analysis / Profil Fashion) */}
        {profile.colorAnalysis && (
          <>
            <SectionHeader icon={Palette} title="Fashion Profile" description="Identitas fashion unik yang mencerminkan karakter dan karakteristik fisik Anda." />
            <AiVisionCard result={profile.colorAnalysis} />
          </>
        )}

        {/* Body Measurements */}
        {(profile.shape || profile.proportion || profile.sizing) && (
          <>
            <SectionHeader icon={Ruler} title="Body Metrics" description="Pemetaan metrik tubuh Anda untuk menentukan potongan pakaian yang paling proporsional." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profile.shape && <BodyShapeCard result={profile.shape} />}
              {profile.proportion && <ProportionsCard result={profile.proportion} />}
              {profile.sizing && (
                <div className="sm:col-span-2">
                  <SizingCard result={profile.sizing} />
                </div>
              )}
            </div>
          </>
        )}

        {/* Product Recommendations */}
        {profile.recommendation && (
          <>
            <SectionHeader icon={Zap} title="Product Recommendations" description="Rekomendasi pakaian terbaik yang telah dikurasi khusus untuk proporsi tubuh Anda." />
            <RecommendationCard 
              result={profile.recommendation} 
              products={(scan.matchedProductsJson as any) || []}
            />
          </>
        )}

        {/* Outfit Recommendations */}
        {profile.shape && (
          <>
            <SectionHeader icon={Shirt} title="Outfit Suggestions" description="Inspirasi kombinasi gaya yang menonjolkan fitur terbaik Anda." />
            <OutfitRecommendationCard 
              outfits={generateOutfitRecommendations(
                analysisData.fashionProfile || analysisData,
                analysisData.isWearingHijab
              )}
            />
          </>
        )}
      </div>

      <div className="mt-16 flex justify-center">
        <Button asChild size="lg" className="rounded-[var(--radius-button)] w-full sm:w-auto min-w-[200px]">
          <Link href="/marketplace">
            Belanja Sekarang
          </Link>
        </Button>
      </div>

    </div>
  );
}


