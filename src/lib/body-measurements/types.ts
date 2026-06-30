export interface MeasurementValue {
  value: number | null;
  confidence: number;
  timestamp: number;
}

export interface BodyMeasurements {
  estimatedHeight: MeasurementValue;
  shoulderWidth: MeasurementValue;
  hipWidth: MeasurementValue;
  waistWidth: MeasurementValue;
  legLength: MeasurementValue;
  torsoLength: MeasurementValue;
  armLength: MeasurementValue;
  shoulderHipRatio: MeasurementValue;
  overallConfidence: number;
}

export interface MeasurementQuality {
  isUpperBodyOnly: boolean;
  isFeetMissing: boolean;
  isTooClose: boolean;
  isTooFar: boolean;
  isRotated: boolean;
  isPoorLighting: boolean;
  warnings: string[];
}

export interface BodyMeasurementResult {
  measurements: BodyMeasurements | null;
  quality: MeasurementQuality;
}
