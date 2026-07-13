import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { AbsoluteMeasurement, getPixelDistance, getJointConfidence, LANDMARK_INDICES } from "./measurement-utils";
import { PixelScale, pixelsToCm } from "../calibration/pixel-scale";

export function calculateHipWidth(
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  scale: PixelScale | null
): AbsoluteMeasurement {
  const p1 = landmarks[LANDMARK_INDICES.LEFT_HIP];
  const p2 = landmarks[LANDMARK_INDICES.RIGHT_HIP];
  
  const pixels = getPixelDistance(p1, p2, canvasWidth, canvasHeight);
  const jointConf = getJointConfidence(p1, p2);
  const scaleConf = scale ? scale.confidence : 50;
  
  const overallConf = Math.round((jointConf * 0.8) + (scaleConf * 0.2));
  const cm = scale ? pixelsToCm(pixels, scale) : 0;

  return {
    cm: Number(cm.toFixed(1)),
    pixels: Math.round(pixels),
    confidence: overallConf
  };
}
