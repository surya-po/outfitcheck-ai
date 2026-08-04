import { NormalizedProfile, MatchedAttributes, ConfidenceLevel } from "./types";

/**
 * Generates human-readable, persona-aware recommendation reasons.
 * Explanations are friendly and specific — they tell the user exactly
 * WHY this product was recommended for them.
 */
export function generateRecommendationReason(
  profile: NormalizedProfile,
  matched: MatchedAttributes,
  productStyle?: string,
  productColors?: string[]
): string {
  const reasons: string[] = [];

  // ── Persona match — show first (most important) ──
  if (matched.persona && profile.personaStyles && profile.personaStyles.length > 0) {
    const personaLabel = profile.personaStyles.slice(0, 2).join(" & ");
    reasons.push(`✓ Sesuai dengan persona ${personaLabel} yang kamu pilih`);
  }

  // ── Occasion match ──
  if (profile.preferredOccasion && matched.persona) {
    reasons.push(`✓ Cocok untuk acara ${profile.preferredOccasion}`);
  }

  // ── Body shape ──
  if (matched.bodyShape && profile.bodyShape) {
    reasons.push(`✓ Cocok dengan bentuk tubuh ${profile.bodyShape}`);
  }

  // ── Skin tone / color ──
  if (matched.skinTone && profile.skinTone) {
    reasons.push(`✓ Warna sesuai dengan skin tone ${profile.skinTone}`);
  }

  // ── Specific product color mentioned ──
  if (matched.color && productColors && productColors.length > 0) {
    const topColor = productColors[0];
    reasons.push(`✓ Warna ${topColor} direkomendasikan oleh AI berdasarkan analisis warna kulit kamu`);
  }

  // ── Fit / proportion ──
  if (matched.fit && profile.fit) {
    reasons.push(`✓ Potongan ${profile.fit} membantu menyeimbangkan proporsi tubuh kamu`);
  }

  // ── Gender appropriate ──
  if (matched.gender && profile.gender && profile.gender !== "Unknown") {
    const genderLabel = profile.gender === "Female" ? "wanita" : "pria";
    reasons.push(`✓ Dirancang untuk ${genderLabel}`);
  }

  if (reasons.length === 0) {
    return "Produk ini merupakan alternatif yang baik untuk melengkapi wardrobe kamu.";
  }

  return reasons.join("\n");
}

export function determineConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 90) return "Very High";
  if (score >= 75) return "High";
  if (score >= 55) return "Medium";
  return "Low";
}
