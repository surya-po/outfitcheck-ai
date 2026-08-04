import { FashionAnalysisProfile } from "@/lib/body-analysis-engine/analysis-types";
import { NormalizedProfile } from "./types";

/**
 * Normalization layer: Translates AI output text into standard formats
 * that can be easily matched with Boutique products.
 *
 * Priority:
 * 1. userStylePreference (user-selected persona) — HIGHEST PRIORITY
 * 2. AI-detected fashionPersona
 * 3. Body shape, skin tone, etc.
 *
 * This ensures persona-aware matching: two users with identical bodies
 * but different personas will get completely different product sets.
 */
export function normalizeProfile(profile: FashionAnalysisProfile): NormalizedProfile {
  // ── Body Shape ──
  const rawShape = profile.shape?.primaryShape || "";
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

  // ── AI-Detected Styles (lower priority than user persona) ──
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

  // Also add AI-detected fashionPersona to styles
  const aiPersona = profile.fashionPersona || profile.recommendation?.fashionPersona;
  if (aiPersona && aiPersona !== "Unknown") {
    stylesSet.add(aiPersona);
  }

  // ── USER-SELECTED PERSONA (Highest Priority) ──
  // Explicitly chosen by user BEFORE body scan — PRIMARY matching filter.
  const userPref = profile.userStylePreference;
  const rawPersonaStyles = userPref?.preferredStyles ?? [];
  const preferredOccasion = userPref?.preferredOccasion;

  // Normalize persona strings to match values in product database
  const personaStyles: string[] = rawPersonaStyles.map((s) => {
    const lower = s.toLowerCase();
    if (/formal/i.test(lower)) return "Formal";
    if (/casual/i.test(lower) && /smart/i.test(lower)) return "Smart Casual";
    if (/business/i.test(lower)) return "Business Casual";
    if (/casual/i.test(lower)) return "Casual";
    if (/streetwear/i.test(lower)) return "Streetwear";
    if (/minimal/i.test(lower)) return "Minimalist";
    if (/korean/i.test(lower)) return "Korean Style";
    if (/vintage/i.test(lower)) return "Vintage";
    if (/sporty/i.test(lower)) return "Sporty";
    if (/party/i.test(lower)) return "Party";
    if (/elegant/i.test(lower)) return "Elegant";
    if (/chic/i.test(lower)) return "Chic";
    if (/luxury/i.test(lower)) return "Luxury";
    if (/feminine/i.test(lower)) return "Feminine";
    if (/modest/i.test(lower)) return "Modest";
    if (/mono/i.test(lower)) return "Monochrome";
    if (/old money/i.test(lower)) return "Old Money";
    return s;
  });

  // Occasion-to-style mapping: occasion hints push additional styles
  if (preferredOccasion) {
    const occ = preferredOccasion.toLowerCase();
    if (/office|meeting/i.test(occ) && !personaStyles.includes("Formal") && !personaStyles.includes("Business Casual")) {
      personaStyles.push("Business Casual");
    }
    if (/party|wedding/i.test(occ) && !personaStyles.includes("Party")) {
      personaStyles.push("Party");
    }
    if (/gym|sport/i.test(occ) && !personaStyles.includes("Sporty")) {
      personaStyles.push("Sporty");
    }
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

  // ── Gender ──
  const rawGender = profile.gender || profile.colorAnalysis?.gender;
  let normGender: string | undefined;
  if (rawGender === "Female") normGender = "Female";
  else if (rawGender === "Male") normGender = "Male";
  else normGender = undefined;

  // ── Fashion Persona (AI-detected) ──
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
    personaStyles,       // User-chosen persona — PRIMARY matching factor
    preferredOccasion,   // User-chosen occasion
  };
}
