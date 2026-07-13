export interface StoreInfo {
  isPartner: boolean;
  name?: string;
  address?: string;
  phone?: string;
  instagram?: string;
  website?: string;
  mapsUrl?: string;
  openingHours?: string;
  rating?: number;
  boutiqueId?: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: "top" | "bottom" | "shoes" | "accessory";
  style: string;
  fit: string;
  material?: string;
  colors: string[];
  sizes: string[];
  gender?: "male" | "female" | "unisex";
  season?: string;
  description?: string;
  price: number;
  image: string;
  stock?: number;
  status: "available" | "coming_soon" | "out_of_stock";
  compatibilityScore: number;
  recommendationReason: string;
  confidenceLevel?: string;
  storeInfo: StoreInfo;
}
