import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { BarChart3, Star, Bookmark, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Analytics - Partner Portal",
};

export default async function PartnerAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/partner-login");
  }

  const boutique = await prisma.boutique.findFirst({
    where: { ownerId: user.id }
  });

  if (!boutique) {
    redirect("/partner/dashboard");
  }

  let topRecommended: any[] = [];
  let topSaved: any[] = [];
  let totalRecommendations = 0;
  let totalSavedOutfits = 0;
  let maxRecCount = 1;
  let maxSavedCount = 1;
  let debugError = null;

  try {
    // 1. Get Totals
    totalRecommendations = await prisma.productRecommendation.count({
      where: { product: { boutiqueId: boutique.id } }
    });

    totalSavedOutfits = await prisma.savedOutfit.count({
      where: { product: { boutiqueId: boutique.id } }
    });

    // 2. Get Top 5 Recommended Products
    topRecommended = await prisma.product.findMany({
      where: { boutiqueId: boutique.id },
      include: {
        _count: {
          select: { productRecommendations: true }
        }
      },
      orderBy: {
        productRecommendations: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // 3. Get Top 5 Saved Products
    topSaved = await prisma.product.findMany({
      where: { boutiqueId: boutique.id },
      include: {
        _count: {
          select: { savedOutfits: true }
        }
      },
      orderBy: {
        savedOutfits: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Find max values for progress bar scaling
    maxRecCount = Math.max(...topRecommended.map((p: any) => p._count.productRecommendations), 1);
    maxSavedCount = Math.max(...topSaved.map((p: any) => p._count.savedOutfits), 1);
  } catch (error: any) {
    debugError = error.message + '\n' + error.stack;
  }

  if (debugError) {
    return (
      <div className="p-10 text-red-500 whitespace-pre-wrap">
        <h1>Internal Error Debug:</h1>
        <p>{debugError}</p>
      </div>
    );
  }


  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Analisis Performa
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Pantau bagaimana pengguna dan AI berinteraksi dengan produk butik Anda.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-border/60 border-border/60 shadow-sm flex items-center gap-6 bg-gradient-to-br from-white to-[#FDF2F8] dark:from-gray-900 dark:to-gray-900/50">
          <div className="p-4 bg-primary/10 rounded-[var(--radius-card)] text-primary">
            <Star className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Rekomendasi AI</p>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{totalRecommendations} <span className="text-lg font-normal text-gray-500">kali</span></h3>
          </div>
        </Card>

        <Card className="p-6 border-border/60 border-border/60 shadow-sm flex items-center gap-6 bg-gradient-to-br from-white to-[#F5F3FF] dark:from-gray-900 dark:to-gray-900/50">
          <div className="p-4 bg-primary/10 rounded-[var(--radius-card)] text-primary">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Disimpan Pengguna</p>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{totalSavedOutfits} <span className="text-lg font-normal text-gray-500">kali</span></h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Recommended Products */}
        <Card className="p-6 border-border/60 border-border/60 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Top 5 Paling Direkomendasikan
          </h2>
          
          {topRecommended.filter(p => p._count.productRecommendations > 0).length > 0 ? (
            <div className="space-y-6">
              {topRecommended
                .filter(p => p._count.productRecommendations > 0)
                .map((product, index) => (
                <div key={product.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[70%]">
                      {index + 1}. {product.name}
                    </span>
                    <span className="font-bold text-primary">{product._count.productRecommendations} kali</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#EC4899] to-[#F472B6] h-2.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(product._count.productRecommendations / maxRecCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Belum ada data rekomendasi produk.
            </div>
          )}
        </Card>

        {/* Top Saved Products */}
        <Card className="p-6 border-border/60 border-border/60 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            Top 5 Paling Banyak Disimpan
          </h2>
          
          {topSaved.filter(p => p._count.savedOutfits > 0).length > 0 ? (
            <div className="space-y-6">
              {topSaved
                .filter(p => p._count.savedOutfits > 0)
                .map((product, index) => (
                <div key={product.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[70%]">
                      {index + 1}. {product.name}
                    </span>
                    <span className="font-bold text-primary">{product._count.savedOutfits} kali</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] h-2.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(product._count.savedOutfits / maxSavedCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Belum ada produk yang disimpan pengguna.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}



