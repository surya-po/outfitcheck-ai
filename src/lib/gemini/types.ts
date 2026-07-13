export interface ColorChip {
  name: string;
  hex: string;
}

export type GenderType = "Female" | "Male" | "Unknown";

export type FashionPersonaType =
  | "Minimalist"
  | "Elegant"
  | "Casual"
  | "Chic"
  | "Feminine"
  | "Streetwear"
  | "Smart Casual"
  | "Relaxed"
  | "Contemporary"
  | "Classic"
  | "Unknown";

export interface GeminiVisionResponse {
  // Gender Detection (Step 1 — foundational)
  gender: GenderType;
  genderConfidence: number; // 0–100

  // Color & Appearance Analysis
  skinTone: string;
  undertone: string;
  season: string;
  faceShape: string;
  hairColor: string;
  dominantClothingColor: string;

  // Fashion Persona (AI-determined style personality)
  fashionPersona: FashionPersonaType;

  // Color Recommendations
  recommendedColors: ColorChip[];
  avoidColors: ColorChip[];

  // Body Shape (AI direct detection, before math override)
  detectedBodyShape?: string;

  // Meta
  confidence: number;
  summary: string;
}

export interface GeminiVisionResult {
  data?: GeminiVisionResponse;
  error?: string;
  isAvailable: boolean;
}
