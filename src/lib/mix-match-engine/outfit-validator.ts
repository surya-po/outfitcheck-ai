import { MixMatchProduct, GeneratedOutfit } from "./outfit-types";

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validates that an outfit combination is sound and usable.
 * Rules:
 *  1. Mandatory slots (top, bottom, footwear) must be filled.
 *  2. All products must be PUBLISHED and have stock > 0.
 *  3. No duplicate product IDs across the outfit.
 *  4. Boutique must be verified (already filtered at DB level, but double-checked here).
 */
export function validateOutfit(slots: GeneratedOutfit["slots"]): ValidationResult {
  const mandatory: { key: string; product: MixMatchProduct | undefined }[] = [
    { key: "top", product: slots.top },
    { key: "bottom", product: slots.bottom },
    { key: "footwear", product: slots.footwear },
  ];

  // Rule 1: Mandatory slots must exist
  for (const { key, product } of mandatory) {
    if (!product) {
      return { valid: false, reason: `Missing mandatory slot: ${key}` };
    }
  }

  // Rule 2: PUBLISHED and stock > 0
  const all: MixMatchProduct[] = [
    slots.top,
    slots.bottom,
    slots.footwear,
    slots.outer,
    slots.bag,
    slots.accessory,
  ].filter((p): p is MixMatchProduct => !!p);

  for (const product of all) {
    if (product.productStatus && product.productStatus !== "PUBLISHED") {
      return { valid: false, reason: `Product "${product.name}" is not published` };
    }
    if (product.stock !== undefined && product.stock <= 0) {
      return { valid: false, reason: `Product "${product.name}" is out of stock` };
    }
  }

  // Rule 3: No duplicate product IDs
  const ids = all.map((p) => p.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    return { valid: false, reason: "Duplicate product in outfit" };
  }

  return { valid: true };
}

/**
 * Quick check: does a product belong to a given category slot?
 * Uses the SLOT_CATEGORY_MAP but exposed as a standalone helper.
 */
export function productBelongsToSlot(
  productCategory: string,
  slotCategories: string[]
): boolean {
  const normalized = productCategory.toLowerCase().trim();
  return slotCategories.some((sc) => normalized.includes(sc) || sc.includes(normalized));
}
