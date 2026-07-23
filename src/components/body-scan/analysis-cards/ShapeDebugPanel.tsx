import { BodyShapeResult } from "@/lib/body-analysis-engine/analysis-types";

interface ShapeDebugPanelProps {
  result: BodyShapeResult;
}

export function ShapeDebugPanel({ result }: ShapeDebugPanelProps) {
  if (!result || !result.ratios) return null;

  return (
    <div className="rounded-[var(--radius-card)] border-2 border-dashed border-red-400 bg-red-50 p-4 shadow-sm mb-6">
      <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
        🛠️ Development Debug Panel: Body Shape
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-gray-700">
        <div className="bg-white p-2 rounded border border-red-100">
          <div className="text-gray-400 mb-1">Shoulder/Hip Ratio</div>
          <div className="font-semibold text-gray-900">{result.ratios.shoulderToHip.toFixed(3)}</div>
        </div>
        <div className="bg-white p-2 rounded border border-red-100">
          <div className="text-gray-400 mb-1">Waist/Hip Ratio</div>
          <div className="font-semibold text-gray-900">{result.ratios.waistToHip.toFixed(3)}</div>
        </div>
        <div className="bg-white p-2 rounded border border-red-100">
          <div className="text-gray-400 mb-1">Waist/Shoulder Ratio</div>
          <div className="font-semibold text-gray-900">{result.ratios.waistToShoulder.toFixed(3)}</div>
        </div>
        <div className="bg-white p-2 rounded border border-red-100">
          <div className="text-gray-400 mb-1">Confidence Score</div>
          <div className="font-semibold text-gray-900">{(result.confidence * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-white p-2 rounded border border-red-100 col-span-2">
          <div className="text-gray-400 mb-1">Primary Shape</div>
          <div className="font-semibold text-emerald-700">{result.primaryShape} ({(result.primaryConfidence * 100).toFixed(1)}%)</div>
        </div>
        <div className="bg-white p-2 rounded border border-red-100 col-span-2">
          <div className="text-gray-400 mb-1">Secondary Shape</div>
          <div className="font-semibold text-amber-600">{result.secondaryShape || "N/A"} {result.secondaryConfidence ? `(${(result.secondaryConfidence * 100).toFixed(1)}%)` : ''}</div>
        </div>
        
        {result.secondaryShape && (
          <div className="bg-white p-2 rounded border border-red-100 col-span-4">
            <div className="text-gray-400 mb-1">Rule Blending Status</div>
            <div className="font-semibold text-gray-800">
              Diff: {((result.primaryConfidence - (result.secondaryConfidence || 0)) * 100).toFixed(1)}% | 
              Status: {
                result.primaryConfidence < 0.90 && 
                (result.secondaryConfidence || 0) >= 0.65 && 
                (result.primaryConfidence - (result.secondaryConfidence || 0)) <= 0.15 
                  ? <span className="text-emerald-600"> ENABLED</span> 
                  : <span className="text-red-500"> DISABLED</span>
              }
            </div>
          </div>
        )}

        <div className="bg-white p-2 rounded border border-red-100 col-span-4">
          <div className="text-gray-400 mb-1">Status</div>
          <div className={`font-semibold ${result.status === 'SUCCESS' ? 'text-emerald-700' : 'text-red-600'}`}>{result.status || 'UNKNOWN'}</div>
        </div>
      </div>
    </div>
  );
}
