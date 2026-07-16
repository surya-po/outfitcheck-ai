import { BodyMeasurementResult } from "@/lib/body-measurements/types";
import { FashionAnalysisProfile, GenderType, FashionPersonaType } from "./analysis-types";
import { determineBodyShape } from "./bodyShape";
import { analyzeProportions } from "./bodyProportion";
import { estimateClothingSize } from "./clothingSize";
import { analyzeColorsFromImage } from "./colorAnalysis";
import { fashionRecommendationEngine } from "../fashion-recommendation-engine/recommendation-service";

export class FashionAnalysisService {
  /**
   * Generates a complete Fashion Profile based on local measurements
   * and AI Vision analysis (Gemini).
   *
   * Gender is extracted from AI vision first, then used to:
   * - Determine gender-correct body shape categories
   * - Drive fashion recommendations
   * - Set fashion persona
   *
   * The resulting FashionAnalysisProfile is the Single Source of Truth
   * for all downstream features.
   */
  public async analyze(
    measurements: BodyMeasurementResult,
    imageBase64: string
  ): Promise<FashionAnalysisProfile> {

    // Format measurements into absolute JSON format for Gemini
    const measurementsJson = JSON.stringify({
      heightCm: measurements.measurements?.estimatedHeight?.value,
      shoulderWidthCm: measurements.measurements?.shoulderWidth?.value,
      hipWidthCm: measurements.measurements?.hipWidth?.value,
      torsoLengthCm: measurements.measurements?.torsoLength?.value,
      legLengthCm: measurements.measurements?.legLength?.value,
      armLengthCm: measurements.measurements?.armLength?.value,
      confidence: measurements.measurements?.overallConfidence
    });

    // Run Category B (AI Vision) first to get gender before body shape
    const colorAnalysis = await analyzeColorsFromImage(imageBase64, measurementsJson);

    // Extract gender from AI analysis (this is the foundation of everything)
    const detectedGender: GenderType = colorAnalysis.gender || "Unknown";
    const genderConfidence: number = colorAnalysis.genderConfidence || 0;
    const fashionPersona: FashionPersonaType = colorAnalysis.fashionPersona || "Unknown";
    const isWearingHijab: boolean = colorAnalysis.isWearingHijab || false;

    // Run Category A (Local Math) — now gender-aware
    const shape = determineBodyShape(measurements, detectedGender);
    const proportion = analyzeProportions(measurements);
    const sizing = estimateClothingSize(measurements, shape, proportion);

    // Build the initial profile (without recommendation yet)
    const profile: FashionAnalysisProfile = {
      id: `analysis-${Date.now()}`,
      measurements,
      gender: detectedGender,
      genderConfidence,
      fashionPersona,
      fashionPreference: colorAnalysis.fashionPreference,
      isWearingHijab,
      shape,
      proportion,
      clothingSize: sizing,
      colorAnalysis,
      analyzedAt: Date.now(),
    } as Omit<FashionAnalysisProfile, "recommendation">;

    // Run Category C (Recommendation Engine) — receives full profile including gender
    const recommendation = fashionRecommendationEngine.generate(profile as FashionAnalysisProfile);

    return {
      ...profile,
      recommendation,
    };
  }
}

// Export a singleton instance for ease of use
export const fashionAnalysisService = new FashionAnalysisService();
