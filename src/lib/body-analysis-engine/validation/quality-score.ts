import { ImageQualityResult } from "./validation-types";

/**
 * Calculates a basic quality score from the image.
 * Since we want to keep it simple on the client, we can sample pixels or rely on existing heuristics.
 * For a robust web implementation, we sample a grid of pixels from the canvas to estimate brightness/contrast.
 */
export function calculateImageQuality(canvasElement: HTMLCanvasElement): ImageQualityResult {
  const ctx = canvasElement.getContext('2d');
  if (!ctx) {
    return { isValid: false, score: 0, messages: ["Gagal membaca data gambar kamera."] };
  }

  // Sample the image to calculate brightness (for performance, don't read every pixel)
  const width = canvasElement.width;
  const height = canvasElement.height;
  
  // If the canvas is 0x0, it's not ready
  if (width === 0 || height === 0) {
    return { isValid: false, score: 0, messages: ["Kamera belum siap."] };
  }

  // We take a smaller crop or step to avoid locking the main thread
  const step = 10; 
  const imageData = ctx.getImageData(0, 0, width, height).data;
  
  let totalBrightness = 0;
  let sampleCount = 0;

  for (let i = 0; i < imageData.length; i += 4 * step) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    
    // Relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    totalBrightness += luminance;
    sampleCount++;
  }

  const avgBrightness = totalBrightness / sampleCount; // 0 to 255
  
  const messages: string[] = [];
  let score = 100;

  if (avgBrightness < 40) {
    messages.push("Pencahayaan terlalu gelap.");
    score -= 40;
  } else if (avgBrightness > 240) {
    messages.push("Pencahayaan terlalu silau.");
    score -= 30;
  }

  return {
    isValid: score >= 70,
    score,
    brightness: avgBrightness,
    messages
  };
}
