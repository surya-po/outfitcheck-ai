import { ScoredProduct } from "./types";

/**
 * Sorts the scored products.
 * 
 * Sorting criteria:
 * 1. Compatibility Score (Descending)
 * 2. Tie Breaker 1: Stock (Descending)
 * 3. Tie Breaker 2: UpdatedAt (Descending)
 * 4. Tie Breaker 3: CreatedAt (Descending)
 */
export function sortMatchedProducts(products: ScoredProduct[]): ScoredProduct[] {
  return products.sort((a, b) => {
    // 1. Score
    if (a.compatibilityScore !== b.compatibilityScore) {
      return b.compatibilityScore - a.compatibilityScore;
    }
    
    // 2. Stock
    if (a.stock !== b.stock) {
      return b.stock - a.stock;
    }

    // 3. UpdatedAt
    const aUpdated = new Date(a.updatedAt).getTime();
    const bUpdated = new Date(b.updatedAt).getTime();
    if (aUpdated !== bUpdated) {
      return bUpdated - aUpdated;
    }

    // 4. CreatedAt
    const aCreated = new Date(a.createdAt).getTime();
    const bCreated = new Date(b.createdAt).getTime();
    return bCreated - aCreated;
  });
}
