import { FashionAnalysisProfile } from "@/lib/body-analysis-engine/analysis-types";
import { runMatchingEngine } from "@/lib/product-matching-engine/matching-engine";
import { normalizeProfile } from "@/lib/product-matching-engine/normalize-profile";
import { ProductData } from "@/lib/product-matching-engine/types";
import {
  MixMatchProduct,
  GeneratedOutfit,
  OutfitFilters,
  SLOT_CATEGORY_MAP,
  OutfitSlotKey,
} from "./outfit-types";
import { validateOutfit } from "./outfit-validator";
import {
  scoreOutfit,
  getOutfitLabel,
  extractColorPalette,
  buildOutfitExplanation,
} from "./outfit-scorer";

// ============================================================
// INTERNAL HELPERS
// ============================================================

/** Maps a raw DB product to ProductData (for the matching engine) */
function toProductData(p: MixMatchProduct): ProductData {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    style: p.style || "",
    fit: p.fit || "",
    season: p.season || null,
    colors: p.colors || [],
    recommendedBodyShapes: [],  // already on ScoredProduct level
    recommendedSkinTones: [],
    price: p.price,
    thumbnail: p.thumbnail,
    image: p.thumbnail,
    stock: p.stock || 0,
    productStatus: p.productStatus || "PUBLISHED",
    updatedAt: p.updatedAt,
    createdAt: p.createdAt,
    boutique: { status: "VERIFIED" },
  };
}

/** Partitions products by their detected outfit slot */
function partitionBySlot(
  products: MixMatchProduct[]
): Record<OutfitSlotKey, MixMatchProduct[]> {
  const result: Record<OutfitSlotKey, MixMatchProduct[]> = {
    top: [],
    bottom: [],
    footwear: [],
    outer: [],
    bag: [],
    accessory: [],
  };

  for (const p of products) {
    const cat = (p.category || "").toLowerCase();
    let assigned = false;
    for (const [slot, keywords] of Object.entries(SLOT_CATEGORY_MAP) as [OutfitSlotKey, string[]][]) {
      if (keywords.some((kw) => cat.includes(kw) || kw.includes(cat))) {
        result[slot].push(p);
        assigned = true;
        break;
      }
    }
    // If not assigned to any slot, skip (product not classifiable)
    if (!assigned) {
      // Attempt looser match for category names in Indonesian
      if (/atasan|kemeja|kaos|blus|shirt|top/i.test(cat)) result.top.push(p);
      else if (/bawahan|celana|rok|dress|skirt|pant/i.test(cat)) result.bottom.push(p);
      else if (/sepatu|sandal|shoe|boot|sneaker|loafer|wedge|heel/i.test(cat)) result.footwear.push(p);
      else if (/jaket|jacket|blazer|cardigan|coat|outer/i.test(cat)) result.outer.push(p);
      else if (/tas|bag|tote|backpack|clutch/i.test(cat)) result.bag.push(p);
      else if (/aksesoris|accessory|jewelry|scarf|hat|belt|topi/i.test(cat)) result.accessory.push(p);
    }
  }

  return result;
}

// ============================================================
// MAIN BUILDER
// ============================================================

/**
 * Builds up to 5 unique outfit combinations using the existing Product Matching Engine.
 *
 * Strategy:
 *  1. Score all products via runMatchingEngine (reuses existing engine entirely).
 *  2. Partition products into category pools (top/bottom/footwear/optional).
 *  3. Build outfit by rotating through top-N picks from each pool so outfits are diverse.
 *  4. Score each outfit, validate, sort by score, return top 5.
 */
export function buildOutfitCombinations(
  analysisProfile: FashionAnalysisProfile,
  allProducts: MixMatchProduct[],
  filters?: OutfitFilters,
  maxOutfits = 5
): GeneratedOutfit[] {
  const normalizedProfile = normalizeProfile(analysisProfile);
  const profileGender = normalizedProfile.gender;

  // Pre-filter products by gender BEFORE scoring
  // This ensures outfit combinations only use appropriate products
  const genderFilteredProducts =
    profileGender && profileGender !== "Unknown"
      ? allProducts.filter((p) => {
          const pg = (p.gender || "").toLowerCase();
          return (
            !pg ||
            pg === "unisex" ||
            pg === profileGender.toLowerCase()
          );
        })
      : allProducts;

  // Step 1: Score gender-filtered products via the existing engine
  const scored = runMatchingEngine(
    analysisProfile,
    genderFilteredProducts.map(toProductData),
    genderFilteredProducts.length
  );

  // Re-attach MixMatch metadata (boutique info, status, etc.) to scored products
  const scoredWithMeta: MixMatchProduct[] = scored.map((sp) => {
    const original = genderFilteredProducts.find((p) => p.id === sp.id);
    return {
      ...sp,
      boutiqueId: original?.boutiqueId,
      boutiqueName: original?.boutiqueName,
      boutiqueVerified: original?.boutiqueVerified,
      discount: original?.discount,
      images: original?.images,
      gender: original?.gender,
      productStatus: original?.productStatus,
      stock: original?.stock || 0,
      style: original?.style,
      material: original?.material,
      colors: original?.colors,
      sizes: original?.sizes,
      fit: original?.fit,
      season: original?.season,
      description: original?.description,
    };
  });

  // Step 2: Partition into category pools
  const pools = partitionBySlot(scoredWithMeta);

  // If no mandatory pools have products, return empty
  if (pools.top.length === 0 || pools.bottom.length === 0 || pools.footwear.length === 0) {
    return [];
  }

  // Step 3: Build candidate outfits with rotation
  // Each outfit picks from a different "position" in the pool to ensure diversity
  const candidateOutfits: GeneratedOutfit[] = [];

  const TOP_POOL_SIZE = Math.min(pools.top.length, 8);
  const BOTTOM_POOL_SIZE = Math.min(pools.bottom.length, 8);
  const FOOTWEAR_POOL_SIZE = Math.min(pools.footwear.length, 5);

  // We generate more candidates than needed, then pick best
  const usedProductIds = new Set<string>();
  let outfitIndex = 0;

  // Cycling strategy: each outfit shifts by 1 position in each pool
  for (let attempt = 0; attempt < maxOutfits * 3; attempt++) {
    if (candidateOutfits.length >= maxOutfits) break;

    const topIndex = attempt % TOP_POOL_SIZE;
    const bottomIndex = (attempt + Math.floor(attempt / TOP_POOL_SIZE)) % BOTTOM_POOL_SIZE;
    const footwearIndex = Math.floor(attempt / 2) % FOOTWEAR_POOL_SIZE;

    const top = pools.top[topIndex];
    const bottom = pools.bottom[bottomIndex];
    const footwear = pools.footwear[footwearIndex];

    // Skip if any core product was used in a previous outfit
    if (
      usedProductIds.has(top.id) ||
      usedProductIds.has(bottom.id) ||
      usedProductIds.has(footwear.id)
    ) {
      continue;
    }

    // Optional slots — rotate through pool if available
    const outerIndex = outfitIndex % Math.max(1, pools.outer.length);
    const bagIndex = outfitIndex % Math.max(1, pools.bag.length);
    const accessoryIndex = outfitIndex % Math.max(1, pools.accessory.length);

    const outer = pools.outer[outerIndex];
    const bag = pools.bag[bagIndex];
    const accessory = pools.accessory[accessoryIndex];

    const slots: GeneratedOutfit["slots"] = {
      top,
      bottom,
      footwear,
      ...(outer ? { outer } : {}),
      ...(bag ? { bag } : {}),
      ...(accessory ? { accessory } : {}),
    };

    // Validate
    const validation = validateOutfit(slots);
    if (!validation.valid) {
      outfitIndex++;
      continue;
    }

    // Score
    const outfitScore = scoreOutfit(slots);

    // Explanation — pass gender for gender-aware styling language
    const explanation = buildOutfitExplanation(
      slots,
      normalizedProfile.bodyShape,
      normalizedProfile.skinTone,
      outfitScore,
      normalizedProfile.gender
    );

    // Dominant style from top product
    const dominantStyle = top.style || bottom.style || "Casual";

    // Check matches
    const matchedBodyShape = top.matchedAttributes?.bodyShape || bottom.matchedAttributes?.bodyShape || false;
    const matchedSkinTone = top.matchedAttributes?.skinTone || bottom.matchedAttributes?.skinTone || false;

    const outfit: GeneratedOutfit = {
      id: `outfit-${Date.now()}-${attempt}`,
      outfitScore,
      outfitLabel: getOutfitLabel(candidateOutfits.length, outfitScore),
      style: dominantStyle,
      explanation,
      slots,
      colorPalette: extractColorPalette(slots),
      matchedBodyShape,
      matchedSkinTone,
    };

    candidateOutfits.push(outfit);

    // Mark products as used (mandatory slots only — optional can repeat)
    usedProductIds.add(top.id);
    usedProductIds.add(bottom.id);
    usedProductIds.add(footwear.id);
    outfitIndex++;
  }

  // Step 4: Sort by outfit score descending
  candidateOutfits.sort((a, b) => b.outfitScore - a.outfitScore);

  // Re-label after sorting
  return candidateOutfits.slice(0, maxOutfits).map((outfit, i) => ({
    ...outfit,
    outfitLabel: getOutfitLabel(i, outfit.outfitScore),
  }));
}
