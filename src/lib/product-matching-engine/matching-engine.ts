import { FashionAnalysisProfile } from "@/lib/body-analysis-engine/analysis-types";
import { ProductData, ScoredProduct } from "./types";
import { normalizeProfile } from "./normalize-profile";
import { calculateCompatibilityScore } from "./calculate-score";
import { sortMatchedProducts } from "./matching-sort";
import { generateRecommendationReason, determineConfidenceLevel } from "./recommendation-reason";

export function runMatchingEngine(
  analysisProfile: FashionAnalysisProfile,
  products: ProductData[],
  limit: number = 10
): ScoredProduct[] {
  // 1. Normalization
  const normalizedProfile = normalizeProfile(analysisProfile);

  // 2. Calculate Scores for all products
  const scoredProducts: ScoredProduct[] = products.map(product => {
    const { score, matchedAttributes } = calculateCompatibilityScore(normalizedProfile, product);
    
    // 3. Generate Confidence & Reason
    const confidenceLevel = determineConfidenceLevel(score);
    const reason = generateRecommendationReason(normalizedProfile, matchedAttributes);

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      thumbnail: product.thumbnail || product.image || "",
      compatibilityScore: score,
      confidenceLevel,
      recommendationReason: reason,
      matchedAttributes,
      // Metadata
      stock: product.stock,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt
    };
  });

  // 4. Filter out products with 0 score (if we want to be strict, but keeping it simple to just take Top 10)
  // 5. Sort the products
  const sorted = sortMatchedProducts(scoredProducts);

  // 6. Return Top N
  return sorted.slice(0, limit);
}
