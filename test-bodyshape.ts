import { determineBodyShape } from "./src/lib/body-analysis-engine/bodyShape";
import { BodyMeasurementResult } from "./src/lib/body-measurements/types";

function mockMeasurement(s: number, w: number, h: number): BodyMeasurementResult {
  return {
    measurements: {
      shoulderWidth: { value: s, confidence: 0.9, timestamp: 0 },
      waistWidth: { value: w, confidence: 0.9, timestamp: 0 },
      hipWidth: { value: h, confidence: 0.9, timestamp: 0 },
      estimatedHeight: { value: 170, confidence: 0.9, timestamp: 0 },
      legLength: { value: 100, confidence: 0.9, timestamp: 0 },
      torsoLength: { value: 50, confidence: 0.9, timestamp: 0 },
      armLength: { value: 60, confidence: 0.9, timestamp: 0 },
      shoulderHipRatio: { value: s/h, confidence: 0.9, timestamp: 0 },
      overallConfidence: 0.9
    },
    quality: {
      isUpperBodyOnly: false,
      isFeetMissing: false,
      isTooClose: false,
      isTooFar: false,
      isRotated: false,
      isPoorLighting: false,
      warnings: []
    }
  };
}

const testCases = [
  // Female
  { name: "F-Hourglass", gender: "Female", s: 100, w: 70, h: 100, expected: "Hourglass" },
  { name: "F-Pear", gender: "Female", s: 90, w: 70, h: 100, expected: "Pear" },
  { name: "F-InvTriangle", gender: "Female", s: 110, w: 70, h: 100, expected: "Inverted Triangle" },
  { name: "F-Apple", gender: "Female", s: 100, w: 95, h: 100, expected: "Apple" },
  { name: "F-Rectangle", gender: "Female", s: 100, w: 85, h: 100, expected: "Rectangle" },
  
  // Male
  { name: "M-Trapezoid", gender: "Male", s: 105, w: 85, h: 100, expected: "Trapezoid" },
  { name: "M-Rectangle", gender: "Male", s: 100, w: 90, h: 100, expected: "Rectangle" },
  { name: "M-Oval", gender: "Male", s: 100, w: 105, h: 100, expected: "Oval" },
  { name: "M-Triangle", gender: "Male", s: 90, w: 90, h: 100, expected: "Triangle" },
  { name: "M-InvTriangle", gender: "Male", s: 115, w: 85, h: 100, expected: "Inverted Triangle" },
  
  // Edge cases
  { name: "Low Confidence Meas", gender: "Female", s: 100, w: 70, h: 100, expected: "Rectangle", lowConf: true }
];

testCases.forEach(tc => {
  const mock = mockMeasurement(tc.s, tc.w, tc.h);
  if (tc.lowConf) {
    mock.measurements!.shoulderWidth.confidence = 0.5;
    mock.measurements!.waistWidth.confidence = 0.5;
    mock.measurements!.hipWidth.confidence = 0.5;
  }
  
  const res = determineBodyShape(mock, tc.gender as any);
  console.log(`[${tc.name}] Expected: ${tc.expected}, Got: ${res.primaryShape} (Conf: ${(res.confidence*100).toFixed(1)}%) | Secondary: ${res.secondaryShape}`);
  if (res.primaryShape !== tc.expected) {
    console.error(`  -> FAILED! expected ${tc.expected} but got ${res.primaryShape}`);
  }
});
