"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { normalizeProfile } from "@/lib/product-matching-engine/normalize-profile";
import { calculateCompatibilityScore } from "@/lib/product-matching-engine/calculate-score";
import { NormalizedProfile, ProductData } from "@/lib/product-matching-engine/types";

// ==========================================
// TYPES
// ==========================================

export interface MarketplaceSearchParams {
  q?: string;
  category?: string;
  style?: string;
  gender?: string;
  color?: string;
  season?: string;
  boutiqueId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "newest" | "best_match" | "popular" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  style: string;
  price: number;
  discountPrice: number | null;
  image: string;
  thumbnail: string | null;
  colors: string[];
  sizes: string[];
  stock: number | null;
  boutique: {
    id: string;
    name: string;
    verified: boolean;
  } | null;
  // AI fields attached later
  compatibilityScore?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchedAttributes?: any;
}

// ==========================================
// HELPERS
// ==========================================

/**
 * Gets the current user's latest ScanHistory and normalizes it.
 * Returns null if no scan exists.
 * Includes gender from Fashion Profile as Single Source of Truth.
 */
async function getUserNormalizedProfile(userId: string): Promise<NormalizedProfile | null> {
  const latestScan = await prisma.scanHistory.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { fashionAnalysisJson: true }
  });

  if (!latestScan || !latestScan.fashionAnalysisJson) return null;

  try {
    return normalizeProfile(latestScan.fashionAnalysisJson as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  } catch (error) {
    console.error("Error normalizing profile:", error);
    return null;
  }
}

// ==========================================
// ACTIONS
// ==========================================

export async function getMarketplaceProducts(params: MarketplaceSearchParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  // Build Prisma Where clause
  const where: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
    productStatus: "PUBLISHED",
    stock: { gt: 0 },
    boutique: {
      status: "VERIFIED"
    }
  };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { boutique: { name: { contains: params.q, mode: "insensitive" } } },
      { category: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    where.categoryRel = { slug: params.category };
  }
  if (params.style) where.style = { contains: params.style, mode: "insensitive" };
  if (params.season) where.season = { contains: params.season, mode: "insensitive" };
  if (params.color) where.colors = { hasSome: [params.color] };
  if (params.boutiqueId) where.boutiqueId = params.boutiqueId;

  // Gender filter:
  // If user explicitly passes a gender filter (from URL params), honor it.
  // Otherwise, the gender filter will be applied post-query via AI scoring.
  // (We avoid a hard WHERE gender = X so products without gender field still appear)
  if (params.gender) {
    where.OR = [
      { gender: { equals: params.gender, mode: "insensitive" } },
      { gender: { equals: "Unisex", mode: "insensitive" } },
      { gender: null },
    ];
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = parseInt(params.minPrice);
    if (params.maxPrice) where.price.lte = parseInt(params.maxPrice);
  }

  // Build Sort clause
  let orderBy: any = { createdAt: "desc" }; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (params.sort === "price_asc") orderBy = { price: "asc" };
  if (params.sort === "price_desc") orderBy = { price: "desc" };
  if (params.sort === "popular") {
    orderBy = { savedOutfits: { _count: "desc" } };
  }

  // 1. Database Query: Filtering & Pagination
  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: params.sort === "best_match" ? { createdAt: "desc" } : orderBy,
      skip,
      take: limit,
      include: {
        boutique: {
          select: { id: true, name: true, verified: true, status: true }
        }
      }
    }),
    prisma.product.count({ where })
  ]);

  // 2. AI Compatibility Calculation (Only for displayed products)
  let userProfile: NormalizedProfile | null = null;
  if (user) {
    userProfile = await getUserNormalizedProfile(user.id);
  }

  const enrichedProducts: MarketplaceProduct[] = products.map((p) => {
    let aiData: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (userProfile) {
      // Map to ProductData format required by calculate-score.ts
      // Include gender so the scoring engine can apply gender matching
      const productData: ProductData = {
        id: p.id,
        name: p.name,
        category: p.category,
        style: p.style,
        fit: p.fit,
        colors: p.colors,
        season: p.season || null,
        recommendedBodyShapes: p.recommendedBodyShapes,
        recommendedSkinTones: p.recommendedSkinTones,
        gender: p.gender || null, // Pass gender for gender-aware scoring
        price: p.price,
        thumbnail: p.thumbnail,
        image: p.image,
        stock: p.stock || 0,
        productStatus: p.productStatus,
        updatedAt: p.updatedAt,
        createdAt: p.createdAt,
        boutique: { status: p.boutique?.status || "VERIFIED" },
      };

      const scoreResult = calculateCompatibilityScore(userProfile, productData);
      aiData = {
        compatibilityScore: scoreResult.score,
        matchedAttributes: scoreResult.matchedAttributes
      };
    }

    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      style: p.style,
      price: p.price,
      discountPrice: p.discountPrice,
      image: p.image,
      thumbnail: p.thumbnail,
      colors: p.colors,
      sizes: p.sizes,
      stock: p.stock,
      boutique: p.boutique,
      ...aiData
    };
  });

  // 3. Post-Pagination Sort for Best Match
  // Gender-matched products always appear higher when user profile is available
  if (params.sort === "best_match" && userProfile) {
    enrichedProducts.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
  } else if (!params.gender && userProfile?.gender) {
    // Auto-sort: gender-matched products first even without explicit sort param
    enrichedProducts.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aMatched = (a.matchedAttributes as any)?.gender ? 1 : 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bMatched = (b.matchedAttributes as any)?.gender ? 1 : 0;
      return bMatched - aMatched;
    });
  }

  return {
    products: enrichedProducts,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      limit
    }
  };
}

export async function getMarketplaceProductDetail(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const product = await prisma.product.findUnique({
    where: { 
      id,
      productStatus: "PUBLISHED",
      boutique: { status: "VERIFIED" }
    },
    include: {
      boutique: true,
      categoryRel: true
    }
  });

  if (!product) return null;

  let aiData = null;
  if (user) {
    const userProfile = await getUserNormalizedProfile(user.id);
    if (userProfile) {
      const productData = {
        style: product.style,
        fit: product.fit,
        colors: product.colors,
        season: product.season || null,
        recommendedBodyShapes: product.recommendedBodyShapes,
        recommendedSkinTones: product.recommendedSkinTones
      } as unknown as ProductData;
      
      const scoreResult = calculateCompatibilityScore(userProfile, productData);
      aiData = {
        score: scoreResult.score,
        attributes: scoreResult.matchedAttributes,
        profile: userProfile
      };
    }
  }

  // Check if saved
  let isSaved = false;
  if (user) {
    const saved = await prisma.savedOutfit.findUnique({
      where: { userId_productId: { userId: user.id, productId: product.id } }
    });
    isSaved = !!saved;
  }

  return {
    product,
    aiData,
    isSaved
  };
}

export async function getRelatedProducts(productId: string, categoryId?: string | null, boutiqueId?: string | null, limit: number = 4) {
  // Fetch a mix of same boutique and same category
  const products = await prisma.product.findMany({
    where: {
      id: { not: productId },
      productStatus: "PUBLISHED",
      stock: { gt: 0 },
      OR: [
        { categoryId: categoryId || undefined },
        { boutiqueId: boutiqueId || undefined }
      ]
    },
    take: limit,
    include: { boutique: { select: { id: true, name: true, verified: true } } },
    orderBy: { createdAt: "desc" }
  });

  // Calculate scores for related products too
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userProfile: NormalizedProfile | null = null;
  if (user) {
    userProfile = await getUserNormalizedProfile(user.id);
  }

  return products.map(p => {
    let score = 0;
    if (userProfile) {
      const pd = {
        style: p.style, fit: p.fit, colors: p.colors, season: p.season || null,
        recommendedBodyShapes: p.recommendedBodyShapes, recommendedSkinTones: p.recommendedSkinTones
      } as unknown as ProductData;
      score = calculateCompatibilityScore(userProfile, pd).score;
    }
    return { ...p, compatibilityScore: score };
  });
}

export async function getBoutiqueProfile(boutiqueId: string) {
  return await prisma.boutique.findUnique({
    where: { id: boutiqueId, verified: true },
    include: {
      user: { select: { profile: true } }
    }
  });
}
