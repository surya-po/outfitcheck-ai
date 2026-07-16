"use client";

import { useState, useTransition } from "react";
import { MixMatchResult } from "@/lib/mix-match-engine/outfit-types";
import { generateOutfitCombinations } from "@/app/actions/mix-match";
import { OutfitGrid } from "@/components/mix-match/OutfitGrid";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Wand2,
  RefreshCw,
  ScanFace,
  ShirtIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Props {
  initialResult: MixMatchResult;
}

export function MixMatchClient({ initialResult }: Props) {
  const [result, setResult] = useState<MixMatchResult>(initialResult);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const newResult = await generateOutfitCombinations();
      setResult(newResult);
    });
  };

  const hasNoBodyScan = !result.hasBodyScan;
  const hasNoProducts = result.hasBodyScan && result.totalProductsConsidered === 0;
  const hasNoOutfits = result.hasBodyScan && result.totalProductsConsidered > 0 && result.outfits.length === 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-card to-muted p-8 md:p-12 text-foreground border border-border/60 shadow-sm">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-[var(--radius-button)]">
              <Wand2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              AI Mix & Match
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3 leading-tight">
            Outfit Lengkap,
            <br />
            <span className="bg-gradient-to-r from-primary to-[#E14D72] bg-clip-text text-transparent">
              Sesuai Tubuh Anda
            </span>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl leading-relaxed mb-8">
            AI akan menyusun kombinasi outfit lengkap — dari atasan hingga alas kaki — berdasarkan bentuk tubuh, skin tone, dan produk dari Boutique Partner kami.
          </p>

          {/* Stats row */}
          {result.hasBodyScan && result.totalProductsConsidered > 0 && (
            <div className="flex flex-wrap gap-6 mb-8 text-sm">
              <div>
                <span className="font-bold text-2xl text-foreground">
                  {result.totalProductsConsidered}
                </span>
                <p className="text-muted-foreground text-xs mt-0.5">Produk Dianalisis</p>
              </div>
              <div>
                <span className="font-bold text-2xl text-foreground">
                  {result.outfits.length}
                </span>
                <p className="text-muted-foreground text-xs mt-0.5">Outfit Dihasilkan</p>
              </div>
              {result.profile?.bodyShape && (
                <div>
                  <span className="font-bold text-2xl text-foreground">
                    {result.profile.bodyShape}
                  </span>
                  <p className="text-muted-foreground text-xs mt-0.5">Body Shape Anda</p>
                </div>
              )}
            </div>
          )}

          {/* Generate Button */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleGenerate}
              disabled={isPending || !result.hasBodyScan}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-sm hover:shadow-sm hover:translate-y-[-2px] transition-all disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  AI Menyusun Outfit...
                </>
              ) : result.outfits.length > 0 ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Generate Ulang
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Outfit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {isPending && (
        <div className="space-y-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-100 dark:bg-gray-800 rounded-[var(--radius-card)] animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty states */}
      {!isPending && hasNoBodyScan && (
        <div className="text-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <ScanFace className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-heading font-bold text-foreground">
            Body Scan Belum Tersedia
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Lakukan Body Scan terlebih dahulu agar AI dapat menganalisis bentuk tubuh dan menghasilkan outfit yang sesuai untuk Anda.
          </p>
          <Link href="/body-scan">
            <Button className="mt-4">
              <ScanFace className="w-4 h-4 mr-2" />
              Mulai Body Scan
            </Button>
          </Link>
        </div>
      )}

      {!isPending && hasNoProducts && (
        <div className="text-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <ShirtIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-heading font-bold text-foreground">
            Belum Ada Produk di Marketplace
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Saat ini belum ada produk yang tersedia di Marketplace. Coba kembali nanti setelah Boutique Partner menambahkan koleksi mereka.
          </p>
          <Link href="/marketplace">
            <Button variant="outline" className="mt-4">
              Kunjungi Marketplace
            </Button>
          </Link>
        </div>
      )}

      {!isPending && hasNoOutfits && (
        <div className="text-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-yellow-500" />
          </div>
          <h3 className="text-xl font-heading font-bold text-foreground">
            Belum Bisa Menyusun Outfit Lengkap
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            AI membutuhkan minimal satu produk di kategori Atasan, Bawahan, dan Alas Kaki untuk membuat kombinasi outfit. Pastikan Boutique Partner sudah memiliki ketiga jenis produk tersebut.
          </p>
          <Button onClick={handleGenerate} disabled={isPending} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Results */}
      {!isPending && result.outfits.length > 0 && (
        <OutfitGrid outfits={result.outfits} profile={result.profile} />
      )}
    </div>
  );
}


