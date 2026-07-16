import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SaveToWardrobeButton } from "./SaveToWardrobeButton";
import { MarketplaceProduct } from "@/app/actions/marketplace";
import { Store, Star } from "lucide-react";
import { BaseProductCard } from "@/components/ui/base-product-card";

interface MarketplaceProductCardProps {
  product: MarketplaceProduct;
  isSaved?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function MarketplaceProductCard({ product, isSaved = false, onClick }: MarketplaceProductCardProps) {
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

  const badges = (
    <>
      {isBestMatch && (
        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-sm font-medium px-2 py-0.5 text-xs flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Best Match
        </Badge>
      )}
      {discountPrice && discountPrice < price && (
        <Badge className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-none shadow-sm font-medium px-2 py-0.5 text-xs">
          Sale
        </Badge>
      )}
    </>
  );

  const actions = (
    <SaveToWardrobeButton 
      productId={id} 
      initialIsSaved={isSaved} 
      compatibilityScore={compatibilityScore}
    />
  );

  const overlays = compatibilityScore !== undefined && !isBestMatch ? (
    <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-foreground border-border/50 shadow-sm px-2 py-0.5 text-xs font-medium">
      {compatibilityScore}% Cocok
    </Badge>
  ) : null;

  const subtitle = boutique ? (
    <div className="flex items-center gap-1.5">
      <Store className="w-3.5 h-3.5" />
      <span className="truncate">{boutique.name}</span>
    </div>
  ) : undefined;

  const card = (
    <BaseProductCard
      image={displayImage}
      title={name}
      subtitle={subtitle}
      price={price}
      discountPrice={discountPrice}
      badges={badges}
      actions={actions}
      overlays={overlays}
      onClick={onClick ? (e) => onClick(e) : undefined}
    />
  );

  if (onClick) {
    return card;
  }

  return (
    <Link href={`/marketplace/${id}`} className="block">
      {card}
    </Link>
  );
}


