import { FashionRecommendationProfile } from "../fashion-recommendation-engine/recommendation-types";
import { Product, StoreInfo } from "./product-types";

export class ProductMatchingService {
  /**
   * Transforms FashionRecommendationProfile into an array of Products.
   * Pipeline: Candidate Generation -> Candidate Filtering (Safety Rules) -> Compatibility Scoring -> Ranking
   */
  public matchProducts(profile: FashionRecommendationProfile): Product[] {
    const emptyStoreInfo: StoreInfo = { isPartner: false };
    const candidates = this.generateCandidates(profile, emptyStoreInfo);
    
    // 1. CANDIDATE FILTERING (Safety Rules)
    const validCandidates = this.filterCandidates(candidates, profile);

    // 2. COMPATIBILITY SCORING
    const scoredProducts = validCandidates.map(product => {
      const score = this.calculateCompatibilityScore(product, profile);
      return { ...product, compatibilityScore: score };
    });

    // 3. RANKING
    return scoredProducts
      .filter(p => p.compatibilityScore > 0)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  private generateCandidates(profile: FashionRecommendationProfile, storeInfo: StoreInfo): Product[] {
    const products: Product[] = [];
    
    // Generate candidates from recommendations to guarantee we have highly relevant ones
    profile.recommendations.forEach((item, idx) => {
      let sizes = ["S", "M", "L", "XL"];
      if (item.category === "shoes") sizes = ["40", "41", "42", "43", "44"];
      if (item.category === "accessory") sizes = ["One Size"];

      // Assign gender to the mock product. For exact matches, use profile gender.
      // We also occasionally generate "Unisex"
      const productGender = Math.random() > 0.8 ? "Unisex" : (profile.gender || "Unknown");

      products.push({
        id: `mock-prod-${idx}-${Date.now()}`,
        name: item.style,
        brand: "OutfitCheck AI Partner",
        category: item.category as any,
        style: item.style,
        fit: item.fit,
        material: "Katun Premium",
        colors: item.colors,
        sizes: sizes,
        gender: productGender,
        price: 250000 + (Math.floor(Math.random() * 5) * 50000),
        image: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%231E1E2D' width='400' height='500'/%3E%3Ctext fill='%23ffffff' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${encodeURIComponent(item.type)}%3C/text%3E%3C/svg%3E`,
        status: "available",
        compatibilityScore: 0, // Will be calculated
        recommendationReason: item.reason,
        storeInfo: storeInfo,
      });
    });

    return products;
  }

  private filterCandidates(candidates: Product[], profile: FashionRecommendationProfile): Product[] {
    const userGender = profile.gender || "Unknown";
    const isModest = profile.fashionPreference === "MODEST" || profile.isWearingHijab;

    const femaleBlockedForMale = ["dress", "skirt", "heels", "blouse", "women's bag"];
    const modestBlockedItems = [
      "tank top", "crop top", "tube top", "tube dress", "sleeveless",
      "off shoulder", "deep v neck", "low cut", "mini dress",
      "mini skirt", "bodycon dress", "open back", "spaghetti strap",
      "transparent top", "halter neck"
    ];

    return candidates.filter(product => {
      const productGender = product.gender ? product.gender.toLowerCase() : "unknown";
      const productName = product.name.toLowerCase();
      const productStyle = product.style.toLowerCase();

      // Rule 1: Strict Gender Filter
      if (userGender === "Male" && productGender === "female") return false;
      if (userGender === "Female" && productGender === "male") return false;

      // Rule 2: Implicit Gender Blocks (for Male)
      if (userGender === "Male") {
        const hasFemaleItem = femaleBlockedForMale.some(item => productName.includes(item) || productStyle.includes(item));
        if (hasFemaleItem && productGender !== "unisex") return false;
      }

      // Rule 3: Modest Filter
      if (isModest) {
        const hasImmodestItem = modestBlockedItems.some(item => productName.includes(item) || productStyle.includes(item));
        if (hasImmodestItem) return false;
      }

      return true;
    });
  }

  private calculateCompatibilityScore(product: Product, profile: FashionRecommendationProfile): number {
    let score = 0;
    
    // Weights
    const W_GENDER = 20;
    const W_BODY_SHAPE = 25;
    const W_BODY_PROPORTION = 15;
    const W_SKIN_TONE = 15;
    const W_STYLE = 10;
    const W_SEASON = 5;
    const W_FIT = 5;
    const W_COLOR_HARMONY = 5;

    // 1. Gender Compatibility (20%)
    const userGender = profile.gender || "Unknown";
    const productGender = product.gender ? product.gender.toLowerCase() : "unknown";
    if (userGender.toLowerCase() === productGender || productGender === "unisex") {
      score += W_GENDER;
    } else {
      return 0; // Absolute zero if mismatched, although filter should catch it first
    }

    // 2. Body Shape (25%) - Mock perfect match since candidates were generated from recommendations
    score += W_BODY_SHAPE; 

    // 3. Body Proportion (15%)
    score += W_BODY_PROPORTION;

    // 4. Skin Tone (15%)
    score += W_SKIN_TONE;

    // 5. Style (10%)
    const isStyleMatch = profile.primaryStyle.toLowerCase() === product.style.toLowerCase() || 
                         profile.alternativeStyles.some(s => s.toLowerCase() === product.style.toLowerCase());
    score += isStyleMatch ? W_STYLE : (W_STYLE / 2); // Partial score for generated candidates

    // 6. Season (5%)
    score += W_SEASON;

    // 7. Fit (5%)
    score += W_FIT;

    // 8. Color Harmony (5%)
    score += W_COLOR_HARMONY;

    // Slightly randomize to simulate variation
    const variation = Math.floor(Math.random() * 5);
    return Math.min(100, Math.max(0, score - variation));
  }
}

export const productMatchingService = new ProductMatchingService();
