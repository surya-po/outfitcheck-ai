/**
 * style-preference-rules.ts
 *
 * Maps user-selected styles & occasions to clothing item priorities and blocklists.
 * Used by the Recommendation Engine as the LOWEST priority layer (after body shape,
 * proportion, skin tone, and hijab rules have already been applied).
 *
 * Priority chain:
 *   1. Gender + Hijab (mandatory)
 *   2. Body Shape rules
 *   3. Body Proportion rules
 *   4. Skin Tone / Color Harmony
 *   5. [THIS FILE] Preferred Style boost / reorder
 *   6. [THIS FILE] Occasion filter
 *   7. Season / Trend
 */

// ============================================================
// STYLE → ITEM KEYWORD MAPPING
// Items listed here will be BOOSTED (moved earlier) when the
// corresponding style is selected by the user.
// ============================================================

export const STYLE_ITEM_BOOST: Record<string, string[]> = {
  Formal: [
    "Blazer", "Kemeja", "Celana Bahan", "Celana Formal", "Rok Formal",
    "Rok Pensil", "Oxford", "Loafers", "Heels", "Pumps",
    "Trench Coat", "Long Coat", "Setelan",
  ],
  "Office Wear": [
    "Blazer", "Kemeja", "Celana Bahan", "Rok Midi", "Setelan", "Loafers",
    "Oxford", "Heels", "Atasan Formal", "Long Coat",
  ],
  Business: [
    "Blazer", "Setelan", "Kemeja", "Celana Bahan", "Oxford", "Loafers",
    "Pumps", "Rok Pensil", "Trench Coat",
  ],
  "Business Casual": [
    "Blazer", "Kemeja", "Chino", "Celana Bahan", "Loafers", "Knit Top",
    "Smart Blouse", "Derby",
  ],
  "Smart Casual": [
    "Kemeja", "Chino", "Blazer", "Knit Top", "Loafers", "Sneakers Clean",
    "Fitted Blouse",
  ],
  Casual: [
    "Kaos", "Jeans", "Sneakers", "Blus", "Celana Casual", "Flat Shoes",
  ],
  Minimalist: [
    "Kaos Polos", "Celana Straight", "Celana Bahan", "Kemeja Polos",
    "Monochrome", "Loafers", "Sneakers Putih", "Tote Bag",
  ],
  Elegant: [
    "Blazer", "Setelan", "Blus Sutra", "Midi Dress", "Heels", "Pumps",
    "Long Coat", "Trench Coat", "Rok Midi", "Fitted Knit",
  ],
  Chic: [
    "Blazer", "Crop Top", "Midi Skirt", "Wide Leg", "Heels", "Mules",
    "Statement Earring", "Structured Bag",
  ],
  Luxury: [
    "Setelan Mewah", "Silk Blouse", "Cashmere Knit", "Trench Coat", "Heels",
    "Leather Bag", "Long Coat", "Wide Leg Pants",
  ],
  Streetwear: [
    "Hoodie", "Oversized Shirt", "Cargo Pants", "Sneakers", "Bomber",
    "Cap", "Jogger", "Kaos Oversized", "High Top", "Balaclava",
  ],
  Sporty: [
    "Track Jacket", "Jogger", "Sneakers", "Sports Bra", "Legging",
    "Windbreaker", "Shorts",
  ],
  Vintage: [
    "Corduroy", "Mom Jeans", "Kemeja Flannel", "Denim Jacket", "Ankle Boots",
    "Midi Dress Retro", "Turtleneck",
  ],
  Feminine: [
    "Wrap Dress", "Midi Dress", "Blus Floral", "Rok A-Line", "Heels",
    "Mules", "Pearl Earring", "Cardigan",
  ],
  Masculine: [
    "Kemeja", "Celana Cargo", "Celana Chino", "Boots", "Bomber",
    "Denim Jacket", "Sneakers Chunky",
  ],
  Modest: [
    "Tunik", "Long Sleeve", "Cardigan", "Long Outer", "Wide Leg Pants",
    "Midi Skirt", "Loose Blouse", "Long Dress",
  ],
  Monochrome: [
    "Setelan Monokrom", "Kemeja Putih", "Celana Hitam", "All White", "All Black",
    "Grey Set", "Nude Set",
  ],
  "Korean Inspired": [
    "Oversized Shirt", "Wide Leg", "Knit Cardigan", "Mini Skirt", "Blazer Kotak",
    "Loafers", "Platform Sneakers", "Tote Bag",
  ],
  "Japanese Inspired": [
    "Linen Shirt", "Wide Leg Pants", "Minimalist Tee", "Haori", "Loafers",
    "Monochrome", "Clean Cut",
  ],
  "Old Money": [
    "Blazer", "Celana Bahan", "Polo Shirt", "Oxford", "Loafers",
    "Knit Sweater", "Setelan Klasik", "Trench Coat", "Cashmere",
  ],
};

// ============================================================
// OCCASION → BLOCKED ITEM KEYWORDS
// These items will be DEMOTED / filtered out when the
// corresponding occasion is active.
// ============================================================

export const OCCASION_BLOCKED_ITEMS: Record<string, string[]> = {
  Office: [
    "Hoodie", "Crop Top", "Cargo Pants", "Jogger", "Track Jacket",
    "Sports Bra", "Sleeveless", "Oversized Kaos", "Tank Top",
    "Bomber", "Windbreaker", "Shorts",
  ],
  Meeting: [
    "Hoodie", "Crop Top", "Cargo Pants", "Jogger", "Tank Top",
    "Sleeveless", "Sports Bra", "Bomber", "Shorts",
  ],
  "Formal Event": [
    "Hoodie", "Cargo Pants", "Jogger", "Sneakers Chunky", "Tank Top",
    "Sports Bra", "Shorts", "Bomber", "Windbreaker",
  ],
  Wedding: [
    "Hoodie", "Cargo Pants", "Jogger", "Kaos Polos", "Tank Top",
    "Sports Bra", "Shorts", "Sneakers (casual)", "Sandal Jepit",
  ],
  Gym: [
    "Blazer", "Heels", "Oxford", "Loafers", "Long Coat",
    "Trench Coat", "Celana Bahan", "Rok Formal",
  ],
  Campus: [
    "Heels Tinggi", "Gown", "Celana Formal Ketat",
  ],
};

// ============================================================
// OCCASION → PRIORITY ITEM KEYWORDS
// These items will be BOOSTED when the corresponding
// occasion is active.
// ============================================================

export const OCCASION_PRIORITY_ITEMS: Record<string, string[]> = {
  Office: [
    "Blazer", "Kemeja", "Celana Bahan", "Rok Midi", "Loafers", "Oxford",
    "Setelan", "Long Coat",
  ],
  Meeting: [
    "Blazer", "Kemeja", "Setelan", "Oxford", "Loafers", "Celana Bahan",
  ],
  "Formal Event": [
    "Setelan", "Blazer", "Long Coat", "Heels", "Oxford", "Celana Formal",
    "Rok Formal", "Kemeja Formal",
  ],
  Wedding: [
    "Blazer", "Setelan", "Dress", "Heels", "Kemeja Formal",
  ],
  Campus: [
    "Kemeja", "Jeans", "Sneakers", "Kaos", "Chino",
  ],
  Daily: [
    "Kaos", "Jeans", "Sneakers", "Blus", "Flat Shoes",
  ],
  Gym: [
    "Track Jacket", "Jogger", "Sneakers", "Sports Bra", "Legging", "Windbreaker",
  ],
  Party: [
    "Dress", "Heels", "Blus Chic", "Statement Earring", "Blazer",
  ],
  Date: [
    "Dress", "Midi Skirt", "Kemeja", "Heels", "Mules", "Chino",
  ],
  Travel: [
    "Sneakers", "Jeans", "Jaket Ringan", "Celana Comfortable", "Kaos",
  ],
  Vacation: [
    "Dress", "Sandals", "Kaos Ringan", "Shorts", "Sneakers",
  ],
  Photoshoot: [
    "Setelan", "Blazer", "Dress", "Statement Outfit", "Heels",
  ],
  Weekend: [
    "Jeans", "Sneakers", "Kaos", "Hoodie", "Celana Casual",
  ],
};

// ============================================================
// STYLE COMPATIBILITY GROUPS
// Styles in the same group are highly compatible.
// Used to handle when user selects multiple styles.
// ============================================================

export const STYLE_COMPATIBILITY_GROUPS: string[][] = [
  ["Formal", "Business", "Office Wear", "Business Casual", "Old Money", "Elegant", "Luxury"],
  ["Smart Casual", "Chic", "Minimalist", "Monochrome", "Japanese Inspired"],
  ["Casual", "Korean Inspired", "Vintage", "Feminine"],
  ["Streetwear", "Sporty", "Masculine"],
  ["Modest"],
];

// ============================================================
// STYLE OCCASION BLACKLIST
// Certain style+occasion combos that are explicitly incompatible
// ============================================================

export const STYLE_OCCASION_INCOMPATIBLE: Record<string, string[]> = {
  Streetwear: ["Formal Event", "Wedding", "Office", "Meeting"],
  Sporty: ["Formal Event", "Wedding"],
  Gym: ["Formal Event", "Wedding", "Office", "Meeting"],
};

// ============================================================
// PREFERENCE EXPLANATION TEMPLATES
// ============================================================

export function buildPreferenceExplanation(
  preferredStyles: string[],
  preferredOccasion: string | undefined,
  shape: string,
  skinToneDesc: string
): string {
  const stylesText = preferredStyles.length > 0
    ? preferredStyles.join(", ")
    : "pilihan bebas";

  const occasionText = preferredOccasion
    ? ` dengan konteks utama untuk acara ${preferredOccasion}`
    : "";

  const bodyContext = shape
    ? ` Seluruh item kemudian disesuaikan kembali dengan bentuk tubuh ${shape}`
    : "";

  const colorContext = skinToneDesc
    ? ` dan tone kulit ${skinToneDesc}`
    : "";

  return `Karena Anda memilih gaya ${stylesText}${occasionText}, sistem memprioritaskan item yang sesuai dengan preferensi tersebut.${bodyContext}${colorContext} sehingga menghasilkan tampilan yang proporsional, harmonis, dan benar-benar personal.`;
}

// ============================================================
// CORE BOOST FUNCTION
// Reorders a list of clothing items based on style preference.
// Items matching preferred styles appear first.
// Items blocked by occasion are removed.
// ============================================================

export interface ClothingCandidate {
  type: string;
  style: string;
  fit: string;
  reason: string;
}

export function applyStylePreferenceBoost<T extends ClothingCandidate>(
  candidates: T[],
  preferredStyles: string[],
  preferredOccasion?: string
): T[] {
  if (!candidates.length) return candidates;

  // 1. Build boost keywords from preferred styles
  const boostKeywords: string[] = preferredStyles.flatMap(
    (s) => STYLE_ITEM_BOOST[s] ?? []
  );

  // 2. Build blocked keywords from occasion
  const blockedKeywords: string[] = preferredOccasion
    ? (OCCASION_BLOCKED_ITEMS[preferredOccasion] ?? [])
    : [];

  // 3. Build priority keywords from occasion
  const priorityKeywords: string[] = preferredOccasion
    ? (OCCASION_PRIORITY_ITEMS[preferredOccasion] ?? [])
    : [];

  const matchesKeyword = (item: T, keywords: string[]): boolean => {
    if (!keywords.length) return false;
    const haystack = `${item.type} ${item.style} ${item.fit}`.toLowerCase();
    return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
  };

  // 4. Filter out blocked items (occasion hard blocks)
  const allowed = candidates.filter(
    (item) => !matchesKeyword(item, blockedKeywords)
  );

  // 5. Score each item
  const scored = allowed.map((item) => {
    let score = 0;
    if (matchesKeyword(item, priorityKeywords)) score += 20;  // occasion priority
    if (matchesKeyword(item, boostKeywords)) score += 10;     // style preference
    return { item, score };
  });

  // 6. Stable sort: higher score first, preserve relative order for ties
  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}

// ============================================================
// OCCASION VALIDATION
// Returns true if the given style is compatible with the occasion
// ============================================================

export function isStyleCompatibleWithOccasion(
  style: string,
  occasion: string | undefined
): boolean {
  if (!occasion) return true;
  const incompatible = STYLE_OCCASION_INCOMPATIBLE[style];
  if (!incompatible) return true;
  return !incompatible.includes(occasion);
}
