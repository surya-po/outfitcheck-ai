"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export function MarketplaceFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for search to avoid UI lag while typing
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Update query params function
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Always reset to page 1 when filtering
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchQuery });
  };

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentStyle = searchParams.get("style") || "";
  const currentGender = searchParams.get("gender") || "";

  const hasActiveFilters = currentCategory || currentStyle || currentGender || (searchParams.get("q"));

  const clearFilters = () => {
    setSearchQuery("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk atau nama boutique..."
            className="pl-10 bg-background/60 backdrop-blur-sm border-border/60 focus-visible:ring-primary rounded-[var(--radius-button)]"
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => {
                setSearchQuery("");
                updateParams({ q: null });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Sort Select */}
        <div className="w-full sm:w-[180px]">
          <Select 
            value={currentSort} 
            onValueChange={(val) => updateParams({ sort: val })}
          >
            <SelectTrigger className="bg-background/60 backdrop-blur-sm border-border/60 rounded-[var(--radius-button)]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="best_match">Best Match (AI)</SelectItem>
              <SelectItem value="popular">Terpopuler</SelectItem>
              <SelectItem value="price_asc">Harga Terendah</SelectItem>
              <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filters Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="bg-background/60 backdrop-blur-sm border-border/60 rounded-[var(--radius-button)] gap-2 sm:hidden">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filter Produk</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Kategori</h4>
                <div className="flex flex-wrap gap-2">
                  {['Atasan', 'Bawahan', 'Dress', 'Outerwear', 'Sepatu', 'Sandal', 'Tas', 'Hijab', 'Aksesoris'].map(cat => (
                    <Badge 
                      key={cat}
                      variant={currentCategory === cat.toLowerCase() ? "default" : "outline"}
                      className={`cursor-pointer ${currentCategory === cat.toLowerCase() ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
                      onClick={() => updateParams({ category: currentCategory === cat.toLowerCase() ? null : cat.toLowerCase() })}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Gender</h4>
                <div className="flex flex-wrap gap-2">
                  {['Women', 'Men', 'Unisex'].map(g => (
                    <Badge 
                      key={g}
                      variant={currentGender === g.toLowerCase() ? "default" : "outline"}
                      className={`cursor-pointer ${currentGender === g.toLowerCase() ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
                      onClick={() => updateParams({ gender: currentGender === g.toLowerCase() ? null : g.toLowerCase() })}
                    >
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Style Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Style</h4>
                <div className="flex flex-wrap gap-2">
                  {['Casual', 'Formal', 'Minimalist', 'Streetwear', 'Vintage'].map(s => (
                    <Badge 
                      key={s}
                      variant={currentStyle === s.toLowerCase() ? "default" : "outline"}
                      className={`cursor-pointer ${currentStyle === s.toLowerCase() ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
                      onClick={() => updateParams({ style: currentStyle === s.toLowerCase() ? null : s.toLowerCase() })}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-primary/20 text-primary hover:bg-primary/10"
                  onClick={clearFilters}
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Quick Filters */}
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 font-medium mr-2">Quick Filter:</span>
        {['Atasan', 'Bawahan', 'Dress', 'Outerwear', 'Sepatu', 'Sandal', 'Tas', 'Hijab', 'Aksesoris'].map(cat => (
          <button
            key={cat}
            onClick={() => updateParams({ category: currentCategory === cat.toLowerCase() ? null : cat.toLowerCase() })}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              currentCategory === cat.toLowerCase() 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-background/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}


