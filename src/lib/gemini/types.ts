export interface ColorChip {
  name: string;
  hex: string;
}

export interface GeminiVisionResponse {
  skinTone: string;
  undertone: string;
  season: string;
  faceShape: string;
  hairColor: string;
  dominantClothingColor: string;
  recommendedColors: ColorChip[];
  avoidColors: ColorChip[];
  confidence: number;
  summary: string;
}

export interface GeminiVisionResult {
  data?: GeminiVisionResponse;
  error?: string;
  isAvailable: boolean;
}
