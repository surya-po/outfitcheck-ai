"use client";

import { useState, useCallback } from "react";
import { Upload, X, Star, FileImage, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
}

export interface UploadedImage {
  id: string;
  url: string;
}

interface Props {
  existingImages: UploadedImage[];
  onImagesChange: (newImages: ImageFile[], removedExistingIds: string[]) => void;
  onThumbnailChange: (thumbnailId: string | null, isExisting: boolean) => void;
  initialThumbnailId?: string | null;
  isProcessing?: boolean;
}

export function ImageUploader({ 
  existingImages, 
  onImagesChange, 
  onThumbnailChange,
  initialThumbnailId,
  isProcessing = false
}: Props) {
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const [removedExistingIds, setRemovedExistingIds] = useState<string[]>([]);
  const [thumbnailId, setThumbnailId] = useState<string | null>(initialThumbnailId || (existingImages.length > 0 ? existingImages[0].id : null));
  const [isThumbnailExisting, setIsThumbnailExisting] = useState<boolean>(
    initialThumbnailId ? existingImages.some(img => img.id === initialThumbnailId) : (existingImages.length > 0)
  );
  
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleSetThumbnail = (id: string | null, isExisting: boolean) => {
    setThumbnailId(id);
    setIsThumbnailExisting(isExisting);
    onThumbnailChange(id, isExisting);
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} bukan gambar.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} melebihi batas 5MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newImageObjects = validFiles.map(file => ({
        id: `new-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        file,
        previewUrl: URL.createObjectURL(file)
      }));

      const updatedNewImages = [...newImages, ...newImageObjects];
      setNewImages(updatedNewImages);
      
      // Auto set thumbnail if none exists
      if (!thumbnailId && updatedNewImages.length > 0 && existingImages.length === 0) {
        handleSetThumbnail(updatedNewImages[0].id, false);
      }

      onImagesChange(updatedNewImages, removedExistingIds);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isProcessing) return;
    processFiles(e.dataTransfer.files);
  }, [newImages, existingImages, removedExistingIds, thumbnailId, isProcessing]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = ""; // Reset input
  };

  const removeNewImage = (id: string) => {
    const updated = newImages.filter(img => img.id !== id);
    // Cleanup blob
    const imgToRemove = newImages.find(img => img.id === id);
    if (imgToRemove) URL.revokeObjectURL(imgToRemove.previewUrl);

    setNewImages(updated);
    
    if (thumbnailId === id) {
      handleSetThumbnail(null, false);
    }
    onImagesChange(updated, removedExistingIds);
  };

  const removeExistingImage = (id: string) => {
    const updatedRemoved = [...removedExistingIds, id];
    setRemovedExistingIds(updatedRemoved);
    
    if (thumbnailId === id) {
      handleSetThumbnail(null, true);
    }
    onImagesChange(newImages, updatedRemoved);
  };


  const activeExistingImages = existingImages.filter(img => !removedExistingIds.includes(img.id));
  const totalImagesCount = activeExistingImages.length + newImages.length;

  return (
    <Card className="p-6 border-[#FDF2F8] dark:border-gray-800 space-y-6">
      <div className="flex justify-between items-center border-b border-[#FDF2F8] dark:border-gray-800 pb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileImage className="w-5 h-5 text-[#EC4899]" /> Galeri Produk <span className="text-red-500">*</span>
        </h3>
        <span className="text-sm text-gray-500 font-medium">
          {totalImagesCount} Gambar
        </span>
      </div>

      {/* Upload Area */}
      <div 
        className={`relative flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-[var(--radius-button)] transition-all duration-200 
          ${isDragging ? 'border-[#EC4899] bg-[#FDF2F8] dark:bg-[#EC4899]/10 scale-[1.01]' : 'border-[#FDF2F8] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple 
          accept="image/jpeg,image/png,image/webp" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          onChange={handleFileInput}
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500 pointer-events-none">
          <Upload className={`w-10 h-10 mb-3 ${isDragging ? 'text-[#EC4899] animate-bounce' : 'text-gray-400'}`} />
          <p className="mb-2 text-sm font-semibold">
            <span className="text-[#EC4899]">Klik untuk unggah</span> atau drag & drop
          </p>
          <p className="text-xs">JPG, PNG, WEBP (Max 5MB per file)</p>
        </div>
      </div>

      {/* Image Grid */}
      {totalImagesCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          
          {/* Existing Images */}
          {activeExistingImages.map(img => (
            <div key={img.id} className={`relative group aspect-square rounded-[var(--radius-button)] overflow-hidden border-2 transition-all ${thumbnailId === img.id ? 'border-[#EC4899] ring-2 ring-[#EC4899]/20' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}>
              <img src={img.url} alt="Product" className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {thumbnailId !== img.id && (
                  <Button 
                    size="sm" 
                    type="button" 
                    onClick={() => handleSetThumbnail(img.id, true)} 
                    disabled={isProcessing}
                    className="bg-white text-gray-900 hover:bg-white/90 scale-90"
                  >
                    Jadikan Thumbnail
                  </Button>
                )}
                <Button 
                  size="icon" 
                  variant="destructive" 
                  type="button" 
                  onClick={() => removeExistingImage(img.id)}
                  disabled={isProcessing}
                  className="w-8 h-8 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {thumbnailId === img.id && (
                <div className="absolute top-2 left-2 bg-[#EC4899] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" /> Thumbnail
                </div>
              )}
            </div>
          ))}

          {/* New Images */}
          {newImages.map(img => (
            <div key={img.id} className={`relative group aspect-square rounded-[var(--radius-button)] overflow-hidden border-2 transition-all ${thumbnailId === img.id ? 'border-[#EC4899] ring-2 ring-[#EC4899]/20' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}>
              <img src={img.previewUrl} alt="New Product" className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {thumbnailId !== img.id && (
                  <Button 
                    size="sm" 
                    type="button" 
                    onClick={() => handleSetThumbnail(img.id, false)} 
                    disabled={isProcessing}
                    className="bg-white text-gray-900 hover:bg-white/90 scale-90"
                  >
                    Jadikan Thumbnail
                  </Button>
                )}
                <Button 
                  size="icon" 
                  variant="destructive" 
                  type="button" 
                  onClick={() => removeNewImage(img.id)}
                  disabled={isProcessing}
                  className="w-8 h-8 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {thumbnailId === img.id && (
                <div className="absolute top-2 left-2 bg-[#EC4899] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" /> Thumbnail
                </div>
              )}
              
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                Baru
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}


