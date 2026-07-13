import { getSavedOutfits } from "@/app/actions/wardrobe";
import CollectionClient from "./CollectionClient";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Digital Wardrobe - OutfitCheck AI",
};

export default async function CollectionPage() {
  const savedOutfits = await getSavedOutfits();

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/history">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white shadow-md shadow-[#EC4899]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Digital Wardrobe</h1>
              <p className="text-sm text-gray-400 mt-0.5">Koleksi outfit AI yang Anda simpan.</p>
            </div>
          </div>
        </div>

        {savedOutfits.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center mt-12 backdrop-blur-sm max-w-lg mx-auto shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-[#EC4899]/20 to-[#F472B6]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#EC4899]/20">
              <span className="text-4xl">👔</span>
            </div>
            <h2 className="text-xl font-bold mb-3 text-white">Belum ada outfit favorit.</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Scan tubuh Anda dan simpan rekomendasi outfit AI ke Digital Wardrobe Anda untuk mempermudah mencari referensi gaya.
            </p>
            <Link href="/body-scan">
              <Button className="w-full bg-[#EC4899] hover:bg-[#D946EF] text-white rounded-xl h-12">
                Lihat Rekomendasi Outfit
              </Button>
            </Link>
          </div>
        ) : (
          <CollectionClient initialOutfits={savedOutfits} />
        )}
      </div>
    </div>
  );
}
