"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  formData: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isProcessing?: boolean;
}

export function PricingCard({ formData, onChange, isProcessing = false }: Props) {
  return (
    <Card className="p-6 border-[#FDF2F8] dark:border-gray-800 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-[#FDF2F8] dark:border-gray-800 pb-2">
        Harga & Inventaris
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <Input 
            type="number" 
            name="price" 
            value={formData.price} 
            onChange={onChange} 
            placeholder="0" 
            min="0"
            disabled={isProcessing}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Harga Diskon (Rp) <span className="text-gray-400 text-xs">(Opsional)</span>
          </label>
          <Input 
            type="number" 
            name="discountPrice" 
            value={formData.discountPrice} 
            onChange={onChange} 
            placeholder="0" 
            min="0"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stok <span className="text-red-500">*</span>
          </label>
          <Input 
            type="number" 
            name="stock" 
            value={formData.stock} 
            onChange={onChange} 
            placeholder="0" 
            min="0"
            disabled={isProcessing}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status Publikasi
          </label>
          <select 
            name="productStatus" 
            value={formData.productStatus} 
            onChange={onChange}
            disabled={isProcessing}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="HIDDEN">Hidden</option>
            <option value="SOLDOUT">Sold Out</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
