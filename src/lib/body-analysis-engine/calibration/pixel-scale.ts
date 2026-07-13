/**
 * Standard ID-1 Card Width in Centimeters
 * This is used as the universal reference object.
 */
export const STANDARD_CARD_WIDTH_CM = 8.56;

export interface PixelScale {
  cmPerPixel: number;
  confidence: number;
}

/**
 * Calculates the cm-per-pixel ratio based on the detected card width.
 */
export function calculatePixelScale(detectedPixelWidth: number, detectionConfidence: number): PixelScale {
  if (detectedPixelWidth <= 0) {
    throw new Error("Invalid pixel width for scale calculation");
  }

  return {
    cmPerPixel: STANDARD_CARD_WIDTH_CM / detectedPixelWidth,
    confidence: detectionConfidence
  };
}

/**
 * Converts a pixel distance into real-world centimeters.
 */
export function pixelsToCm(pixels: number, scale: PixelScale): number {
  return pixels * scale.cmPerPixel;
}
