export type ConfidenceLevel = "Very High" | "High" | "Medium" | "Low";

export interface NormalizedProfile {
  bodyShape: string;
  skinTone: string;
  styles: string[];
  seasons: string[];
  colors: string[];
  fit: string;
  // Fashion Profile fields — Single Source of Truth
  gender?: string;          // "Female" | "Male" | "Unknown"
  fashionPersona?: string;  // e.g. "Minimalist", "Elegant", etc.
}

export interface MatchedAttributes {
  bodyShape: boolean;
  skinTone: boolean;
  style: boolean;
  season: boolean;
  color: boolean;
  fit: boolean;
  gender: boolean;          // NEW: whether gender matched
}

export interface RecommendationReason {
  text: string;
  matchedAttributes: MatchedAttributes;
}

export interface ScoredProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  thumbnail: string;
  compatibilityScore: number;
  confidenceLevel: ConfidenceLevel;
  recommendationReason: string;
  matchedAttributes: MatchedAttributes;
  // Metadata for sorting
  stock: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface ProductData {
  id: string;
  name: string;
  category: string;
  style: string;
  fit: string;
  season: string | null;
  colors: string[];
  recommendedBodyShapes: string[];
  recommendedSkinTones: string[];
  gender?: string | null;    // NEW: product target gender ("Female" | "Male" | "Unisex" | null)
  price: number;
  thumbnail: string | null;
  image: string | null;
  stock: number;
  productStatus: string;
  updatedAt: Date;
  createdAt: Date;
  boutique: {
    status: string;
  };
}
