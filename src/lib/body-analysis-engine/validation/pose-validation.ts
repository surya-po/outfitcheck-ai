import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { ValidationResult } from "./validation-types";

// MediaPipe Pose Landmark Indices
const LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

const VISIBILITY_THRESHOLD = 0.5;

export function validatePose(landmarks: NormalizedLandmark[]): ValidationResult {
  if (!landmarks || landmarks.length === 0) {
    return { isValid: false, messages: ["Tidak ada orang terdeteksi."] };
  }

  const messages: string[] = [];
  
  // Helper to check if a landmark is visible
  const isVisible = (index: number) => {
    const lm = landmarks[index];
    return lm && (lm.visibility ?? 0) >= VISIBILITY_THRESHOLD;
  };

  // 1. Check Head
  if (!isVisible(LANDMARKS.NOSE)) {
    messages.push("Kepala belum terlihat sepenuhnya.");
  }

  // 2. Check Shoulders
  if (!isVisible(LANDMARKS.LEFT_SHOULDER) || !isVisible(LANDMARKS.RIGHT_SHOULDER)) {
    messages.push("Kedua bahu harus terlihat jelas.");
  }

  // 3. Check Feet/Ankles
  if (!isVisible(LANDMARKS.LEFT_ANKLE) || !isVisible(LANDMARKS.RIGHT_ANKLE)) {
    messages.push("Kedua kaki (sampai pergelangan) harus terlihat.");
  }

  // 4. Check if body is rotated (shoulders should be roughly horizontal)
  if (isVisible(LANDMARKS.LEFT_SHOULDER) && isVisible(LANDMARKS.RIGHT_SHOULDER)) {
    const shoulderDx = Math.abs(landmarks[LANDMARKS.LEFT_SHOULDER].x - landmarks[LANDMARKS.RIGHT_SHOULDER].x);
    if (shoulderDx < 0.1) {
      messages.push("Badan harus menghadap depan (terlalu miring).");
    }
  }

  return {
    isValid: messages.length === 0,
    messages
  };
}
