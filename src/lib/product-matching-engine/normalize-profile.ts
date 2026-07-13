import { FashionAnalysisProfile } from "@/lib/body-analysis-engine/analysis-types";
import { NormalizedProfile } from "./types";

/**
 * Normalization layer: Translates AI output text into standard formats
 * that can be easily matched with Boutique products.
 *
 * This also propagates gender and fashionPersona from the Fashion Profile
 * (Single Source of Truth) so all downstream matching is gender-aware.
 */
export function normalizeProfile(profile: FashionAnalysisProfile): NormalizedProfile {
  // ── Body Shape ──
  const rawShape = profile.shape?.shape || "";
  let normShape = "";
  if (/rectangle/i.test(rawShape)) normShape = "Rectangle";
  else if (/hourglass/i.test(rawShape)) normShape = "Hourglass";
  else if (/pear/i.test(rawShape)) normShape = "Pear";
  else if (/apple/i.test(rawShape)) normShape = "Apple";
  else if (/inverted triangle/i.test(rawShape)) normShape = "Inverted Triangle";
  else if (/triangle/i.test(rawShape) && !/inverted/i.test(rawShape)) normShape = "Triangle";
  else if (/trapezoid/i.test(rawShape)) normShape = "Trapezoid";
  else if (/oval/i.test(rawShape)) normShape = "Oval";
  else normShape = rawShape;

  // ── Skin Tone ──
  const rawTone = profile.colorAnalysis?.skinTone || profile.colorAnalysis?.undertone || "";
  let normTone = "";
  if (/hangat|warm/i.test(rawTone)) normTone = "Warm";
  else if (/dingin|cool/i.test(rawTone)) normTone = "Cool";
  else if (/netral|neutral/i.test(rawTone)) normTone = "Neutral";
  else if (/olive/i.test(rawTone)) normTone = "Olive";
  else if (/fair|terang/i.test(rawTone)) normTone = "Fair";
  else if (/deep|gelap/i.test(rawTone)) normTone = "Deep";
  else normTone = rawTone;

  // ── Styles ──
  const rawPrimaryStyle = profile.recommendation?.primaryStyle || "";
  const rawAltStyles = profile.recommendation?.alternativeStyles || [];
  const stylesSet = new Set<string>();

  [rawPrimaryStyle, ...rawAltStyles].forEach((style) => {
    if (!style) return;
    if (/minimal/i.test(style)) stylesSet.add("Minimalist");
    else if (/casual/i.test(style)) stylesSet.add("Casual");
    else if (/formal/i.test(style)) stylesSet.add("Formal");
    else if (/streetwear/i.test(style)) stylesSet.add("Streetwear");
    else if (/elegant/i.test(style)) stylesSet.add("Elegant");
    else if (/chic/i.test(style)) stylesSet.add("Chic");
    else if (/contemporary/i.test(style)) stylesSet.add("Contemporary");
    else if (/smart/i.test(style)) stylesSet.add("Smart Casual");
    else if (/relaxed/i.test(style)) stylesSet.add("Relaxed");
    else if (/vintage|retro/i.test(style)) stylesSet.add("Vintage");
    else stylesSet.add(style);
  });

  // Also add fashionPersona to styles for better matching
  const persona = profile.fashionPersona || profile.recommendation?.fashionPersona;
  if (persona && persona !== "Unknown") {
    stylesSet.add(persona);
  }

  // ── Seasons ──
  const rawSeason = profile.colorAnalysis?.seasonalColor || "";
  const seasonsSet = new Set<string>();
  if (/gugur|autumn|fall/i.test(rawSeason)) seasonsSet.add("Autumn");
  else if (/semi|spring/i.test(rawSeason)) seasonsSet.add("Spring");
  else if (/panas|summer/i.test(rawSeason)) seasonsSet.add("Summer");
  else if (/dingin|winter/i.test(rawSeason)) seasonsSet.add("Winter");
  else if (rawSeason) seasonsSet.add(rawSeason);

  // ── Fit ──
  const rawFit = profile.sizing?.recommendedFit || "";
  let normFit = "";
  if (/slim/i.test(rawFit)) normFit = "Slim Fit";
  else if (/regular|standard/i.test(rawFit)) normFit = "Regular Fit";
  else if (/relaxed/i.test(rawFit)) normFit = "Relaxed Fit";
  else if (/oversize/i.test(rawFit)) normFit = "Oversized";
  else normFit = rawFit;

  // ── Colors ──
  const rawColors = profile.colorAnalysis?.recommendedColors || [];
  const recColors = profile.recommendation?.recommendedColors || [];

  const colorsSet = new Set<string>();
  [...rawColors, ...recColors].forEach((c) => {
    if (c && c.name) {
      const n = c.name.toLowerCase();
      if (/hitam|black/i.test(n)) colorsSet.add("Black");
      else if (/putih|white/i.test(n)) colorsSet.add("White");
      else if (/abu|grey|gray/i.test(n)) colorsSet.add("Grey");
      else if (/biru|blue|navy/i.test(n)) colorsSet.add("Blue");
      else if (/merah|red/i.test(n)) colorsSet.add("Red");
      else if (/hijau|green|olive|sage/i.test(n)) colorsSet.add("Green");
      else if (/kuning|yellow|mustard/i.test(n)) colorsSet.add("Yellow");
      else if (/cokelat|brown|mocha|khaki/i.test(n)) colorsSet.add("Brown");
      else if (/pink|dusty pink|blush/i.test(n)) colorsSet.add("Pink");
      else if (/krem|cream|beige|ivory|oatmeal/i.test(n)) colorsSet.add("Beige");
      else if (/lavender|ungu|purple/i.test(n)) colorsSet.add("Purple");
      else if (/mint|teal|tosca/i.test(n)) colorsSet.add("Teal");
      else colorsSet.add(c.name);
    }
  });

  // ── Gender ── (from Fashion Profile — Single Source of Truth)
  const rawGender = profile.gender || profile.colorAnalysis?.gender;
  let normGender: string | undefined;
  if (rawGender === "Female") normGender = "Female";
  else if (rawGender === "Male") normGender = "Male";
  else normGender = undefined; // Unknown — don't filter

  // ── Fashion Persona ──
  const normPersona =
    profile.fashionPersona !== "Unknown" ? profile.fashionPersona : undefined;

  return {
    bodyShape: normShape,
    skinTone: normTone,
    styles: Array.from(stylesSet),
    seasons: Array.from(seasonsSet),
    colors: Array.from(colorsSet),
    fit: normFit,
    gender: normGender,
    fashionPersona: normPersona,
  };
}
