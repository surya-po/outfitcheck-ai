import { BodyMeasurementResult } from "@/lib/body-measurements/types";

export interface MeasurementValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validates body measurements before calculating body shape.
 * Ensures the data is of high enough quality.
 */
export function validateMeasurements(result: BodyMeasurementResult): MeasurementValidationResult {
  if (!result || !result.measurements) {
    return { isValid: false, reason: "No measurements provided." };
  }

  const { shoulderWidth, waistWidth, hipWidth } = result.measurements;

  // 1. Missing landmarks
  if (!shoulderWidth || !waistWidth || !hipWidth) {
    return { isValid: false, reason: "Missing required body landmarks (shoulder, waist, or hip)." };
  }

  // 2. Hip cannot be zero
  if ((hipWidth.value ?? 0) <= 0) {
    return { isValid: false, reason: "Hip measurement cannot be zero or negative." };
  }
  
  if ((shoulderWidth.value ?? 0) <= 0 || (waistWidth.value ?? 0) <= 0) {
    return { isValid: false, reason: "Measurements cannot be zero or negative." };
  }

  // 3. Measurement confidence minimal 75%
  // Assuming confidence is 0-1, so 0.75
  const avgConfidence = (shoulderWidth.confidence + waistWidth.confidence + hipWidth.confidence) / 3;
  if (avgConfidence < 0.75) {
    return { isValid: false, reason: `Measurement confidence is too low (${(avgConfidence * 100).toFixed(1)}%). Need at least 75%.` };
  }

  // 4. Basic sanity check (e.g., shoulder > waist) - as requested by user spec
  if ((shoulderWidth.value ?? 0) <= (waistWidth.value ?? 0)) {
     return { isValid: false, reason: "Waist is larger than or equal to shoulder. This might be a measurement error." };
  }

  return { isValid: true };
}
