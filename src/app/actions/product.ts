"use server";

import { prisma } from "@/lib/prisma";
import { FashionAnalysisProfile } from "@/lib/body-analysis-engine/analysis-types";
import { Product, StoreInfo } from "@/lib/product-matching-engine/product-types";
import { runMatchingEngine } from "@/lib/product-matching-engine/matching-engine";
import { ProductData } from "@/lib/product-matching-engine/types";

/**
 * Server action to match products for a given fashion profile.
 * Queries actual Boutique products and uses the Matching Engine to score them.
 */
export async function findBestMatchingProducts(profile: FashionAnalysisProfile): Promise<Product[]> {
  // 1. Query active products from Verified Boutiques
  const activeProducts = await prisma.product.findMany({
    where: {
      productStatus: "PUBLISHED",
      stock: { gt: 0 },
      boutique: {
        status: "VERIFIED"
      }
    },
    select: {
      id: true,
      name: true,
      category: true,
      style: true,
      fit: true,
      season: true,
      colors: true,
      sizes: true,
      recommendedBodyShapes: true,
      recommendedSkinTones: true,
      price: true,
      thumbnail: true,
      image: true,
      stock: true,
      productStatus: true,
      updatedAt: true,
      createdAt: true,
      boutiqueId: true,
      boutique: {
        select: {
          id: true,
          status: true,
          name: true,
          instagram: true,
          website: true,
          phone: true,
          address: true,
          mapsUrl: true,
          openingHours: true
        }
      }
    }
  });

  if (activeProducts.length === 0) {
    return [];
  }

  const productDataList: ProductData[] = activeProducts.map(p => ({
    ...p,
    stock: p.stock || 0,
    productStatus: p.productStatus || "DRAFT",
    boutique: {
      // boutique.verified=true was used in WHERE clause above,
      // so all results are verified. Map to VERIFIED string for matching engine.
      status: "VERIFIED"
    }
  }));

  // 2. Run Matching Engine
  const scoredProducts = runMatchingEngine(profile, productDataList, 10);

  // 3. Map back to Product interface expected by UI
  const finalProducts: Product[] = scoredProducts.map(sp => {
    // Find original product to extract boutique info
    const original = activeProducts.find(p => p.id === sp.id);

    return {
      id: sp.id,
      name: sp.name,
      category: sp.category as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      style: original?.style || "",
      fit: original?.fit || "",
      colors: original?.colors || [],
      sizes: original?.sizes || [],
      price: sp.price,
      image: sp.thumbnail || original?.image || "",
      status: "available",
      compatibilityScore: sp.compatibilityScore,
      confidenceLevel: sp.confidenceLevel,
      recommendationReason: sp.recommendationReason,
      storeInfo: {
        isPartner: true,
        name: original?.boutique?.name || "Fitcheck AI Partner",
        instagram: original?.boutique?.instagram || undefined,
        website: original?.boutique?.website || undefined,
        phone: original?.boutique?.phone || undefined,
        address: original?.boutique?.address || undefined,
        mapsUrl: original?.boutique?.mapsUrl || undefined,
        openingHours: original?.boutique?.openingHours || undefined,
        boutiqueId: original?.boutiqueId || undefined,
      }
    };
  });

  return finalProducts;
}
