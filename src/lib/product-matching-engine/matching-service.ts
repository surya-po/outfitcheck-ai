import { FashionRecommendationProfile } from "../fashion-recommendation-engine/recommendation-types";
import { Product, StoreInfo } from "./product-types";

export class ProductMatchingService {
  /**
   * Transforms FashionRecommendationProfile into an array of mock Products.
   * This prepares the architecture for future boutique integration.
   */
  public matchProducts(profile: FashionRecommendationProfile): Product[] {
    const products: Product[] = [];

    // Mock Store Info (Future-ready for non-partners)
    const emptyStoreInfo: StoreInfo = {
      isPartner: false,
    };

    profile.recommendations.forEach((item, idx) => {
      // Mock sizes based on category
      let sizes = ["S", "M", "L", "XL"];
      if (item.category === "shoes") sizes = ["40", "41", "42", "43", "44"];
      if (item.category === "accessory") sizes = ["One Size"];

      // Generate a mock product for each recommendation
      const mockProduct: Product = {
        id: `mock-prod-${idx}-${Date.now()}`,
        name: item.style,
        brand: "OutfitCheck AI Partner", // Placeholder brand
        category: item.category as any,
        style: item.style,
        fit: item.fit,
        material: "Katun Premium", // Mock material
        colors: item.colors,
        sizes: sizes,
        gender: "unisex",
        price: 250000 + (Math.floor(Math.random() * 5) * 50000), // Mock price
        // Using a data URI SVG placeholder to avoid external image dependencies breaking
        image: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%231E1E2D' width='400' height='500'/%3E%3Ctext fill='%23ffffff' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${encodeURIComponent(item.type)}%3C/text%3E%3C/svg%3E`,
        status: "available",
        compatibilityScore: item.compatibilityScore,
        recommendationReason: item.reason,
        storeInfo: emptyStoreInfo,
      };

      products.push(mockProduct);
    });

    // Sort by compatibility score descending
    return products.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}

export const productMatchingService = new ProductMatchingService();
