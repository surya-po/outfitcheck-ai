"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { buildOutfitCombinations } from "@/lib/mix-match-engine/outfit-builder";
import { MixMatchProduct, MixMatchResult, OutfitFilters } from "@/lib/mix-match-engine/outfit-types";
import { normalizeProfile } from "@/lib/product-matching-engine/normalize-profile";

/**
 * Main server action for the Mix & Match feature.
 *
 * Workflow:
 *  1. Authenticate user.
 *  2. Fetch the user's latest body scan (fashionAnalysisJson).
 *  3. Fetch all valid Marketplace products (PUBLISHED, stock > 0, boutique verified).
 *  4. Run outfit builder (which internally uses Product Matching Engine).
 *  5. Return top 5 outfits — NOT saved to database.
 */
export async function generateOutfitCombinations(
  filters?: OutfitFilters
): Promise<MixMatchResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      outfits: [],
      profile: null,
      hasBodyScan: false,
      totalProductsConsidered: 0,
    };
  }

  // Step 2: Get latest scan
  const latestScan = await prisma.scanHistory.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      fashionAnalysisJson: true,
      geminiAnalysisJson: true,
    },
  });

  if (!latestScan || !latestScan.fashionAnalysisJson) {
    return {
      outfits: [],
      profile: null,
      hasBodyScan: false,
      totalProductsConsidered: 0,
    };
  }

  const fashionProfile = latestScan.fashionAnalysisJson as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const normalizedProfile = normalizeProfile(fashionProfile);

  // Step 3: Fetch all valid products from the marketplace
  const dbProducts = await prisma.product.findMany({
    where: {
      productStatus: "PUBLISHED",
      stock: { gt: 0 },
      boutique: { status: "VERIFIED" },
    },
    include: {
      boutique: {
        select: { id: true, name: true, verified: true },
      },
    },
  });

  if (dbProducts.length === 0) {
    return {
      outfits: [],
      profile: normalizedProfile,
      hasBodyScan: true,
      totalProductsConsidered: 0,
    };
  }

  // Step 4: Map to MixMatchProduct format
  const products: MixMatchProduct[] = dbProducts.map((p) => ({
    // ScoredProduct defaults (will be filled by engine)
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    thumbnail: p.thumbnail || p.image || "",
    compatibilityScore: 0,
    confidenceLevel: "Medium" as const,
    recommendationReason: "",
    matchedAttributes: {
      bodyShape: false,
      skinTone: false,
      style: false,
      season: false,
      color: false,
      fit: false,
      gender: false,
      persona: false,
    },
    stock: p.stock || 0,
    updatedAt: p.updatedAt,
    createdAt: p.createdAt,
    // MixMatch extra fields
    boutiqueId: p.boutique?.id,
    boutiqueName: p.boutique?.name,
    boutiqueVerified: p.boutique?.verified,
    discount: p.discountPrice,
    images: p.images,
    gender: p.gender || undefined,
    productStatus: p.productStatus,
    style: p.style,
    material: p.material || undefined,
    colors: p.colors,
    sizes: p.sizes,
    fit: p.fit,
    season: p.season,
    description: p.description,
  }));

  // Step 5 & 6: Build and score outfit combinations
  const outfits = buildOutfitCombinations(fashionProfile, products, filters, 5);

  return {
    outfits,
    profile: normalizedProfile,
    hasBodyScan: true,
    totalProductsConsidered: products.length,
  };
}

/**
 * Saves all products in an outfit to the user's wardrobe (SavedOutfit).
 * Saves each product individually, skipping duplicates.
 */
export async function saveOutfitToWardrobe(
  productIds: string[],
  outfitScore: number,
  outfitExplanation: string
): Promise<{ success: boolean; saved: number; skipped: number }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Ensure user exists in Prisma
  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email || `user-${user.id}@example.com` },
  });

  let saved = 0;
  let skipped = 0;

  for (const productId of productIds) {
    const existing = await prisma.savedOutfit.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (existing) {
      skipped++;
    } else {
      await prisma.savedOutfit.create({
        data: {
          userId: user.id,
          productId,
          compatibilityScore: outfitScore,
          recommendationReason: outfitExplanation,
        },
      });
      saved++;
    }
  }

  return { success: true, saved, skipped };
}
