import { prisma } from "@/lib/prisma";
import { ConversationContext } from "./assistant-types";

export async function buildConversationContext(
  userId: string,
  userMessage: string
): Promise<ConversationContext> {
  // Check if we need to load saved outfits
  const messageLower = userMessage.toLowerCase();
  const wantsWardrobe =
    messageLower.includes("outfit favorit") ||
    messageLower.includes("outfit tersimpan") ||
    messageLower.includes("wardrobe saya") ||
    messageLower.includes("koleksi saya");

  // Fetch basic user profile
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId },
    select: {
      firstName: true,
      gender: true,
      heightCm: true,
      weightKg: true,
    },
  });

  // Fetch latest scan — includes full fashionAnalysisJson (Fashion Profile)
  const latestScan = await prisma.scanHistory.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      measurementsJson: true,
      fashionAnalysisJson: true,
      geminiAnalysisJson: true,
      recommendationJson: true,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let savedOutfits: any[] = [];
  if (wantsWardrobe) {
    // Only load up to 10 favorite/saved outfits
    const saved = await prisma.savedOutfit.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            name: true,
            category: true,
            style: true,
            colors: true,
          },
        },
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    });
    savedOutfits = saved.map((s) => ({
      name: s.product.name,
      category: s.product.category,
      style: s.product.style,
      colors: s.product.colors,
      notes: s.notes,
    }));
  }

  const hasScanData = !!latestScan;

  // Extract Fashion Profile fields from fashionAnalysisJson (Single Source of Truth)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fashionJson = latestScan?.fashionAnalysisJson as any;
  const scanGender: string | undefined =
    fashionJson?.gender || fashionJson?.colorAnalysis?.gender;
  const genderConfidence: number | undefined =
    fashionJson?.genderConfidence || fashionJson?.colorAnalysis?.genderConfidence;
  const fashionPersona: string | undefined =
    fashionJson?.fashionPersona || fashionJson?.colorAnalysis?.fashionPersona;
  const skinTone: string | undefined = fashionJson?.colorAnalysis?.skinTone;
  const undertone: string | undefined = fashionJson?.colorAnalysis?.undertone;
  const recommendedColors = fashionJson?.colorAnalysis?.recommendedColors;

  return {
    hasScanData,
    userProfile: userProfile
      ? {
          firstName: userProfile.firstName || undefined,
          gender: userProfile.gender || undefined,
          heightCm: userProfile.heightCm || undefined,
          weightKg: userProfile.weightKg || undefined,
        }
      : undefined,
    latestScan: latestScan
      ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          bodyShape: (latestScan.fashionAnalysisJson as any)?.shape?.shape,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          proportions: (latestScan.fashionAnalysisJson as any)?.proportion,
          measurements: latestScan.measurementsJson,
          geminiAnalysis: latestScan.geminiAnalysisJson,
          recommendation: latestScan.recommendationJson,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          clothingSize: (latestScan.fashionAnalysisJson as any)?.sizing,
          // Fashion Profile fields — Single Source of Truth
          gender: scanGender,
          genderConfidence,
          fashionPersona,
          skinTone,
          undertone,
          recommendedColors,
        }
      : undefined,
    savedOutfits: wantsWardrobe ? savedOutfits : undefined,
  };
}
