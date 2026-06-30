"use client";

import { BodyMeasurementResult, MeasurementValue } from "@/lib/body-measurements/types";
import { AlertCircle, Ruler, Info } from "lucide-react";

interface MeasurementPanelProps {
  result: BodyMeasurementResult | null;
}

const MetricRow = ({ label, metric }: { label: string; metric: MeasurementValue }) => {
  // Determine color based on confidence
  const conf = metric.confidence;
  const isLowConfidence = conf < 0.5;
  const valueStr = metric.value ? metric.value.toFixed(1) : "--";

  return (
    <div className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white/90">{label}</span>
        <span className="text-[10px] text-white/50 flex items-center gap-1">
          {isLowConfidence && <AlertCircle className="h-3 w-3 text-amber-400" />}
          Keyakinan: {(conf * 100).toFixed(0)}%
        </span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-lg font-bold text-white tabular-nums tracking-tight">
          {valueStr}
        </span>
        {metric.value && (
          <span className="text-xs text-white/60 mb-1">cm</span>
        )}
      </div>
    </div>
  );
};

const RatioRow = ({ label, metric }: { label: string; metric: MeasurementValue }) => {
  const valueStr = metric.value ? metric.value.toFixed(2) : "--";
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white/90">{label}</span>
        <span className="text-[10px] text-white/50">Keyakinan: {(metric.confidence * 100).toFixed(0)}%</span>
      </div>
      <span className="text-lg font-bold text-white tabular-nums tracking-tight">{valueStr}</span>
    </div>
  );
};

export function MeasurementPanel({ result }: MeasurementPanelProps) {
  if (!result || !result.measurements) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl w-full max-w-sm h-full flex flex-col items-center justify-center text-center">
        <Ruler className="h-10 w-10 text-white/50 mb-3" />
        <p className="text-white/70 font-medium">Menunggu scan tubuh...</p>
      </div>
    );
  }

  const { measurements, quality } = result;



  return (
    <div className="bg-[#1E1E2D]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-gradient-to-r from-[#EC4899]/20 to-[#F472B6]/10 p-4 border-b border-white/10 flex items-center gap-3">
        <div className="bg-[#EC4899] p-2 rounded-lg">
          <Ruler className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white leading-tight">Hasil Pengukuran</h3>
          <p className="text-xs text-white/60 flex items-center gap-1">
            <Info className="h-3 w-3" /> Semua nilai adalah perkiraan
          </p>
        </div>
      </div>

      {quality.warnings.length > 0 && (
        <div className="bg-amber-500/20 border-b border-amber-500/20 p-3">
          {quality.warnings.map((warn, i) => (
            <p key={i} className="text-xs text-amber-200 flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {warn}
            </p>
          ))}
        </div>
      )}

      <div className="p-4 flex flex-col gap-1 overflow-y-auto max-h-[500px] custom-scrollbar">
        <MetricRow label="Tinggi Badan" metric={measurements.estimatedHeight} />
        <MetricRow label="Lebar Bahu" metric={measurements.shoulderWidth} />
        <MetricRow label="Lebar Pinggul" metric={measurements.hipWidth} />
        <MetricRow label="Lebar Pinggang" metric={measurements.waistWidth} />
        <MetricRow label="Panjang Torso" metric={measurements.torsoLength} />
        <MetricRow label="Panjang Lengan" metric={measurements.armLength} />
        <MetricRow label="Panjang Kaki" metric={measurements.legLength} />
        
        <div className="mt-2 pt-2 border-t border-white/20">
          <RatioRow label="Rasio Bahu-Pinggul" metric={measurements.shoulderHipRatio} />
        </div>
      </div>
    </div>
  );
}
