import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { 
  AbsoluteMeasurement, 
  getPixelDistance, 
  getJointConfidence, 
  combineConfidences,
  LANDMARK_INDICES 
} from "./measurement-utils";
import { PixelScale, pixelsToCm } from "../calibration/pixel-scale";

/**
 * Calculates total body height using Segmented Addition method.
 * This is much more accurate than head-to-toe bounding boxes, especially if the user is slightly slouched.
 * Segments: Heel -> Ankle -> Knee -> Hip -> Shoulder -> Ear -> Top of Head (Estimated from Ear)
 */
export function calculateAbsoluteHeight(
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  scale: PixelScale | null
): AbsoluteMeasurement {
  // Use the side that is more visible, or average them. Here we'll calculate both and average.
  const calculateSideHeight = (
    heelIdx: number, ankleIdx: number, kneeIdx: number, hipIdx: number, shoulderIdx: number, earIdx: number, eyeIdx: number
  ) => {
    const lms = landmarks;
    const p1 = getPixelDistance(lms[heelIdx], lms[ankleIdx], canvasWidth, canvasHeight);
    const p2 = getPixelDistance(lms[ankleIdx], lms[kneeIdx], canvasWidth, canvasHeight);
    const p3 = getPixelDistance(lms[kneeIdx], lms[hipIdx], canvasWidth, canvasHeight);
    const p4 = getPixelDistance(lms[hipIdx], lms[shoulderIdx], canvasWidth, canvasHeight);
    const p5 = getPixelDistance(lms[shoulderIdx], lms[earIdx], canvasWidth, canvasHeight);
    
    // Estimate distance from Ear to Top of Head.
    // Instead of using a fixed ratio of the torso (which varies by body type),
    // we use the distance from ear to eye to establish head scale.
    // The top of the head is typically ~1.8x to 2.2x the ear-to-eye distance above the ear.
    const earToEyeDist = getPixelDistance(lms[earIdx], lms[eyeIdx], canvasWidth, canvasHeight);
    
    // Fallback to torso ratio (approx 15% of hip-to-shoulder) if facial landmarks are anomalous
    const fallbackOffset = p4 * 0.15;
    
    // Use facial proportion if it seems reasonable, otherwise fallback
    const topOfHeadOffsetPx = (earToEyeDist > 0 && earToEyeDist < p4 * 0.5) 
      ? earToEyeDist * 2.0 
      : fallbackOffset;

    const totalPx = p1 + p2 + p3 + p4 + p5 + topOfHeadOffsetPx;
    
    const conf = combineConfidences([
      getJointConfidence(lms[heelIdx], lms[ankleIdx]),
      getJointConfidence(lms[ankleIdx], lms[kneeIdx]),
      getJointConfidence(lms[kneeIdx], lms[hipIdx]),
      getJointConfidence(lms[hipIdx], lms[shoulderIdx]),
      getJointConfidence(lms[shoulderIdx], lms[earIdx]),
      getJointConfidence(lms[earIdx], lms[eyeIdx])
    ]);
    
    return { px: totalPx, conf };
  };

  const left = calculateSideHeight(
    LANDMARK_INDICES.LEFT_HEEL, LANDMARK_INDICES.LEFT_ANKLE, LANDMARK_INDICES.LEFT_KNEE, 
    LANDMARK_INDICES.LEFT_HIP, LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.LEFT_EAR, LANDMARK_INDICES.LEFT_EYE
  );
  
  const right = calculateSideHeight(
    LANDMARK_INDICES.RIGHT_HEEL, LANDMARK_INDICES.RIGHT_ANKLE, LANDMARK_INDICES.RIGHT_KNEE, 
    LANDMARK_INDICES.RIGHT_HIP, LANDMARK_INDICES.RIGHT_SHOULDER, LANDMARK_INDICES.RIGHT_EAR, LANDMARK_INDICES.RIGHT_EYE
  );

  // Take the one with better confidence, or average if both are good.
  let finalPx = 0;
  let finalConf = 0;

  if (left.conf > right.conf + 10) {
    finalPx = left.px;
    finalConf = left.conf;
  } else if (right.conf > left.conf + 10) {
    finalPx = right.px;
    finalConf = right.conf;
  } else {
    finalPx = (left.px + right.px) / 2;
    finalConf = (left.conf + right.conf) / 2;
  }

  // Factor in the calibration scale confidence
  const scaleConf = scale ? scale.confidence : 50; 
  const overallConf = Math.round((finalConf * 0.7) + (scaleConf * 0.3));

  const cm = scale ? pixelsToCm(finalPx, scale) : 0;

  return {
    cm: Number(cm.toFixed(1)),
    pixels: Math.round(finalPx),
    confidence: overallConf
  };
}
