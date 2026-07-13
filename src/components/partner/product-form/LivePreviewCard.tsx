"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Info } from "lucide-react";
import Image from "next/image";

interface Props {
  formData: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  thumbnailUrl: string | null;
  categories: { id: string; name: string; [key: string]: any }[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function LivePreviewCard({ formData, thumbnailUrl, categories }: Props) {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const categoryName = categories.find(c => c.id === formData.categoryId)?.name || "Kategori";

  return (
    <div className="sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <EyeIcon className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Live Preview</h3>
      </div>
      
      <Card className="overflow-hidden border-[#FDF2F8] dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-black">
        {/* Image */}
        <div className="relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={formData.name || "Preview"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <ShoppingBag className="w-12 h-12 opacity-50" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${
              formData.productStatus === "PUBLISHED" ? "bg-emerald-500" :
              formData.productStatus === "DRAFT" ? "bg-gray-500" :
              formData.productStatus === "HIDDEN" ? "bg-orange-500" :
              "bg-red-500"
            } hover:opacity-90`}>
              {formData.productStatus}
            </Badge>
          </div>

          {/* Discount Badge */}
          {formData.discountPrice && parseInt(formData.discountPrice) > 0 && parseInt(formData.price) > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              {Math.round((1 - parseInt(formData.discountPrice) / parseInt(formData.price)) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">
                {categoryName}
              </p>
              <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                {formData.name || "Nama Produk"}
              </h4>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 flex-wrap">
            {formData.discountPrice && parseInt(formData.discountPrice) > 0 ? (
              <>
                <span className="font-bold text-lg text-[#EC4899]">
                  {formatRupiah(parseInt(formData.discountPrice))}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatRupiah(parseInt(formData.price))}
                </span>
              </>
            ) : (
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {formatRupiah(parseInt(formData.price))}
              </span>
            )}
          </div>

          {/* Quick Specs */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
            {formData.style && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{formData.style}</span>}
            {formData.sizes.length > 0 && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{formData.sizes.length} Sizes</span>}
            {formData.colors.length > 0 && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{formData.colors.length} Colors</span>}
            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">Stock: {formData.stock || 0}</span>
          </div>
        </div>
      </Card>

      {/* AI Compatibility Panel */}
      {(formData.recommendedBodyShapes.length > 0 || formData.recommendedSkinTones.length > 0) && (
        <Card className="mt-4 p-4 border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
          <h5 className="text-xs font-bold text-blue-900 dark:text-blue-100 flex items-center gap-1.5 mb-2">
            <Star className="w-3.5 h-3.5 fill-current text-blue-500" /> AI Target
          </h5>
          <div className="space-y-2 text-xs">
            {formData.recommendedBodyShapes.length > 0 && (
              <div className="flex gap-2">
                <span className="text-gray-500 w-16 shrink-0">Body:</span>
                <span className="text-blue-800 dark:text-blue-200 font-medium">{formData.recommendedBodyShapes.join(", ")}</span>
              </div>
            )}
            {formData.recommendedSkinTones.length > 0 && (
              <div className="flex gap-2">
                <span className="text-gray-500 w-16 shrink-0">Skin:</span>
                <span className="text-blue-800 dark:text-blue-200 font-medium">{formData.recommendedSkinTones.join(", ")}</span>
              </div>
            )}
          </div>
        </Card>
      )}
      
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
        <Info className="w-4 h-4 shrink-0 text-gray-400 mt-0.5" />
        <p>Tampilan ini adalah simulasi. Card asli di aplikasi mungkin memiliki perbedaan tata letak tergantung pada ukuran layar pengguna.</p>
      </div>
    </div>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
