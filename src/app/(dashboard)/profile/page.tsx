import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { User, ScanFace, Heart, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { StatisticCard } from "@/components/ui/StatisticCard";
import { EditableProfileForm } from "@/components/profile/EditableProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return notFound();
  }

  let user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      profile: true,
      _count: {
        select: {
          scanHistories: true,
          savedOutfits: true,
        },
      },
    },
  });

  if (!user) {
    // Auto-create user and profile if they don't exist yet
    user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email || "",
        profile: {
          create: {}
        }
      },
      include: {
        profile: true,
        _count: {
          select: {
            scanHistories: true,
            savedOutfits: true,
          },
        },
      },
    });
  }

  const latestScan = await prisma.scanHistory.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const profile = user.profile;
  const memberSince = format(new Date(user.createdAt), "MMMM yyyy", { locale: localeId });

  const latestScanDateStr = latestScan 
    ? format(new Date(latestScan.createdAt), "dd MMM yyyy, HH:mm", { locale: localeId }) 
    : "Belum ada hasil scan.";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fashionAnalysis = latestScan?.fashionAnalysisJson as any;
  const latestBodyShape = fashionAnalysis?.shape?.shape || "-";
  const latestAiScore = latestScan?.aiScore ? Math.round(latestScan.aiScore) : "-";

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-500 space-y-8">
      
      {/* Main Info Grid */}
      <EditableProfileForm
        profile={profile}
        userEmail={user.email}
        memberSince={memberSince}
        latestScanData={{
          latestBodyShape,
          latestAiScore,
          latestScanDateStr
        }}
      />

      {/* Statistics Section */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 px-1">Statistik Aktivitas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatisticCard
            title="Total Body Scans"
            value={user._count.scanHistories}
            icon={<ScanFace className="w-5 h-5" />}
          />
          <StatisticCard
            title="Total Saved Outfits"
            value={user._count.savedOutfits}
            icon={<Heart className="w-5 h-5" />}
          />
          <StatisticCard
            title="Scan Terakhir"
            value={latestScanDateStr}
            icon={<Clock className="w-5 h-5" />}
          />
        </div>
      </div>
      
    </div>
  );
}


