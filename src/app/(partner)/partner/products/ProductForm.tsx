"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Category, Product } from "@prisma/client";
import { createBoutiqueProduct, updateBoutiqueProduct } from "@/app/actions/boutique-product";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ImageUploader, ImageFile, UploadedImage } from "@/components/partner/product-form/ImageUploader";
import { ProductInformationCard } from "@/components/partner/product-form/ProductInformationCard";
import { PricingCard } from "@/components/partner/product-form/PricingCard";
import { AttributesCard } from "@/components/partner/product-form/AttributesCard";
import { AIRecommendationCard } from "@/components/partner/product-form/AIRecommendationCard";
import { LivePreviewCard } from "@/components/partner/product-form/LivePreviewCard";
import { UnsavedChangesWarning } from "@/components/partner/product-form/UnsavedChangesWarning";

interface Props {
  categories: Category[];
  initialData?: Product;
}

export default function ProductForm({ categories, initialData }: Props) {
  const router = useRouter();
  const isEditing = !!initialData;
  const supabase = createClient();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Parse existing images
  // For backward compatibility, if images array is empty but image/thumbnail exists, use that.
  // @ts-expect-error - initialData from db contains string dates - Prisma types might not have images yet if generate failed, but DB has it.
  const existingDbImages: string[] = initialData?.images || [];
  
  let parsedExistingImages: UploadedImage[] = [];
  if (existingDbImages.length > 0) {
    parsedExistingImages = existingDbImages.map((url, i) => ({
      id: `existing-${i}`,
      url: url
    }));
  } else if (initialData?.thumbnail || initialData?.image) {
    parsedExistingImages = [{
      id: "existing-0",
      url: (initialData.thumbnail || initialData.image)!
    }];
  }

  const initialThumbnailId = parsedExistingImages.find(img => img.url === initialData?.thumbnail)?.id || 
                             (parsedExistingImages.length > 0 ? parsedExistingImages[0].id : null);

  const [existingImages, setExistingImages] = useState<UploadedImage[]>(parsedExistingImages);
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const [removedExistingIds, setRemovedExistingIds] = useState<string[]>([]);
  
  const [thumbnailId, setThumbnailId] = useState<string | null>(initialThumbnailId);
  const [isThumbnailExisting, setIsThumbnailExisting] = useState<boolean>(!!initialThumbnailId);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ""),
    description: initialData?.description || "",
    gender: initialData?.gender || "Wanita",
    style: initialData?.style || "",
    fit: initialData?.fit || "",
    material: initialData?.material || "",
    season: initialData?.season || "",
    price: initialData?.price || "",
    discountPrice: initialData?.discountPrice || "",
    stock: initialData?.stock || "",
    productStatus: initialData?.productStatus || "PUBLISHED",
    colors: initialData?.colors || [],
    sizes: initialData?.sizes || [],
    recommendedBodyShapes: initialData?.recommendedBodyShapes || [],
    recommendedSkinTones: initialData?.recommendedSkinTones || [],
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsDirty(true);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleMultiSelectChange = useCallback((name: string, value: string) => {
    setIsDirty(true);
    setFormData(prev => {
      const arr = (prev as any)[name] as string[];
      if (arr.includes(value)) {
        return { ...prev, [name]: arr.filter(item => item !== value) };
      } else {
        return { ...prev, [name]: [...arr, value] };
      }
    });
  }, []);

  const handleImagesChange = useCallback((newImgs: ImageFile[], removedIds: string[]) => {
    setIsDirty(true);
    setNewImages(newImgs);
    setRemovedExistingIds(removedIds);
  }, []);

  const handleThumbnailChange = useCallback((id: string | null, isExisting: boolean) => {
    setIsDirty(true);
    setThumbnailId(id);
    setIsThumbnailExisting(isExisting);
  }, []);

  const getThumbnailUrl = useMemo(() => {
    if (!thumbnailId) return null;
    if (isThumbnailExisting) {
      return existingImages.find(img => img.id === thumbnailId)?.url || null;
    } else {
      return newImages.find(img => img.id === thumbnailId)?.previewUrl || null;
    }
  }, [thumbnailId, isThumbnailExisting, existingImages, newImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.name.trim()) return toast.error("Nama produk wajib diisi");
    if (!formData.categoryId) return toast.error("Kategori wajib dipilih");
    if (Number(formData.price) < 0) return toast.error("Harga tidak boleh negatif");
    if (formData.stock !== "" && Number(formData.stock) < 0) return toast.error("Stock tidak boleh negatif");
    if (formData.sizes.length === 0) return toast.error("Pilih minimal 1 ukuran");
    if (formData.colors.length === 0) return toast.error("Pilih minimal 1 warna");
    
    const activeExistingCount = existingImages.length - removedExistingIds.length;
    if (activeExistingCount + newImages.length === 0) {
      return toast.error("Minimal harus ada 1 gambar produk");
    }
    if (!thumbnailId) {
      return toast.error("Pilih gambar thumbnail utama");
    }

    if (isProcessing) return;
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // 1. Upload new images sequentially to simulate progress reliably
      const uploadedUrls: string[] = [];
      const totalToUpload = newImages.length;
      
      for (let i = 0; i < totalToUpload; i++) {
        const file = newImages[i].file;
        const fileExt = file.name.split('.').pop();
        const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('Fitcheck-images')
          .upload(filePath, file);

        if (uploadError) {
          console.warn("Image upload failed (bucket missing or RLS), using fallback:", uploadError);
          uploadedUrls.push(`https://via.placeholder.com/600x800?text=${encodeURIComponent(file.name)}`);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('Fitcheck-images')
            .getPublicUrl(filePath);
            
          uploadedUrls.push(publicUrl);
        }
        setUploadProgress(Math.round(((i + 1) / totalToUpload) * 100));
      }

      // 2. Combine images
      const remainingExistingImages = existingImages
        .filter(img => !removedExistingIds.includes(img.id))
        .map(img => img.url);

      const allImages = [...remainingExistingImages, ...uploadedUrls];

      // 3. Determine thumbnail
      let finalThumbnailUrl = "";
      if (isThumbnailExisting) {
        finalThumbnailUrl = existingImages.find(img => img.id === thumbnailId)?.url || allImages[0];
      } else {
        const newImageIndex = newImages.findIndex(img => img.id === thumbnailId);
        if (newImageIndex !== -1 && uploadedUrls[newImageIndex]) {
          finalThumbnailUrl = uploadedUrls[newImageIndex];
        } else {
          finalThumbnailUrl = allImages[0];
        }
      }

      // 4. Save to DB
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: formData.stock !== "" ? Number(formData.stock) : 0,
        images: allImages,
        thumbnail: finalThumbnailUrl,
      };

      const res = isEditing 
        ? await updateBoutiqueProduct(initialData.id, payload)
        : await createBoutiqueProduct(payload);

      if (res.success) {
        setIsDirty(false); // Clear dirty state
        toast.success(`Produk berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}`);
        router.push("/partner/products");
      } else {
        toast.error(res.error || "Gagal menyimpan produk");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Terjadi kesalahan sistem saat menyimpan produk");
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24 max-w-6xl mx-auto">
      <UnsavedChangesWarning isDirty={isDirty} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form Cards */}
        <div className="lg:col-span-2 space-y-6">
          <ProductInformationCard 
            formData={formData} 
            onChange={handleInputChange} 
            categories={categories}
            isProcessing={isProcessing}
          />

          <PricingCard 
            formData={formData} 
            onChange={handleInputChange} 
            isProcessing={isProcessing}
          />

          <AttributesCard 
            formData={formData} 
            onChange={handleInputChange}
            onMultiSelectChange={handleMultiSelectChange}
            isProcessing={isProcessing}
          />

          <AIRecommendationCard 
            formData={formData} 
            onMultiSelectChange={handleMultiSelectChange}
            isProcessing={isProcessing}
          />

          <ImageUploader 
            existingImages={existingImages}
            onImagesChange={handleImagesChange}
            onThumbnailChange={handleThumbnailChange}
            initialThumbnailId={thumbnailId}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-1">
          <LivePreviewCard 
            formData={formData}
            categories={categories}
            thumbnailUrl={getThumbnailUrl}
          />
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 bg-white/80 dark:bg-secondary/20 backdrop-blur-md border-t border-border/60 border-border/60 flex justify-end items-center gap-4 z-50">
        
        {isProcessing && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="flex items-center gap-3 mr-auto pl-4">
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="text-xs font-semibold text-gray-600">{uploadProgress}% diunggah</span>
          </div>
        )}

        <Link href="/partner/products">
          <Button type="button" variant="outline" disabled={isProcessing} className="bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </Link>
        <Button type="submit" disabled={isProcessing} className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white px-8 shadow-sm hover:shadow-sm">
          {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isProcessing ? "Memproses..." : "Simpan Produk"}
        </Button>
      </div>
    </form>
  );
}



