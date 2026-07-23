import { getBoutiqueProfile, getMarketplaceProducts } from "@/app/actions/marketplace";
import { notFound } from "next/navigation";
import { Store, MapPin, Globe, ShieldCheck, ExternalLink, Navigation } from "lucide-react";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";
import { EmptyState } from "@/components/marketplace/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const boutique = await getBoutiqueProfile(id);
  return { title: boutique ? `${boutique.name} | Fitcheck AI` : "Boutique Not Found" };
}

export default async function BoutiqueProfilePage(
  props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | undefined }>;
  }
) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;

  const boutique = await getBoutiqueProfile(id);
  if (!boutique) {
    notFound();
  }

  // Fetch only products from this boutique
  const { products, pagination } = await getMarketplaceProducts({
    boutiqueId: id,
    page,
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 animate-in fade-in duration-700">
      
      {/* 1. Hero Banner Area (Modern Full-bleed style) */}
      <div className="relative w-full h-[280px] sm:h-[350px] lg:h-[400px] overflow-hidden">
        {boutique.banner ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={boutique.banner} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 relative">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] to-transparent" />
          </div>
        )}
      </div>

      {/* 2. Boutique Profile Container (Overlapping the banner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-24 sm:-mt-32">
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          
          {/* Logo */}
          <div className="shrink-0 group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-[var(--radius-card)] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-full rounded-[var(--radius-card)] overflow-hidden bg-gray-50 flex items-center justify-center text-gray-300">
                {boutique.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={boutique.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-12 h-12" />
                )}
              </div>
            </div>
          </div>

          {/* Info Details */}
          <div className="flex-1 pt-2 md:pt-14 pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                  {boutique.name}
                  {boutique.verified && (
                    <span title="Verified Partner" className="bg-blue-50 text-blue-500 p-1.5 rounded-full ring-1 ring-blue-100 shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </span>
                  )}
                </h1>
                
                {boutique.city && (
                  <p className="text-gray-500 mt-2 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    {boutique.city}, {boutique.province}
                  </p>
                )}
              </div>
              
              {/* Quick Actions / Links */}
              <div className="flex flex-wrap gap-2">
                {boutique.instagram && (
                  <a href={`https://instagram.com/${boutique.instagram.replace('@','')}`} target="_blank" rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                    <ExternalLink className="w-4 h-4" /> Instagram
                  </a>
                )}
                {boutique.website && (
                  <a href={boutique.website} target="_blank" rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                {boutique.mapsUrl && (
                  <a href={boutique.mapsUrl} target="_blank" rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 border border-pink-100 rounded-full text-sm font-medium hover:bg-pink-100 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                    <Navigation className="w-4 h-4" /> Lokasi
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            {boutique.description && (
              <p className="text-gray-600 max-w-3xl leading-relaxed text-base sm:text-lg">
                {boutique.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Koleksi Terbaru
          </h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {pagination.totalItems} Produk
          </span>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {products.map((product, idx) => (
                <div key={product.id} className="animate-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${(idx % 5) * 100}ms` }}>
                  <MarketplaceProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-16">
                {page > 1 && (
                  <Link 
                    href={`/marketplace/boutique/${id}?page=${page - 1}`}
                    className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 hover:text-pink-600 transition-all"
                  >
                    Sebelumnya
                  </Link>
                )}
                <span className="text-sm text-gray-400 font-medium px-4">
                  Halaman {page} dari {pagination.totalPages}
                </span>
                {page < pagination.totalPages && (
                  <Link 
                    href={`/marketplace/boutique/${id}?page=${page + 1}`}
                    className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 hover:text-pink-600 transition-all"
                  >
                    Selanjutnya
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="pt-10">
            <EmptyState 
              title="Koleksi Masih Kosong" 
              description="Butik ini belum menambahkan produk ke dalam etalase mereka."
              actionText="Jelajahi Butik Lain"
            />
          </div>
        )}
      </div>
    </div>
  );
}


