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
      <h3 className="text-foreground font-bold text-sm mb-3 flex items-center gap-2">
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
    <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-4 sm:p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-button)] bg-gradient-to-br from-primary to-[#E14D72] text-primary-foreground">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Rekomendasi Fashion AI</h2>
          <p className="text-xs text-muted-foreground">Gaya personal yang disesuaikan khusus untuk Anda berdasarkan data Butik terverifikasi.</p>
        </div>
      </div>

      {/* ── Your Fashion Preference ── */}
      {((result.preferredStyles && result.preferredStyles.length > 0) || result.preferredOccasion) && (
        <div className="bg-gradient-to-r from-primary/10 to-[#E14D72]/10 border border-primary/20 rounded-[var(--radius-card)] p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">✨</span>
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Your Fashion Preference</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {result.preferredStyles && result.preferredStyles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.preferredStyles.map((s) => (
                  <span key={s} className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold border border-primary/30">
                    {s}
                  </span>
                ))}
              </div>
            )}
            {result.preferredOccasion && (
              <span className="text-xs px-3 py-1 bg-[#E14D72]/15 text-[#E14D72] rounded-full font-semibold border border-[#E14D72]/30">
                📍 {result.preferredOccasion}
              </span>
            )}
          </div>
          {result.preferenceExplanation && (
            <p className="text-xs text-muted-foreground leading-relaxed mt-2 border-t border-primary/10 pt-2">
              {result.preferenceExplanation}
            </p>
          )}
        </div>
      )}

      <div className="bg-primary/10 border border-primary/20 rounded-[var(--radius-card)] p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-sm uppercase tracking-wider text-primary font-bold">Gaya yang Direkomendasikan</span>
          </div>
          {result.fashionPreference && (
            <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded-full uppercase">
              {result.fashionPreference}
            </span>
          )}
        </div>
        <div className="text-xl font-bold text-foreground mb-2">{result.primaryStyle}</div>
        <div className="text-xs text-muted-foreground">Alternatif: {result.alternativeStyles.join(", ")}</div>
      </div>

      <RecommendationSection title="Best Match" emoji="⭐" items={bestMatches} onViewDetail={setSelectedProduct} savedProductIds={savedProductIds} onToggleFavorite={onToggleFavorite} />
      <RecommendationSection title="Recommended" emoji="👍" items={recommended} onViewDetail={setSelectedProduct} savedProductIds={savedProductIds} onToggleFavorite={onToggleFavorite} />
      <RecommendationSection title="Alternative" emoji="🔄" items={alternatives} onViewDetail={setSelectedProduct} savedProductIds={savedProductIds} onToggleFavorite={onToggleFavorite} />

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Palet Warna */}
        <div className="bg-secondary border border-border/60 rounded-[var(--radius-button)] p-4">
          <h3 className="text-foreground font-bold text-sm mb-3 flex items-center gap-2">
            <span>🎨</span> Palet Warna
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.recommendedColors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-background pr-3 rounded-full overflow-hidden border border-border/60 shadow-sm">
                <div className="w-6 h-6" style={{ backgroundColor: color.hex }} />
                <span className="text-xs text-muted-foreground">{color.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warna Dihindari */}
        <div className="bg-secondary border border-border/60 rounded-[var(--radius-button)] p-4">
          <h3 className="text-foreground font-bold text-sm mb-3 flex items-center gap-2">
            <span>🚫</span> Hindari Warna
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.avoidColors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-background pr-3 rounded-full overflow-hidden border border-border/60 shadow-sm">
                <div className="w-6 h-6" style={{ backgroundColor: color.hex }} />
                <span className="text-xs text-muted-foreground">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-foreground font-bold text-sm mb-3 flex items-center gap-2">
          <span>💡</span> Tips Fashion Personal
        </h3>
        <ul className="space-y-2">
          {result.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-secondary border border-border/60 rounded-[var(--radius-button)] p-4">
        <h3 className="text-foreground font-bold text-sm mb-2 flex items-center gap-2">
          <span>📝</span> Ringkasan AI
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
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




