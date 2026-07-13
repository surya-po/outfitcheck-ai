"use client";

import { useState, useMemo } from "react";
import type { ScanHistory } from "@prisma/client";
import { Search, Trash2, Calendar, Activity, Info, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryCard } from "@/components/body-scan/history/HistoryCard";
import { deleteAllScanHistory, deleteScanHistory, toggleFavorite } from "@/app/actions/history";
interface HistoryClientProps {
  initialData: ScanHistory[];
}

type FilterOption = "all" | "today" | "week" | "month" | "year";

export default function HistoryClient({ initialData }: HistoryClientProps) {
  const [data, setData] = useState<ScanHistory[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [isDeleting, setIsDeleting] = useState(false);

  // Compute Stats
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const now = new Date();
    const thisMonthScans = data.filter(s => new Date(s.createdAt).getMonth() === now.getMonth() && new Date(s.createdAt).getFullYear() === now.getFullYear()).length;
    const avgScore = data.reduce((acc, s) => acc + (s.aiScore || 0), 0) / data.length;

    // Frequencies
    const styleFreq: Record<string, number> = {};
    const colorFreq: Record<string, number> = {};

    data.forEach(s => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rec = s.recommendationJson as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gem = s.geminiAnalysisJson as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fas = s.fashionAnalysisJson as any;

      if (rec?.primaryStyle) styleFreq[rec.primaryStyle] = (styleFreq[rec.primaryStyle] || 0) + 1;
      if (gem?.seasonalColor) colorFreq[gem.seasonalColor] = (colorFreq[gem.seasonalColor] || 0) + 1;
    });

    const favStyle = Object.entries(styleFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    const favColor = Object.entries(colorFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return {
      total: data.length,
      thisMonth: thisMonthScans,
      avgScore: avgScore.toFixed(0),
      favStyle,
      favColor
    };
  }, [data]);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    let result = data;
    const now = new Date();

    // Date Filter
    if (filter !== "all") {
      result = result.filter(s => {
        const d = new Date(s.createdAt);
        if (filter === "today") return d.toDateString() === now.toDateString();
        if (filter === "week") return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
        if (filter === "month") return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
        if (filter === "year") return d.getFullYear() === now.getFullYear();
        return true;
      });
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => {
        const d = new Date(s.createdAt).toLocaleDateString("id-ID");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rec = s.recommendationJson as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gem = s.geminiAnalysisJson as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fas = s.fashionAnalysisJson as any;
        
        const style = (rec?.primaryStyle || "").toLowerCase();
        const shape = (fas?.shape?.shape || "").toLowerCase();
        const color = (gem?.seasonalColor || "").toLowerCase();
        const tags = Array.isArray(s.tags) ? s.tags.join(" ").toLowerCase() : "";

        return d.includes(q) || style.includes(q) || shape.includes(q) || color.includes(q) || tags.includes(q);
      });
    }

    // Sort: Favorites first, then newest
    return result.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  }, [data, filter, searchQuery]);


  const handleDeleteAll = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus SEMUA riwayat scan? Ini tidak dapat dibatalkan.")) {
      setIsDeleting(true);
      try {
        await deleteAllScanHistory();
        setData([]);
      } catch {
        alert("Gagal menghapus.");
      }
      setIsDeleting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus scan ini?")) {
      try {
        await deleteScanHistory(id);
        setData(data.filter(s => s.id !== id));
      } catch {
        alert("Gagal menghapus.");
      }
    }
  };

  const handleToggleFav = async (id: string, current: boolean) => {
    try {
      await toggleFavorite(id, current);
      setData(data.map(s => s.id === id ? { ...s, isFavorite: !current } : s));
    } catch {
      alert("Gagal memperbarui status favorit.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Statistics Section */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard title="Total Scan" value={stats.total} icon={<Activity />} />
          <StatCard title="Scan Bulan Ini" value={stats.thisMonth} icon={<Calendar />} />
          <StatCard title="Skor AI Rata-rata" value={`${stats.avgScore}%`} icon={<Info />} />
          <StatCard title="Gaya Favorit" value={stats.favStyle} icon={<Shirt />} />
          <StatCard title="Warna Dominan" value={stats.favColor} icon={<div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-purple-500" />} />
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#FDF2F8] shadow-sm">
        <div className="flex w-full sm:w-auto items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari gaya, tanggal, warna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#EC4899] focus:border-transparent outline-none text-sm"
          />
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>Semua</FilterBtn>
          <FilterBtn active={filter === "today"} onClick={() => setFilter("today")}>Hari Ini</FilterBtn>
          <FilterBtn active={filter === "week"} onClick={() => setFilter("week")}>7 Hari</FilterBtn>
          <FilterBtn active={filter === "month"} onClick={() => setFilter("month")}>30 Hari</FilterBtn>
          <FilterBtn active={filter === "year"} onClick={() => setFilter("year")}>Tahun Ini</FilterBtn>
          
          <div className="w-px h-6 bg-gray-200 mx-1" />
          
          <Button 
            variant="ghost" 
            onClick={handleDeleteAll}
            disabled={isDeleting || data.length === 0}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-3 rounded-xl flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Hapus Semua</span>
          </Button>
        </div>
      </div>

      {/* Grid */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map(item => (
            <HistoryCard 
              key={item.id} 
              item={item} 
              onDelete={() => handleDelete(item.id)}
              onToggleFavorite={() => handleToggleFav(item.id, item.isFavorite)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-[#FDF2F8]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-bold mb-1">Tidak ada riwayat ditemukan</h3>
          <p className="text-gray-500 text-sm">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}

// Subcomponents
function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#FDF2F8] shadow-sm flex flex-col justify-between h-full min-h-[90px]">
      <div className="flex items-center justify-between text-gray-400 mb-2">
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
        <div className="[&>svg]:w-4 [&>svg]:h-4">{icon}</div>
      </div>
      <div className="text-lg font-bold text-gray-900 truncate">{value}</div>
    </div>
  );
}

function FilterBtn({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
        active 
          ? "bg-[#1E1E2D] text-white" 
          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
