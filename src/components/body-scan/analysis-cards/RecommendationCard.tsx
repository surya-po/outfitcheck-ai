"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { FashionRecommendationProfile } from "@/lib/fashion-recommendation-engine/recommendation-types";
import { ProductCard } from "../product-matching/ProductCard";
import { ProductDetailDialog } from "../product-matching/ProductDetailDialog";
import { Product } from "@/lib/product-matching-engine/product-types";

function RecommendationSection({ title, emoji, items, onViewDetail, savedProductIds = new Set(), onToggleFavorite }: { title: string, emoji: string, items: Product[], onViewDetail: (p: Product) => void, savedProductIds?: Set<string>, onToggleFavorite?: (p: Product) => void }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item, idx) => (
          <ProductCard 
            key={idx} 
            product={item} 
            onViewDetail={onViewDetail}
            isFavorite={savedProductIds.has(item.id)}
            onToggleFavorite={onToggleFavorite}
            isBestMatch={idx === 0 && title.includes("Best Match")}
          />
        ))}
      </div>
    </div>
  );
}

export function RecommendationCard({ result, products = [], savedProductIds = new Set(), onToggleFavorite }: { result: FashionRecommendationProfile, products?: Product[], savedProductIds?: Set<string>, onToggleFavorite?: (p: Product) => void }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!result || !products) return null;

  // Group by score (Assuming they are already sorted desc)
  const bestMatches = products.slice(0, 2);
  const recommended = products.slice(2, 6);
  const alternatives = products.slice(6);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-sm backdrop-blur-sm sm:col-span-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Rekomendasi Fashion AI</h2>
          <p className="text-xs text-white/60">Gaya personal yang disesuaikan khusus untuk Anda berdasarkan data Butik terverifikasi.</p>
        </div>
      </div>

      <div className="bg-[#EC4899]/10 border border-[#EC4899]/20 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🎯</span>
          <span className="text-sm uppercase tracking-wider text-[#EC4899] font-bold">Gaya yang Direkomendasikan</span>
        </div>
        <div className="text-xl font-bold text-white mb-2">{result.primaryStyle}</div>
        <div className="text-xs text-white/70">Alternatif: {result.alternativeStyles.join(", ")}</div>
      </div>

      <RecommendationSection title="Best Match" emoji="⭐" items={bestMatches} onViewDetail={setSelectedProduct} savedProductIds={savedProductIds} onToggleFavorite={onToggleFavorite} />
      <RecommendationSection title="Recommended" emoji="👍" items={recommended} onViewDetail={setSelectedProduct} savedProductIds={savedProductIds} onToggleFavorite={onToggleFavorite} />
      <RecommendationSection title="Alternative" emoji="🔄" items={alternatives} onViewDetail={setSelectedProduct} savedProductIds={savedProductIds} onToggleFavorite={onToggleFavorite} />

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Palet Warna */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <span>🎨</span> Palet Warna
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.recommendedColors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-black/20 pr-3 rounded-full overflow-hidden border border-white/5">
                <div className="w-6 h-6" style={{ backgroundColor: color.hex }} />
                <span className="text-xs text-white/80">{color.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warna Dihindari */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <span>🚫</span> Hindari Warna
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.avoidColors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-black/20 pr-3 rounded-full overflow-hidden border border-white/5">
                <div className="w-6 h-6" style={{ backgroundColor: color.hex }} />
                <span className="text-xs text-white/80">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <span>💡</span> Tips Fashion Personal
        </h3>
        <ul className="space-y-2">
          {result.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
              <span className="text-[#EC4899]">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
          <span>📝</span> Ringkasan AI
        </h3>
        <p className="text-sm text-white/70 leading-relaxed">
          {result.summary}
        </p>
      </div>

      {selectedProduct && (
        <ProductDetailDialog 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}
