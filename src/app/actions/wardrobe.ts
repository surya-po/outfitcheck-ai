"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product } from "@/lib/product-matching-engine/product-types";
import { notificationService } from "@/lib/notification-service";

/**
 * Toggles a product in the user's SavedOutfit collection.
 */
export async function toggleFavoriteOutfit(
  productId: string,
  compatibilityScore?: number,
  recommendationReason?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Ensure user exists in Prisma
  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email || `user-${user.id}@example.com`,
    }
  });

  const existing = await prisma.savedOutfit.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.savedOutfit.delete({
      where: { id: existing.id },
    });
    // Dispatch Notification
    await notificationService.notifyWardrobeRemoved(user.id, productId);
  } else {
    await prisma.savedOutfit.create({
      data: {
        userId: user.id,
        productId,
        compatibilityScore,
        recommendationReason,
      },
    });
    // Dispatch Notification
    await notificationService.notifyWardrobeAdded(user.id, productId);
  }

  revalidatePath("/collection");
  revalidatePath("/history");
  
  return !existing;
}

/**
 * Fetches the user's saved outfits, joined with the actual Product catalog details.
 */
export async function getSavedOutfits() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const savedOutfits = await prisma.savedOutfit.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          boutique: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map the DB Product + SavedOutfit data back to our Product interface
  return savedOutfits.map((saved) => {
    const dbProduct = saved.product;
    const product: Product = {
      id: dbProduct.id,
      name: dbProduct.name,
      brand: dbProduct.brand || undefined,
      category: dbProduct.category as any,
      style: dbProduct.style,
      fit: dbProduct.fit,
      material: dbProduct.material || undefined,
      colors: dbProduct.colors,
      sizes: dbProduct.sizes,
      gender: dbProduct.gender as any,
      season: dbProduct.season || undefined,
      description: dbProduct.description || undefined,
      price: dbProduct.price,
      image: dbProduct.image,
      stock: dbProduct.stock || undefined,
      status: dbProduct.status as any,
      compatibilityScore: saved.compatibilityScore || 0,
      recommendationReason: saved.recommendationReason || "",
      storeInfo: {
        isPartner: true,
        name: dbProduct.boutique?.name || "OutfitCheck AI Partner",
        instagram: dbProduct.boutique?.instagram || undefined,
        website: dbProduct.boutique?.website || undefined,
        phone: dbProduct.boutique?.phone || undefined,
        address: dbProduct.boutique?.address || undefined,
        mapsUrl: dbProduct.boutique?.mapsUrl || undefined,
        openingHours: dbProduct.boutique?.openingHours || undefined,
      },
    };
    return {
      savedOutfitId: saved.id,
      savedAt: saved.createdAt,
      product,
    };
  });
}

/**
 * Helper to fetch just a set of saved product IDs for UI hydration.
 */
export async function getSavedOutfitProductIds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const savedOutfits = await prisma.savedOutfit.findMany({
    where: { userId: user.id },
    select: { productId: true },
  });

  return savedOutfits.map((s) => s.productId);
}
