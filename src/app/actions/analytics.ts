"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Ensures the user is authenticated and returns the user object.
 */
async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/**
 * Gets total recommendations for products belonging to the partner's boutiques.
 */
export async function getPartnerTotalRecommendations() {
  const user = await requireAuth();

  const total = await prisma.productRecommendation.count({
    where: {
      product: {
        boutique: {
          ownerId: user.id
        }
      }
    }
  });

  return total;
}

/**
 * Gets recommendation counts grouped by source (e.g. BODY_SCAN, FASHION_ASSISTANT).
 */
export async function getPartnerRecommendationsBySource() {
  const user = await requireAuth();

  const grouped = await prisma.productRecommendation.groupBy({
    by: ["source"],
    where: {
      product: {
        boutique: {
          ownerId: user.id
        }
      }
    },
    _count: {
      id: true
    }
  });

  return grouped.map(g => ({
    source: g.source,
    count: g._count.id
  }));
}

/**
 * Gets the top recommended products for the partner.
 */
export async function getPartnerTopRecommendedProducts(limit: number = 5) {
  const user = await requireAuth();

  const grouped = await prisma.productRecommendation.groupBy({
    by: ["productId"],
    where: {
      product: {
        boutique: {
          ownerId: user.id
        }
      }
    },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: "desc"
      }
    },
    take: limit
  });

  if (grouped.length === 0) return [];

  // Fetch product details for the top products
  const productIds = grouped.map(g => g.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds }
    },
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      categoryRel: {
        select: {
          name: true
        }
      }
    }
  });

  // Merge the counts with product data
  return grouped.map(g => {
    const product = products.find(p => p.id === g.productId);
    return {
      productId: g.productId,
      count: g._count.id,
      productName: product?.name || "Unknown Product",
      productImage: product?.image || "",
      productPrice: product?.price || 0,
      category: product?.categoryRel?.name || "Unknown"
    };
  });
}

/**
 * Gets total recommendations over time (e.g. by day) for a simple chart.
 */
export async function getPartnerRecommendationsTrend(days: number = 7) {
  const user = await requireAuth();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const recommendations = await prisma.productRecommendation.findMany({
    where: {
      createdAt: {
        gte: startDate
      },
      product: {
        boutique: {
          ownerId: user.id
        }
      }
    },
    select: {
      createdAt: true
    }
  });

  // Group by date (YYYY-MM-DD) in memory since Prisma groupBy on Date part 
  // requires raw queries in PostgreSQL.
  const trend = recommendations.reduce((acc, curr) => {
    const dateStr = curr.createdAt.toISOString().split("T")[0];
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Format into array and sort by date
  return Object.entries(trend)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
