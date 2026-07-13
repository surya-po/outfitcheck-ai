"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/product-matching-engine/product-types";
import { ProductCard } from "@/components/body-scan/product-matching/ProductCard";
import { ProductDetailDialog } from "@/components/body-scan/product-matching/ProductDetailDialog";
import { toggleFavoriteOutfit } from "@/app/actions/wardrobe";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

interface SavedOutfitData {
  savedOutfitId: string;
  savedAt: Date;
  product: Product;
}

interface CollectionClientProps {
  initialOutfits: SavedOutfitData[];
}

export default function CollectionClient({ initialOutfits }: CollectionClientProps) {
  const [outfits, setOutfits] = useState<SavedOutfitData[]>(initialOutfits);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  // Removed outfits that the user un-favorites (optimistic UI)
  const handleToggleFavorite = async (product: Product) => {
    // Optimistic removal
    setOutfits((prev) => prev.filter((o) => o.product.id !== product.id));
    try {
      await toggleFavoriteOutfit(product.id);
    } catch (error) {
      console.error("Failed to unfavorite", error);
      // Revert if failed (simple reload strategy or just add it back)
    }
  };

  const filteredAndSortedOutfits = useMemo(() => {
    let result = [...outfits];

    // Filter by Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.product.name.toLowerCase().includes(query) ||
          o.product.style.toLowerCase().includes(query)
      );
    }

    // Filter by Category
    if (categoryFilter !== "all") {
      result = result.filter((o) => o.product.category === categoryFilter);
    }

    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a.savedAt).getTime();
      const timeB = new Date(b.savedAt).getTime();
      return sortOrder === "latest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [outfits, searchQuery, categoryFilter, sortOrder]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari gaya atau nama produk..."
            className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-white/30 h-11 rounded-xl focus-visible:ring-[#EC4899]"
          />
        </div>
        
        <div className="flex gap-2 overflow-hidden">
          <div className="flex bg-black/20 rounded-xl p-1 border border-white/10 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {["all", "Atasan", "Bawahan", "Dress", "Outerwear", "Sepatu", "Sandal", "Tas", "Hijab", "Aksesoris"].map((cat) => {
              const labels: Record<string, string> = {
                all: "Semua",
                "Atasan": "Atasan",
                "Bawahan": "Bawahan",
                "Dress": "Dress",
                "Outerwear": "Outerwear",
                "Sepatu": "Sepatu",
                "Sandal": "Sandal",
                "Tas": "Tas",
                "Hijab": "Hijab",
                "Aksesoris": "Aksesoris",
              };
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    categoryFilter === cat
                      ? "bg-[#EC4899] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {labels[cat]}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}
            className="bg-black/20 border-white/10 text-white hover:bg-white/10 h-11 rounded-xl px-4"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {sortOrder === "latest" ? "Terbaru" : "Terlama"}
          </Button>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSortedOutfits.length === 0 ? (
        <div className="text-center py-12 text-white/50 bg-white/5 rounded-2xl border border-white/10">
          Tidak ada outfit yang cocok dengan filter pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAndSortedOutfits.map((outfit) => (
            <ProductCard
              key={outfit.savedOutfitId}
              product={outfit.product}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
              onViewDetail={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
