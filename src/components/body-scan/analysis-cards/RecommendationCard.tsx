"use client";

import { useState } from "react";
import { Diamond, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { FashionRecommendationProfile } from "@/lib/fashion-recommendation-engine/recommendation-types";
import { FashionAnalysisProfile } from "@/lib/body-analysis-engine/analysis-types";
import { UserStylePreference } from "@/lib/fashion-recommendation-engine/recommendation-types";
import { ProductCard } from "../product-matching/ProductCard";
import { ProductDetailDialog } from "../product-matching/ProductDetailDialog";
import { Product } from "@/lib/product-matching-engine/product-types";

// ─── Analysis Summary Card ────────────────────────────────────────
function AnalysisSummaryCard({
  analysisProfile,
  userStylePreference,
  result,
}: {
  analysisProfile?: FashionAnalysisProfile;
  userStylePreference?: UserStylePreference;
  result: FashionRecommendationProfile;
}) {
  const bodyShape = analysisProfile?.shape?.primaryShape || result.debug?.primaryShape || "—";
  const skinTone = analysisProfile?.colorAnalysis?.skinTone || "—";
  const undertone = analysisProfile?.colorAnalysis?.undertone || "—";
  const proportions = analysisProfile?.proportion?.proportions || [];
  const persona = userStylePreference?.preferredStyles || result.preferredStyles || [];
  const occasion = userStylePreference?.preferredOccasion || result.preferredOccasion;
  const confidence = analysisProfile?.colorAnalysis?.confidence;

  const summaryItems = [
    { label: "Persona", value: persona.length > 0 ? persona.join(", ") : "—", emoji: "✨", highlight: true },
    { label: "Occasion", value: occasion || "—", emoji: "📍", highlight: false },
    { label: "Body Shape", value: bodyShape, emoji: "👤", highlight: false },
    { label: "Skin Tone", value: skinTone, emoji: "🎨", highlight: false },
    { label: "Undertone", value: undertone, emoji: "💎", highlight: false },
    { label: "Proporsi", value: proportions.length > 0 ? proportions.join(", ") : "—", emoji: "📐", highlight: false },
  ];

  return (
    <div className="rounded-[var(--radius-card)] border border-border/60 bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:p-6 shadow-sm mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-button)] bg-gradient-to-br from-primary to-[#E14D72] text-white shadow-sm shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-foreground">Ringkasan Analisis</h2>
          <p className="text-xs text-muted-foreground">Profil fashion personal kamu berdasarkan analisis AI</p>
        </div>
        {confidence && (
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-primary">{confidence.toFixed(0)}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Confidence</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className={`flex flex-col gap-1 p-3 rounded-xl border transition-all ${
              item.highlight
                ? "border-primary/30 bg-primary/8 col-span-2 sm:col-span-1"
                : "border-border/60 bg-background/60"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {item.emoji} {item.label}
            </span>
            <span
              className={`text-sm font-semibold leading-snug ${
                item.highlight ? "text-primary" : "text-foreground"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Color Palette Section ────────────────────────────────────────
function ColorPaletteSection({ result }: { result: FashionRecommendationProfile }) {
  const rec = result.recommendedColors || [];
  const avoid = result.avoidColors || [];
  if (rec.length === 0 && avoid.length === 0) return null;

  return (
    <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-5 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <span>🎨</span> Palet Warna yang Direkomendasikan
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recommended */}
        {rec.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-emerald-500 font-semibold mb-2">
              ✓ Recommended Colors
            </p>
            <div className="flex flex-wrap gap-2">
              {rec.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-background/80 pl-1 pr-3 py-1 rounded-full border border-border/60 shadow-sm"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-foreground font-medium">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Avoid */}
        {avoid.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold mb-2">
              • Less Recommended
            </p>
            <div className="flex flex-wrap gap-2">
              {avoid.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-background/80 pl-1 pr-3 py-1 rounded-full border border-border/60 shadow-sm opacity-70"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm shrink-0 relative"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-bold">✕</div>
                  </div>
                  <span className="text-xs text-muted-foreground line-through">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product Section ──────────────────────────────────────────────
function ProductSection({
  title,
  emoji,
  items,
  onViewDetail,
  savedProductIds = new Set(),
  onToggleFavorite,
  isBestMatch = false,
}: {
  title: string;
  emoji: string;
  items: Product[];
  onViewDetail: (p: Product) => void;
  savedProductIds?: Set<string>;
  onToggleFavorite?: (p: Product) => void;
  isBestMatch?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <h3 className="text-foreground font-bold text-sm flex items-center gap-2">
          <span>{emoji}</span> {title}
          <span className="text-xs text-muted-foreground font-normal">({items.length} produk)</span>
        </h3>
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      {expanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in-50 duration-200">
          {items.map((item, idx) => (
            <ProductCard
              key={idx}
              product={item}
              onViewDetail={onViewDetail}
              isFavorite={savedProductIds.has(item.id)}
              onToggleFavorite={onToggleFavorite}
              isBestMatch={isBestMatch && idx === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Empty State — No Products ────────────────────────────────────
function EmptyProductsState({
  result,
  userStylePreference,
}: {
  result: FashionRecommendationProfile;
  userStylePreference?: UserStylePreference;
}) {
  const persona = userStylePreference?.preferredStyles || result.preferredStyles || [];
  const occasion = userStylePreference?.preferredOccasion || result.preferredOccasion;

  // Generate conceptual outfit suggestion based on persona
  const getConceptualOutfit = () => {
    const p = persona[0]?.toLowerCase() || "";
    if (/formal/.test(p)) return "Blazer navy + kemeja putih + celana bahan hitam + sepatu pantofel";
    if (/streetwear/.test(p)) return "Hoodie oversized + cargo pants + sneakers putih";
    if (/casual/.test(p)) return "T-shirt polos + jeans slim + sneakers";
    if (/sporty/.test(p)) return "Polo shirt + jogger pants + sepatu olahraga";
    if (/minimal/.test(p)) return "Kemeja putih bersih + celana chino + loafers";
    if (/vintage/.test(p)) return "Kemeja flannel + high-waist jeans + ankle boots";
    if (/elegant/.test(p)) return "Dress midi + heels nude + tas clutch";
    if (/korean/.test(p)) return "Oversized knit + wide-leg pants + platform sneakers";
    return "T-shirt basic + celana bahan + sneakers bersih";
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-border/60 bg-muted/30 p-8 text-center">
      <div className="text-4xl mb-3">🛍️</div>
      <h3 className="text-base font-bold text-foreground mb-2">
        Belum ada produk yang cocok dengan persona{persona.length > 0 ? ` ${persona[0]}` : ""}
      </h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
        Butik partner belum memiliki produk dengan kategori{" "}
        <span className="font-semibold text-primary">{persona.join(", ") || "ini"}</span>
        {occasion ? ` untuk acara ${occasion}` : ""}. Produk nyata akan otomatis muncul saat butik menambahkan stok yang relevan.
      </p>

      <div className="bg-card border border-border/60 rounded-xl p-4 max-w-sm mx-auto text-left">
        <p className="text-[10px] uppercase tracking-wider text-primary font-bold mb-2">
          💡 Rekomendasi Outfit Konseptual
        </p>
        <p className="text-sm text-foreground font-medium">{getConceptualOutfit()}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Kombinasi ini ideal untuk bentuk tubuh dan persona kamu. Cari item serupa di toko terdekat.
        </p>
      </div>
    </div>
  );
}

// ─── Main Card ────────────────────────────────────────────────────
export function RecommendationCard({
  result,
  products = [],
  savedProductIds = new Set(),
  onToggleFavorite,
  analysisProfile,
  userStylePreference,
}: {
  result: FashionRecommendationProfile;
  products?: Product[];
  savedProductIds?: Set<string>;
  onToggleFavorite?: (p: Product) => void;
  analysisProfile?: FashionAnalysisProfile;
  userStylePreference?: UserStylePreference;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!result) return null;

  const bestMatches = products.slice(0, 3);
  const recommended = products.slice(3, 8);
  const alternatives = products.slice(8);

  return (
    <div className="space-y-0">
      {/* ── 1. Analysis Summary ── */}
      <AnalysisSummaryCard
        analysisProfile={analysisProfile}
        userStylePreference={userStylePreference}
        result={result}
      />

      {/* ── 2. Main Recommendation Card ── */}
      <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-button)] bg-gradient-to-br from-primary to-[#E14D72] text-primary-foreground shadow-sm">
            <Diamond className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Rekomendasi Outfit</h2>
            <p className="text-xs text-muted-foreground">
              Dipersonalisasi untuk kamu · Produk dari butik terverifikasi
            </p>
          </div>
        </div>

        {/* Persona banner */}
        {((result.preferredStyles && result.preferredStyles.length > 0) ||
          result.preferredOccasion ||
          (userStylePreference?.preferredStyles && userStylePreference.preferredStyles.length > 0)) && (
          <div className="bg-gradient-to-r from-primary/10 to-[#E14D72]/5 border border-primary/20 rounded-[var(--radius-card)] p-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-primary font-bold uppercase tracking-wider mr-1">
                ✨ Menampilkan hasil untuk:
              </span>
              {(userStylePreference?.preferredStyles || result.preferredStyles || []).map((s) => (
                <span
                  key={s}
                  className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold border border-primary/30"
                >
                  {s}
                </span>
              ))}
              {(userStylePreference?.preferredOccasion || result.preferredOccasion) && (
                <span className="text-xs px-3 py-1 bg-[#E14D72]/15 text-[#E14D72] rounded-full font-semibold border border-[#E14D72]/30">
                  📍 {userStylePreference?.preferredOccasion || result.preferredOccasion}
                </span>
              )}
            </div>
            {result.preferenceExplanation && (
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-primary/10">
                {result.preferenceExplanation}
              </p>
            )}
          </div>
        )}

        {/* Products or Empty State */}
        {products.length === 0 ? (
          <EmptyProductsState result={result} userStylePreference={userStylePreference} />
        ) : (
          <>
            <ProductSection
              title="Best Match untuk Kamu"
              emoji="⭐"
              items={bestMatches}
              onViewDetail={setSelectedProduct}
              savedProductIds={savedProductIds}
              onToggleFavorite={onToggleFavorite}
              isBestMatch={true}
            />
            <ProductSection
              title="Rekomendasi Lainnya"
              emoji="👍"
              items={recommended}
              onViewDetail={setSelectedProduct}
              savedProductIds={savedProductIds}
              onToggleFavorite={onToggleFavorite}
            />
            <ProductSection
              title="Alternatif"
              emoji="🔄"
              items={alternatives}
              onViewDetail={setSelectedProduct}
              savedProductIds={savedProductIds}
              onToggleFavorite={onToggleFavorite}
            />
          </>
        )}
      </div>

      {/* ── 3. Color Palette ── */}
      <div className="mt-6">
        <ColorPaletteSection result={result} />
      </div>

      {/* ── 4. Style Tips ── */}
      {result.tips && result.tips.length > 0 && (
        <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <span>💡</span> Tips Styling Personal
          </h3>
          <ul className="space-y-2">
            {result.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5 shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 5. AI Summary ── */}
      {result.summary && (
        <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <span>📝</span> Ringkasan AI Personal Stylist
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
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
