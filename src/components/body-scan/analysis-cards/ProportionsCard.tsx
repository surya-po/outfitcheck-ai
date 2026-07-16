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
              className="px-3 py-1 bg-secondary border border-border/60 rounded-full text-xs font-medium text-secondary-foreground"
            >
              {propMap[prop] || prop}
            </span>
          ))}
        </div>
        
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Rasio Bahu-Pinggul</span>
            <span className="text-foreground font-medium">{result.shoulderToHipRatio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Rasio Kaki-Torso</span>
            <span className="text-foreground font-medium">{result.legToTorsoRatio.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </AnalysisCardBase>
  );
}




