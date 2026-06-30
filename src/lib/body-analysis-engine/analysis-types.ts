import { BodyMeasurementResult } from "@/lib/body-measurements/types";

// ==========================================
// CATEGORY A: LOCAL ANALYSIS (Math-based)
// ==========================================

export type BodyShapeType = 
  | "Rectangle" 
  | "Triangle" 
  | "Inverted Triangle" 
  | "Trapezoid" 
  | "Oval" 
  | "Hourglass";

export interface BodyShapeResult {
  shape: BodyShapeType;
  confidence: number;
  details: string;
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
}

export interface ColorAnalysisResult {
  isAvailable: boolean; // Flag to indicate if vision AI is enabled
  error?: string;       // Holds any error message if vision failed
  
  skinTone?: string;
  undertone?: string;
  seasonalColor?: string;
  faceShape?: string;
  hairColor?: string;
  dominantClothingColor?: string;
  recommendedColors?: ColorChip[];
  colorsToAvoid?: ColorChip[];
  confidence?: number;
  summary?: string;
}

// ==========================================
// FULL ENGINE RESULT
// ==========================================

import { FashionRecommendationProfile } from "../fashion-recommendation-engine/recommendation-types";

export interface FashionAnalysisProfile {
  measurements: BodyMeasurementResult;
  shape: BodyShapeResult;
  proportion: BodyProportionResult;
  sizing: ClothingSizeResult;
  colorAnalysis: ColorAnalysisResult;
  recommendation?: FashionRecommendationProfile;
  analyzedAt: number;
}
