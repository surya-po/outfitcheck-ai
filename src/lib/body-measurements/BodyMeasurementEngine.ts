import { type Landmark } from "@mediapipe/tasks-vision";
import { BodyMeasurements, BodyMeasurementResult } from "./types";
import { EmaFilter } from "./smoothing";
import { calculateRawMeasurements, checkMeasurementQuality } from "./measurement-utils";

/**
 * Stateful engine that processes frame-by-frame landmarks,
 * applies Exponential Moving Average smoothing, and tracks quality.
 */
export class BodyMeasurementEngine {
  // We use a separate filter for each measurement to allow independent tracking
  private filters = {
    estimatedHeight: new EmaFilter(0.15),
    shoulderWidth: new EmaFilter(0.15),
    hipWidth: new EmaFilter(0.15),
    waistWidth: new EmaFilter(0.15),
    legLength: new EmaFilter(0.15),
    torsoLength: new EmaFilter(0.15),
    armLength: new EmaFilter(0.15),
    shoulderHipRatio: new EmaFilter(0.15),
  };

  /**
   * Process a single frame of landmarks.
   */
  public processFrame(
    landmarks2D: Landmark[],
    worldLandmarks: Landmark[]
  ): BodyMeasurementResult {
    const timestamp = Date.now();
    
    // 1. Quality Check
    const quality = checkMeasurementQuality(landmarks2D, worldLandmarks);

    // If quality is fundamentally broken (e.g., upper body only when we need legs),
    // we might want to pause updating filters. But for now, we just pass the raw data
    // and let the confidence score reflect the poor quality.
    
    // 2. Calculate Raw Math
    const raw = calculateRawMeasurements(worldLandmarks);

    // 3. Apply Smoothing
    const measurements: BodyMeasurements = {
      estimatedHeight: {
        value: this.filters.estimatedHeight.update(raw.estimatedHeight.val),
        confidence: raw.estimatedHeight.conf,
        timestamp,
      },
      shoulderWidth: {
        value: this.filters.shoulderWidth.update(raw.shoulderWidth.val),
        confidence: raw.shoulderWidth.conf,
        timestamp,
      },
      hipWidth: {
        value: this.filters.hipWidth.update(raw.hipWidth.val),
        confidence: raw.hipWidth.conf,
        timestamp,
      },
      waistWidth: {
        value: this.filters.waistWidth.update(raw.waistWidth.val),
        confidence: raw.waistWidth.conf,
        timestamp,
      },
      legLength: {
        value: this.filters.legLength.update(raw.legLength.val),
        confidence: raw.legLength.conf,
        timestamp,
      },
      torsoLength: {
        value: this.filters.torsoLength.update(raw.torsoLength.val),
        confidence: raw.torsoLength.conf,
        timestamp,
      },
      armLength: {
        value: this.filters.armLength.update(raw.armLength.val),
        confidence: raw.armLength.conf,
        timestamp,
      },
      shoulderHipRatio: {
        value: this.filters.shoulderHipRatio.update(raw.shoulderHipRatio.val),
        confidence: raw.shoulderHipRatio.conf,
        timestamp,
      },
      // Overall confidence is the average of all key metric confidences
      overallConfidence: (
        raw.estimatedHeight.conf +
        raw.shoulderWidth.conf +
        raw.hipWidth.conf +
        raw.legLength.conf
      ) / 4,
    };

    return {
      measurements,
      quality,
    };
  }

  /**
   * Reset all filters (e.g., when camera stops or tracking is lost for a long time)
   */
  public reset() {
    Object.values(this.filters).forEach(f => f.reset());
  }
}
