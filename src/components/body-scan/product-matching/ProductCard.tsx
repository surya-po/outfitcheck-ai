import { Product } from "@/lib/product-matching-engine/product-types";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BaseProductCard } from "@/components/ui/base-product-card";

export interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
  isBestMatch?: boolean;
}

export function ProductCard({ product, onViewDetail, isFavorite = false, onToggleFavorite, isBestMatch = false }: ProductCardProps) {
  const CONFIDENCE_LABEL_ID: Record<string, string> = {
    "Very High": "Sangat Tinggi",
    "High": "Tinggi",
    "Medium": "Sedang",
    "Low": "Rendah",
  };

  let confidenceColor = "bg-gray-500";
  if (product.confidenceLevel === "Very High") confidenceColor = "bg-emerald-500";
  else if (product.confidenceLevel === "High") confidenceColor = "bg-blue-500";
  else if (product.confidenceLevel === "Medium") confidenceColor = "bg-amber-500";
  else if (product.confidenceLevel === "Low") confidenceColor = "bg-red-500";

  const badges = (
    <div className="flex flex-col gap-1">
      <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-foreground border-border/50 shadow-sm px-2 py-0.5 text-[10px] font-bold">
        <span className="text-primary mr-1">{product.compatibilityScore}%</span> Cocok
      </Badge>
      {product.confidenceLevel && (
        <Badge className={`${confidenceColor} text-white border-none shadow-sm font-bold px-2 py-0.5 text-[9px]`}>
          {CONFIDENCE_LABEL_ID[product.confidenceLevel ?? ""] ?? product.confidenceLevel}
        </Badge>
      )}
    </div>
  );

  const overlays = isBestMatch ? (
    <Badge className="bg-gradient-to-r from-primary to-[#E14D72] hover:from-primary hover:to-[#E14D72] text-primary-foreground border-none shadow-sm font-bold px-2 py-1 text-[10px] flex items-center gap-1">
      <CheckCircle className="w-3 h-3" /> Paling Cocok
    </Badge>
  ) : undefined;

  const actions = onToggleFavorite ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavorite(product);
      }}
      className="w-8 h-8 rounded-full bg-background/60 backdrop-blur-md flex items-center justify-center border border-border/60 shadow-sm hover:scale-110 transition-transform z-10"
    >
      <Heart 
        className={`w-4 h-4 transition-colors ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`} 
      />
    </button>
  ) : undefined;

  const subtitle = (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">
        {product.category}
      </span>
    </div>
  );

  const customActions = (
    <div className="w-full mt-2">
      <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2 leading-tight min-h-[30px]">
        {product.recommendationReason}
      </p>
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          onViewDetail(product);
        }}
        variant="outline"
        className="w-full text-xs h-8 rounded-[var(--radius-button)] border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      >
        Lihat Detail
      </Button>
    </div>
  );

  return (
    <BaseProductCard
      image={product.image}
      title={product.name}
      subtitle={subtitle}
      price={product.price}
      badges={badges}
      actions={actions}
      overlays={overlays}
      className={isBestMatch ? 'border-primary shadow-[0_0_15px_rgba(236,72,153,0.3)]' : ''}
      footer={customActions}
    />
  );
}


