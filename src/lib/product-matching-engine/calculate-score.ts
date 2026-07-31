import { MATCHING_WEIGHTS } from "./constants";
import { NormalizedProfile, ProductData, MatchedAttributes } from "./types";

export interface ScoreResult {
  score: number;
  matchedAttributes: MatchedAttributes;
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
  };

  // ── GENDER MATCH (Priority filter) ──
  // If profile has a known gender, check that the product is appropriate.
  // Products with gender mismatch (not Unisex) get a heavy penalty.
  if (profile.gender && profile.gender !== "Unknown") {
    let productGender = (product.gender || "").toLowerCase();
    let profileGender = profile.gender.toLowerCase();

    // Normalize Indonesian/English gender terms
    if (["wanita", "perempuan", "female", "womenswear", "women", "cewek"].includes(productGender)) productGender = "female";
    if (["pria", "laki-laki", "male", "menswear", "men", "cowok"].includes(productGender)) productGender = "male";
    if (["wanita", "perempuan", "female", "womenswear", "women", "cewek"].includes(profileGender)) profileGender = "female";
    if (["pria", "laki-laki", "male", "menswear", "men", "cowok"].includes(profileGender)) profileGender = "male";

    if (!productGender || productGender === "unisex" || productGender === "") {
      // Unisex or unspecified — fine for everyone, give partial credit
      score += MATCHING_WEIGHTS.BODY_SHAPE * 0.15; // small bonus
      matchedAttributes.gender = true;
    } else if (productGender === profileGender) {
      // Exact gender match — bonus
      score += MATCHING_WEIGHTS.BODY_SHAPE * 0.20;
      matchedAttributes.gender = true;
    } else {
      // Gender mismatch — heavy penalty (product not suitable)
      score -= 40;
      matchedAttributes.gender = false;
    }
  } else {
    // Unknown gender — neutral, no penalty no bonus
    matchedAttributes.gender = true;
  }

  // 1. Body Shape Match (30%)
  if (profile.bodyShape && product.recommendedBodyShapes && product.recommendedBodyShapes.length > 0) {
    if (product.recommendedBodyShapes.some((s) => new RegExp(profile.bodyShape, "i").test(s))) {
      score += MATCHING_WEIGHTS.BODY_SHAPE;
      matchedAttributes.bodyShape = true;
    } else if (product.recommendedBodyShapes.includes("All Shapes")) {
      score += MATCHING_WEIGHTS.BODY_SHAPE * 0.8;
      matchedAttributes.bodyShape = true;
    } else {
      score -= 20; // explicit mismatch penalty
      matchedAttributes.bodyShape = false;
    }
  } else {
    score += MATCHING_WEIGHTS.BODY_SHAPE * 0.5;
  }

  // 2. Skin Tone Match (20%)
  if (profile.skinTone && product.recommendedSkinTones && product.recommendedSkinTones.length > 0) {
    if (product.recommendedSkinTones.some((t) => new RegExp(profile.skinTone, "i").test(t))) {
      score += MATCHING_WEIGHTS.SKIN_TONE;
      matchedAttributes.skinTone = true;
    } else {
      score -= 15; // explicit mismatch penalty
      matchedAttributes.skinTone = false;
    }
  } else {
    score += MATCHING_WEIGHTS.SKIN_TONE * 0.5;
  }

  // 3. Style Match (15%)
  if (profile.styles.length > 0 && product.style) {
    if (profile.styles.some((s) => new RegExp(s, "i").test(product.style!))) {
      score += MATCHING_WEIGHTS.STYLE;
      matchedAttributes.style = true;
    } else {
      // Style mismatch penalty
      score -= 30; // heavy penalty to push mismatched styles down
      matchedAttributes.style = false;
    }
  } else {
    score += MATCHING_WEIGHTS.STYLE * 0.5;
  }

  // 4. Season Match (10%)
  if (profile.seasons.length > 0 && product.season) {
    if (profile.seasons.some((s) => new RegExp(s, "i").test(product.season!))) {
      score += MATCHING_WEIGHTS.SEASON;
      matchedAttributes.season = true;
    } else {
      score -= 10; // explicit mismatch penalty
      matchedAttributes.season = false;
    }
  } else {
    score += MATCHING_WEIGHTS.SEASON * 0.5;
  }

  // 5. Color Match (15%)
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
      score -= 15; // explicit mismatch penalty
      matchedAttributes.color = false;
    }
  } else {
    score += MATCHING_WEIGHTS.COLOR * 0.5;
  }

  // 6. Fit Match (10%)
  if (profile.fit && product.fit) {
    if (new RegExp(profile.fit, "i").test(product.fit)) {
      score += MATCHING_WEIGHTS.FIT;
      matchedAttributes.fit = true;
    } else {
      score -= 10; // explicit mismatch penalty
      matchedAttributes.fit = false;
    }
  } else {
    score += MATCHING_WEIGHTS.FIT * 0.5;
  }

  // Clamp score: never below 0
  const clampedScore = Math.max(0, score);

  return {
    score: Math.round(clampedScore * 10) / 10,
    matchedAttributes,
  };
}
