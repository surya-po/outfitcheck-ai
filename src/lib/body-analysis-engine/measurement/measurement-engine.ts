import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { AbsoluteMeasurement, getPixelDistance, getJointConfidence, LANDMARK_INDICES, combineConfidences } from "./measurement-utils";
import { PixelScale, pixelsToCm } from "../calibration/pixel-scale";
import { calculateAbsoluteHeight } from "./height";
import { calculateShoulderWidth } from "./shoulder";
import { calculateHipWidth } from "./hips";

export interface FullBodyMeasurement {
  height: AbsoluteMeasurement;
  shoulderWidth: AbsoluteMeasurement;
  hipWidth: AbsoluteMeasurement;
  torsoLength: AbsoluteMeasurement;
  legLength: AbsoluteMeasurement;
  armLength: AbsoluteMeasurement;
  overallConfidence: number;
}

export function calculateTorsoLength(
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  scale: PixelScale | null
): AbsoluteMeasurement {
  // Average Shoulder Y to Average Hip Y
  const leftS = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
  const rightS = landmarks[LANDMARK_INDICES.RIGHT_SHOULDER];
  const leftH = landmarks[LANDMARK_INDICES.LEFT_HIP];
  const rightH = landmarks[LANDMARK_INDICES.RIGHT_HIP];

  const midShoulder = { x: (leftS.x + rightS.x) / 2, y: (leftS.y + rightS.y) / 2, visibility: getJointConfidence(leftS, rightS)/100 } as NormalizedLandmark;
  const midHip = { x: (leftH.x + rightH.x) / 2, y: (leftH.y + rightH.y) / 2, visibility: getJointConfidence(leftH, rightH)/100 } as NormalizedLandmark;

  const pixels = getPixelDistance(midShoulder, midHip, canvasWidth, canvasHeight);
  const conf = Math.round((getJointConfidence(midShoulder, midHip) * 0.8) + ((scale?.confidence || 50) * 0.2));

  return {
    cm: scale ? Number(pixelsToCm(pixels, scale).toFixed(1)) : 0,
    pixels: Math.round(pixels),
    confidence: conf
  };
}

export function calculateLegLength(
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  scale: PixelScale | null
): AbsoluteMeasurement {
  const leftH = landmarks[LANDMARK_INDICES.LEFT_HIP];
  const leftK = landmarks[LANDMARK_INDICES.LEFT_KNEE];
  const leftA = landmarks[LANDMARK_INDICES.LEFT_ANKLE];
  
  const p1 = getPixelDistance(leftH, leftK, canvasWidth, canvasHeight);
  const p2 = getPixelDistance(leftK, leftA, canvasWidth, canvasHeight);
  
  const pixels = p1 + p2;
  const conf = Math.round((combineConfidences([getJointConfidence(leftH, leftK), getJointConfidence(leftK, leftA)]) * 0.8) + ((scale?.confidence || 50) * 0.2));

  return {
    cm: scale ? Number(pixelsToCm(pixels, scale).toFixed(1)) : 0,
    pixels: Math.round(pixels),
    confidence: conf
  };
}

export function calculateArmLength(
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  scale: PixelScale | null
): AbsoluteMeasurement {
  const leftS = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
  const leftE = landmarks[LANDMARK_INDICES.LEFT_ELBOW];
  const leftW = landmarks[LANDMARK_INDICES.LEFT_WRIST];
  
  const p1 = getPixelDistance(leftS, leftE, canvasWidth, canvasHeight);
  const p2 = getPixelDistance(leftE, leftW, canvasWidth, canvasHeight);
  
  const pixels = p1 + p2;
  const conf = Math.round((combineConfidences([getJointConfidence(leftS, leftE), getJointConfidence(leftE, leftW)]) * 0.8) + ((scale?.confidence || 50) * 0.2));

  return {
    cm: scale ? Number(pixelsToCm(pixels, scale).toFixed(1)) : 0,
    pixels: Math.round(pixels),
    confidence: conf
  };
}

/**
 * Main engine function to calculate all absolute measurements.
 */
export function calculateAllMeasurements(
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  scale: PixelScale | null
): FullBodyMeasurement {
  
  const height = calculateAbsoluteHeight(landmarks, canvasWidth, canvasHeight, scale);
  const shoulderWidth = calculateShoulderWidth(landmarks, canvasWidth, canvasHeight, scale);
  const hipWidth = calculateHipWidth(landmarks, canvasWidth, canvasHeight, scale);
  const torsoLength = calculateTorsoLength(landmarks, canvasWidth, canvasHeight, scale);
  const legLength = calculateLegLength(landmarks, canvasWidth, canvasHeight, scale);
  const armLength = calculateArmLength(landmarks, canvasWidth, canvasHeight, scale);

  const overallConfidence = combineConfidences([
    height.confidence,
    shoulderWidth.confidence,
    hipWidth.confidence,
    torsoLength.confidence,
    legLength.confidence,
    armLength.confidence
  ]);

  return {
    height,
    shoulderWidth,
    hipWidth,
    torsoLength,
    legLength,
    armLength,
    overallConfidence
  };
}
