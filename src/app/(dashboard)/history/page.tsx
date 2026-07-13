import { getScanHistory } from "@/app/actions/history";
import HistoryClient from "./HistoryClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Riwayat Scan - OutfitCheck AI",
  description: "Lihat riwayat scan tubuh dan rekomendasi fashion AI Anda",
};

export default async function HistoryPage() {
  const historyData = await getScanHistory();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2D] tracking-tight">Riwayat Scan</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola dan tinjau kembali profil fashion AI Anda sebelumnya.</p>
      </div>
      
      <HistoryClient initialData={historyData} />
    </div>
  );
}
