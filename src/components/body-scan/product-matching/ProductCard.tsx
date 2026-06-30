import { Product } from "@/lib/product-matching-engine/product-types";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export function ProductCard({ product, onViewDetail }: ProductCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col group hover:border-[#EC4899]/50 transition-colors">
      
      {/* Image Area */}
      <div className="relative w-full aspect-square bg-black/50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        {/* Compatibility Score Badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 shadow-sm">
          {product.compatibilityScore}% Cocok
        </div>
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
          <p className="text-xs text-white/50 mb-3">
            {product.style}
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
