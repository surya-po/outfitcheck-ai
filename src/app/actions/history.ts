"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { uploadBase64Image } from "@/lib/supabase/storage";
import { revalidatePath } from "next/cache";
import { notificationService } from "@/lib/notification-service";

interface SaveScanPayload {
  capturedImageBase64: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  measurementsJson: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fashionAnalysisJson: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geminiAnalysisJson: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recommendationJson: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchedProductsJson: any;
  aiScore: number;
}

export async function saveScanHistory(payload: SaveScanPayload) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Upload image to Supabase Storage
    const fileName = `${user.id}/${Date.now()}.jpg`;
    const imageUrl = await uploadBase64Image(
      payload.capturedImageBase64,
      "scans",
      fileName
    );

    // Derive tags from gemini analysis & recommendation
    const tags = [
      payload.geminiAnalysisJson?.seasonalColor,
      payload.fashionAnalysisJson?.shape?.shape,
      payload.recommendationJson?.primaryStyle
    ].filter(Boolean);

    // Ensure the user exists in our Prisma database 
    // (handles cases where DB was reset but auth cookie remained)
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email || `user-${user.id}@example.com`,
      }
    });

    // Save to Database
    const history = await prisma.scanHistory.create({
      data: {
        userId: user.id,
        capturedImageUrl: imageUrl,
        measurementsJson: payload.measurementsJson,
        fashionAnalysisJson: payload.fashionAnalysisJson,
        geminiAnalysisJson: payload.geminiAnalysisJson,
        recommendationJson: payload.recommendationJson,
        matchedProductsJson: payload.matchedProductsJson,
        aiScore: payload.aiScore,
        tags: tags,
      }
    });

    // Track Recommendations in Analytics
    try {
      if (Array.isArray(payload.matchedProductsJson)) {
        const recommendationsData = payload.matchedProductsJson.map((product: any) => ({
          userId: user.id,
          productId: product.id,
          scanHistoryId: history.id,
          source: "BODY_SCAN" as const,
          score: product.compatibilityScore || null,
          reason: product.recommendationReason || null
        }));

        if (recommendationsData.length > 0) {
          await prisma.productRecommendation.createMany({
            data: recommendationsData,
            skipDuplicates: true
          });
        }
      }
    } catch (analyticsError) {
      console.error("Failed to track product recommendations:", analyticsError);
      // Do not throw, let the main scan history saving succeed
    }

    // Dispatch Notifications
    await notificationService.notifyBodyScan(user.id, history.id);
    await notificationService.notifyAiAnalysis(user.id, history.id);

    revalidatePath("/history");
    revalidatePath("/dashboard");
    return { success: true, history };
  } catch (error: any) {
    console.error("saveScanHistory error:", error);
    return { success: false, error: error?.message || "Unknown error occurred" };
  }
}

export async function toggleFavorite(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.scanHistory.updateMany({
    where: { id, userId: user.id },
    data: { isFavorite: !currentStatus }
  });
  revalidatePath("/history");
  revalidatePath("/dashboard");
  return true;
}

export async function deleteScanHistory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.scanHistory.deleteMany({
    where: { id, userId: user.id }
  });
  revalidatePath("/history");
  revalidatePath("/dashboard");
  return true;
}

export async function deleteAllScanHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.scanHistory.deleteMany({
    where: { userId: user.id }
  });
  revalidatePath("/history");
  revalidatePath("/dashboard");
  return true;
}

export async function getScanHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const histories = await prisma.scanHistory.findMany({
    where: { userId: user.id },
    orderBy: [
      { isFavorite: "desc" },
      { createdAt: "desc" }
    ]
  });

  return histories;
}
