import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BaseProductCardProps {
  image?: string;
  title: string;
  subtitle?: React.ReactNode;
  price?: number;
  discountPrice?: number;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  overlays?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  footer?: React.ReactNode;
}

export function BaseProductCard({
  image,
  title,
  subtitle,
  price,
  discountPrice,
  badges,
  actions,
  overlays,
  className,
  onClick,
  footer,
}: BaseProductCardProps) {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/30">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}

        {/* Top-Left Badges */}
        {badges && (
          <div className="absolute left-3 top-3 flex flex-col gap-2 items-start z-10">
            {badges}
          </div>
        )}

        {/* Top-Right Actions (e.g. Save Button) */}
        {actions && (
          <div className="absolute right-3 top-3 z-10">
            {actions}
          </div>
        )}

        {/* Bottom Overlays (e.g. Match Score) */}
        {overlays && (
          <div className="absolute bottom-3 left-3 z-10">
            {overlays}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 gap-1.5">
        {subtitle && (
          <div className="text-xs text-muted-foreground font-medium truncate group-hover:text-primary transition-colors">
            {subtitle}
          </div>
        )}
        
        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors leading-snug">
          {title}
        </h3>
        
        <div className="mt-auto pt-2 flex items-end gap-2">
          {discountPrice && price && discountPrice < price ? (
            <>
              <span className="text-lg font-bold text-primary leading-none">
                {formatRupiah(discountPrice)}
              </span>
              <span className="text-sm text-muted-foreground line-through leading-none pb-[2px]">
                {formatRupiah(price)}
              </span>
            </>
          ) : price !== undefined ? (
            <span className="text-lg font-bold text-foreground leading-none">
              {formatRupiah(price)}
            </span>
          ) : null}
        </div>
        
        {footer && (
          <div className="mt-3 pt-3 border-t border-border/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

