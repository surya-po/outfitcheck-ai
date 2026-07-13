import { NormalizedProfile, MatchedAttributes, ConfidenceLevel } from "./types";

export function generateRecommendationReason(
  profile: NormalizedProfile, 
  matched: MatchedAttributes
): string {
  const reasons: string[] = [];
  
  if (matched.gender && profile.gender) {
    reasons.push(`✓ Produk ini sesuai untuk ${profile.gender === "Female" ? "wanita" : profile.gender === "Male" ? "pria" : "Anda"}`);
  }

  if (matched.bodyShape) {
    reasons.push(`✓ Sangat cocok untuk bentuk tubuh ${profile.bodyShape || "Anda"}`);
  }
  
  if (matched.skinTone) {
    reasons.push(`✓ Pilihan warna sesuai dengan skin tone ${profile.skinTone || "Anda"}`);
  }

  if (matched.style && profile.styles.length > 0) {
    reasons.push(`✓ Sesuai dengan preferensi gaya Anda`);
  }

  if (matched.season && profile.seasons.length > 0) {
    reasons.push(`✓ Sempurna untuk palet warna ${profile.seasons[0]}`);
  }

  if (matched.color && profile.colors.length > 0) {
    reasons.push(`✓ Menggunakan warna yang direkomendasikan berdasarkan analisis Anda`);
  }

  if (matched.fit && profile.fit) {
    reasons.push(`✓ Potongan ${profile.fit} pas dengan proporsi tubuh Anda`);
  }

  if (reasons.length === 0) {
    return "Produk ini merupakan alternatif yang baik untuk preferensi Anda secara umum.";
  }

  return "Produk ini direkomendasikan karena:\n" + reasons.join("\n");
}

export function determineConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 95) return "Very High";
  if (score >= 85) return "High";
  if (score >= 70) return "Medium";
  return "Low";
}
