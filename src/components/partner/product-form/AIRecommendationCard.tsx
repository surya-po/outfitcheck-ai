"use client";

import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface Props {
  formData: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onMultiSelectChange: (name: string, value: string) => void;
  isProcessing?: boolean;
}

const BODY_SHAPES = ["Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"];
const SKIN_TONES = ["Warm", "Cool", "Neutral", "Olive", "Fair", "Deep"];

export function AIRecommendationCard({ formData, onMultiSelectChange, isProcessing = false }: Props) {
  return (
    <Card className="p-6 border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 space-y-6">
      <div className="flex items-center gap-2 border-b border-blue-100 dark:border-blue-900/30 pb-2">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          AI Recommendation Target
        </h3>
      </div>
      <p className="text-xs text-blue-600/80 dark:text-blue-300/80 mt-1 mb-4">
        Atribut ini digunakan oleh Fitcheck AI untuk merekomendasikan produk ini ke pengguna yang tepat. (Opsional)
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Rekomendasi Bentuk Tubuh
          </label>
          <div className="flex flex-wrap gap-2">
            {BODY_SHAPES.map(shape => (
              <button
                key={shape}
                type="button"
                disabled={isProcessing}
                onClick={() => onMultiSelectChange("recommendedBodyShapes", shape)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  formData.recommendedBodyShapes.includes(shape)
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-blue-100/50 dark:border-blue-900/20">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Rekomendasi Skin Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {SKIN_TONES.map(tone => (
              <button
                key={tone}
                type="button"
                disabled={isProcessing}
                onClick={() => onMultiSelectChange("recommendedSkinTones", tone)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  formData.recommendedSkinTones.includes(tone)
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}


