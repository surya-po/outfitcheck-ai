"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: any) => void;
  onMultiSelectChange: (name: string, value: string) => void;
  isProcessing?: boolean;
}

const AVAILABLE_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "All Size"];
const AVAILABLE_COLORS = ["Black", "White", "Gray", "Navy", "Blue", "Red", "Pink", "Green", "Yellow", "Brown", "Beige"];

export function AttributesCard({ formData, onChange, onMultiSelectChange, isProcessing = false }: Props) {
  return (
    <Card className="p-6 border-[#FDF2F8] dark:border-gray-800 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-[#FDF2F8] dark:border-gray-800 pb-2">
        Atribut Produk
      </h3>
      

      <div className="pt-4 border-t border-[#FDF2F8] dark:border-gray-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Ukuran Tersedia <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map(size => (
            <button
              key={size}
              type="button"
              disabled={isProcessing}
              onClick={() => onMultiSelectChange("sizes", size)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                formData.sizes.includes(size)
                  ? 'bg-[#EC4899] text-white border-[#EC4899] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#EC4899] hover:text-[#EC4899]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#FDF2F8] dark:border-gray-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Warna Tersedia <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COLORS.map(color => (
            <button
              key={color}
              type="button"
              disabled={isProcessing}
              onClick={() => onMultiSelectChange("colors", color)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                formData.colors.includes(color)
                  ? 'bg-[#EC4899] text-white border-[#EC4899] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#EC4899] hover:text-[#EC4899]'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}


