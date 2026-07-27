"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  formData: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  categories: { id: string; name: string; [key: string]: any }[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  isProcessing?: boolean;
}

export function ProductInformationCard({ formData, onChange, categories, isProcessing = false }: Props) {
  return (
    <Card className="p-6 border-[#FDF2F8] dark:border-gray-800 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-[#FDF2F8] dark:border-gray-800 pb-2">
        Informasi Produk
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input 
              name="name" 
              value={formData.name} 
              onChange={onChange} 
              placeholder="Contoh: Kemeja Oversize Wanita" 
              maxLength={100}
              disabled={isProcessing}
              required 
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-400">
              {formData.name.length}/100
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Textarea 
              name="description" 
              value={formData.description} 
              onChange={onChange} 
              placeholder="Jelaskan detail produk, bahan, dan cara perawatan..." 
              rows={5} 
              maxLength={1000}
              disabled={isProcessing}
              required
            />
            <span className="absolute right-3 bottom-3 text-xs text-gray-400 bg-white dark:bg-background px-1">
              {formData.description.length}/1000
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select 
              name="categoryId" 
              value={formData.categoryId} 
              onChange={onChange} 
              disabled={isProcessing}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Pilih Kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={onChange}
              disabled={isProcessing}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="Unisex">Unisex</option>
              <option value="Womenswear">Womenswear</option>
              <option value="Menswear">Menswear</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
}


