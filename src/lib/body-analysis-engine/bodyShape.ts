import { BodyMeasurementResult } from "@/lib/body-measurements/types";
import { BodyShapeResult, BodyShapeType } from "./analysis-types";

export function determineBodyShape(result: BodyMeasurementResult): BodyShapeResult {
  if (!result.measurements) {
    return {
      shape: "Rectangle",
      confidence: 0,
      details: "Insufficient data to determine body shape."
    };
  }

  const { shoulderWidth, hipWidth, waistWidth } = result.measurements;

  const s = shoulderWidth.value;
  const h = hipWidth.value;
  const w = waistWidth.value;
  
  const conf = (shoulderWidth.confidence + hipWidth.confidence + waistWidth.confidence) / 3;

  // Fallback if measurement is completely missing
  if (!s || !h || !w) {
    return {
      shape: "Rectangle",
      confidence: 0,
      details: "Insufficient data to determine body shape."
    };
  }

  const shoulderToHip = s / h;
  const waistToHip = w / h;
  const waistToShoulder = w / s;

  let shape: BodyShapeType = "Rectangle";
  let details = "";

  // Basic geometric heuristics
  if (shoulderToHip > 1.15) {
    shape = "Inverted Triangle";
    details = "Shoulders are significantly broader than hips.";
  } else if (shoulderToHip < 0.85) {
    shape = "Triangle";
    details = "Hips are significantly wider than shoulders.";
  } else if (waistToHip < 0.75 && waistToShoulder < 0.75) {
    shape = "Hourglass";
    details = "Well-defined waist with balanced shoulders and hips.";
  } else if (waistToHip > 0.95 && waistToShoulder > 0.95) {
    shape = "Oval";
    details = "Waist measurement is similar to or larger than shoulders and hips.";
  } else if (shoulderToHip >= 0.95 && shoulderToHip <= 1.05) {
    if (waistToHip >= 0.75 && waistToHip <= 0.95) {
      shape = "Trapezoid";
      details = "Broad shoulders tapering slightly to the waist and hips.";
    } else {
      shape = "Rectangle";
      details = "Shoulders, waist, and hips have similar widths.";
    }
  } else {
    shape = "Rectangle";
    details = "Balanced proportions without a significantly defined waist.";
  }

  return {
    shape,
    confidence: conf,
    details
  };
}
