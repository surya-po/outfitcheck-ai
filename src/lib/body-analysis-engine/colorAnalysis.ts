import { ColorAnalysisResult } from "./analysis-types";
import { analyzeImageWithGemini } from "@/lib/gemini/gemini";

/**
 * Service for AI Vision Color Analysis using Gemini 2.5 Flash.
 * Maps the full GeminiVisionResponse to ColorAnalysisResult,
 * including the new gender and fashionPersona fields.
 */
export async function analyzeColorsFromImage(imageBase64: string, measurementsJson: string): Promise<ColorAnalysisResult> {
  const result = await analyzeImageWithGemini(imageBase64, measurementsJson, 1);

  if (!result.isAvailable || result.error || !result.data) {
    return {
      isAvailable: result.isAvailable,
      error: result.error || "Failed to analyze image",
    };
  }

  const { data } = result;
  return {
    isAvailable: true,
    skinTone: data.skinTone,
    undertone: data.undertone,
    seasonalColor: data.season,
    faceShape: data.faceShape,
    hairColor: data.hairColor,
    dominantClothingColor: data.dominantClothingColor,
    recommendedColors: data.recommendedColors,
    colorsToAvoid: data.avoidColors,
    confidence: data.confidence,
    summary: data.summary,
    // Fashion Intelligence fields
    gender: data.gender,
    genderConfidence: data.genderConfidence,
    fashionPersona: data.fashionPersona,
    fashionPreference: data.fashionPreference,
    isWearingHijab: data.isWearingHijab,
    detectedBodyShape: data.detectedBodyShape,
  };
}
