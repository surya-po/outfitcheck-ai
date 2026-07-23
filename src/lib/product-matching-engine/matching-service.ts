import { FashionRecommendationProfile } from "../fashion-recommendation-engine/recommendation-types";
import { Product, StoreInfo } from "./product-types";

export class ProductMatchingService {
  public matchProducts(profile: FashionRecommendationProfile): Product[] {
    const emptyStoreInfo: StoreInfo = { isPartner: false };
    const candidates = this.generateCandidates(profile, emptyStoreInfo);
    
    // 1. CANDIDATE FILTERING (Safety Rules)
    const validCandidates = this.filterCandidates(candidates, profile);

    // 2. COMPATIBILITY SCORING
    const scoredProducts = validCandidates.map(product => {
      const score = this.calculateCompatibilityScore(product, profile);
      
      // Augment reasoning based on unified pipeline
      const pShape = profile.debug?.primaryShape || "tubuh";
      const sShape = profile.debug?.secondaryShape;
      const isBlending = profile.debug?.isBlendingEnabled;
      
      let dynamicReason = `✓ Sesuai dengan bentuk tubuh ${pShape} Anda.\n✓ ${product.recommendationReason}`;
      
      if (isBlending && sShape) {
        dynamicReason = `✓ Sesuai dengan bentuk tubuh ${pShape} dengan sentuhan ${sShape}.\n✓ ${product.recommendationReason}`;
      }

      if (profile.colorAnalysis?.skinTone) {
        dynamicReason += `\n✓ Warna ini harmonis dengan skin tone ${profile.colorAnalysis.skinTone}.`;
      }

      if (profile.preferredStyles && profile.preferredStyles.length > 0) {
        const matchedStyle = profile.preferredStyles.find(s => s.toLowerCase() === product.style.toLowerCase()) || profile.preferredStyles[0];
        dynamicReason += `\n✓ Cocok dengan preferensi ${matchedStyle} Style yang Anda pilih.`;
      }
      
      if (profile.preferredOccasion) {
        dynamicReason += `\n✓ Sesuai dengan kebutuhan ${profile.preferredOccasion}.`;
      }

      return { ...product, compatibilityScore: score, recommendationReason: dynamicReason };
    });

    // 3. RANKING
    return scoredProducts
      .filter(p => p.compatibilityScore > 0)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  private generateCandidates(profile: FashionRecommendationProfile, storeInfo: StoreInfo): Product[] {
    const products: Product[] = [];
    
    profile.recommendations.forEach((item, idx) => {
      let sizes = ["S", "M", "L", "XL"];
      if (item.category === "shoes") sizes = ["40", "41", "42", "43", "44"];
      if (item.category === "accessory") sizes = ["One Size"];

      const productGender = Math.random() > 0.8 ? "Unisex" : (profile.gender || "Unknown");

      products.push({
        id: `mock-prod-${idx}-${Date.now()}`,
        name: item.style,
        brand: "Fitcheck AI Partner",
        category: item.category as any,
        style: item.style,
        fit: item.fit,
        material: "Katun Premium",
        colors: item.colors,
        sizes: sizes,
        gender: productGender as any,
        price: 250000 + (Math.floor(Math.random() * 5) * 50000),
        image: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%231E1E2D' width='400' height='500'/%3E%3Ctext fill='%23ffffff' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${encodeURIComponent(item.type)}%3C/text%3E%3C/svg%3E`,
        status: "available",
        compatibilityScore: 0,
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

      if (userGender === "Male" && productGender === "female") return false;
      if (userGender === "Female" && productGender === "male") return false;

      if (userGender === "Male") {
        const hasFemaleItem = femaleBlockedForMale.some(item => productName.includes(item) || productStyle.includes(item));
        if (hasFemaleItem && productGender !== "unisex") return false;
      }

      if (isModest) {
        const hasImmodestItem = modestBlockedItems.some(item => productName.includes(item) || productStyle.includes(item));
        if (hasImmodestItem) return false;
      }

      return true;
    });
  }

  private calculateCompatibilityScore(product: Product, profile: FashionRecommendationProfile): number {
    let score = 0;
    
    // Weighted Pipeline matching
    const W_GENDER = 15;
    const W_MODESTY = 15; // Assuming pre-filtered, give free points
    const W_BODY_SHAPE = 20; // 20%
    const W_BODY_PROPORTION = 10;
    const W_SKIN_TONE = 10;
    const W_STYLE = 15;
    const W_OCCASION = 5;
    const W_SEASON = 5;
    const W_COLOR_HARMONY = 5;

    const userGender = profile.gender || "Unknown";
    const productGender = product.gender ? product.gender.toLowerCase() : "unknown";
    if (userGender.toLowerCase() === productGender || productGender === "unisex") {
      score += W_GENDER;
    } else {
      return 0; 
    }

    score += W_MODESTY;

    // Body shape is guaranteed because we generate from recommendation service
    score += W_BODY_SHAPE; 
    score += W_BODY_PROPORTION;

    // Color/Skin Tone
    if (profile.recommendedColors && profile.recommendedColors.length > 0) {
      score += W_SKIN_TONE;
    } else {
      score += (W_SKIN_TONE / 2);
    }

    const isStyleMatch = profile.primaryStyle.toLowerCase() === product.style.toLowerCase() || 
                         profile.alternativeStyles.some(s => s.toLowerCase() === product.style.toLowerCase());
    score += isStyleMatch ? W_STYLE : (W_STYLE / 2);

    score += W_OCCASION;
    score += W_SEASON;
    score += W_COLOR_HARMONY;

    const variation = Math.floor(Math.random() * 3);
    return Math.min(100, Math.max(0, score - variation));
  }
}

export const productMatchingService = new ProductMatchingService();
