import { BodyMeasurementResult } from "@/lib/body-measurements/types";

// ==========================================
// GENDER
// ==========================================

export type GenderType = "Female" | "Male" | "Unknown";

// ==========================================
// FASHION PERSONA
// ==========================================

export type FashionPersonaType =
  | "Minimalist"
  | "Elegant"
  | "Casual"
  | "Chic"
  | "Feminine"
  | "Streetwear"
  | "Smart Casual"
  | "Elegant Casual"
  | "Modest Fashion"
  | "Office Wear"
  | "Relaxed"
  | "Contemporary"
  | "Classic"
  | "Unknown";

// ==========================================
// CATEGORY A: LOCAL ANALYSIS (Math-based)
// ==========================================

// Female-specific body shapes
export type FemaleBodyShapeType =
  | "Hourglass"
  | "Pear"
  | "Apple"
  | "Rectangle"
  | "Inverted Triangle";

// Male-specific body shapes
export type MaleBodyShapeType =
  | "Rectangle"
  | "Triangle"
  | "Inverted Triangle"
  | "Oval"
  | "Trapezoid";

// Union type for backward compatibility
export type BodyShapeType = FemaleBodyShapeType | MaleBodyShapeType;

export interface BodyShapeResult {
  primaryShape: string;
  secondaryShape?: string;
  confidence: number; // overall or primary
  primaryConfidence: number;
  secondaryConfidence?: number;
  ratios: {
    shoulderToHip: number;
    waistToHip: number;
    waistToShoulder: number;
  };
  details: string;
  status?: "SUCCESS" | "LOW_CONFIDENCE";
}

export type BodyProportionType =
  | "Balanced"
  | "Long Legs"
  | "Short Torso"
  | "Long Torso"
  | "Broad Shoulders"
  | "Narrow Shoulders";

export interface BodyProportionResult {
  proportions: BodyProportionType[];
  shoulderToHipRatio: number;
  legToTorsoRatio: number;
}

export type ClothingFitType = "Slim Fit" | "Regular Fit" | "Relaxed Fit" | "Oversized";

export interface SizeEstimate {
  size: string;
  confidence: number;
  alternative?: string;
}

export interface ClothingSizeResult {
  topSize: SizeEstimate;
  bottomSize: SizeEstimate;
  shirtSize: SizeEstimate;
  jacketSize: SizeEstimate;
  hoodieSize: SizeEstimate;
  recommendedFit: ClothingFitType;
}

// ==========================================
// CATEGORY B: AI VISION READY (Cloud-based)
// ==========================================

export interface ColorChip {
  name: string;
  hex: string;
  reason?: string; // Why this color suits the user
}

export interface ColorAnalysisResult {
  isAvailable: boolean;
  error?: string;

  // Core appearance
  skinTone?: string;
  undertone?: string;
  seasonalColor?: string;
  faceShape?: string;
  hairColor?: string;
  dominantClothingColor?: string;

  // Color recommendations
  recommendedColors?: ColorChip[];
  colorsToAvoid?: ColorChip[];
  confidence?: number;
  summary?: string;

  // Fashion Intelligence fields
  gender?: GenderType;
  genderConfidence?: number;
  fashionPersona?: FashionPersonaType;
  fashionPreference?: string;
  isWearingHijab?: boolean;
  detectedBodyShape?: string; // AI-detected shape (visual), before math override
}

// ==========================================
// FULL ENGINE RESULT — Fashion Profile (Single Source of Truth)
// ==========================================

import { FashionRecommendationProfile, UserStylePreference } from "../fashion-recommendation-engine/recommendation-types";

export interface FashionAnalysisProfile {
  measurements: BodyMeasurementResult;
  shape: BodyShapeResult;
  proportion: BodyProportionResult;
  sizing: ClothingSizeResult;
  colorAnalysis: ColorAnalysisResult;
  recommendation?: FashionRecommendationProfile;
  analyzedAt: number;

  // Fashion Profile fields (Single Source of Truth)
  gender?: GenderType;
  fashionPersona?: FashionPersonaType;
  fashionPreference?: string;
  isWearingHijab?: boolean;

  // Flattened fashion profile for easy consumption by Recommendation Engine
  fashionProfile: {
    gender: string;
    primaryShape: string;
    secondaryShape?: string;
    primaryConfidence: number;
    secondaryConfidence?: number;
    bodyScale?: string;
    bodyProportion: string[];
    shoulderWidth?: number;
    waistDefinition?: string;
    hipWidth?: number;
  };

  // User Style Preference — captured before Body Scan
  userStylePreference?: UserStylePreference;
}
