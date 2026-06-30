import { type Landmark } from "@mediapipe/tasks-vision";
import { MeasurementQuality } from "./types";

/**
 * Calculate 3D Euclidean distance between two landmarks in centimeters.
 * MediaPipe worldLandmarks are in meters, so we multiply by 100.
 */
export function getDistance3D(p1: Landmark, p2: Landmark): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) * 100;
}

/**
 * Midpoint between two landmarks.
 */
export function getMidpoint(p1: Landmark, p2: Landmark): Landmark {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
    z: (p1.z + p2.z) / 2,
    visibility: Math.min(p1.visibility ?? 0, p2.visibility ?? 0),
  };
}

/**
 * Minimum visibility threshold for confidence calculations.
 */
const VIS_THRESH = 0.5;

/**
 * Calculates all raw measurements given the 33 worldLandmarks (in meters).
 */
export function calculateRawMeasurements(worldLandmarks: Landmark[]) {
  const lShoulder = worldLandmarks[11];
  const rShoulder = worldLandmarks[12];
  const lHip = worldLandmarks[23];
  const rHip = worldLandmarks[24];
  
  const lKnee = worldLandmarks[25];
  const rKnee = worldLandmarks[26];
  const lAnkle = worldLandmarks[27];
  const rAnkle = worldLandmarks[28];

  const lElbow = worldLandmarks[13];
  const rElbow = worldLandmarks[14];
  const lWrist = worldLandmarks[15];
  const rWrist = worldLandmarks[16];

  const nose = worldLandmarks[0];

  // 1. Widths
  const shoulderWidth = getDistance3D(lShoulder, rShoulder);
  const hipWidth = getDistance3D(lHip, rHip);
  
  // Waist is approximated slightly above hips for simplicity, or just scaled from hip
  const waistWidth = hipWidth * 0.85; 

  // 2. Lengths
  const midShoulder = getMidpoint(lShoulder, rShoulder);
  const midHip = getMidpoint(lHip, rHip);
  const torsoLength = getDistance3D(midShoulder, midHip);

  // Arm = Shoulder to Elbow + Elbow to Wrist (Avg of both arms)
  const lArm = getDistance3D(lShoulder, lElbow) + getDistance3D(lElbow, lWrist);
  const rArm = getDistance3D(rShoulder, rElbow) + getDistance3D(rElbow, rWrist);
  const armLength = (lArm + rArm) / 2;

  // Leg = Hip to Knee + Knee to Ankle (Avg of both legs)
  const lLeg = getDistance3D(lHip, lKnee) + getDistance3D(lKnee, lAnkle);
  const rLeg = getDistance3D(rHip, rKnee) + getDistance3D(rKnee, rAnkle);
  const legLength = (lLeg + rLeg) / 2;

  // 3. Estimated Height
  // Head to shoulder + Torso + Leg + rough foot/top head buffer (~15cm)
  const headToShoulder = getDistance3D(nose, midShoulder);
  const estimatedHeight = headToShoulder + torsoLength + legLength + 15;

  // 4. Ratios
  const shoulderHipRatio = shoulderWidth > 0 && hipWidth > 0 ? shoulderWidth / hipWidth : 1;

  // Compute confidence for each metric based on the minimum visibility of involved landmarks
  const vis = (landmarks: Landmark[]) => {
    return Math.min(...landmarks.map(l => l.visibility ?? 0));
  };

  return {
    shoulderWidth: { val: shoulderWidth, conf: vis([lShoulder, rShoulder]) },
    hipWidth: { val: hipWidth, conf: vis([lHip, rHip]) },
    waistWidth: { val: waistWidth, conf: vis([lHip, rHip]) },
    torsoLength: { val: torsoLength, conf: vis([lShoulder, rShoulder, lHip, rHip]) },
    armLength: { val: armLength, conf: vis([lShoulder, rShoulder, lElbow, rElbow, lWrist, rWrist]) },
    legLength: { val: legLength, conf: vis([lHip, rHip, lKnee, rKnee, lAnkle, rAnkle]) },
    estimatedHeight: { val: estimatedHeight, conf: vis([nose, lShoulder, rShoulder, lHip, rHip, lAnkle, rAnkle]) },
    shoulderHipRatio: { val: shoulderHipRatio, conf: vis([lShoulder, rShoulder, lHip, rHip]) },
  };
}

/**
 * Performs quality checks to see if the pose is valid for measurement.
 */
export function checkMeasurementQuality(
  landmarks2D: Landmark[],
  worldLandmarks: Landmark[]
): MeasurementQuality {
  const warnings: string[] = [];

  const lShoulder = worldLandmarks[11];
  const rShoulder = worldLandmarks[12];
  const lHip = worldLandmarks[23];
  const rHip = worldLandmarks[24];
  const lAnkle = landmarks2D[27];
  const rAnkle = landmarks2D[28];
  
  // 1. Is rotated (Check if Z depth difference between shoulders is too large)
  // worldLandmarks z-axis represents depth. If |lShoulder.z - rShoulder.z| is large, they are rotated.
  const shoulderDepthDiff = Math.abs(lShoulder.z - rShoulder.z);
  const hipDepthDiff = Math.abs(lHip.z - rHip.z);
  const isRotated = shoulderDepthDiff > 0.1 || hipDepthDiff > 0.1; // 0.1m (10cm) difference in depth
  
  if (isRotated) warnings.push("Please face the camera directly.");

  // 2. Is feet missing (using 2D landmarks for frame visibility)
  // x and y are [0.0, 1.0]. If y > 1.0 or visibility is very low, they are cut off.
  const isFeetMissing = 
    !lAnkle || !rAnkle || 
    (lAnkle.visibility ?? 0) < VIS_THRESH || 
    (rAnkle.visibility ?? 0) < VIS_THRESH ||
    lAnkle.y > 0.98 || rAnkle.y > 0.98;

  if (isFeetMissing) warnings.push("Move backward — feet not visible.");

  // 3. Upper body only
  const isUpperBodyOnly = isFeetMissing && ((worldLandmarks[23]?.visibility ?? 0) < VIS_THRESH);

  // 4. Proximity (Using bounding box of 2D landmarks)
  const allY = landmarks2D.map(l => l.y);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const heightRatio = maxY - minY;

  const isTooFar = heightRatio < 0.4; // Body takes up less than 40% of frame
  const isTooClose = minY < 0.02 || maxY > 0.98; // Head or feet touching edges exactly

  if (isTooFar) warnings.push("Move closer to the camera.");
  if (isTooClose && !isFeetMissing) warnings.push("Move backward slightly.");

  // 5. Lighting
  const avgVisibility = landmarks2D.reduce((sum, l) => sum + (l.visibility ?? 0), 0) / landmarks2D.length;
  const isPoorLighting = avgVisibility < 0.5;

  if (isPoorLighting) warnings.push("Improve lighting for better accuracy.");

  return {
    isUpperBodyOnly,
    isFeetMissing,
    isTooClose,
    isTooFar,
    isRotated,
    isPoorLighting,
    warnings,
  };
}
