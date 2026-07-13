import { Sparkles, Palette, AlertCircle } from "lucide-react";
import { AnalysisCardBase } from "./AnalysisCardBase";
import { ColorAnalysisResult, ColorChip } from "@/lib/body-analysis-engine/analysis-types";

const DataRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl p-3">
    <span className="text-[10px] text-white/50 uppercase tracking-wider mb-1">{label}</span>
    <span className="text-sm font-medium text-white/90">{value || "Tidak diketahui"}</span>
  </div>
);



export function AiVisionCard({ result }: { result: ColorAnalysisResult }) {

  // If AI Vision failed or is not available, show error/placeholder state
  if (!result.isAvailable || result.error) {
    return (
      <AnalysisCardBase title="Profil Fashion AI" icon={Sparkles} className="md:col-span-2">
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl mb-4 text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">Analisis Tidak Tersedia</h4>
          <p className="text-sm text-red-400/80 mb-2">
            {result.error || "Layanan AI Vision tidak tersedia."}
          </p>
          <p className="text-xs text-white/50">
            Silakan periksa konfigurasi API Anda atau coba lagi nanti.
          </p>
        </div>
      </AnalysisCardBase>
    );
  }

  return (
    <AnalysisCardBase title="Profil Fashion AI" icon={Sparkles} className="md:col-span-2">
      <div className="flex flex-col gap-6">
        
        {/* Attributes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DataRow label="Warna Kulit" value={result.skinTone} />
          <DataRow label="Undertone Kulit" value={result.undertone} />
          <DataRow label="Musim Warna" value={result.seasonalColor} />
          <DataRow label="Bentuk Wajah" value={result.faceShape} />
          <DataRow label="Warna Rambut" value={result.hairColor} />
          <DataRow label="Warna Dominan" value={result.dominantClothingColor} />
        </div>

        <div className="bg-gradient-to-r from-[#EC4899]/20 to-transparent border-l-2 border-[#EC4899] p-3 rounded-r-xl">
          <span className="flex items-center gap-1.5 text-[10px] text-[#F472B6] uppercase tracking-wider font-bold mb-1">
            <Palette className="w-3 h-3" /> Ringkasan AI
          </span>
          <p className="text-xs text-white/80 leading-relaxed">
            {result.summary || "Tidak ada ringkasan yang diberikan."}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 text-xs text-white/50">
          <span>Tingkat Keyakinan AI:</span>
          <span className="font-bold text-emerald-400">
            {result.confidence ? `${result.confidence}%` : "Tidak diketahui"}
          </span>
        </div>

      </div>
    </AnalysisCardBase>
  );
}
