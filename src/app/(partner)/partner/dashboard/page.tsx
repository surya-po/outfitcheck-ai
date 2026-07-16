import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle, Clock, EyeOff, Star, Bookmark, Plus, Store, ExternalLink } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - Partner Portal",
};

export default async function PartnerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/partner-login");
  }

  const boutique = await prisma.boutique.findFirst({
    where: { ownerId: user.id }
  });

  if (!boutique) {
    // Maybe redirect to setup boutique page
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Store className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Profil Butik Belum Dibuat</h2>
        <p className="text-gray-500 mt-2 mb-6">Silakan hubungi administrator untuk verifikasi butik Anda.</p>
      </div>
    );
  }

  // Fetch stats
  const totalProducts = await prisma.product.count({ where: { boutiqueId: boutique.id } });
  const activeProducts = await prisma.product.count({ where: { boutiqueId: boutique.id, productStatus: "PUBLISHED" } });
  const draftProducts = await prisma.product.count({ where: { boutiqueId: boutique.id, productStatus: "DRAFT" } });
  const hiddenProducts = await prisma.product.count({ where: { boutiqueId: boutique.id, productStatus: "HIDDEN" } });

  const totalRecommendations = await prisma.productRecommendation.count({
    where: { product: { boutiqueId: boutique.id } }
  });

  const totalSavedOutfits = await prisma.savedOutfit.count({
    where: { product: { boutiqueId: boutique.id } }
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Halo, {boutique.name}!</h1>
          <p className="text-muted-foreground mt-1">Berikut adalah ringkasan performa butik Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/partner/products/create">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-sm rounded-[var(--radius-button)]">
              <Plus className="w-4 h-4 mr-2" /> Tambah Produk
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/partner/products/create" className="group">
          <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer h-full border-border/60 bg-card shadow-sm rounded-[var(--radius-card)]">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-foreground">Tambah Produk</span>
          </Card>
        </Link>
        <Link href="/partner/products" className="group">
          <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-secondary hover:bg-secondary/10 transition-colors cursor-pointer h-full border-border/60 bg-card shadow-sm rounded-[var(--radius-card)]">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-foreground">Kelola Produk</span>
          </Card>
        </Link>
        <Link href="/partner/analytics" className="group">
          <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer h-full border-border/60 bg-card shadow-sm rounded-[var(--radius-card)]">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-foreground">Analytics</span>
          </Card>
        </Link>
        <Link href="/marketplace" target="_blank" className="group">
          <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-muted-foreground hover:bg-muted transition-colors cursor-pointer h-full border-border/60 bg-card shadow-sm rounded-[var(--radius-card)]">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-foreground">Preview Marketplace</span>
          </Card>
        </Link>
      </div>

      {/* Stats Cards */}
      <h2 className="text-lg font-heading font-bold text-foreground mt-8 mb-4">Statistik Produk</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-border/60 bg-card shadow-sm flex flex-col rounded-[var(--radius-card)]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-muted rounded-lg text-muted-foreground">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-heading font-bold text-foreground">{totalProducts}</h3>
            <p className="text-sm text-muted-foreground font-medium mt-1">Total Produk</p>
          </div>
        </Card>

        <Card className="p-6 border-border/60 bg-card shadow-sm flex flex-col rounded-[var(--radius-card)]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-heading font-bold text-foreground">{activeProducts}</h3>
            <p className="text-sm text-muted-foreground font-medium mt-1">Produk Aktif</p>
          </div>
        </Card>

        <Card className="p-6 border-border/60 bg-card shadow-sm flex flex-col rounded-[var(--radius-card)]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-heading font-bold text-foreground">{draftProducts}</h3>
            <p className="text-sm text-muted-foreground font-medium mt-1">Draft</p>
          </div>
        </Card>

        <Card className="p-6 border-border/60 bg-card shadow-sm flex flex-col rounded-[var(--radius-card)]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
              <EyeOff className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-heading font-bold text-foreground">{hiddenProducts}</h3>
            <p className="text-sm text-muted-foreground font-medium mt-1">Sembunyi / Habis</p>
          </div>
        </Card>
      </div>

      <h2 className="text-lg font-heading font-bold text-foreground mt-8 mb-4">Performa AI & Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-border/60 bg-card shadow-sm flex flex-col rounded-[var(--radius-card)]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-[var(--radius-button)] text-primary">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-heading font-bold text-foreground">{totalRecommendations}</h3>
            <p className="text-sm text-muted-foreground font-medium mt-2">Kali Direkomendasikan oleh AI</p>
          </div>
        </Card>

        <Card className="p-6 border-border/60 bg-card shadow-sm flex flex-col rounded-[var(--radius-card)]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary/10 rounded-[var(--radius-button)] text-secondary">
              <Bookmark className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-heading font-bold text-foreground">{totalSavedOutfits}</h3>
            <p className="text-sm text-muted-foreground font-medium mt-2">Disimpan ke Virtual Wardrobe Pengguna</p>
          </div>
        </Card>
      </div>
    </div>
  );
}



