import { Product } from "@/lib/product-matching-engine/product-types";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle } from "lucide-react";

export interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
  isBestMatch?: boolean;
}

export function ProductCard({ product, onViewDetail, isFavorite = false, onToggleFavorite, isBestMatch = false }: ProductCardProps) {
  // Determine confidence color
  let confidenceColor = "bg-gray-500";
  if (product.confidenceLevel === "Very High") confidenceColor = "bg-emerald-500";
  else if (product.confidenceLevel === "High") confidenceColor = "bg-blue-500";
  else if (product.confidenceLevel === "Medium") confidenceColor = "bg-amber-500";
  else if (product.confidenceLevel === "Low") confidenceColor = "bg-red-500";

  return (
    <div className={`bg-white/5 border ${isBestMatch ? 'border-[#EC4899] shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-white/10'} rounded-xl overflow-hidden flex flex-col group hover:border-[#EC4899]/50 transition-colors relative`}>
      
      {/* Image Area */}
      <div className="relative w-full aspect-[4/5] bg-black/50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        
        {/* Compatibility Score & Confidence Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 shadow-sm flex items-center gap-1">
            <span className="text-[#EC4899]">{product.compatibilityScore}%</span> Cocok
          </div>
          {product.confidenceLevel && (
            <div className={`text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm ${confidenceColor}`}>
              {product.confidenceLevel}
            </div>
          )}
        </div>
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-sm hover:scale-110 transition-transform z-10"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${isFavorite ? "fill-[#EC4899] text-[#EC4899]" : "text-white/80"}`} 
            />
          </button>
        )}

        {isBestMatch && (
          <div className="absolute bottom-2 right-2 bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Best Match
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wider text-[#EC4899] font-bold mb-1">
            {product.category}
          </div>
          <h4 className="text-white font-medium text-sm line-clamp-1 mb-1">
            {product.name}
          </h4>
          <p className="text-[10px] text-white/50 mb-2 line-clamp-2 leading-tight">
            {product.recommendationReason}
          </p>
        </div>
        
        <div className="mt-auto">
          <div className="text-white font-bold text-sm mb-3">
            Rp {product.price.toLocaleString("id-ID")}
          </div>
          <Button 
            onClick={() => onViewDetail(product)}
            variant="outline"
            className="w-full text-xs h-8 border-white/20 hover:bg-white/10 hover:text-white"
          >
            Lihat Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
