"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteOutfit } from "@/app/actions/wardrobe";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SaveToWardrobeButtonProps {
  productId: string;
  initialIsSaved?: boolean;
  compatibilityScore?: number;
  className?: string;
  iconClassName?: string;
}

export function SaveToWardrobeButton({ 
  productId, 
  initialIsSaved = false, 
  compatibilityScore,
  className,
  iconClassName
}: SaveToWardrobeButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent triggering link if inside an anchor tag
    e.stopPropagation();

    setIsLoading(true);
    try {
      await toggleFavoriteOutfit(productId, compatibilityScore);
      setIsSaved(!isSaved);
      toast.success(isSaved ? "Dihapus dari Digital Wardrobe" : "Disimpan ke Digital Wardrobe");
    } catch (error) {
      toast.error("Gagal menyimpan outfit. Pastikan Anda sudah login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-full backdrop-blur-md bg-white/50 border border-white/40 shadow-sm transition-all hover:bg-white/80 active:scale-95 disabled:opacity-50",
        isSaved && "bg-[#FDF2F8] border-pink-200",
        className
      )}
      aria-label="Save to wardrobe"
    >
      <Heart 
        className={cn(
          "w-5 h-5 transition-colors", 
          isSaved ? "fill-pink-500 text-pink-500" : "text-gray-600",
          iconClassName
        )} 
      />
    </button>
  );
}


