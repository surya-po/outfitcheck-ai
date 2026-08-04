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
    const reason = generateRecommendationReason(
      normalizedProfile,
      matchedAttributes,
      product.style || undefined,
      product.colors || undefined
    );

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

  // 4. Strict Filtering
  // Do NOT recommend products with explicit gender mismatch or negative/zero score
  const eligibleProducts = scoredProducts.filter(p => {
    // If it's explicitly evaluated as a gender mismatch (male vs female), drop it completely
    if (p.matchedAttributes.gender === false) return false;
    
    // If score is 0 or less, it's not a match at all
    if (p.compatibilityScore <= 0) return false;

    return true;
  });

  // 5. Sort the products
  const sorted = sortMatchedProducts(eligibleProducts);

  // 6. Return Top N
  return sorted.slice(0, limit);
}
