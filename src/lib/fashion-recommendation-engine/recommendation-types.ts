export interface OutfitRecommendationItem {
  category: "top" | "bottom" | "shoes" | "accessory" | "outer";
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
  gender?: string;
  fashionPersona?: string;
  primaryStyle: string;
  alternativeStyles: string[];
  recommendations: OutfitRecommendationItem[];
  recommendedColors: { name: string; hex: string; reason?: string }[];
  avoidColors: { name: string; hex: string }[];
  tips: string[];
  summary: string;
}
