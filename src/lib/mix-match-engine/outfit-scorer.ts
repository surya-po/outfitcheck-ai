import { MixMatchProduct, GeneratedOutfit } from "./outfit-types";

/**
 * Scores an outfit by averaging the compatibility score of mandatory slots
 * and giving a small boost for optional slots.
 */
export function scoreOutfit(slots: GeneratedOutfit["slots"]): number {
  const mandatory: MixMatchProduct[] = [slots.top, slots.bottom, slots.footwear];
  const optional: MixMatchProduct[] = [slots.outer, slots.bag, slots.accessory].filter(
    (p): p is MixMatchProduct => !!p
  );

  const mandatoryAvg =
    mandatory.reduce((sum, p) => sum + p.compatibilityScore, 0) / mandatory.length;

  // Optional items contribute a smaller weight boost
  const optionalBoost =
    optional.length > 0
      ? (optional.reduce((sum, p) => sum + p.compatibilityScore, 0) / optional.length) * 0.15
      : 0;

  const raw = mandatoryAvg + optionalBoost;
  return Math.min(100, Math.round(raw * 10) / 10);
}

/**
 * Determines outfit label based on rank
 */
export function getOutfitLabel(rank: number, _score: number): string {
  if (rank === 0) return "Pilihan Terbaik";
  if (rank === 1) return "Pilihan Kedua";
  if (rank === 2) return "Style Pick";
  if (rank === 3) return "Alternatif A";
  return "Alternatif B";
}

/**
 * Extracts a unified color palette from all products in an outfit
 */
export function extractColorPalette(slots: GeneratedOutfit["slots"]): string[] {
  const all: MixMatchProduct[] = [
    slots.top,
    slots.bottom,
    slots.footwear,
    slots.outer,
    slots.bag,
    slots.accessory,
  ].filter((p): p is MixMatchProduct => !!p);

  const colorsSet = new Set<string>();
  all.forEach((p) => {
    (p.colors || []).slice(0, 2).forEach((c) => colorsSet.add(c));
  });

  return Array.from(colorsSet).slice(0, 6);
}

/**
 * Builds a human-readable outfit explanation in the style of a professional stylist.
 * Gender-aware and avoids naming specific fashion movements.
 */
export function buildOutfitExplanation(
  slots: GeneratedOutfit["slots"],
  bodyShape: string,
  skinTone: string,
  outfitScore: number,
  gender?: string
): string {
  const parts: string[] = [];

  // Opening — gender-aware body shape context
  if (bodyShape) {
    if (gender === "Female") {
      parts.push(
        `Kombinasi ini dirancang untuk bentuk tubuh **${bodyShape}** dengan mempertimbangkan keseimbangan proporsi dan siluet yang elegan`
      );
    } else if (gender === "Male") {
      parts.push(
        `Kombinasi ini dirancang untuk bentuk tubuh **${bodyShape}** dengan mempertimbangkan proporsi yang proporsional dan tampilan yang rapi`
      );
    } else {
      parts.push(
        `Kombinasi outfit ini disesuaikan dengan karakteristik bentuk tubuh **${bodyShape}**`
      );
    }
  }

  // Color context
  if (skinTone) {
    parts.push(`pilihan warna yang dipilih harmonis dengan skin tone **${skinTone}**`);
  }

  // Layering context — if outer is present
  if (slots.outer) {
    parts.push(
      `Layer ${slots.outer.name} memberikan dimensi visual yang rapi sekaligus menjaga keseimbangan proporsi keseluruhan`
    );
  }

  // Score context
  if (outfitScore >= 85) {
    parts.push(
      `Kecocokan outfit secara keseluruhan **${outfitScore}%** — sangat direkomendasikan berdasarkan profil Fashion Anda`
    );
  } else if (outfitScore >= 70) {
    parts.push(
      `Outfit Score **${outfitScore}%** — pilihan yang solid dan nyaman untuk penampilan sehari-hari`
    );
  } else {
    parts.push(
      `Outfit Score **${outfitScore}%** — alternatif yang menarik untuk variasi penampilan`
    );
  }

  if (parts.length === 0) {
    return "Outfit ini dipilih berdasarkan Fashion Profile lengkap Anda untuk tampilan yang proporsional dan harmonis.";
  }

  return parts.join(", dengan ") + ".";
}
