import { Sparkles, Palette } from "lucide-react";
import { AnalysisCardBase } from "./AnalysisCardBase";

export function AiVisionPlaceholderCard() {
  return (
    <AnalysisCardBase title="AI Vision Analysis" icon={Sparkles} className="md:col-span-2">
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#EC4899]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl mb-4 shadow-inner">
          <Palette className="h-8 w-8 text-[#F472B6]" />
        </div>
        
        <h4 className="text-lg font-bold text-white mb-2">
          Color & Tone Analysis
        </h4>
        
        <p className="text-sm text-white/60 max-w-md mb-6 leading-relaxed">
          Skin tone, undertone, seasonal color palette, and personalized color recommendations will be powered by <strong className="text-white/80">Gemini Vision AI</strong> in the next phase.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm opacity-40 grayscale">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col items-center">
            <span className="text-xs text-white/50 mb-1">Skin Tone</span>
            <div className="h-2 w-12 bg-white/20 rounded-full animate-pulse" />
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col items-center">
            <span className="text-xs text-white/50 mb-1">Undertone</span>
            <div className="h-2 w-12 bg-white/20 rounded-full animate-pulse" />
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col items-center col-span-2">
            <span className="text-xs text-white/50 mb-2">Recommended Palette</span>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-4 w-4 rounded-full bg-white/20 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

      </div>
    </AnalysisCardBase>
  );
}
