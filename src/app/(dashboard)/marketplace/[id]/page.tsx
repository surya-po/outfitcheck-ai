import { Suspense } from "react";
import { getMarketplaceProductDetail, getRelatedProducts } from "@/app/actions/marketplace";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Store, Star, ShoppingBag, CheckCircle2, ShieldCheck, MapPin, Globe, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SaveToWardrobeButton } from "@/components/marketplace/SaveToWardrobeButton";
import { MarketplaceProductCard } from "@/components/marketplace/MarketplaceProductCard";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Detail Produk ${id} | Fitcheck AI` };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const detail = await getMarketplaceProductDetail(id);
  if (!detail) {
    notFound();
  }

  const { product, aiData, isSaved } = detail;
  const relatedProducts = await getRelatedProducts(product.id, product.categoryId, product.boutiqueId, 5);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const images = product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in-50 duration-500 pb-20">
      {/* Back Navigation */}
      <Link 
        href="/marketplace" 
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-pink-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Kembali ke Marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-[var(--radius-card)] overflow-hidden bg-gray-100 border border-gray-200 relative">
            {images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                <ShoppingBag className="w-12 h-12 mb-2" />
                <p>Tidak ada gambar</p>
              </div>
            )}
            
            {/* Save Button */}
            <div className="absolute top-4 right-4 z-10">
              <SaveToWardrobeButton 
                productId={product.id} 
                initialIsSaved={isSaved}
                compatibilityScore={aiData?.score}
                className="w-12 h-12 shadow-sm bg-white/80 border-none"
                iconClassName="w-6 h-6"
              />
            </div>
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <div key={i} className="w-20 h-24 shrink-0 rounded-[var(--radius-button)] overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:border-pink-500 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Gallery ${i+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <div>
            {product.boutique && (
              <Link href={`/marketplace/boutique/${product.boutique.id}`} className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-medium mb-2 transition-colors">
                <Store className="w-4 h-4" />
                {product.boutique.name}
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 mt-4">
              {product.discountPrice && product.discountPrice < product.price ? (
                <>
                  <span className="text-3xl font-bold text-pink-600 tracking-tight">
                    {formatRupiah(product.discountPrice)}
                  </span>
                  <span className="text-lg text-gray-400 line-through pb-1">
                    {formatRupiah(product.price)}
                  </span>
                  <Badge className="bg-red-100 text-red-600 border-none hover:bg-red-200 ml-2 mb-1">
                    Hemat {formatRupiah(product.price - product.discountPrice)}
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900 tracking-tight">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* AI Compatibility Card */}
          {aiData ? (
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-[var(--radius-card)] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-pink-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    AI Compatibility Score
                  </h3>
                  <div className="text-2xl font-bold text-pink-600">{aiData.score}%</div>
                </div>
                
                {aiData.score >= 85 ? (
                  <Badge className="bg-pink-500 text-white border-none mb-3">Best Match</Badge>
                ) : aiData.score >= 60 ? (
                  <Badge className="bg-blue-500 text-white border-none mb-3">Recommended</Badge>
                ) : (
                  <Badge className="bg-gray-500 text-white border-none mb-3">Alternative</Badge>
                )}

                <div className="text-sm text-gray-600 space-y-1">
                  <p>Berdasarkan analisis Body Scan Anda:</p>
                  <ul className="list-disc pl-4 space-y-1 text-xs mt-2">
                    {aiData.attributes?.bodyShape && <li>Potongan produk sesuai dengan bentuk tubuh <span className="font-semibold">{aiData.profile?.bodyShape}</span> Anda.</li>}
                    {aiData.attributes?.color && <li>Warna produk melengkapi *skin tone* <span className="font-semibold">{aiData.profile?.skinTone}</span> Anda.</li>}
                    {aiData.attributes?.style && <li>Gaya sesuai dengan preferensi Anda.</li>}
                    {!aiData.attributes?.bodyShape && !aiData.attributes?.color && !aiData.attributes?.style && <li>Produk ini bisa menjadi alternatif gaya baru untuk Anda.</li>}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
             <div className="bg-gray-50 border border-gray-200 rounded-[var(--radius-card)] p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Cek Kecocokan Produk</h3>
                  <p className="text-sm text-gray-500 mt-1">Lakukan Body Scan untuk melihat seberapa cocok produk ini dengan bentuk tubuh Anda.</p>
                </div>
                <Button asChild className="bg-gray-900 text-white hover:bg-gray-800 shrink-0">
                  <Link href="/body-scan">Scan Tubuh Sekarang</Link>
                </Button>
             </div>
          )}

          {/* Product Details Specs */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <span className="text-gray-500 block mb-1">Kategori</span>
              <span className="font-medium text-gray-900">{product.categoryRel?.name || product.category}</span>
            </div>
            {product.style && (
              <div>
                <span className="text-gray-500 block mb-1">Style</span>
                <span className="font-medium text-gray-900">{product.style}</span>
              </div>
            )}
            {product.material && (
              <div>
                <span className="text-gray-500 block mb-1">Material</span>
                <span className="font-medium text-gray-900">{product.material}</span>
              </div>
            )}
            {product.fit && (
              <div>
                <span className="text-gray-500 block mb-1">Fit</span>
                <span className="font-medium text-gray-900">{product.fit}</span>
              </div>
            )}
          </div>

          {/* Variants */}
          {product.colors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Pilihan Warna</h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <Badge key={color} variant="outline" className="bg-white">{color}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {product.sizes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Ukuran Tersedia</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <Badge key={size} variant="outline" className="bg-white">{size}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Deskripsi Produk</h4>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Cara Order Section */}
          <div className="bg-pink-50 border border-pink-100 rounded-[var(--radius-card)] p-6 mt-6">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-pink-600" />
              Cara Order
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Produk ini dijual secara eksklusif oleh partner butik kami. Anda dapat langsung memesan atau menanyakan ketersediaan melalui:
            </p>
            <div className="flex flex-wrap gap-3">
              {product.boutique?.phone && (
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                  <a href={`https://wa.me/${product.boutique.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(product.boutique.name)},%20saya%20ingin%20bertanya%20tentang%20produk%20${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer">
                    Chat WhatsApp
                  </a>
                </Button>
              )}
              {product.boutique?.instagram && (
                <Button asChild variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-full">
                  <a href={`https://instagram.com/${product.boutique.instagram.replace('@','')}`} target="_blank" rel="noreferrer">
                    DM Instagram
                  </a>
                </Button>
              )}
              {(!product.boutique?.phone && !product.boutique?.instagram) && product.boutique && (
                <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white rounded-full">
                   <Link href={`/marketplace/boutique/${product.boutique.id}`}>
                     Kunjungi Halaman Toko
                   </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Boutique Info Section */}
      {product.boutique && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="bg-white rounded-[var(--radius-card)] p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FDF2F8] rounded-[var(--radius-card)] flex items-center justify-center text-pink-500 shrink-0">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{product.boutique.name}</h3>
                  {product.boutique.verified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {product.boutique.city && (
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {product.boutique.city}</span>
                  )}
                  {product.boutique.instagram && (
                    <a href={`https://instagram.com/${product.boutique.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-pink-600 transition-colors">
                      <Camera className="w-3.5 h-3.5" /> {product.boutique.instagram}
                    </a>
                  )}
                  {product.boutique.mapsUrl && (
                    <a href={product.boutique.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-colors font-medium">
                      <MapPin className="w-3.5 h-3.5" /> Buka di Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
            <Button asChild variant="outline" className="shrink-0 rounded-full">
              <Link href={`/marketplace/boutique/${product.boutique.id}`}>Kunjungi Toko</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Produk Serupa</h2>
            <Link href={`/marketplace?category=${product.categoryId || product.category.toLowerCase()}`} className="text-sm font-medium text-pink-600 hover:text-pink-700">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <MarketplaceProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { Sparkles } from "lucide-react";


