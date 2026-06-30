import { Shirt } from "lucide-react";
import { AnalysisCardBase } from "./AnalysisCardBase";
import { ClothingSizeResult } from "@/lib/body-analysis-engine/analysis-types";

import { SizeEstimate } from "@/lib/body-analysis-engine/analysis-types";

const SizeRow = ({ label, estimate }: { label: string; estimate: SizeEstimate }) => (
  <div className="flex flex-col py-2 border-b border-white/5 last:border-0">
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/70">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/40">{estimate.confidence}%</span>
        <span className="text-sm font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md border border-white/20">
          {estimate.size}
        </span>
      </div>
    </div>
    {estimate.alternative && (
      <span className="text-xs text-white/50 mt-1 text-right">
        Alternatif: {estimate.alternative}
      </span>
    )}
  </div>
);

const fitMap: Record<string, string> = {
  "Slim Fit": "Potongan Slim Fit",
  "Regular Fit": "Potongan Regular Fit",
  "Relaxed Fit": "Potongan Relaxed Fit",
  "Oversized": "Potongan Oversize"
};

export function SizingCard({ result }: { result: ClothingSizeResult }) {

  return (
    <AnalysisCardBase title="Perkiraan Ukuran Pakaian" icon={Shirt}>
      <div className="flex flex-col gap-1 mb-4">
        <SizeRow label="Atasan" estimate={result.topSize} />
        <SizeRow label="Bawahan" estimate={result.bottomSize} />
        <SizeRow label="Kemeja" estimate={result.shirtSize} />
        <SizeRow label="Jaket" estimate={result.jacketSize} />
        <SizeRow label="Hoodie" estimate={result.hoodieSize} />
      </div>

      <div className="bg-[#EC4899]/10 border border-[#EC4899]/20 rounded-xl p-3 text-center">
        <span className="block text-[10px] uppercase tracking-wider text-[#EC4899] font-bold mb-1">
          Rekomendasi Potongan Pakaian
        </span>
        <span className="text-sm font-medium text-white">
          {fitMap[result.recommendedFit] || result.recommendedFit}
        </span>
      </div>
    </AnalysisCardBase>
  );
}
