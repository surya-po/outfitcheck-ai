import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticCard } from "@/components/ui/StatisticCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ScanFace,
  Sparkles,
  Heart,
  Shirt,
  Calendar,
  LogOut,
  ArrowRight,
  Bot
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch Profile
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  });

  // Fetch Stats
  const [scanCount, recommendationsCount, savedLooksCount] = await Promise.all([
    prisma.scanHistory.count({ where: { userId: user.id } }),
    prisma.productRecommendation.count({ where: { userId: user.id } }),
    prisma.savedOutfit.count({ where: { userId: user.id } })
  ]);
  const collectionsCount = savedLooksCount; // For now mapping Collections to Saved Looks

  const latestScan = await prisma.scanHistory.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  let fullName = "Style Icon";
  if (profile?.firstName || profile?.lastName) {
    fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  } else if (user.user_metadata?.full_name || user.user_metadata?.display_name) {
    fullName = user.user_metadata.full_name || user.user_metadata.display_name;
  }

  const firstName = fullName.split(" ")[0];
  const avatarUrl = profile?.avatarUrl || user.user_metadata?.avatar_url;
  const initials = firstName.substring(0, 2).toUpperCase();

  const greeting = "Halo";

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      
      {/* 1. Welcome Hero Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[var(--radius-card)] bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white shadow-xl shadow-[#EC4899]/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-white/20 shadow-sm">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-poppins)]">
              {greeting}, {firstName} 👋
            </h1>
            <p className="mt-2 text-white/90 max-w-md leading-relaxed">
              Siap menemukan gaya berpakaian yang paling cocok dengan bentuk tubuh Anda?
            </p>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Link href="/body-scan">
            <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-sm border-0 font-semibold rounded-[var(--radius-button)] h-11 px-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Mulai Scan Tubuh
            </Button>
          </Link>
          <Link href="/collection">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 rounded-[var(--radius-button)] h-11 px-6 transition-colors">
              Lihat Koleksi
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Scan Tubuh"
          value={scanCount.toString()}
          icon={<ScanFace className="h-5 w-5" />}
        />
        <StatisticCard
          title="Rekomendasi"
          value={recommendationsCount.toString()}
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatisticCard
          title="Disimpan"
          value={savedLooksCount.toString()}
          icon={<Heart className="h-5 w-5" />}
        />
        <StatisticCard
          title="Koleksi"
          value={collectionsCount.toString()}
          icon={<Shirt className="h-5 w-5" />}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* 2. AI Body Scan Card */}
          <Card className="shadow-sm hover:shadow-sm transition-shadow overflow-hidden group">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <ScanFace className="h-5 w-5 text-primary" />
                Analisis Tubuh AI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {latestScan ? (
                <div className="flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4 shadow-sm">
                    <ScanFace className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Analisis Selesai!</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                    Profil bentuk tubuh Anda telah dianalisis. Anda siap menerima rekomendasi gaya berpakaian dari AI.
                  </p>
                  <Link href="/history">
                    <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 rounded-[var(--radius-button)] px-8 h-11 font-medium transition-all hover:scale-105">
                      Lihat Hasil
                    </Button>
                  </Link>
                </div>
              ) : (
                <EmptyState
                  icon={ScanFace}
                  title="Belum ada data analisis"
                  description="Mulai scan tubuh Anda untuk mendapatkan rekomendasi pakaian yang dipersonalisasi khusus untuk Anda."
                  action={
                    <Link href="/body-scan">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius-button)] px-8 h-11 shadow-sm transition-all hover:scale-105 mt-2">
                        Mulai Scan <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  }
                  className="border-none min-h-[250px] bg-transparent"
                />
              )}
            </CardContent>
          </Card>

          {/* 3. Outfit Recommendation Card */}
          <Card className="shadow-sm hover:shadow-sm transition-shadow">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Rekomendasi Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8 text-center">
              {latestScan ? (
                <>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Rekomendasi</h3>
                  <p className="text-muted-foreground text-sm mb-6 text-center">
                    Cek rekomendasi pintar berdasarkan gaya personal, cuaca hari ini, dan pakaian di lemari digital Anda.
                  </p>
                  <Link href="/recommendation" className="w-full">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius-button)] px-8 h-11 shadow-sm hover:scale-105 transition-all w-full">
                      Lihat Rekomendasi
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Selesaikan scan tubuh terlebih dahulu</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                    Kami perlu menganalisis bentuk tubuh Anda terlebih dahulu untuk memberikan rekomendasi yang akurat.
                  </p>
                  <Button disabled className="rounded-[var(--radius-button)] px-8">
                    Lihat Rekomendasi
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* 3.5 AI Fashion Assistant Card */}
          <Card className="shadow-sm hover:shadow-sm transition-shadow overflow-hidden group">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Asisten Fashion AI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <EmptyState
                icon={Bot}
                title="AI Personal Stylist"
                description="Dapatkan rekomendasi gaya, warna, dan kombinasi pakaian yang paling cocok dengan bentuk tubuh Anda."
                action={
                  <Link href="/fashion-assistant">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius-button)] px-8 h-11 shadow-sm transition-all hover:scale-105 mt-2">
                      Tanya Asisten <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                }
                className="border-none min-h-[200px] bg-transparent"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* 4. Profile Snapshot */}
          <Card className="shadow-sm hover:shadow-sm transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Profil Saya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm mb-4">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-foreground">{fullName}</h3>
                <p className="text-muted-foreground text-sm mb-6">{user.email}</p>
                <Link href="/profile" className="w-full">
                  <Button variant="outline" className="w-full rounded-[var(--radius-button)] border-primary/20 text-primary hover:bg-primary/10 hover:text-primary">
                    Edit Profil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 5. Quick Actions / Links */}
          <Card className="shadow-sm hover:shadow-sm transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Akses Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/collection" className="block">
                <div className="flex items-center gap-4 p-3 rounded-[var(--radius-card)] border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-colors group">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Shirt className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Lemari Digital</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelola pakaian Anda</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/history" className="block">
                <div className="flex items-center gap-4 p-3 rounded-[var(--radius-card)] border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-colors group">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Riwayat Scan</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Lihat hasil analisis sebelumnya</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="shadow-sm hover:shadow-sm transition-shadow border-none bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tips Gaya Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-semibold text-sm">1</span>
                  </div>
                  <span className="text-foreground leading-relaxed pt-1">
                    Pastikan pencahayaan cukup saat melakukan scan tubuh agar hasilnya akurat.
                  </span>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-semibold text-sm">2</span>
                  </div>
                  <span className="text-foreground leading-relaxed pt-1">
                    Gunakan pakaian ketat saat scan untuk rekomendasi ukuran yang pas.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 7. Recent Activity */}
          <Card className="shadow-sm hover:shadow-sm transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Aktivitas Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Login Terakhir</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(user.last_sign_in_at || user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF7FB] text-[#EC4899]">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Akun Dibuat</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}


