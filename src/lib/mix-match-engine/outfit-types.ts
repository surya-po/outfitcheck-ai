import { ScoredProduct, NormalizedProfile } from "@/lib/product-matching-engine/types";

// ============================================================
// SLOT CATEGORIES — maps DB category strings to outfit slots
// ============================================================

export type OutfitSlotKey = "top" | "bottom" | "footwear" | "outer" | "bag" | "accessory";

export const SLOT_CATEGORY_MAP: Record<OutfitSlotKey, string[]> = {
  top: ["atasan", "tops", "kemeja", "kaos", "blouse", "t-shirt", "shirt", "hijab"],
  bottom: ["bawahan", "bottoms", "celana", "rok", "dress", "trousers", "pants", "skirt"],
  footwear: ["sepatu", "shoes", "footwear", "boots", "sneakers", "loafers", "sandal", "sandals", "heels", "wedges"],
  outer: ["outerwear", "jaket", "jacket", "blazer", "cardigan", "coat", "hoodie"],
  bag: ["tas", "bag", "handbag", "backpack", "clutch", "tote"],
  accessory: ["aksesoris", "accessories", "accessory", "jewelry", "watch", "belt", "scarf", "hat", "topi", "kalung", "gelang"],
};

// ============================================================
// TYPES
// ============================================================

/** A product that has been scored and enriched for mix-match use */
export interface MixMatchProduct extends Omit<ScoredProduct, 'stock'> {
  boutiqueId?: string;
  boutiqueName?: string;
  boutiqueVerified?: boolean;
  discount?: number | null;
  images?: string[];
  gender?: string;
  productStatus?: string;
  stock: number;   // required in ScoredProduct, keep as number (0 if null from DB)
  style?: string;
  material?: string;
  colors?: string[];
  sizes?: string[];
  fit?: string;
  season?: string | null;
  description?: string | null;
}

/** A single generated outfit combination */
export interface GeneratedOutfit {
  id: string;
  outfitScore: number;
  outfitLabel: string;           // e.g. "Best Match", "Style Pick #2"
  style: string;                  // dominant style across products
  explanation: string;            // AI-generated human-readable explanation
  slots: {
    top: MixMatchProduct;
    bottom: MixMatchProduct;
    footwear: MixMatchProduct;
    outer?: MixMatchProduct;
    bag?: MixMatchProduct;
    accessory?: MixMatchProduct;
  };
  colorPalette: string[];         // unique colors across all items
  matchedBodyShape: boolean;
  matchedSkinTone: boolean;
}

/** The filters that can be passed to outfit builder (future-ready) */
export interface OutfitFilters {
  occasion?: "casual" | "formal" | "wedding" | "sport" | "daily";
  budget?: number;
  weather?: string;
  favoriteStyle?: string;
  gender?: string;
}

/** Result from the server action */
export interface MixMatchResult {
  outfits: GeneratedOutfit[];
  profile: NormalizedProfile | null;
  hasBodyScan: boolean;
  totalProductsConsidered: number;
}
