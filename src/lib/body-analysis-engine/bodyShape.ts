import { BodyMeasurementResult } from "@/lib/body-measurements/types";
import { BodyShapeResult, GenderType } from "./analysis-types";
import { validateMeasurements } from "./measurement-validator";

/**
 * Helper to calculate how close a value is to an ideal range (for confidence scoring).
 * Returns 1 if within range, and decays smoothly if outside the range.
 */
function calculateScore(value: number, min: number, max: number, softMargin: number = 0.05): number {
  if (value >= min && value <= max) return 1.0;
  if (value < min) {
    const diff = min - value;
    if (diff >= softMargin) return 0;
    return 1 - (diff / softMargin);
  }
  if (value > max) {
    const diff = value - max;
    if (diff >= softMargin) return 0;
    return 1 - (diff / softMargin);
  }
  return 0;
}

interface ShapeCandidate {
  shape: string;
  score: number;
}

export function determineBodyShape(
  result: BodyMeasurementResult,
  gender: GenderType = "Unknown"
): BodyShapeResult {
  const validation = validateMeasurements(result);
  
  const { shoulderWidth, hipWidth, waistWidth } = result.measurements || {};
  
  const s = shoulderWidth?.value || 1;
  const h = hipWidth?.value || 1;
  const w = waistWidth?.value || 1;

  const shoulderToHip = s / h;
  const waistToHip = w / h;
  const waistToShoulder = w / s;

  const ratios = { shoulderToHip, waistToHip, waistToShoulder };

  if (!validation.isValid) {
    // We will still calculate, but force LOW_CONFIDENCE
  }

  let candidates: ShapeCandidate[] = [];

  if (gender === "Female") {
    candidates = scoreFemaleShapes(shoulderToHip, waistToHip, waistToShoulder);
  } else if (gender === "Male") {
    candidates = scoreMaleShapes(shoulderToHip, waistToHip, waistToShoulder);
  } else {
    // If unknown, fallback to Female shapes as generic since they cover more general variations
    candidates = scoreFemaleShapes(shoulderToHip, waistToHip, waistToShoulder);
  }

  // Pick top 2
  const primary = candidates[0];
  const secondary = candidates.length > 1 && candidates[1].score > 0 ? candidates[1] : undefined;
  
  // Normalise confidence based on measurement confidence + algorithmic score
  const measurementConfidence = ((shoulderWidth?.confidence || 1) + (hipWidth?.confidence || 1) + (waistWidth?.confidence || 1)) / 3;
  let primaryConfidence = primary.score * measurementConfidence;
  let secondaryConfidence = secondary ? (secondary.score * measurementConfidence) : undefined;
  
  if (!validation.isValid) {
    primaryConfidence *= 0.5; // Penalty for invalid measurements
    if (secondaryConfidence) secondaryConfidence *= 0.5;
  }

  return {
    primaryShape: primary.shape,
    secondaryShape: secondary?.shape,
    confidence: primaryConfidence, // backward compat
    primaryConfidence,
    secondaryConfidence,
    ratios,
    details: getExplanation(primary.shape) + (!validation.isValid ? ` (${validation.reason})` : ""),
    status: (!validation.isValid || primaryConfidence < 0.5) ? "LOW_CONFIDENCE" : "SUCCESS"
  };
}

function scoreFemaleShapes(sh: number, wh: number, ws: number): ShapeCandidate[] {
  const candidates: ShapeCandidate[] = [];

  // Hourglass: 0.95 <= sh <= 1.05, wh < 0.75, ws < 0.75
  const hgSh = calculateScore(sh, 0.95, 1.05, 0.05);
  const hgWh = calculateScore(wh, 0.0, 0.749, 0.05);
  const hgWs = calculateScore(ws, 0.0, 0.749, 0.05);
  candidates.push({ shape: "Hourglass", score: (hgSh + hgWh + hgWs) / 3 });

  // Pear: sh < 0.95
  candidates.push({ shape: "Pear", score: calculateScore(sh, 0.0, 0.949, 0.05) });

  // Inverted Triangle: sh > 1.05
  candidates.push({ shape: "Inverted Triangle", score: calculateScore(sh, 1.051, 2.0, 0.05) });

  // Apple: wh >= 0.90 or ws >= 0.90
  const appWh = calculateScore(wh, 0.90, 2.0, 0.05);
  const appWs = calculateScore(ws, 0.90, 2.0, 0.05);
  candidates.push({ shape: "Apple", score: Math.max(appWh, appWs) });

  // Rectangle: 0.95 <= sh <= 1.05, 0.75 <= wh < 0.90
  const rectSh = calculateScore(sh, 0.95, 1.05, 0.05);
  const rectWh = calculateScore(wh, 0.75, 0.899, 0.05);
  candidates.push({ shape: "Rectangle", score: (rectSh + rectWh) / 2 });

  return candidates.sort((a, b) => b.score - a.score);
}

function scoreMaleShapes(sh: number, wh: number, ws: number): ShapeCandidate[] {
  const candidates: ShapeCandidate[] = [];

  // Trapezoid: 0.95 <= sh <= 1.10, 0.75 < wh <= 0.95
  const trapSh = calculateScore(sh, 0.95, 1.10, 0.05);
  const trapWh = calculateScore(wh, 0.751, 0.95, 0.05);
  candidates.push({ shape: "Trapezoid", score: (trapSh + trapWh) / 2 });

  // Inverted Triangle: sh > 1.10
  candidates.push({ shape: "Inverted Triangle", score: calculateScore(sh, 1.101, 2.0, 0.05) });

  // Triangle: sh < 0.95
  candidates.push({ shape: "Triangle", score: calculateScore(sh, 0.0, 0.949, 0.05) });

  // Oval: wh >= 0.95 or ws >= 0.95
  const ovalWh = calculateScore(wh, 0.95, 2.0, 0.05);
  const ovalWs = calculateScore(ws, 0.95, 2.0, 0.05);
  candidates.push({ shape: "Oval", score: Math.max(ovalWh, ovalWs) });

  // Rectangle: sh roughly 0.95-1.05, wh roughly 0.85-0.95 (close to trapezoid but boxier)
  // We'll capture it by defining a slightly different ideal zone than Trapezoid or just providing a baseline score
  const rectSh = calculateScore(sh, 0.95, 1.05, 0.05);
  const rectWh = calculateScore(wh, 0.85, 0.95, 0.05);
  // To avoid Trapezoid and Rectangle always tying, let's say Rectangle is when waist is closer to hips but not Oval.
  candidates.push({ shape: "Rectangle", score: (rectSh + rectWh) / 2 });

  return candidates.sort((a, b) => b.score - a.score);
}

function getExplanation(shape: string): string {
  switch(shape) {
    case "Hourglass": return "Your shoulders and hips are well balanced while your waist is significantly defined, creating an Hourglass silhouette. Structured garments that emphasize your waistline will complement your natural proportions.";
    case "Pear": return "Your hips are wider than your shoulders, creating a Pear silhouette. Tops with interesting details and solid bottoms help balance your proportions.";
    case "Inverted Triangle": return "Your shoulders are noticeably broader than your hips, creating an Inverted Triangle silhouette. Voluminous bottoms can help balance your upper body.";
    case "Apple": return "Your waist is relatively large compared to your shoulders and hips, creating an Apple silhouette. Flowing garments and vertical lines will help create a more proportionate look.";
    case "Rectangle": return "Your shoulders, waist, and hips are relatively uniform, creating a Rectangle silhouette. Garments with texture or layering help create visual dimension.";
    case "Trapezoid": return "Your shoulders are broader than your hips with a moderately defined waist, creating a Trapezoid silhouette—a highly versatile proportion for most clothing styles.";
    case "Triangle": return "Your hips are broader than your shoulders, creating a Triangle silhouette. Structured tops and well-fitted outer layers help balance your proportions.";
    case "Oval": return "Your waist is larger than your shoulders or hips, creating an Oval silhouette. Flowing pieces with vertical lines will provide a flattering, proportionate visual effect.";
    default: return "Your proportions are unique. Focus on garments that make you feel comfortable and confident.";
  }
}
