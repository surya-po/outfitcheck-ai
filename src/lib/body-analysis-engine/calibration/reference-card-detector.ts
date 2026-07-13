export interface CardDetectionResult {
  detected: boolean;
  pixelWidth: number;
  confidence: number;
  rotation: number;
}

/**
 * Detects a reference card (ID-1 size: KTP, ATM) using OpenCV.
 * It assumes OpenCV is already loaded globally via `loadOpenCV()`.
 */
export function detectReferenceCard(canvas: HTMLCanvasElement): CardDetectionResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cv = (window as any).cv;
  if (!cv || !cv.Mat) {
    throw new Error("OpenCV is not loaded");
  }

  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    // 1. Preprocessing
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(blurred, edges, 50, 150, 3, false);

    // 2. Find Contours
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let maxArea = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bestRect: any = null;

    // 3. Find the best matching rectangle (assumed to be the card)
    for (let i = 0; i < contours.size(); ++i) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);

      // Filter out tiny noise and massive contours (entire screen)
      if (area > 1000 && area < (canvas.width * canvas.height * 0.5)) {
        const approx = new cv.Mat();
        const perimeter = cv.arcLength(cnt, true);
        cv.approxPolyDP(cnt, approx, 0.02 * perimeter, true);

        // If it has 4 corners, it's a rectangle
        if (approx.rows === 4) {
          // Check if it's convex to avoid weird shapes
          if (cv.isContourConvex(approx)) {
            // Get the bounding rotated rectangle to find width/height
            const rotRect = cv.minAreaRect(cnt);
            const rectArea = rotRect.size.width * rotRect.size.height;
            
            // Check aspect ratio (ID-1 is 8.56 / 5.4 = ~1.58)
            const longest = Math.max(rotRect.size.width, rotRect.size.height);
            const shortest = Math.min(rotRect.size.width, rotRect.size.height);
            const ratio = longest / shortest;

            // Tolerance for perspective distortion (1.3 to 1.8)
            if (ratio > 1.3 && ratio < 1.8) {
              if (rectArea > maxArea) {
                maxArea = rectArea;
                bestRect = rotRect;
              }
            }
          }
        }
        approx.delete();
      }
      cnt.delete();
    }

    if (bestRect) {
      // The longest edge of the detected rectangle corresponds to 8.56 cm
      const longestEdge = Math.max(bestRect.size.width, bestRect.size.height);
      const confidence = Math.min(100, Math.max(50, 100 - (Math.abs(1.58 - (longestEdge / Math.min(bestRect.size.width, bestRect.size.height))) * 50)));

      return {
        detected: true,
        pixelWidth: longestEdge,
        confidence: Math.round(confidence), // percentage
        rotation: bestRect.angle
      };
    }

    return {
      detected: false,
      pixelWidth: 0,
      confidence: 0,
      rotation: 0
    };
  } catch (err) {
    console.error("OpenCV Detection Error:", err);
    return { detected: false, pixelWidth: 0, confidence: 0, rotation: 0 };
  } finally {
    // Memory management: prevent memory leaks in WebAssembly
    src.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
  }
}
