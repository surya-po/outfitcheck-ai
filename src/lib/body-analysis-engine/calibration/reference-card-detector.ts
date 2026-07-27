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
    // Use more sensitive thresholds to detect edges even in low contrast
    cv.Canny(blurred, edges, 20, 80, 3, false);

    // Add morphological closing to connect broken lines around the card
    const kernel = cv.Mat.ones(5, 5, cv.CV_8U);
    cv.morphologyEx(edges, edges, cv.MORPH_CLOSE, kernel);
    kernel.delete();

    // 2. Find Contours
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let maxArea = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bestRect: any = null;

    // 3. Find the best matching rectangle (assumed to be the card)
    for (let i = 0; i < contours.size(); ++i) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);

      // Filter out tiny noise and massive contours (allow very small cards down to 500 area)
      if (area > 500 && area < (canvas.width * canvas.height * 0.5)) {
        // Get the bounding rotated rectangle to find width/height
        const rotRect = cv.minAreaRect(cnt);
        const rectArea = rotRect.size.width * rotRect.size.height;
        
        // Calculate extent (contour area / bounding box area)
        // A perfect rectangle has extent 1.0. With fingers/tilt, allow down to 0.45.
        const extent = area / rectArea;

        // Check aspect ratio (ID-1 is 8.56 / 5.4 = ~1.58)
        const longest = Math.max(rotRect.size.width, rotRect.size.height);
        const shortest = Math.min(rotRect.size.width, rotRect.size.height);
        const ratio = longest / shortest;

        // Tolerance for perspective distortion (1.2 to 2.0) and occlusion (extent > 0.45)
        if (ratio > 1.2 && ratio < 2.0 && extent > 0.45) {
          if (rectArea > maxArea) {
            maxArea = rectArea;
            bestRect = rotRect;
          }
        }
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
