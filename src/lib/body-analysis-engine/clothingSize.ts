import { BodyMeasurementResult } from "@/lib/body-measurements/types";
import { ClothingSizeResult, ClothingFitType, SizeEstimate, BodyShapeResult, BodyProportionResult } from "./analysis-types";

function createEstimate(size: string, confidence: number, alternative?: string): SizeEstimate {
  // Cap confidence at 95% to indicate it's an estimation
  return {
    size,
    confidence: Math.min(Math.round(confidence * 100), 95),
    alternative
  };
}

export function estimateClothingSize(
  result: BodyMeasurementResult,
  shapeResult: BodyShapeResult,
  proportionResult: BodyProportionResult
): ClothingSizeResult {
  
  const defaultEstimate = createEstimate("M", 0.5);
  
  if (!result.measurements) {
    return {
      topSize: defaultEstimate,
      bottomSize: defaultEstimate,
      shirtSize: defaultEstimate,
      jacketSize: defaultEstimate,
      hoodieSize: defaultEstimate,
      recommendedFit: "Regular Fit"
    };
  }

  const { shoulderWidth, hipWidth, waistWidth, estimatedHeight } = result.measurements;
  
  const s = shoulderWidth.value || 45;
  const h = hipWidth.value || 40;
  const w = waistWidth.value || 35; // If waist is missing, use a generic ratio
  
  // Base confidence from measurements used
  const baseConf = (
    (shoulderWidth.confidence + hipWidth.confidence + waistWidth.confidence + estimatedHeight.confidence) / 4
  );

  // 1. Top Size (T-Shirt) based on Shoulder
  let topSize = "M";
  let topAlt: string | undefined;
  
  if (s < 38) {
    topSize = "XS";
    if (s > 36.5) topAlt = "S (jika menyukai Regular Fit)";
  } else if (s >= 38 && s < 42) {
    topSize = "S";
    if (s > 40.5) topAlt = "M (jika menyukai Relaxed Fit)";
  } else if (s >= 42 && s < 46) {
    topSize = "M";
    if (s > 44.5) topAlt = "L (jika menyukai Relaxed Fit)";
  } else if (s >= 46 && s < 50) {
    topSize = "L";
    if (s > 48.5) topAlt = "XL (jika menyukai Oversize)";
  } else if (s >= 50) {
    topSize = "XL";
    if (s > 53) topAlt = "XXL (jika menyukai Oversize)";
  }

  // 2. Shirt Size (Needs to account for waist to avoid button pulling)
  const shirtSize = topSize;
  let shirtAlt: string | undefined;
  // If waist is unusually wide compared to shoulders (e.g. Oval shape), size up the shirt
  if (shapeResult.primaryShape === "Oval" || shapeResult.primaryShape === "Triangle") {
    // Bump up one size conceptually by adjusting the string if needed.
    // For simplicity, we just recommend a looser fit alternative.
    shirtAlt = "Naik 1 ukuran (agar kancing tidak ketat di perut)";
  }

  // 3. Jacket / Hoodie (Accounts for Arm / Torso lengths if available)
  const outerwearSize = topSize;
  let outerwearAlt: string | undefined;
  
  if (proportionResult.proportions.includes("Long Torso")) {
    outerwearAlt = "Naik 1 ukuran (untuk panjang lengan/torso yang pas)";
  } else if (topSize === "M" || topSize === "L") {
    // General oversize recommendation for hoodies
    outerwearAlt = topSize === "M" ? "L (jika menyukai Oversize)" : "XL (jika menyukai Oversize)";
  }

  // 4. Bottom Size (Pants) - primarily waist, factoring in hips
  let bottomSize = "32";
  let bottomAlt: string | undefined;

  // Approximate flat waist * 2 ~ waist circumference (rough heuristic)
  // Standard sizing mapping for waist:
  if (w < 34) {
    bottomSize = "28";
    if (w > 33) bottomAlt = "29 (jika pinggul lebar)";
  } else if (w >= 34 && w < 36) {
    bottomSize = "30";
    if (w > 35) bottomAlt = "31 (jika paha besar)";
  } else if (w >= 36 && w < 39) {
    bottomSize = "32";
    if (w > 38) bottomAlt = "33 (jika paha besar)";
  } else if (w >= 39 && w < 42) {
    bottomSize = "34";
    if (w > 41) bottomAlt = "35 (jika paha besar)";
  } else if (w >= 42) {
    bottomSize = "36";
    if (w > 44) bottomAlt = "38 (jika menyukai Relaxed Fit)";
  }

  if (shapeResult.primaryShape === "Triangle" || shapeResult.primaryShape === "Hourglass") {
    bottomAlt = "Naik 1 ukuran (untuk menyesuaikan lebar pinggul)";
  }

  // 5. Fit Recommendation
  let recommendedFit: ClothingFitType = "Regular Fit";
  const ratio = s / (h || 1);
  if (ratio > 1.2 || shapeResult.primaryShape === "Inverted Triangle") {
    recommendedFit = "Slim Fit";
  } else if (ratio < 0.9 || shapeResult.primaryShape === "Oval" || shapeResult.primaryShape === "Triangle") {
    recommendedFit = "Relaxed Fit";
  }

  return {
    topSize: createEstimate(topSize, baseConf, topAlt),
    bottomSize: createEstimate(bottomSize, baseConf, bottomAlt),
    shirtSize: createEstimate(shirtSize, baseConf, shirtAlt),
    jacketSize: createEstimate(outerwearSize, baseConf, outerwearAlt),
    hoodieSize: createEstimate(outerwearSize, baseConf, outerwearAlt),
    recommendedFit
  };
}
