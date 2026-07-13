import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface AbsoluteMeasurement {
  cm: number;
  pixels: number;
  confidence: number;
}

export const LANDMARK_INDICES = {
  NOSE: 0,
  LEFT_EYE: 2,
  RIGHT_EYE: 5,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

/**
 * Calculates Euclidean distance in pixels between two normalized landmarks
 */
export function getPixelDistance(
  p1: NormalizedLandmark,
  p2: NormalizedLandmark,
  canvasWidth: number,
  canvasHeight: number
): number {
  if (!p1 || !p2) return 0;
  
  const x1 = p1.x * canvasWidth;
  const y1 = p1.y * canvasHeight;
  const x2 = p2.x * canvasWidth;
  const y2 = p2.y * canvasHeight;
  
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Gets the average confidence (visibility) between two points
 */
export function getJointConfidence(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
  if (!p1 || !p2) return 0;
  const v1 = p1.visibility ?? 0;
  const v2 = p2.visibility ?? 0;
  return Math.round(((v1 + v2) / 2) * 100);
}

/**
 * Combines multiple confidences by taking the average
 */
export function combineConfidences(confidences: number[]): number {
  if (confidences.length === 0) return 0;
  const sum = confidences.reduce((a, b) => a + b, 0);
  return Math.round(sum / confidences.length);
}
