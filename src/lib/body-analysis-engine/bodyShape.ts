import { BodyMeasurementResult } from "@/lib/body-measurements/types";
import {
  BodyShapeResult,
  BodyShapeType,
  FemaleBodyShapeType,
  MaleBodyShapeType,
  GenderType,
} from "./analysis-types";

/**
 * Determines body shape based on measurements and detected gender.
 * Uses gender-appropriate category sets to avoid cross-contamination.
 */
export function determineBodyShape(
  result: BodyMeasurementResult,
  gender: GenderType = "Unknown"
): BodyShapeResult {
  if (!result.measurements) {
    return {
      shape: "Rectangle",
      confidence: 0,
      details: "Data pengukuran tidak mencukupi untuk menentukan bentuk tubuh.",
    };
  }

  const { shoulderWidth, hipWidth, waistWidth } = result.measurements;

  const s = shoulderWidth.value;
  const h = hipWidth.value;
  const w = waistWidth.value;

  const conf =
    (shoulderWidth.confidence + hipWidth.confidence + waistWidth.confidence) / 3;

  if (!s || !h || !w) {
    return {
      shape: "Rectangle",
      confidence: 0,
      details: "Data pengukuran tidak mencukupi untuk menentukan bentuk tubuh.",
    };
  }

  const shoulderToHip = s / h;
  const waistToHip = w / h;
  const waistToShoulder = w / s;

  if (gender === "Female") {
    return determineFemaleBodyShape(shoulderToHip, waistToHip, waistToShoulder, conf);
  } else if (gender === "Male") {
    return determineMaleBodyShape(shoulderToHip, waistToHip, waistToShoulder, conf);
  } else {
    // Unknown gender — use generic heuristics, fallback to Rectangle
    return determineGenericBodyShape(shoulderToHip, waistToHip, waistToShoulder, conf);
  }
}

// ============================================================
// FEMALE BODY SHAPE CATEGORIES
// ============================================================

function determineFemaleBodyShape(
  shoulderToHip: number,
  waistToHip: number,
  waistToShoulder: number,
  conf: number
): BodyShapeResult {
  let shape: FemaleBodyShapeType = "Rectangle";
  let details = "";

  if (shoulderToHip > 1.15) {
    // Shoulders significantly wider than hips
    shape = "Inverted Triangle";
    details =
      "Bahu lebih lebar dari panggul. Rekomendasi atasan yang simpel dan bawahan bervolume untuk menyeimbangkan proporsi.";
  } else if (shoulderToHip < 0.85) {
    // Hips significantly wider than shoulders — Pear
    shape = "Pear";
    details =
      "Panggul lebih lebar dari bahu. Atasan dengan detail yang menarik dan bawahan polos membantu menyeimbangkan proporsi.";
  } else if (waistToHip > 0.90 && waistToShoulder > 0.90) {
    // Waist as wide as shoulders and hips — Apple
    shape = "Apple";
    details =
      "Lingkar pinggang lebih besar dari bahu dan panggul. Pakaian dengan potongan mengalir dan detail vertikal membantu menciptakan siluet yang lebih proporsional.";
  } else if (waistToHip < 0.75 && waistToShoulder < 0.75) {
    // Well-defined waist — Hourglass
    shape = "Hourglass";
    details =
      "Pinggang terdefinisi dengan baik, bahu dan panggul seimbang. Hampir semua potongan pakaian akan terlihat indah pada proporsi tubuh ini.";
  } else {
    // Balanced proportions — Rectangle
    shape = "Rectangle";
    details =
      "Bahu, pinggang, dan panggul memiliki lebar yang relatif sama. Pakaian dengan detail tekstur atau layer membantu menciptakan dimensi visual yang menarik.";
  }

  return { shape, confidence: conf, details };
}

// ============================================================
// MALE BODY SHAPE CATEGORIES
// ============================================================

function determineMaleBodyShape(
  shoulderToHip: number,
  waistToHip: number,
  waistToShoulder: number,
  conf: number
): BodyShapeResult {
  let shape: MaleBodyShapeType = "Rectangle";
  let details = "";

  if (shoulderToHip > 1.15) {
    shape = "Inverted Triangle";
    details =
      "Bahu jauh lebih lebar dari pinggul. Bawahan bervolume seperti celana wide leg membantu menyeimbangkan siluet.";
  } else if (shoulderToHip < 0.85) {
    shape = "Triangle";
    details =
      "Pinggul lebih lebar dari bahu. Atasan berstruktur dan outer layer yang pas membantu menyeimbangkan proporsi.";
  } else if (waistToHip > 0.95 && waistToShoulder > 0.95) {
    shape = "Oval";
    details =
      "Lingkar pinggang lebih besar dari bahu dan pinggul. Pakaian dengan potongan mengalir dan garis vertikal memberikan efek visual yang lebih proporsional.";
  } else if (
    shoulderToHip >= 0.95 &&
    shoulderToHip <= 1.05 &&
    waistToHip >= 0.75 &&
    waistToHip <= 0.95
  ) {
    shape = "Trapezoid";
    details =
      "Bahu lebih lebar dari pinggul dengan sedikit definisi pinggang — proporsi yang sangat ideal untuk hampir semua gaya pakaian.";
  } else {
    shape = "Rectangle";
    details =
      "Bahu, pinggang, dan pinggul memiliki lebar yang relatif sama. Pakaian dengan layer dan detail tekstur menciptakan dimensi visual yang menarik.";
  }

  return { shape, confidence: conf, details };
}

// ============================================================
// GENERIC (Unknown gender)
// ============================================================

function determineGenericBodyShape(
  shoulderToHip: number,
  waistToHip: number,
  waistToShoulder: number,
  conf: number
): BodyShapeResult {
  let shape: BodyShapeType = "Rectangle";
  let details = "";

  if (shoulderToHip > 1.15) {
    shape = "Inverted Triangle";
    details = "Bahu lebih lebar dari pinggul secara signifikan.";
  } else if (shoulderToHip < 0.85) {
    shape = "Pear";
    details = "Pinggul lebih lebar dari bahu.";
  } else if (waistToHip < 0.75 && waistToShoulder < 0.75) {
    shape = "Hourglass";
    details = "Pinggang terdefinisi dengan baik, bahu dan pinggul seimbang.";
  } else if (waistToHip > 0.95 && waistToShoulder > 0.95) {
    shape = "Oval";
    details = "Pinggang lebih lebar dari bahu dan pinggul.";
  } else {
    shape = "Rectangle";
    details = "Bahu, pinggang, dan pinggul relatif sama lebar.";
  }

  return { shape, confidence: conf * 0.7, details }; // Lower confidence for unknown gender
}
