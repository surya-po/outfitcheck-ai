import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface ValidationResult {
  isValid: boolean;
  messages: string[];
}

export interface ImageQualityResult {
  isValid: boolean;
  score: number;
  messages: string[];
  brightness?: number;
  contrast?: number;
  blur?: number;
}
