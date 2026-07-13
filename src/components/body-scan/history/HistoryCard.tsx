import type { ScanHistory } from "@prisma/client";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Star, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface HistoryCardProps {
  item: ScanHistory;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function HistoryCard({ item, onDelete, onToggleFavorite }: HistoryCardProps) {
  const d = new Date(item.createdAt);
  const dateStr = format(d, "dd MMM yyyy", { locale: localeId });
  const timeStr = format(d, "HH:mm", { locale: localeId });

  // Safe parsing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rec = item.recommendationJson as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fas = item.fashionAnalysisJson as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gem = item.geminiAnalysisJson as any;

  const style = rec?.primaryStyle || "Tidak diketahui";
  const shape = fas?.shape?.shape || "Tidak diketahui";
  const color = gem?.seasonalColor || "Tidak diketahui";
  const score = item.aiScore ? Math.round(item.aiScore) : "-";

  return (
    <div className="bg-white border border-[#FDF2F8] rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow relative">
      
      {/* Thumbnail Area */}
      <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={item.capturedImageUrl} 
          alt={`Scan ${dateStr}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Top Controls */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="bg-black/40 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium border border-white/10">
            {dateStr} • {timeStr}
          </div>
          <button 
            onClick={onToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-md border border-white/10 transition-colors ${item.isFavorite ? 'bg-[#EC4899] text-white' : 'bg-black/40 text-white hover:bg-white/20'}`}
          >
            <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Info overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-lg drop-shadow-md">{style}</h3>
            <span className="bg-[#EC4899] text-[10px] font-bold px-2 py-0.5 rounded-sm">Skor {score}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="text-[10px] bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">{shape}</span>
            <span className="text-[10px] bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">{color}</span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="p-3 flex items-center justify-between gap-2">
        <Link href={`/history/${item.id}`} className="flex-1">
          <button className="w-full h-9 bg-gray-50 hover:bg-[#EC4899]/10 text-gray-700 hover:text-[#EC4899] text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
            Lihat Detail <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
        <button 
          onClick={onDelete}
          className="h-9 w-9 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
