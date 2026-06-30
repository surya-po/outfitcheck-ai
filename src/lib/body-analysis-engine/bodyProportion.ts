import { BodyMeasurementResult } from "@/lib/body-measurements/types";
import { BodyProportionResult, BodyProportionType } from "./analysis-types";

export function analyzeProportions(result: BodyMeasurementResult): BodyProportionResult {
  if (!result.measurements) {
    return {
      proportions: ["Balanced"],
      shoulderToHipRatio: 1,
      legToTorsoRatio: 1,
    };
  }

  const { shoulderWidth, hipWidth, legLength, torsoLength } = result.measurements;

  const s = shoulderWidth.value || 0;
  const h = hipWidth.value || 1; // avoid div by 0
  const l = legLength.value || 0;
  const t = torsoLength.value || 1;

  const shoulderToHipRatio = s / h;
  const legToTorsoRatio = l / t;

  const proportions: BodyProportionType[] = [];

  // Vertical Proportions
  if (legToTorsoRatio > 1.2) {
    proportions.push("Long Legs");
    proportions.push("Short Torso");
  } else if (legToTorsoRatio < 0.9) {
    proportions.push("Long Torso");
  } else {
    proportions.push("Balanced");
  }

  // Horizontal Proportions
  if (shoulderToHipRatio > 1.2) {
    proportions.push("Broad Shoulders");
  } else if (shoulderToHipRatio < 0.85) {
    proportions.push("Narrow Shoulders");
  }

  return {
    proportions,
    shoulderToHipRatio,
    legToTorsoRatio,
  };
}
