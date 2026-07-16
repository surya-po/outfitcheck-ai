import { getProduct } from "@/app/actions/boutique-product";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Preview Produk - Partner Dashboard",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PreviewProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id) as any;

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/partner/products" className="p-2 bg-white dark:bg-gray-900 rounded-full hover:bg-gray-50 border shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Preview Produk</h1>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-[var(--radius-button)] p-4 flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
        <Sparkles className="w-5 h-5 shrink-0" />
        <p>Halaman ini menampilkan gambaran kasar bagaimana produk Anda akan terlihat di Marketplace. Desain akhir di Marketplace mungkin memiliki sedikit perbedaan menyesuaikan dengan tema platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image */}
        <div className="bg-white dark:bg-gray-900 rounded-[var(--radius-card)] overflow-hidden shadow-sm border border-border/60 border-border/60 aspect-[3/4]">
          {product.thumbnail || product.image ? (
            <img src={product.thumbnail || product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              Tidak ada gambar
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          <div>
            <div className="text-sm font-semibold text-primary mb-2">{product.categoryRel?.name || product.category}</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(product.discountPrice)}</span>
                  <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="pt-6 border-t border-gray-100 border-border/60">
            <h3 className="font-semibold mb-4">Varian</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Warna</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors && product.colors.length > 0 ? product.colors.map((color: string) => (
                    <span key={color} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded-full">{color}</span>
                  )) : <span className="text-sm text-gray-400">-</span>}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ukuran</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes && product.sizes.length > 0 ? product.sizes.map((size: string) => (
                    <span key={size} className="px-3 py-1 border border-gray-200 border-border/60 text-sm rounded-md font-medium">{size}</span>
                  )) : <span className="text-sm text-gray-400">-</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 border-border/60">
            <h3 className="font-semibold mb-4">Spesifikasi</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-gray-500">Style</span> <span className="font-medium">{product.style || "-"}</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Fit</span> <span className="font-medium">{product.fit || "-"}</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Material</span> <span className="font-medium">{product.material || "-"}</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Gender</span> <span className="font-medium">{product.gender || "-"}</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Status</span> <span className="font-medium text-primary">{product.productStatus}</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Stok Tersedia</span> <span className="font-medium">{product.stock}</span></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* AI Recommendation Preview */}
      <Card className="mt-8 p-6 bg-gradient-to-br from-card to-muted dark:from-[#EC4899]/5 dark:to-transparent border-border/60 border-border/60">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Matching Data
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Sistem OutfitCheck AI akan menggunakan parameter di bawah ini untuk mencocokkan produk dengan profil pengguna. Semakin detail, semakin tinggi tingkat akurasi kecocokan (*Compatibility Score*).
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-semibold mb-2">Bentuk Tubuh Sesuai</p>
            <ul className="space-y-1">
              {product.recommendedBodyShapes && product.recommendedBodyShapes.length > 0 ? product.recommendedBodyShapes.map((item: string) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-500" /> {item}
                </li>
              )) : <li className="text-sm text-gray-400">Cocok untuk semua bentuk tubuh</li>}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Skin Tone Sesuai</p>
            <ul className="space-y-1">
              {product.recommendedSkinTones && product.recommendedSkinTones.length > 0 ? product.recommendedSkinTones.map((item: string) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-500" /> {item}
                </li>
              )) : <li className="text-sm text-gray-400">Cocok untuk semua skin tone</li>}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Musim (Season) Rekomendasi</p>
            <ul className="space-y-1">
              {product.recommendedSeasons && product.recommendedSeasons.length > 0 ? product.recommendedSeasons.map((item: string) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-500" /> {item}
                </li>
              )) : <li className="text-sm text-gray-400">Tidak ada preferensi musim khusus</li>}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}



