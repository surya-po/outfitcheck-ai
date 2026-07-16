"use client";

import { useState } from "react";
import { MarketplaceProductCard } from "./MarketplaceProductCard";
import { ProductDetailDialog } from "@/components/body-scan/product-matching/ProductDetailDialog";
import { MarketplaceProduct } from "@/app/actions/marketplace";
import { Product } from "@/lib/product-matching-engine/product-types";

interface MarketplaceGridProps {
  products: MarketplaceProduct[];
}

export function MarketplaceGrid({ products }: MarketplaceGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (e: React.MouseEvent, p: MarketplaceProduct) => {
    e.preventDefault();
    
    const dialogProduct: Product = {
      id: p.id,
      name: p.name,
      category: p.categoryRel?.name || p.category || "",
      style: p.style || "",
      fit: p.fit || "",
      material: p.material || "",
      colors: p.colors || [],
      sizes: p.sizes || [],
      price: p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price,
      image: p.image || p.thumbnail || "",
      compatibilityScore: p.compatibilityScore || 0,
      recommendationReason: p.description || "Produk dari Marketplace.",
      storeInfo: p.boutique ? {
        name: p.boutique.name,
        address: p.boutique.city || "",
        phone: p.boutique.phone || "",
        instagram: p.boutique.instagram || "",
        website: p.boutique.website || "",
        mapsUrl: p.boutique.mapsUrl || "",
        openingHours: "",
        isPartner: p.boutique.verified,
      } : {
        name: "Unknown",
        isPartner: false
      }
    };
    
    setSelectedProduct(dialogProduct);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {products.map((product) => (
          <MarketplaceProductCard 
            key={product.id} 
            product={product} 
            onClick={(e) => handleProductClick(e, product)}
          />
        ))}
      </div>
      
      {selectedProduct && (
        <ProductDetailDialog 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}


