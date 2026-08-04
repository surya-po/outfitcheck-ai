import { MATCHING_WEIGHTS } from "./constants";
import { NormalizedProfile, ProductData, MatchedAttributes } from "./types";

export interface ScoreResult {
  score: number;
  matchedAttributes: MatchedAttributes;
}

/**
 * Persona-to-product style compatibility map.
 * Maps each user persona to the list of product style keywords that are compatible.
 * If a product's style matches ANY of these keywords, it gets a persona boost.
 */
const PERSONA_STYLE_MAP: Record<string, string[]> = {
  "Formal":          ["formal", "office wear", "business", "classic", "professional", "blazer", "kemeja", "shirt"],
  "Business Casual": ["business", "casual", "smart casual", "office", "kemeja", "chino"],
  "Smart Casual":    ["smart casual", "casual", "contemporary", "chic", "semi-formal"],
  "Casual":          ["casual", "relaxed", "everyday", "daily", "basic", "santai"],
  "Streetwear":      ["streetwear", "urban", "hype", "graphic", "oversized", "sneaker"],
  "Minimalist":      ["minimalist", "minimal", "clean", "basic", "monochrome", "simpel"],
  "Korean Style":    ["korean", "k-fashion", "casual", "cute", "soft", "pastel"],
  "Vintage":         ["vintage", "retro", "classic", "old school", "90s", "80s"],
  "Sporty":          ["sporty", "athletic", "activewear", "gym", "sport", "training"],
  "Party":           ["party", "festive", "glamour", "cocktail", "evening", "pesta"],
  "Elegant":         ["elegant", "chic", "sophisticated", "luxury", "anggun"],
  "Chic":            ["chic", "elegant", "stylish", "contemporary", "modern"],
  "Luxury":          ["luxury", "premium", "high-end", "designer", "exclusive"],
  "Feminine":        ["feminine", "floral", "romantic", "soft", "pastel", "cute"],
  "Modest":          ["modest", "conservative", "covered", "long", "loose"],
  "Monochrome":      ["monochrome", "minimal", "black", "white", "grey"],
  "Old Money":       ["classic", "preppy", "polo", "linen", "tailored", "old money"],
};

/**
 * Check if a product's style keyword is compatible with user's persona.
 * Returns: 1 = full match, 0.5 = partial/related match, 0 = no match, -1 = mismatch
 */
function getPersonaCompatibility(
  productStyle: string,
  personaStyles: string[]
): { score: number; matched: boolean } {
  if (!personaStyles || personaStyles.length === 0) {
    return { score: 0.5, matched: true }; // No preference — neutral
  }

  const productLower = productStyle.toLowerCase();

  // Check each selected persona
  let bestScore = 0;
  let anyMatch = false;

  for (const persona of personaStyles) {
    const keywords = PERSONA_STYLE_MAP[persona] || [persona.toLowerCase()];
    const isMatch = keywords.some((kw) =>
      productLower.includes(kw.toLowerCase()) || kw.toLowerCase().includes(productLower)
    );
    if (isMatch) {
      bestScore = Math.max(bestScore, 1);
      anyMatch = true;
    }
  }

  // If no match found, check if product style is fundamentally incompatible
  // e.g., if user chose "Formal" but product is "Streetwear" — strong mismatch
  if (!anyMatch) {
    const isMismatch = personaStyles.some((persona) => {
      const personaKw = PERSONA_STYLE_MAP[persona] || [];
      // Strict opposites
      if (persona === "Formal" && /casual|streetwear|sporty|party/i.test(productLower)) return true;
      if (persona === "Streetwear" && /formal|elegant|luxury|business/i.test(productLower)) return true;
      if (persona === "Sporty" && /formal|elegant|luxury|vintage/i.test(productLower)) return true;
      if (persona === "Casual" && /formal|tuxedo|evening/i.test(productLower)) return true;
      if (persona === "Elegant" && /sporty|streetwear|gym/i.test(productLower)) return true;
      return false;
    });
    return { score: isMismatch ? -1 : 0.3, matched: false };
  }

  return { score: bestScore, matched: anyMatch };
}

export function calculateCompatibilityScore(
  profile: NormalizedProfile,
  product: ProductData
): ScoreResult {
  let score = 0;

  const matchedAttributes: MatchedAttributes = {
    bodyShape: false,
    skinTone: false,
    style: false,
    season: false,
    color: false,
    fit: false,
    gender: false,
    persona: false,
  };

  // ══════════════════════════════════════════════════════════════
  // 0. GENDER MATCH (Hard filter — applied before scoring)
  // ══════════════════════════════════════════════════════════════
  if (profile.gender && profile.gender !== "Unknown") {
    let productGender = (product.gender || "").toLowerCase();
    let profileGender = profile.gender.toLowerCase();

    if (["wanita", "perempuan", "female", "womenswear", "women", "cewek"].includes(productGender)) productGender = "female";
    if (["pria", "laki-laki", "male", "menswear", "men", "cowok"].includes(productGender)) productGender = "male";
    if (["wanita", "perempuan", "female", "womenswear", "women", "cewek"].includes(profileGender)) profileGender = "female";
    if (["pria", "laki-laki", "male", "menswear", "men", "cowok"].includes(profileGender)) profileGender = "male";

    if (!productGender || productGender === "unisex" || productGender === "") {
      score += MATCHING_WEIGHTS.BODY_SHAPE * 0.15;
      matchedAttributes.gender = true;
    } else if (productGender === profileGender) {
      score += MATCHING_WEIGHTS.BODY_SHAPE * 0.20;
      matchedAttributes.gender = true;
    } else {
      score -= 40; // Hard penalty — gender mismatch
      matchedAttributes.gender = false;
    }
  } else {
    matchedAttributes.gender = true;
  }

  // ══════════════════════════════════════════════════════════════
  // 1. PERSONA MATCH (35%) — PRIMARY factor
  //    User-selected style must match product style.
  //    This is what makes two users with same body but different
  //    personas get completely different products.
  // ══════════════════════════════════════════════════════════════
  const personaStyles = profile.personaStyles || [];
  if (personaStyles.length > 0 && product.style) {
    const { score: personaScore, matched } = getPersonaCompatibility(product.style, personaStyles);
    matchedAttributes.persona = matched;

    if (personaScore >= 1) {
      // Full persona match — major boost
      score += MATCHING_WEIGHTS.PERSONA_MATCH;
    } else if (personaScore >= 0.3) {
      // Partial / neutral — small partial credit
      score += MATCHING_WEIGHTS.PERSONA_MATCH * 0.3;
    } else {
      // Persona mismatch — HEAVY penalty to push product out of results
      score -= MATCHING_WEIGHTS.PERSONA_MATCH * 1.5; // -52.5 points
      matchedAttributes.persona = false;
    }
  } else if (personaStyles.length === 0) {
    // No preference set — neutral (no penalty no bonus)
    score += MATCHING_WEIGHTS.PERSONA_MATCH * 0.4;
    matchedAttributes.persona = true;
  }

  // ══════════════════════════════════════════════════════════════
  // 2. BODY SHAPE MATCH (25%)
  // ══════════════════════════════════════════════════════════════
  if (profile.bodyShape && product.recommendedBodyShapes && product.recommendedBodyShapes.length > 0) {
    if (product.recommendedBodyShapes.some((s) => new RegExp(profile.bodyShape, "i").test(s))) {
      score += MATCHING_WEIGHTS.BODY_SHAPE;
      matchedAttributes.bodyShape = true;
    } else if (product.recommendedBodyShapes.includes("All Shapes")) {
      score += MATCHING_WEIGHTS.BODY_SHAPE * 0.8;
      matchedAttributes.bodyShape = true;
    } else {
      score -= 15; // Explicit mismatch penalty
      matchedAttributes.bodyShape = false;
    }
  } else {
    score += MATCHING_WEIGHTS.BODY_SHAPE * 0.5;
  }

  // ══════════════════════════════════════════════════════════════
  // 3. SKIN TONE MATCH (15%)
  // ══════════════════════════════════════════════════════════════
  if (profile.skinTone && product.recommendedSkinTones && product.recommendedSkinTones.length > 0) {
    if (product.recommendedSkinTones.some((t) => new RegExp(profile.skinTone, "i").test(t))) {
      score += MATCHING_WEIGHTS.SKIN_TONE;
      matchedAttributes.skinTone = true;
    } else {
      score -= 10;
      matchedAttributes.skinTone = false;
    }
  } else {
    score += MATCHING_WEIGHTS.SKIN_TONE * 0.5;
  }

  // ══════════════════════════════════════════════════════════════
  // 4. COLOR MATCH (10%)
  // ══════════════════════════════════════════════════════════════
  if (profile.colors.length > 0 && product.colors && product.colors.length > 0) {
    let colorMatched = false;
    for (const pColor of product.colors) {
      if (profile.colors.some((c) => new RegExp(c, "i").test(pColor))) {
        colorMatched = true;
        break;
      }
    }
    if (colorMatched) {
      score += MATCHING_WEIGHTS.COLOR;
      matchedAttributes.color = true;
    } else {
      score -= 8;
      matchedAttributes.color = false;
    }
  } else {
    score += MATCHING_WEIGHTS.COLOR * 0.5;
  }

  // ══════════════════════════════════════════════════════════════
  // 5. AI STYLE ALIGNMENT (7%)
  // ══════════════════════════════════════════════════════════════
  if (profile.styles.length > 0 && product.style) {
    if (profile.styles.some((s) => new RegExp(s, "i").test(product.style!))) {
      score += MATCHING_WEIGHTS.STYLE;
      matchedAttributes.style = true;
    } else {
      score -= 5;
      matchedAttributes.style = false;
    }
  } else {
    score += MATCHING_WEIGHTS.STYLE * 0.5;
  }

  // ══════════════════════════════════════════════════════════════
  // 6. FIT MATCH (5%)
  // ══════════════════════════════════════════════════════════════
  if (profile.fit && product.fit) {
    if (new RegExp(profile.fit, "i").test(product.fit)) {
      score += MATCHING_WEIGHTS.FIT;
      matchedAttributes.fit = true;
    } else {
      score -= 5;
      matchedAttributes.fit = false;
    }
  } else {
    score += MATCHING_WEIGHTS.FIT * 0.5;
  }

  // ══════════════════════════════════════════════════════════════
  // 7. SEASON MATCH (3%)
  // ══════════════════════════════════════════════════════════════
  if (profile.seasons.length > 0 && product.season) {
    if (profile.seasons.some((s) => new RegExp(s, "i").test(product.season!))) {
      score += MATCHING_WEIGHTS.SEASON;
      matchedAttributes.season = true;
    } else {
      score -= 3;
      matchedAttributes.season = false;
    }
  } else {
    score += MATCHING_WEIGHTS.SEASON * 0.5;
  }

  // Clamp: never below 0, never above MAX_SCORE
  const clampedScore = Math.min(100, Math.max(0, score));

  return {
    score: Math.round(clampedScore * 10) / 10,
    matchedAttributes,
  };
}
