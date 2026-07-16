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
    <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in-50 duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/history">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-button)] bg-gradient-to-br from-primary to-[#E14D72] text-primary-foreground shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Digital Wardrobe</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Koleksi outfit AI yang Anda simpan.</p>
            </div>
          </div>
        </div>

        {savedOutfits.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-[var(--radius-card)] p-12 text-center mt-12 backdrop-blur-sm max-w-lg mx-auto shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👔</span>
            </div>
            <h2 className="text-xl font-heading font-bold mb-3 text-foreground">Belum ada outfit favorit.</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Scan tubuh Anda dan simpan rekomendasi outfit AI ke Digital Wardrobe Anda untuk mempermudah mencari referensi gaya.
            </p>
            <Link href="/body-scan">
              <Button className="w-full rounded-[var(--radius-button)] h-12 shadow-sm">
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


