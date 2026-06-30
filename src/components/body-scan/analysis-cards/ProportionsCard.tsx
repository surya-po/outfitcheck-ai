import { Scale } from "lucide-react";
import { AnalysisCardBase } from "./AnalysisCardBase";
import { BodyProportionResult } from "@/lib/body-analysis-engine/analysis-types";

const propMap: Record<string, string> = {
  "Balanced": "Seimbang",
  "Long Legs": "Kaki Panjang",
  "Short Torso": "Torso Pendek",
  "Long Torso": "Torso Panjang",
  "Broad Shoulders": "Bahu Lebar",
  "Narrow Shoulders": "Bahu Sempit"
};

export function ProportionsCard({ result }: { result: BodyProportionResult }) {
  return (
    <AnalysisCardBase title="Proporsi Tubuh" icon={Scale}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {result.proportions.map((prop, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/90"
            >
              {propMap[prop] || prop}
            </span>
          ))}
        </div>
        
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex justify-between text-xs">
            <span className="text-white/60">Rasio Bahu-Pinggul</span>
            <span className="text-white font-medium">{result.shoulderToHipRatio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/60">Rasio Kaki-Torso</span>
            <span className="text-white font-medium">{result.legToTorsoRatio.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </AnalysisCardBase>
  );
}
