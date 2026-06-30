export interface OutfitRecommendationItem {
  category: "top" | "bottom" | "shoes" | "accessory";
  type: string;
  style: string;
  colors: string[];
  fit: string;
  material?: string;
  reason: string;
  compatibilityScore: number;
  priority: number;

  matchedProductId?: string;
  matchedStoreId?: string;
}

export interface FashionRecommendationProfile {
  primaryStyle: string;
  alternativeStyles: string[];
  recommendations: OutfitRecommendationItem[];
  recommendedColors: { name: string; hex: string }[];
  avoidColors: { name: string; hex: string }[];
  tips: string[];
  summary: string;
}
