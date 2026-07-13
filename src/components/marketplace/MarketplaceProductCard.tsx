import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SaveToWardrobeButton } from "./SaveToWardrobeButton";
import { MarketplaceProduct } from "@/app/actions/marketplace";
import { Store, Star } from "lucide-react";

interface MarketplaceProductCardProps {
  product: MarketplaceProduct;
  isSaved?: boolean;
}

export function MarketplaceProductCard({ product, isSaved = false }: MarketplaceProductCardProps) {
  const {
    id,
    name,
    boutique,
    price,
    discountPrice,
    image,
    thumbnail,
    compatibilityScore,
  } = product;

  const displayImage = thumbnail || image;
  const isBestMatch = compatibilityScore ? compatibilityScore >= 85 : false;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <Link href={`/marketplace/${id}`} className="group block">
      <div className="relative bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/40 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={displayImage} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
            {isBestMatch && (
              <Badge className="bg-pink-500 hover:bg-pink-600 text-white border-none shadow-md font-semibold px-2 py-0.5 text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Best Match
              </Badge>
            )}
            {discountPrice && discountPrice < price && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white border-none shadow-md font-semibold px-2 py-0.5 text-xs">
                Sale
              </Badge>
            )}
          </div>

          {/* Save Button */}
          <div className="absolute top-3 right-3 z-10">
            <SaveToWardrobeButton 
              productId={id} 
              initialIsSaved={isSaved} 
              compatibilityScore={compatibilityScore}
            />
          </div>
          
          {/* AI Score Overlay */}
          {compatibilityScore !== undefined && !isBestMatch && (
            <div className="absolute bottom-3 left-3">
               <Badge className="bg-white/80 backdrop-blur-sm text-gray-800 border-none shadow-sm px-2 py-0.5 text-xs">
                 {compatibilityScore}% Cocok
               </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {boutique && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Store className="w-3.5 h-3.5" />
              <span className="truncate hover:text-pink-600 transition-colors">
                {boutique.name}
              </span>
            </div>
          )}
          
          <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-pink-600 transition-colors">
            {name}
          </h3>
          
          <div className="flex items-end gap-2 pt-1">
            {discountPrice && discountPrice < price ? (
              <>
                <span className="text-lg font-bold text-pink-600 leading-none">
                  {formatRupiah(discountPrice)}
                </span>
                <span className="text-sm text-gray-400 line-through leading-none pb-[2px]">
                  {formatRupiah(price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 leading-none">
                {formatRupiah(price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
