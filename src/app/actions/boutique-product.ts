"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ProductStatus } from "@prisma/client";

export async function getBoutiqueProducts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const boutique = await prisma.boutique.findFirst({
    where: { ownerId: user.id }
  });
  if (!boutique) return [];

  return await prisma.product.findMany({
    where: { boutiqueId: boutique.id },
    include: {
      categoryRel: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getProduct(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const boutique = await prisma.boutique.findFirst({
    where: { ownerId: user.id }
  });
  if (!boutique) return null;

  return await prisma.product.findFirst({
    where: { id, boutiqueId: boutique.id },
    include: {
      categoryRel: true
    }
  });
}

export async function createBoutiqueProduct(data: any) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const boutique = await prisma.boutique.findFirst({
      where: { ownerId: user.id }
    });
    if (!boutique) throw new Error("Boutique not found");

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });
    if (!category) throw new Error("Category not found");

    const product = await prisma.product.create({
      data: {
        boutiqueId: boutique.id,
        categoryId: data.categoryId,
        category: category.name, // For backward compatibility
        name: data.name,
        brand: data.brand || null,
        description: data.description,
        gender: data.gender,
        style: data.style,
        fit: data.fit,
        material: data.material,
        price: data.price,
        discountPrice: data.discountPrice,
        stock: data.stock,
        thumbnail: data.thumbnail,
        image: data.thumbnail || "", // Fallback
        images: data.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        recommendedBodyShapes: data.recommendedBodyShapes || [],
        recommendedSkinTones: data.recommendedSkinTones || [],
        recommendedSeasons: data.recommendedSeasons || [],
        productStatus: data.productStatus as ProductStatus,
        status: data.productStatus === "PUBLISHED" ? "available" : "unavailable", // Legacy
      }
    });

    revalidatePath("/partner/products");
    revalidatePath("/partner/dashboard");
    return { success: true, product };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateBoutiqueProduct(id: string, data: any) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const boutique = await prisma.boutique.findFirst({
      where: { ownerId: user.id }
    });
    if (!boutique) throw new Error("Boutique not found");

    const existing = await prisma.product.findFirst({
      where: { id, boutiqueId: boutique.id }
    });
    if (!existing) throw new Error("Product not found");

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });
    if (!category) throw new Error("Category not found");

    const product = await prisma.product.update({
      where: { id },
      data: {
        categoryId: data.categoryId,
        category: category.name,
        name: data.name,
        brand: data.brand || null,
        description: data.description,
        gender: data.gender,
        style: data.style,
        fit: data.fit,
        material: data.material,
        price: data.price,
        discountPrice: data.discountPrice,
        stock: data.stock,
        thumbnail: data.thumbnail,
        image: data.thumbnail || existing.image,
        images: data.images || existing.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        recommendedBodyShapes: data.recommendedBodyShapes || [],
        recommendedSkinTones: data.recommendedSkinTones || [],
        recommendedSeasons: data.recommendedSeasons || [],
        productStatus: data.productStatus as ProductStatus,
        status: data.productStatus === "PUBLISHED" ? "available" : "unavailable",
      }
    });

    revalidatePath("/partner/products");
    revalidatePath(`/partner/products/${id}`);
    revalidatePath(`/partner/products/${id}/edit`);
    revalidatePath("/partner/dashboard");
    return { success: true, product };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteBoutiqueProduct(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const boutique = await prisma.boutique.findFirst({
      where: { ownerId: user.id }
    });
    if (!boutique) throw new Error("Boutique not found");

    await prisma.product.deleteMany({
      where: { id, boutiqueId: boutique.id }
    });

    revalidatePath("/partner/products");
    revalidatePath("/partner/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}

export async function bulkDeleteProducts(ids: string[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const boutique = await prisma.boutique.findFirst({
      where: { ownerId: user.id }
    });
    if (!boutique) throw new Error("Boutique not found");

    await prisma.product.deleteMany({
      where: { 
        id: { in: ids },
        boutiqueId: boutique.id 
      }
    });

    revalidatePath("/partner/products");
    revalidatePath("/partner/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error bulk deleting products:", error);
    return { success: false, error: error.message };
  }
}

export async function bulkUpdateProductStatus(ids: string[], status: ProductStatus) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const boutique = await prisma.boutique.findFirst({
      where: { ownerId: user.id }
    });
    if (!boutique) throw new Error("Boutique not found");

    await prisma.product.updateMany({
      where: { 
        id: { in: ids },
        boutiqueId: boutique.id 
      },
      data: {
        productStatus: status,
        status: status === "PUBLISHED" ? "available" : "unavailable",
      }
    });

    revalidatePath("/partner/products");
    revalidatePath("/partner/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error bulk updating product status:", error);
    return { success: false, error: error.message };
  }
}
