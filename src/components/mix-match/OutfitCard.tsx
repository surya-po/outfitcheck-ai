"use client";

import { useState, useTransition } from "react";
import { MixMatchProduct, GeneratedOutfit } from "@/lib/mix-match-engine/outfit-types";
import { NormalizedProfile } from "@/lib/product-matching-engine/types";
import { saveOutfitToWardrobe } from "@/app/actions/mix-match";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  ShoppingBag,
  Store,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Props {
  outfit: GeneratedOutfit;
  rank: number;
  profile: NormalizedProfile | null;
}

const SLOT_LABELS: Record<string, string> = {
  top: "Atasan",
  bottom: "Bawahan",
  footwear: "Alas Kaki",
  outer: "Outer",
  bag: "Tas",
  accessory: "Aksesoris",
};

const SCORE_COLOR = (score: number) => {
  if (score >= 85) return "text-green-600 dark:text-green-400";
  if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
  return "text-gray-500 dark:text-gray-400";
};

const SCORE_BG = (score: number) => {
  if (score >= 85) return "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
  if (score >= 70) return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800";
  return "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductSlot({
  label,
  product,
}: {
  label: string;
  product: MixMatchProduct;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0 border-gray-100 dark:border-gray-800">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
            {label[0]}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#EC4899] dark:text-[#FBCFE8]">
          {label}
        </span>
        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 mt-0.5">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            {formatPrice(product.price)}
          </span>
          {product.boutiqueName && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
              · {product.boutiqueName}
            </span>
          )}
        </div>
      </div>

      {/* Score badge */}
      <div
        className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold ${SCORE_BG(product.compatibilityScore)}`}
      >
        <span className={SCORE_COLOR(product.compatibilityScore)}>
          {product.compatibilityScore}%
        </span>
      </div>
    </div>
  );
}

export function OutfitCard({ outfit, rank }: Props) {
  const [showDetail, setShowDetail] = useState(rank === 0);
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const allSlotEntries = Object.entries(outfit.slots) as [
    string,
    MixMatchProduct,
  ][];
  const totalPrice = allSlotEntries.reduce(
    (sum, [, p]) => sum + (p.price || 0),
    0
  );
  const allProductIds = allSlotEntries.map(([, p]) => p.id);

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await saveOutfitToWardrobe(
          allProductIds,
          outfit.outfitScore,
          outfit.explanation
        );
        if (result.success) {
          setIsSaved(true);
          if (result.saved > 0) {
            toast.success(
              `${result.saved} produk disimpan ke Digital Wardrobe!${result.skipped > 0 ? ` (${result.skipped} sudah tersimpan)` : ""}`
            );
          } else {
            toast.info("Semua produk sudah ada di Digital Wardrobe Anda.");
          }
        }
      } catch {
        toast.error("Gagal menyimpan outfit.");
      }
    });
  };

  const RANK_STYLES: Record<number, string> = {
    0: "from-[#EC4899] to-[#8B5CF6]",
    1: "from-[#8B5CF6] to-[#6366F1]",
    2: "from-[#6366F1] to-[#3B82F6]",
    3: "from-[#3B82F6] to-[#06B6D4]",
    4: "from-[#06B6D4] to-[#10B981]",
  };

  const gradientClass = RANK_STYLES[rank] || RANK_STYLES[4];

  return (
    <Card className="overflow-hidden border-[#FDF2F8] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradientClass} p-4 text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">
              {outfit.outfitLabel}
            </span>
            <h3 className="text-lg font-bold mt-0.5">{outfit.style} Outfit</h3>
          </div>
          {/* Score Ring */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex flex-col items-center justify-center">
              <span className="text-lg font-black leading-none">
                {outfit.outfitScore}
              </span>
              <span className="text-[9px] opacity-80 font-semibold">SCORE</span>
            </div>
          </div>
        </div>

        {/* Match Badges */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {outfit.matchedBodyShape && (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/20 px-2 py-1 rounded-full">
              <Check className="w-3 h-3" /> Body Shape
            </span>
          )}
          {outfit.matchedSkinTone && (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/20 px-2 py-1 rounded-full">
              <Check className="w-3 h-3" /> Skin Tone
            </span>
          )}
          {outfit.colorPalette.length > 0 && (
            <div className="flex items-center gap-1">
              {outfit.colorPalette.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full"
                >
                  {color}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Explanation */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start gap-2 p-3 bg-[#FFF7FB] dark:bg-[#EC4899]/5 border border-[#FDF2F8] dark:border-[#EC4899]/20 rounded-xl">
          <Sparkles className="w-4 h-4 text-[#EC4899] shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            {outfit.explanation}
          </p>
        </div>
      </div>

      {/* Product Slots */}
      <div className="px-4 pt-2">
        <button
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-200 py-2"
          onClick={() => setShowDetail(!showDetail)}
        >
          <span>Produk Digunakan ({allSlotEntries.length} item)</span>
          {showDetail ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {showDetail && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            {allSlotEntries.map(([slot, product]) => (
              <ProductSlot
                key={slot}
                label={SLOT_LABELS[slot] || slot}
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
        {/* Total Price */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Estimasi Total</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isPending || isSaved}
            size="sm"
            className={`flex-1 ${
              isSaved
                ? "bg-green-500 hover:bg-green-500 text-white"
                : "bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white hover:shadow-md"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 mr-1" /> Tersimpan
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-1" />
                {isPending ? "Menyimpan..." : "Simpan Outfit"}
              </>
            )}
          </Button>

          <Link href="/collection" className="shrink-0">
            <Button size="sm" variant="outline" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </Link>

          {outfit.slots.top?.boutiqueId && (
            <Link
              href={`/marketplace?boutique=${outfit.slots.top.boutiqueId}`}
              className="shrink-0"
            >
              <Button size="sm" variant="outline" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <Store className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Product links */}
        {showDetail && (
          <div className="flex flex-wrap gap-2 pt-1">
            {allSlotEntries.map(([slot, product]) => (
              <Link
                key={`link-${slot}`}
                href={`/marketplace/${product.id}`}
                className="flex items-center gap-1 text-[10px] font-medium text-[#8B5CF6] hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                {SLOT_LABELS[slot] || slot}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
