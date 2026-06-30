import { BodyMeasurementResult } from "@/lib/body-measurements/types";
import { FashionAnalysisProfile } from "./analysis-types";
import { determineBodyShape } from "./bodyShape";
import { analyzeProportions } from "./bodyProportion";
import { estimateClothingSize } from "./clothingSize";
import { analyzeColorsFromImage } from "./colorAnalysis";
import { fashionRecommendationEngine } from "../fashion-recommendation-engine/recommendation-service";

export class FashionAnalysisService {
  /**
   * Generates a complete fashion analysis profile based on local measurements
   * and placeholder vision analysis.
   */
  public async analyze(
    measurements: BodyMeasurementResult,
    imageBase64: string
  ): Promise<FashionAnalysisProfile> {
    
    // Run all Category A (Local Math) synchronously
    const shape = determineBodyShape(measurements);
    const proportion = analyzeProportions(measurements);
    const sizing = estimateClothingSize(measurements, shape, proportion);
    
    // Run Category B (AI Vision Placeholder) asynchronously
    const colorAnalysis = await analyzeColorsFromImage(imageBase64);

    // Initial profile
    const profileWithoutRecommendation: FashionAnalysisProfile = {
      measurements,
      shape,
      proportion,
      sizing,
      colorAnalysis,
      analyzedAt: Date.now(),
    };

    // Run Category C (Recommendation Engine) synchronously
    const recommendation = fashionRecommendationEngine.generate(profileWithoutRecommendation);

    return {
      ...profileWithoutRecommendation,
      recommendation
    };
  }
}

// Export a singleton instance for ease of use
export const fashionAnalysisService = new FashionAnalysisService();
