import { Activity } from "lucide-react";
import { AnalysisCardBase } from "./AnalysisCardBase";
import { BodyShapeResult } from "@/lib/body-analysis-engine/analysis-types";

const shapeMap: Record<string, string> = {
  "Rectangle": "Persegi Panjang",
  "Triangle": "Segitiga",
  "Inverted Triangle": "Segitiga Terbalik",
  "Trapezoid": "Trapesium",
  "Oval": "Oval",
  "Hourglass": "Jam Pasir"
};

export function BodyShapeCard({ result }: { result: BodyShapeResult }) {
  const localizedShape = shapeMap[result.primaryShape] || result.primaryShape;

  return (
    <AnalysisCardBase title="Bentuk Tubuh" icon={Activity}>
      <div className="flex flex-col items-center justify-center text-center py-4">
        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-[#E14D72] mb-2 tracking-tight">
          {localizedShape}
        </div>
        <p className="text-sm text-foreground mb-4 px-2">
          {result.details}
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border/60 text-xs text-secondary-foreground/70">
          <span>Tingkat Keyakinan AI:</span>
          <span className="text-secondary-foreground font-medium">{(result.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </AnalysisCardBase>
  );
}




