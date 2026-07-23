import { Suspense } from "react";
import { getMarketplaceProducts, MarketplaceSearchParams } from "@/app/actions/marketplace";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import { MarketplaceFilter } from "@/components/marketplace/MarketplaceFilter";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Marketplace | Fitcheck AI",
};

export default async function MarketplacePage(
  props: {
    searchParams?: Promise<{ [key: string]: string | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const viewAll = searchParams?.view === "all";
  const limit = viewAll ? 1000 : 12;

  const getPaginatedUrl = () => {
    const params = new URLSearchParams(searchParams as any);
    params.delete("view");
    return `/marketplace?${params.toString()}`;
  };

  const getViewAllUrl = () => {
    const params = new URLSearchParams(searchParams as any);
    params.set("view", "all");
    params.delete("page");
    return `/marketplace?${params.toString()}`;
  };

  const queryParams: MarketplaceSearchParams = {
    q: searchParams?.q,
    category: searchParams?.category,
    style: searchParams?.style,
    gender: searchParams?.gender,
    color: searchParams?.color,
    season: searchParams?.season,
    sort: searchParams?.sort as any,
    page,
    limit,
  };

  const { products, pagination } = await getMarketplaceProducts(queryParams);

  // Check if we need to show Featured / New Arrivals / AI Best Match sections 
  // (We show them if there are no active filters or searches)
  const isDefaultView = !searchParams?.q && !searchParams?.category && !searchParams?.style && !searchParams?.sort && page === 1;

  // Render hero banner only on default view
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in-50 duration-500 pb-12">
      {/* Header / Hero Banner */}
      {isDefaultView && (
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-primary to-[#E14D72] p-8 sm:p-12 text-primary-foreground shadow-sm border border-primary/20">
          <div className="relative z-10 max-w-2xl space-y-4">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              AI Powered Marketplace
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
              Temukan Gaya Sempurna Anda
            </h1>
            <p className="text-primary-foreground/90 text-lg leading-relaxed max-w-xl">
              Jelajahi koleksi eksklusif dari boutique partner terverifikasi. Kami merekomendasikan produk terbaik berdasarkan bentuk tubuh dan analisis AI Anda.
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          
          <ShoppingBag className="absolute -right-8 -bottom-8 w-64 h-64 text-white opacity-10 rotate-12" />
        </div>
      )}

      {/* Filter and Search Section */}
      <div className="sticky top-0 z-20 pt-2 pb-4 bg-background/80 backdrop-blur-xl">
        <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded-full" />}>
          <MarketplaceFilter />
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {isDefaultView && products.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-heading font-bold text-foreground">Rekomendasi Untuk Anda</h2>
            </div>
            {!viewAll && (
              <Link 
                href={getViewAllUrl()}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Lihat Semua
              </Link>
            )}
          </div>
        )}

        {products.length > 0 ? (
          <>
            <MarketplaceGrid products={products} />

            {/* Pagination Controls */}
            {!viewAll && pagination.totalPages > 1 && (
              <div className="flex flex-col items-center justify-center gap-4 pt-8">
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link 
                      href={`/marketplace?${new URLSearchParams({ ...searchParams as any, page: (page - 1).toString() }).toString()}`}
                      className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Sebelumnya
                    </Link>
                  )}
                  <span className="text-sm text-muted-foreground px-2">
                    Halaman {page} dari {pagination.totalPages}
                  </span>
                  {page < pagination.totalPages && (
                    <Link 
                      href={`/marketplace?${new URLSearchParams({ ...searchParams as any, page: (page + 1).toString() }).toString()}`}
                      className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Selanjutnya
                    </Link>
                  )}
                </div>
                <Link 
                  href={getViewAllUrl()}
                  className="px-6 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                >
                  Lihat Semua Produk
                </Link>
              </div>
            )}

            {/* Back to pagination when viewing all */}
            {viewAll && pagination.totalItems > 12 && (
              <div className="flex items-center justify-center pt-8">
                <Link 
                  href={getPaginatedUrl()}
                  className="px-6 py-2 rounded-full border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                >
                  Tampilkan dengan Halaman
                </Link>
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// Ensure Badge is imported (create a small local wrapper if we need it)
import { Badge } from "@/components/ui/badge";


