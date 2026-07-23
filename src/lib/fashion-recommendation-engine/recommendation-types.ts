// ============================================================
// USER STYLE PREFERENCE — Input from user before Body Scan
// ============================================================

export interface UserStylePreference {
  /** Up to 3 styles chosen by user (e.g. ["Formal", "Minimalist"]) */
  preferredStyles: string[];
  /** Single occasion chosen by user (e.g. "Office") */
  preferredOccasion?: string;
}

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
  fashionPreference?: string;
  isWearingHijab?: boolean;
  primaryStyle: string;
  alternativeStyles: string[];
  recommendations: OutfitRecommendationItem[];
  recommendedColors: { name: string; hex: string; reason?: string }[];
  avoidColors: { name: string; hex: string }[];
  tips: string[];
  summary: string;

  // ── Style Preference Context (from user input) ──
  preferredStyles?: string[];
  preferredOccasion?: string;
  /** AI-generated explanation of how style preference was applied */
  preferenceExplanation?: string;

  debug?: {
    primaryShape: string;
    secondaryShape?: string;
    primaryConfidence: number;
    secondaryConfidence: number;
    isBlendingEnabled: boolean;
  };
}
